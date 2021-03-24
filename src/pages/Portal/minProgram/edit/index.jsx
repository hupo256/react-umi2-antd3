/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑模板
 */
import React, { useState, useEffect, useContext } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Provider, ctx } from '../common/context';
import { Card, Button, Drawer } from 'antd';
import ImgsEdit from './imgsEdit';
import TagEdit from './tagsEdit';
import pholder from '../tools/tempbg.png';
import styles from './edit.less';

function TempEdit(props) {
  const { tagsData, settagsData, imgsData, setimgsData } = useContext(ctx);
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <PageHeaderWrapper>
        <Card className={styles.currTepOut} bordered={false}>
          <Drawer
            title="编辑轮播"
            width={620}
            closable={false}
            onClose={() => setVisible(false)}
            visible={visible}
          >
            {/* <ImgsEdit /> */}
            <TagEdit />
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

export default props => (
  <Provider>
    <TempEdit {...props} />
  </Provider>
);
