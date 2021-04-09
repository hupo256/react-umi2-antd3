/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑模板
 */
import React, { useState, useContext, useEffect } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Provider, ctx } from '../common/context';
import Preview from '../preview';
import TitleGuid from '../common/titleGuid';
import DrawerEditor from '../common/drawer';
import styles from './edit.less';

function TempEdit(props) {
  const { curFlag } = useContext(ctx);

  return (
    <PageHeaderWrapper>
      <TitleGuid title="编辑小程序" isEdit={true} />
      <div className={`${styles.currTepBox} ${curFlag ? styles.rightPlaceHolder : ''}`}>
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
