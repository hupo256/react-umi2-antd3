/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 商品管理
 */
import React, { useState, useEffect, useContext } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Provider, ctx } from '../common/context';
import mktApi from '@/services/mktActivity';
import { Card, Tabs } from 'antd';
import { urlParamHash, calcNumInArr } from '../tools';
import CreatGame from '../addGame/creatGame';
import CreatGoods from '../addGame/creatGoods';

const { TabPane } = Tabs;

function ActivityEdit(props) {
  const { setcurActDate, setcurGoods } = useContext(ctx);

  useEffect(() => {
    const { uid } = urlParamHash(location.href);
    if (!uid) return;
    mktApi.getActivity({ uid }).then(res => {
      console.log(res);
      if (!res?.data) return;
      const { data } = res;
      // 拿到数据，开始填充from
      setcurActDate(data);
      const arr = calcNumInArr(data?.prizeList || []);
      setcurGoods(arr.slice());
    });
  }, []);

  function tabChange(e) {
    console.log();
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Tabs defaultActiveKey="2" onChange={tabChange}>
          <TabPane tab="基本信息" key="1">
            <CreatGame isEdit={true} />
          </TabPane>

          <TabPane tab="奖项设置" key="2">
            <CreatGoods isEdit={true} />
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <ActivityEdit {...props} />
  </Provider>
);
