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
  const { stepNum } = useContext(ctx);

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <ShowSteps />
        {stepNum === 0 && <CreatGame />}
        {stepNum === 1 && <CreatGoods />}
        {stepNum === 2 && <CreatDone />}
      </Card>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <CreatAct {...props} />
  </Provider>
);
