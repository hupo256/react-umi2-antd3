/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑轮播图
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { Radio, InputNumber, Icon, message } from 'antd';
import { defaultImg } from '../../tools/data';
import AddMore from './addMore';
import Upload from '@/components/Upload/Upload';
import Cascader from './cascader';
import styles from './drawerEditor.less';

const { Group } = Radio;
const maxLen = 6;

export default function TagsEdit(props) {
  const { pageData, setpageData, curFlag, setcurInd, setimgEdtor, imgEdtor, curInd } = useContext(
    ctx
  );
  const [tagList = [], settagList] = useState(() => touchTagList());
  const [height, setHeight] = useState(176);
  const [imgHeightType, setimgHeightType] = useState(1);

  useEffect(
    () => {
      const hgt = pageData?.maps?.[curFlag]?.height;
      if (hgt === 176 || hgt === 85) {
        setimgHeightType(1);
      } else {
        setimgHeightType(2);
        setHeight(hgt);
      }
      settagList(pageData?.maps?.[curFlag]?.list);
    },
    [curFlag]
  );

  function touchTagList() {
    const arr = pageData?.maps?.[curFlag]?.list;
    return arr?.map(item => ({ ...item, showSec: false }));
  }

  function addNewImgs() {
    if (tagList.length === maxLen) {
      message.warning(`最多可添加${maxLen}张图片`);
      return;
    }
    tagList.push({});
    forUpdatePageData();
  }

  function toChooseImg(num) {
    setcurInd(num);
    setimgEdtor(true);
  }

  function forUpdatePageData() {
    const newObj = { ...pageData };
    newObj.maps[curFlag].list = tagList;
    settagList(tagList.slice());
    setpageData(newObj);
  }

  function delImg(num) {
    tagList.splice(num, 1);
    forUpdatePageData();
  }

  function toMove(ind, num) {
    const rec = tagList.splice(ind, 1)[0];
    tagList.splice(ind + num, 0, rec);
    forUpdatePageData();
  }

  function radioChage(e) {
    const { value } = e.target;
    const newObj = { ...pageData };
    const defaultHei = curFlag === 'banner' ? 176 : 85;
    newObj.maps[curFlag].height = defaultHei;
    setimgHeightType(value);
    setpageData(newObj);
  }

  function widthChange(e) {
    const newObj = { ...pageData };
    newObj.maps[curFlag].height = +e;
    setpageData(newObj);
  }

  // 图片选择
  function handleUploadOk(data) {
    console.log(data[0].path);
    tagList[curInd].imgUrl = data[0].path;
    setimgEdtor(false);
    forUpdatePageData();
  }

  return (
    <>
      <div style={{ marginBottom: '1em', fontSize: 12, paddingLeft: 17, width: '100%' }}>
        <Icon type="info-circle" style={{ color: '#c1c1c1' }} />{' '}
        为保证网站显示效果，图片建议尺寸：1920px*952px
      </div>
      <div className={styles.widthBox}>
        图片高度：
        <Group onChange={radioChage} value={imgHeightType}>
          <Radio value={1}>默认</Radio>
          <Radio value={2}>自定义</Radio>
        </Group>
        {imgHeightType === 2 && (
          <InputNumber
            size="small"
            max={1000}
            min={1}
            defaultValue={height}
            style={{ width: 70, marginLeft: '-10px' }}
            onChange={widthChange}
          />
        )}
      </div>

      <ul className={styles.imgEditBox}>
        {tagList.length > 0 &&
          tagList.map((tag, ind) => {
            const { imgUrl = '' } = tag;
            const len = tagList.length;
            return (
              <li key={ind}>
                <div
                  className={`${styles.minImgBox} ${imgUrl ? '' : styles.deftImg}`}
                  onClick={() => toChooseImg(ind)}
                >
                  <img src={imgUrl || `${defaultImg}ic_Image.png`} alt="" />
                </div>
                <div className={styles.inpBox}>
                  <span>关联页面</span>
                  <Cascader itemInd={ind} tagList={tagList} forUpdatePageData={forUpdatePageData} />
                </div>

                <div className={styles.tbOpration}>
                  <a disabled={ind === 0} onClick={() => toMove(ind, -1)}>
                    <Icon type="arrow-up" />
                  </a>
                  <a disabled={ind === len - 1} onClick={() => toMove(ind, 1)}>
                    <Icon type="arrow-down" />
                  </a>
                  <a disabled={len === 1} onClick={() => delImg(ind)}>
                    <Icon type="delete" />
                  </a>
                </div>
              </li>
            );
          })}
      </ul>

      <AddMore clickHandle={addNewImgs} />

      <Upload
        visible={imgEdtor}
        selectNum={1}
        destroy={true}
        handleOk={data => handleUploadOk(data)}
        handleCancel={() => setimgEdtor(false)}
      />
    </>
  );
}
