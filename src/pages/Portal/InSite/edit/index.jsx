/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑模板
 */
import React, { useState, useContext, useEffect, useRef } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Provider, ctx } from '../common/context';
import Preview from '../preview';
import TitleGuid from '../common/titleGuid';
import DrawerEditor from '../common/drawer';
import styles from './edit.less';

function TempEdit(props) {
  const { curFlag, setcurFlag } = useContext(ctx);
  const editBox = useRef();

  useEffect(() => {
    // editBox.current.addEventListener('click', touchFlag);
    // return () => {
    //   editBox.current.removeEventListener('click', touchFlag);
    // };
  }, []);

  function touchFlag(e) {
    const text = isClickInBox(e.target);
    !text && setcurFlag('');
  }

  // 获取xpath
  function isClickInBox(el) {
    let inBox = false;
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      const cls = el.className;
      // console.log(cls);
      if (cls.includes('drawerEditor')) {
        inBox = true;
        break;
      }
    }
    return isPluginDom;
  }

  return (
    <PageHeaderWrapper>
      <TitleGuid title="编辑小程序" isEdit={true} />
      <div
        ref={editBox}
        className={`${styles.currTepBox} ${curFlag ? styles.rightPlaceHolder : ''}`}
      >
        <Preview />
        <DrawerEditor />
      </div>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <TempEdit {...props} />
  </Provider>
);
