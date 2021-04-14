/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 商品管理
 */
import React, { useState, useEffect, useContext } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import mktApi from '@/services/mktActivity';
import { Provider, ctx } from '../common/context';
import { Card } from 'antd';
import CreatGame from './creatGame';
import CreatGoods from './creatGoods';
import CreatDone from './creatDone';

function CreatAct(props) {
  const { activityCode, goodsDone } = useContext(ctx);

  console.log(activityCode);
  useEffect(() => {}, []);

  function addNew() {
    console.log(22);
    setgoodsModal(true);
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        {!activityCode && <CreatGame />}
        {activityCode && !goodsDone && <CreatGoods />}
        {goodsDone && <CreatDone />}
      </Card>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <CreatAct {...props} />
  </Provider>
);
