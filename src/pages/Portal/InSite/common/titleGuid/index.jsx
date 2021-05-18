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
import { baseRouteKey, themes } from '../../tools/data';
import { ctx } from '../context';
import { updateHomePageEditData, publishEditData } from '@/services/miniProgram';
import styles from './titleGuid.less';
import { saveNavEditData } from '../../../../../services/miniProgram';

const { confirm } = Modal;

export default function TitleGuid(props) {
  const { title = '标题', disc, isEdit } = props;
  const { pageData, setcurFlag, templateCode, templateName, navData } = useContext(ctx);

  function toPublish() {
    console.log(pageData);
    let { jsonData, themeData } = pageData;
    const { customerService } = JSON.parse(localStorage.getItem('auth'));
    themeData = themes[templateCode];
    const parmas = {
      editTemplateCode: templateCode,
      editTemplateJson: { jsonData, themeData, templateName, globalInfor: { customerService } },
    };
    updateHomePageEditData(parmas).then(res => {
      if (res.code === 200) {
        saveNavEditData(navData)
          .then(r => {
            if (r.code === 200) {
              publishEditData().then(() => {
                setcurFlag(''); // 置空
                message.success('发布成功');
                setTimeout(() => {
                  router.push(`${baseRouteKey}home`);
                }, 1000);
              });
            }
          })
      }
    });
  }

  function showConfirm() {
    confirm({
      title: '确认要放弃更改吗？',
      content: '放弃更改后，将不保留当前编辑的内容',
      onOk() {
        console.log('ok');
        setcurFlag(''); // 置空
        setTimeout(() => {
          router.go(-1);
        });
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
            <Button onClick={toPublish} type="primary">
              <img
                src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210427/4baa9248ecf944b0a13f5fea5453f859/ic_send.png"
                alt=""
              />
              发布
            </Button>
          </div>
        )}
      </h3>
      {disc && <p>模板可以帮您一键生成案例、工地和设计师模块，并有多种布局和风格供您选择。</p>}
    </div>
  );
}
