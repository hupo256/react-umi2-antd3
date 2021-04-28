/*
 * @Author: tdd 
 * @Date: 2021-03-23 09:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-07 13:49:12 
 * 编辑模板
 */
import React, { useContext, useEffect } from 'react';
import { ctx } from '../context';
import { canEditTags } from '../../tools/data';
import ImgsEdit from './imgsEdit';
import TagsEdit from './tagsEdit';
import styles from './drawerEditor.less';

export default function DrawerEditor(props) {
  const { curFlag, setcurFlag } = useContext(ctx);
  const isShow = canEditTags.includes(curFlag);

  function blockPropagation(e) {
    e.stopPropagation();
    // 阻止与原生事件的冒泡
    // e.nativeEvent.stopImmediatePropagation();
  }

  return (
    <div
      className={`${styles.drawerOut} ${isShow ? styles.show : ''}`}
      onClick={() => setcurFlag('editing')}
    >
      <div className={styles.drawerBox} onClick={blockPropagation}>
        <h3>{`编辑${curFlag === 'highlights' ? '亮点' : '图片广告'}`}</h3>
        {curFlag === 'banner' && <ImgsEdit />}
        {curFlag === 'highlights' && <TagsEdit />}
        {curFlag === 'advertising' && <ImgsEdit />}
      </div>
    </div>
  );
}
