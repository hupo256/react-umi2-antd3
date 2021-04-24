/*
 * @Author: tdd 
 * @Date: 2021-03-25 16:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-25 16:49:12 
 * 移动端首页 公用头部
 */
import React, { useContext, useState } from 'react';
import { Button, message, Modal } from 'antd';
import router from 'umi/router';
import { baseRouteKey } from '../../tools/data';
import { ctx } from '../context';
import { updateHomePageEditData, publishEditData } from '@/services/miniProgram';
import styles from './titleGuid.less';

const { confirm } = Modal;

export default function TitleGuid(props) {
  const { title = '标题', disc, isEdit } = props;
  const { pageData, setcurFlag, templateCode, templateName, touchPageData } = useContext(ctx);

  function toPublich() {
    console.log(pageData);
    const { jsonData, themeData } = pageData;
    const { customerService } = JSON.parse(localStorage.getItem('auth'));
    const parmas = {
      editTemplateCode: templateCode,
      editTemplateJson: { jsonData, themeData, templateName, globalInfor: { customerService } },
    };
    updateHomePageEditData(parmas).then(res => {
      res.code === 200 &&
        publishEditData().then(res => {
          setcurFlag(''); // 置空
          message.success('发布成功');
          setTimeout(() => {
            router.push(`${baseRouteKey}home`);
          }, 1500);
        });
    });
  }

  function showConfirm() {
    confirm({
      title: '确认要放弃更改吗？',
      content: '放弃更改后，将不保留当前编辑的内容',
      onOk() {
        router.go(-1);
      },
      onCancel() {
        console.log('onCancel');
      },
    });
  }

  return (
    <div className={styles.guidBox}>
      <h3>
        <span>{title}</span>
        {isEdit && (
          <div className={styles.btnBox}>
            <Button onClick={showConfirm}>放弃更改</Button>
            <Button onClick={toPublich} type="primary">
              发布
            </Button>
          </div>
        )}
      </h3>
      {disc && <p>模板可以帮您一键生成案例、工地和设计师模块，并有多种布局和风格供您选择。</p>}
    </div>
  );
}
