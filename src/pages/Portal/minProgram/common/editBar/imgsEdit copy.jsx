/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑轮播
 */
import React, { useContext, useEffect, useState } from 'react';
import { ctx } from '../context';
import { Input } from 'antd';
import EditBar from './index';
// import { imgBaseUrl } from '../tools';
import styles from './drawerEditor.less';

export default function Templates(props) {
  const { pageData, setlinkEdtor, setcurInd, setimgEdtor } = useContext(ctx);

  const columns = [
    {
      title: '图片',
      key: 'imgUrl',
      width: 100,
      render: (text, record, index) => (
        <div className={styles.minImgBox} onClick={() => toChooseImg(index)}>
          <img src={`${imgBaseUrl}img_LakeBlue.png`} alt="" />
        </div>
      ),
    },
    {
      title: '链接',
      key: 'title',
      width: 270,
      render: (text, record, index) => {
        const { title } = record;
        return (
          <div className={styles.inpBox}>
            <Input placeholder="请设置跳转链接" value={title} onClick={() => toChooseLink(index)} />
          </div>
        );
      },
    },
  ];

  function toChooseImg(num) {
    setcurInd(num);
    setimgEdtor(true);
  }

  function toChooseLink(num) {
    setcurInd(num);
    setlinkEdtor(true);
  }

  return <EditBar dList={pageData.jsonData[0].list} comColumn={columns} />;
}
