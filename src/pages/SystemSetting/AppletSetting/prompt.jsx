/*
 * @Author: tdd
 * @Date: 2021-06-16 10:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-06-17 13:49:12
 * 离开确认组件
 */
import React, { useState, useContext } from 'react';
import { Prompt } from 'react-router-dom';
import router from 'umi/router';
import { Modal, message } from 'antd';

export default function ForPrompt(props) {
  const { isEditing, submitFun } = props;
  let isPrompt = isEditing;

  function goLeave(key, bool) {
    if (!bool) {
      router.push(key);
    } else {
      console.log('to save');
      submitFun && submitFun(key);
    }
  }

  return (
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
  );
}
