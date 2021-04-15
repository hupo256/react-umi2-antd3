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
import { Card } from 'antd';
import CreatGame from './creatGame';
import CreatGoods from './creatGoods';
import CreatDone from './creatDone';
import ShowSteps from './steps';

function CreatAct(props) {
  const { activityCode, newUrl } = useContext(ctx);

  console.log(activityCode);
  useEffect(() => {}, []);

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <ShowSteps />
        {!activityCode && <CreatGame />}
        {activityCode && !newUrl && <CreatGoods />}
        {newUrl && <CreatDone />}
      </Card>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <CreatAct {...props} />
  </Provider>
);
