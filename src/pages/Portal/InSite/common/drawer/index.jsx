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
import ModelsEdit from './modelsEdit'
import AboutUsEdit from './aboutUsEdit'
import NavEdit from './navEdit'


export default function DrawerEditor(props) {
  const { curFlag, setcurFlag, pageData, setpageData, navData, setNavData } = useContext(ctx);
  const isShow = canEditTags.includes(curFlag);

  function blockPropagation(e) {
    e.stopPropagation();
    // 阻止与原生事件的冒泡
    // e.nativeEvent.stopImmediatePropagation();
  }
  console.log(111)
  return (
    <div
      className={`${styles.drawerOut} ${isShow ? styles.show : ''}`}
      onClick={() => {
        if (curFlag === 'editModel') {
          const newObj = { ...pageData };
          newObj.jsonData.map((e) => {
            if (e.afterName) {
              e.title = e.afterName
            }
          });
          setpageData(newObj);
        }
        if (curFlag === 'nav') {
          const newArr = [ ...navData ];
          const arr = []
          newArr.map(e => {
            if (e.navModule) {
              arr.push(e)
            }
          })
          setNavData(arr);
        }
        setcurFlag('editing')
      }}
    >
      <div className={styles.drawerBox} onClick={blockPropagation}>
        <h3>{`编辑${curFlag === 'highlights' ? '亮点' : curFlag === 'editModel' ? '模块' : curFlag === 'aboutUs' ? '关于我们' : curFlag === 'nav' ? '导航' : '图片广告'}`}</h3>
        {curFlag === 'editModel' && <ModelsEdit />}
        {curFlag === 'banner' && <ImgsEdit />}
        {curFlag === 'highlights' && <TagsEdit />}
        {curFlag === 'advertising' && <ImgsEdit />}
        {curFlag === 'aboutUs' && <AboutUsEdit />}
        {curFlag === 'nav' && <NavEdit />}
      </div>
    </div>
  );
}
