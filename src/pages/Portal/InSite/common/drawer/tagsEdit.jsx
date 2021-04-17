/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑亮点
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { Input, Icon, message } from 'antd';
import LinkChoose from './linkChoose';
import styles from './drawerEditor.less';

const maxLen = 6;

export default function TagsEdit(props) {
  const { pageData, setpageData, curFlag, setlinkEdtor, setcurInd } = useContext(ctx);
  const [tagList = [], settagList] = useState(() => pageData?.maps?.[curFlag]?.list);

  function addNewImgs() {
    if (tagList.length === maxLen) return message.warning(`最多可添加${maxLen}张图片`);
    const rec = {};
    settagList([...tagList, rec].slice());
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

  return (
    <>
      <ul>
        {tagList.length > 0 &&
          tagList.map((tag, ind) => {
            const { title, desc, uid, text = '' } = tag;
            const len = tagList.length;
            return (
              <li key={ind}>
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
                <div className={styles.inpBox}>
                  <Input value={title} placeholder="请输入文本" />
                  <Input value={desc} placeholder="请输入文本" />
                  <Input
                    value={text}
                    placeholder="请设置跳转链接"
                    onClick={() => toChooseLink(ind)}
                  />
                </div>
              </li>
            );
          })}
      </ul>

      <p className={styles.addImg} onClick={addNewImgs}>
        <span>+</span>
        <span>添加亮点</span>
      </p>

      <LinkChoose dList={tagList} />
    </>
  );
}
