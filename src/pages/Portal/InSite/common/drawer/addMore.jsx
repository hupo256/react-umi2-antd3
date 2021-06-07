/*
 * @Author: tdd
 * @Date: 2021-06-02 16:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-06-02 16:49:12
 * 通用组件--添加一条新数据
 */
import React, { useContext } from 'react';
import { ctx } from '../context';
import styles from './drawerEditor.less';

export default function NavEdit(props) {
  const { MdTip } = useContext(ctx);
  return (
    <p className={styles.addImg} onClick={props.clickHandle}>
      <span>+</span>
      <span>{` 添加${MdTip}`}</span>
    </p>
  );
}
