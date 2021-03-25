/*
 * @Author: tdd 
 * @Date: 2021-03-25 16:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-25 16:49:12 
 * 移动端首页 公用头部
 */
import React from 'react';
import styles from './titleGuid.less';

export default function TitleGuid() {
  return (
    <div className={styles.guidBox}>
      <h3>选择一个模板开始</h3>
      <p>模板可以帮您一键生成案例、工地和设计师模块，并有多种布局和风格供您选择。</p>
    </div>
  );
}
