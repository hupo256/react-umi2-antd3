/*
 * @Author: tdd 
 * @Date: 2021-03-23 09:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-07 13:49:12 
 * 编辑模板
 */
import React, { useState, useContext, useEffect } from 'react';
import { ctx } from '../context';
import ImgsEdit from './imgsEdit';
import TagsEdit from './tagsEdit';
import styles from './drawerEditor.less';

const editTags = ['banner', 'highlights', 'highlights'];

export default function DrawerEditor(props) {
  const { curFlag } = useContext(ctx);
  const isShow = editTags.includes(curFlag);

  return (
    <div className={`${styles.drawerBox} ${isShow ? styles.show : ''}`}>
      <h3>编辑轮播图</h3>
      {curFlag === 'banner' && <ImgsEdit />}
      {curFlag === 'highlights' && <TagsEdit />}
    </div>
  );
}
