/*
 * @Author: tdd
 * @Date: 2021-03-25 16:49:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-06-10 19:38:29
 * 移动端首页 公用头部
 */
import React, { useContext } from 'react';
import { Button, message, Modal, Icon } from 'antd';
import router from 'umi/router';
import { baseRouteKey, themes } from '../../tools/data';
import { ctx } from '../context';
import { publishEditData } from '@/services/miniProgram';
import styles from './titleGuid.less';
import { getauth } from '@/utils/authority';

export default function TitleGuid(props) {
  const { title = '标题', disc, isEdit, isAuthed } = props;
  const { pageData, setcurFlag, templateCode, templateName, savePageData } = useContext(ctx);
  const permissionsBtn = getauth();
  function toPublish() {
    let { jsonData, themeData } = pageData;
    const { customerService } = JSON.parse(localStorage.getItem('auth'));
    themeData = themes[templateCode];
    const parmas = {
      editTemplateCode: templateCode,
      editTemplateJson: { jsonData, themeData, templateName, globalInfor: { customerService } },
    };
    updateHomePageEditData(parmas).then(res => {
      if (res.code === 200) {
        const newArr = [...navData];
        const arr = [];
        newArr.map(e => {
          if (e.navModule) {
            arr.push(e);
          }
        });
        saveNavEditData(arr).then(r => {
          if (r.code === 200) {
            publishEditData().then(() => {
              setcurFlag(''); // 置空
              message.success('发布成功');
              setTimeout(() => {
                router.push(`${baseRouteKey}home`);
              }, 1000);
            });
          }
        });
      }
    });
  }

  function showConfirm() {
    Modal.confirm({
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
        <div className={styles.btnBox}>
          {isEdit && (
            <>
              <Button onClick={showConfirm}>放弃更改</Button>
              {permissionsBtn.permissions.includes('BTN210610000005') && (
                <a href="#/pc/preview" target="_blank">
                  <Icon type="desktop" />
                  <span>网站预览</span>
                </a>
              )}
              <Button onClick={toPublish} type="primary">
                <img
                  src="https://img.inbase.in-deco.com/crm_saas/release/20210511/bb4bd99abc374cae9b1dbe634a6a388c/ic_send.png"
                  alt=""
                />
                发布
              </Button>
            </>
          )}

          {isAuthed && (
            <>
              {permissionsBtn.permissions.includes('BTN210610000005') && (
                <a href="#/pc/preview" target="_blank">
                  <Icon type="desktop" />
                  <span>网站预览</span>
                </a>
              )}
            </>
          )}
        </div>
      </h3>
      {disc && <p>模板可以帮您一键生成案例、工地和设计师模块，并有多种布局和风格供您选择。</p>}
    </div>
  );
}
