/*
 * @Author: tdd 
 * @Date: 2021-04-12 11:09:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-12 14:49:12 
 * 添加、修改商品
 */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ctx } from '../common/context';
import router from 'umi/router';
import { baseRouteKey } from '../tools/data';
import { Button, Icon, Input, message } from 'antd';
import styles from './addGame.less';

export default function CreatGoods(props) {
  const { activityTitle, newUrl, setcurActDate, setstepNum, setcurGoods } = useContext(ctx);
  const urlHolder = useRef();

  function gotoRoute(key) {
    router.push(`${baseRouteKey}${key}`);
  }

  function copyLink() {
    const inp = urlHolder.current;
    console.log(inp);
    inp.select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
    message.success('复制成功!');
  }

  function toMoreAgain() {
    setcurActDate(null);
    setcurGoods([]);
    setstepNum(0);
  }

  return (
    <div className={styles.doneBox}>
      <Icon type="check-circle" theme="filled" style={{ fontSize: '70px', color: '#fe6a30' }} />
      <h3>创建成功</h3>
      <p>可在所需的呈现的菜单，选择当前小戏啦</p>
      <div className={styles.titBox}>
        <p>
          游戏标题：
          {activityTitle}
        </p>
        <p>
          游戏链接：
          <span>{newUrl} </span>
          <Input ref={urlHolder} className={styles.inpHidden} value={newUrl} />
          <a onClick={copyLink} className={styles.tocopy}>
            <Icon type="copy" />
            复制链接
          </a>
        </p>
      </div>
      <div className={styles.btnBox}>
        <Button type="primary" onClick={toMoreAgain}>
          再创建一个
        </Button>
        <Button onClick={() => gotoRoute('games')}>返回营销小游戏</Button>
      </div>
    </div>
  );
}
