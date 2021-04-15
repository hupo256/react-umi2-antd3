/*
 * @Author: tdd 
 * @Date: 2021-04-15 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-15 16:49:12 
 * 分步显示 模块
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import { Steps } from 'antd';
import styles from './steps.less';

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

export default function ShowStep(props) {
  const { stepNum } = useContext(ctx);

  useEffect(() => {}, []);

  function addNew() {
    console.log(22);
    setgoodsModal(true);
  }

  return (
    <div className={styles.headDisc}>
      <h3>创建小游戏</h3>
      <p>小游戏创建共为两步：第一步填写基本信息，第二步进行奖项设置，即可完成创建</p>

      <div className={styles.stepbox}>
        <Steps current={stepNum}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
    </div>
  );
}
