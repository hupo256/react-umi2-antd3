/*
 * @Author: tdd
 * @Date: 2021-03-25 16:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-25 16:49:12
 * 移动端首页 公用头部
 */
import React, { useContext } from 'react';
import { Button, message, Modal, Icon } from 'antd';
import router from 'umi/router';
import { baseRouteKey, themes } from '../../tools/data';
import { ctx } from '../context';
import { updateHomePageEditData, publishEditData, saveNavEditData } from '@/services/miniProgram';
import styles from './titleGuid.less';

const { confirm } = Modal;

export default function TitleGuid(props) {
  const { title = '标题', disc, isEdit } = props;
  const { pageData, setcurFlag, templateCode, templateName, navData } = useContext(ctx);

  function toPublish() {
    console.log(pageData);
    if(!pageData?.jsonData) return message.error('数据为空，请稍后再试')
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
            <a href="#/pc/preview" target="_blank">
              <Icon type="desktop" />
              <span>网站预览</span>
            </a>
            <Button onClick={toPublish} type="primary">
              <img
                src="https://img.inbase.in-deco.com/crm_saas/release/20210511/bb4bd99abc374cae9b1dbe634a6a388c/ic_send.png"
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
