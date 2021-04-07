/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑亮点
 */
import React, { useContext } from 'react';
import { ctx } from '../context';
import styles from './drawerEditor.less';

export default function Templates(props) {
  const { pageData, setpageData } = useContext(ctx);

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
    <div className={styles.tbOpration}>
      <a disabled={ind === 0} onClick={() => toMove(ind, -1)}>
        up
      </a>
      <a disabled={ind === tagList.length - 1} onClick={() => toMove(ind, 1)}>
        down
      </a>
      <a disabled={tagList.length === 1} onClick={() => delImg(ind)}>
        del
      </a>
    </div>
  );
}
