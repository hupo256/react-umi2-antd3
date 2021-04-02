/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑轮播
 */
import React, { useContext, useEffect, useState } from 'react';
import { ctx } from '../common/context';
import { Input } from 'antd';
import { dataSource } from '../tools/data';
import EditBar from '../common/editBar/index';
import { imgBaseUrl } from '../tools';
import styles from './edit.less';

export default function Templates(props) {
  const { setimgsData, setimgUrlModal } = useContext(ctx);

  useEffect(() => {
    setimgsData(dataSource);
  }, []);

  const columns = [
    {
      title: '图片',
      key: 'name',
      width: 100,
      render: (text, record, index) => (
        <div className={styles.minImgBox}>
          <img src={`${imgBaseUrl}img_LakeBlue.png`} alt="" />
        </div>
      ),
    },
    {
      title: '链接',
      key: 'age',
      width: 270,
      render: (text, record, index) => (
        <div className={styles.inpBox}>
          <Input placeholder="请设置跳转链接" onFocus={() => inpFocus(record)} />
        </div>
      ),
    },
  ];

  function inpFocus(rec) {
    setimgUrlModal(true);
  }

  return <EditBar comColumn={columns} />;
}
