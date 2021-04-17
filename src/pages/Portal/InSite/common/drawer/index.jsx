/*
 * @Author: tdd 
 * @Date: 2021-03-23 09:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-07 13:49:12 
 * 编辑模板
 */
import React, { useState, useContext, useEffect } from 'react';
import { ctx } from '../context';
import { canEditTags } from '../../tools/data';
import ImgsEdit from './imgsEdit';
import TagsEdit from './tagsEdit';
import styles from './drawerEditor.less';

export default function DrawerEditor(props) {
  const { curFlag } = useContext(ctx);
  const isShow = canEditTags.includes(curFlag);

  return (
    <div className={`drawerEditor ${styles.drawerBox} ${isShow ? styles.show : ''}`}>
      <h3>{`编辑${curFlag === 'banner' ? '轮播' : '亮点'}`}</h3>
      {curFlag === 'banner' && <ImgsEdit />}
      {curFlag === 'highlights' && <TagsEdit />}
    </div>
  );
}
