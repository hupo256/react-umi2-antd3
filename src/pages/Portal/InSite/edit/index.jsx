/*
 * @Author: tdd
 * @Date: 2021-03-23 13:49:12
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-28 18:36:27
 * 编辑模板
 */
import React, { useState, useContext } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Tooltip, Icon } from 'antd';
import { Provider, ctx } from '../common/context';
import { tipsText, canEditTags, editText } from '../tools/data';
import Preview from '../preview';
import TitleGuid from '../common/titleGuid';
import DrawerEditor from '../common/drawer';
import EditModel from '../common/drawer/modelsEdit'
import Prompt from './prompt';
import styles from './edit.less';

function TempEdit(props) {
  const { curFlag, setcurFlag } = useContext(ctx);
  const showRight = canEditTags.includes(curFlag);

  return (
    <PageHeaderWrapper>
      <TitleGuid title="首页装修" isEdit={true} />
      <div className={`${styles.currTepBox} ${showRight ? styles.rightPlaceHolder : ''}`}>
        <Preview />

        <div className={styles.tipsOut}>
          <div
            className={styles.tipsBox}
            style={{ bottom: '15.5em' }}
            onClick={() => {
              setcurFlag('editModel');
            }}
          >
            <Tooltip placement="topLeft" title={editText}>
              <Icon type="appstore" style={{ fontSize: '16px', color: '#fe6a30' }} />
              <b>编辑模块</b>
            </Tooltip>
          </div>
          <div className={styles.tipsBox}>
            <Tooltip placement="topLeft" title={tipsText}>
              <Icon type="bulb" style={{ fontSize: '16px', color: '#fe6a30' }} />
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
