/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑模板
 */
import React, { useState, useEffect } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Drawer } from 'antd';
import ImgsEdit from '../common/imgsEdit';
import pholder from '../tools/tempbg.png';
import styles from './edit.less';

export default function Templates(props) {
  const [visible, setVisible] = useState(true);

  function selectChange(e) {
    console.log(e);
  }

  return (
    <div>
      <PageHeaderWrapper>
        <Card className={styles.currTepOut} bordered={false}>
          <Drawer
            title="编辑轮播"
            width={620}
            // bodyStyle={{ paddingBottom: 80 }}
            closable={false}
            onClose={() => setVisible(false)}
            visible={visible}
          >
            <ImgsEdit />
          </Drawer>

          <div className={styles.currTepBox}>
            <img src={pholder} alt="" />

            <div className={styles.btnbox}>
              <Button onClick={() => setVisible(true)} type="primary">
                温馨提示
              </Button>
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    </div>
  );
}
