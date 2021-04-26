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
import { Card, Steps } from 'antd';
import CreatGame from './creatGame';
import CreatGoods from './creatGoods';
import CreatDone from './creatDone';
import styles from './addGame.less';

const { Step } = Steps;
const steps = [
  {
    title: '填写基本信息',
    content: 'First-content',
  },
  {
    title: '进行奖项设置',
    content: 'Second-content',
  },
  {
    title: '完成',
    content: 'Last-content',
  },
];

function CreatAct(props) {
  const { stepNum } = useContext(ctx);

  return (
    <PageHeaderWrapper>
      <div className={styles.guidBox}>
        <h3>创建小游戏</h3>
        <p>小游戏创建共为两步：第一步填写基本信息，第二步进行奖项设置，即可完成创建</p>
      </div>
      <Card bordered={false}>
        <div className={styles.stepbox}>
          <Steps current={stepNum}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>
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
