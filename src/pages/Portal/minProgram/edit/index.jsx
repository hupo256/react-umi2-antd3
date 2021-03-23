/*
 * @Author: zqm 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button } from 'antd';
import tempbg from '../tools/tempbg.png';
import styles from './edit.less';

export default function Templates(props) {
  const [tepList, settepList] = useState([]);
  const [isEdit, setisEdit] = useState(true);

  useEffect(() => {
    // settepList(touchList());
  }, []);

  function touchList() {
    const temLen = isEdit ? 8 : 7;
    const arr = [];
    for (let i = 0; i < temLen; i++) {
      arr.push({
        img: tempbg,
        tit: '经典黑白风',
      });
    }
    return arr;
  }

  return (
    <div>
      <PageHeaderWrapper>
        <Card bordered={false} style={{ marginTop: 20 }}>
          <h3>编辑</h3>
        </Card>
      </PageHeaderWrapper>
    </div>
  );
}
