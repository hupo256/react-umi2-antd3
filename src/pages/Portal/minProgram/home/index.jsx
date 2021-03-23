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
import pholder from '../tools/bg.png';
import styles from './home.less';

export default function Templates(props) {
  const [tepList, settepList] = useState([]);
  const [isEdit, setisEdit] = useState(true);

  useEffect(() => {
    // settepList(touchList());
  }, []);

  return (
    <div>
      <PageHeaderWrapper>
        <Card className={styles.currTepOut} bordered={false}>
          <h3>当前使用的模板名</h3>

          <div className={styles.currTepBox}>
            <img src={pholder} alt="" />
          </div>
        </Card>
      </PageHeaderWrapper>
    </div>
  );
}
