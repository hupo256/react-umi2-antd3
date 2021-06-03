/*
 * @Author: tdd
 * @Date: 2021-04-17 10:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-17 13:49:12
 * 离开确认组件
 */
import React, { useState, useContext } from 'react';
import { Prompt } from 'react-router-dom';
import router from 'umi/router';
import { ctx } from '../common/context';
import { Modal, message } from 'antd';
import styles from './edit.less';

export default function ForPrompt(props) {
  const { curFlag, setcurFlag, pageData, templateCode, savePageData } = useContext(ctx);

  // flag为editing，表示还有未保存的数据
  let isPrompt = curFlag === 'editing';

  function goLeave(key, bool) {
    setcurFlag('');
    if (!bool) {
      router.push(key);
    } else {
      if(!pageData?.jsonData) return message.error('数据为空，请稍后再试')
      const parmas = {
        editTemplateCode: templateCode,
        editTemplateJson: pageData,
      };
      if (parmas.editTemplateJson.maps) {
        delete parmas.editTemplateJson.maps;
      }
      // 保存后再跳转
      savePageData(parmas, () => {
        message.success('保存成功', () => router.push(key));
      });
    }
  }

  return (
    <div className={styles.contain}>
      <Prompt
        when={isPrompt}
        message={location => {
          if (!isPrompt) {
            return true;
          }
          const { pathname } = location;
          Modal.confirm({
            title: '保存修改',
            content: '您刚才编辑的信息需要保存吗？',
            onOk() {
              console.log('to save');
              goLeave(pathname, true);
            },
            onCancel() {
              console.log(location);
              isPrompt = false;
              goLeave(pathname);
            },
          });
          return false;
        }}
      />
    </div>
  );
}
