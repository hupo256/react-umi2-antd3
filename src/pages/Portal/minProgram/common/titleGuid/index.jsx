/*
 * @Author: tdd 
 * @Date: 2021-03-25 16:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-25 16:49:12 
 * 移动端首页 公用头部
 */
import React from 'react';
import { Button, Icon } from 'antd';
import styles from './titleGuid.less';

export default function TitleGuid(props) {
  const { title = '标题', disc, isEdit } = props;

  function cancle() {
    console.log();
  }

  function toPublich() {
    console.log();
  }

  return (
    <div className={styles.guidBox}>
      <h3>
        <span>{title}</span>
        {isEdit && (
          <div className={styles.btnBox}>
            <Button onClick={cancle}>放弃更改</Button>
            <Button onClick={toPublich} type="primary">
              发布
            </Button>
          </div>
        )}
      </h3>
      {disc && <p>模板可以帮您一键生成案例、工地和设计师模块，并有多种布局和风格供您选择。</p>}
    </div>
  );
}
