/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑模板
 */
import React, { useState, useContext, useEffect } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { updateHomePageEditData, getHomePagePublishedData } from '@/services/miniProgram';
import { Provider, ctx } from '../common/context';
import { Button, Drawer } from 'antd';
import Preview from '../preview';
import TitleGuid from '../common/titleGuid';
import DrawerEditor from '../common/editBar/drawerEditor';
import styles from './edit.less';

function TempEdit(props) {
  const { setpageData, setcurFlag, curFlag } = useContext(ctx);
  const [visible, setvisible] = useState(false);

  useEffect(() => {
    getJsonData();
  }, []);

  function getJsonData() {
    const param = [
      {
        key: 'case',
        pageNum: '1',
        pageSize: '4',
      },
      {
        key: 'site',
        pageNum: '1',
        pageSize: '4',
      },
      {
        key: 'design',
        pageNum: '1',
        pageSize: '4',
      },
    ];
    getHomePagePublishedData(param).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setpageData(addMapToData(data.templateJson));
    });
  }

  function addMapToData(pData) {
    const arr = pData.jsonData;
    const map = {};
    arr.forEach(item => {
      const pName = item.flag;
      map[pName] = item;
    });
    pData.maps = map;
    return pData;
  }

  return (
    <PageHeaderWrapper>
      <TitleGuid title="编辑小程序" isEdit={true} />
      <div className={`${styles.currTepBox} ${curFlag ? styles.rightPlaceHolder : ''}`}>
        <Preview />

        <div className={styles.btnbox}>
          {/* <Button onClick={() => setcurFlag('highlights')} type="primary"> */}
          <Button onClick={() => setcurFlag('banner')} type="primary">
            开始编辑
          </Button>
        </div>

        <DrawerEditor />
      </div>

      {/* <Button onClick={() => setvisible(true)}>click me</Button> */}
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={() => setvisible(false)}
        visible={visible}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <TempEdit {...props} />
  </Provider>
);
