/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑轮播图
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { Input, Radio, InputNumber, Icon, message } from 'antd';
import { defaultImg } from '../../tools/data';
import Upload from '@/components/Upload/Upload';
import LinkChoose from './linkChoose';
import styles from './drawerEditor.less';

const { Group } = Radio;
const maxLen = 6;

export default function TagsEdit(props) {
  const {
    pageData,
    setpageData,
    curFlag,
    setlinkEdtor,
    setcurInd,
    setimgEdtor,
    imgEdtor,
    curInd,
  } = useContext(ctx);
  const [tagList = [], settagList] = useState(() => pageData?.maps?.[curFlag]?.list);
  const [imgHeightType, setimgHeightType] = useState(1);

  useEffect(
    () => {
      settagList(pageData?.maps?.[curFlag]?.list);
    },
    [curFlag]
  );

  function addNewImgs() {
    if (tagList.length === maxLen) {
      message.warning(`最多可添加${maxLen}张图片`);
      return;
    }
    const rec = {};
    settagList([...tagList, rec].slice());
  }

  function toChooseImg(num) {
    setcurInd(num);
    setimgEdtor(true);
  }

  function toChooseLink(num) {
    setcurInd(num);
    setlinkEdtor(true);
  }

  function delImg(num) {
    tagList.splice(num, 1);
    settagList(tagList.slice());
    setpageData(pageData);
  }

  function toMove(ind, num) {
    const rec = tagList.splice(ind, 1)[0];
    tagList.splice(ind + num, 0, rec);
    pageData.jsonData[1].list = tagList;
    settagList(tagList.slice());
    setpageData(pageData);
  }

  function radioChage(e) {
    const { value } = e.target;
    console.log(typeof e.target.value);
    if (value === 1) pageData.jsonData[0].height = 176;
    setimgHeightType(value);
  }

  function widthChange(e) {
    pageData.jsonData[0].height = +e;
    setpageData(pageData);
  }

  // 图片选择
  function handleUploadOk(data) {
    console.log(data[0].path);
    tagList[curInd].imgUrl = data[0].path;
    setpageData(pageData);
    setimgEdtor(false);
  }

  return (
    <>
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
            defaultValue={580}
            style={{ width: 70, marginLeft: '-10px' }}
            onChange={widthChange}
          />
        )}
      </div>

      <ul className={styles.imgEditBox}>
        {tagList.length > 0 &&
          tagList.map((tag, ind) => {
            const { title, imgUrl } = tag;
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
                  <Input
                    placeholder="请设置跳转链接"
                    value={title}
                    onClick={() => toChooseLink(ind)}
                  />
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

      <p className={styles.addImg} onClick={addNewImgs}>
        <span>+</span>
        <span>添加轮播图</span>
      </p>

      <Upload
        visible={imgEdtor}
        selectNum={1}
        destroy={true}
        handleOk={data => handleUploadOk(data)}
        handleCancel={() => setimgEdtor(false)}
      />

      <LinkChoose dList={tagList} />
    </>
  );
}
