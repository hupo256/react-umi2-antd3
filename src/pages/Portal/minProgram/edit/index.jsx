/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Drawer } from 'antd';
import pholder from '../tools/tempbg.png';
import styles from './edit.less';

export default function Templates(props) {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <PageHeaderWrapper>
        <Card className={styles.currTepOut} bordered={false}>
          <div className={styles.currTepBox}>
            <img src={pholder} alt="" />

            <div className={styles.btnbox}>
              <Button onClick={() => gotoRoute('edit')} type="primary">
                温馨提示
              </Button>
            </div>
          </div>

          <Drawer
            title="Basic Drawer"
            closable={false}
            onClose={() => setVisible(false)}
            visible={visible}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
        </Card>
      </PageHeaderWrapper>
    </div>
  );
}
