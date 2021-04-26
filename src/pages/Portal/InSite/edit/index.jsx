/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑模板
 */
import React, { useState, useContext } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Tooltip, Icon } from 'antd';
import { Provider, ctx } from '../common/context';
import { tipsText, canEditTags } from '../tools/data';
import Preview from '../preview';
import TitleGuid from '../common/titleGuid';
import DrawerEditor from '../common/drawer';
import Prompt from './prompt';
import styles from './edit.less';

function TempEdit(props) {
  const { curFlag } = useContext(ctx);
  const showRight = canEditTags.includes(curFlag);

  return (
    <PageHeaderWrapper>
      <TitleGuid title="首页装修" isEdit={true} />
      <div className={`${styles.currTepBox} ${showRight ? styles.rightPlaceHolder : ''}`}>
        <Preview />

        <div className={styles.tipsOut}>
          <div className={styles.tipsBox}>
            <Tooltip placement="topLeft" title={tipsText}>
              <Icon type="bulb" style={{ fontSize: '16px' }} />
              <b>温馨提示</b>
            </Tooltip>
          </div>
        </div>
        <DrawerEditor />
      </div>

      <Prompt isPrompt={true} />
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <TempEdit {...props} />
  </Provider>
);
