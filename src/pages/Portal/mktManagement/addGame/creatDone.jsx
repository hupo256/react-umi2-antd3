/*
 * @Author: tdd 
 * @Date: 2021-04-12 11:09:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-12 14:49:12 
 * 添加、修改商品
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import router from 'umi/router';
import { baseRouteKey } from '../tools/data';
import { defaultGoods } from '../tools/data';
import Upload from '@/components/Upload/Upload';
import mktApi from '@/services/mktActivity';
import { Button, Icon } from 'antd';
import styles from './addGame.less';

export default function CreatGoods(props) {
  const { activityTitle } = useContext(ctx);
  const [actUrl, setactUrl] = useState(false);

  function gotoRoute(key) {
    router.push(`${baseRouteKey}${key}`);
  }

  return (
    <div className={styles.doneBox}>
      <Icon type="check-circle" theme="filled" style={{ fontSize: '70px', color: '#fe6a30' }} />
      <h3>创建成功</h3>
      <p>可在所需的呈现的菜单，选择当前小小戏啦</p>
      <div className={styles.titBox}>
        <p>
          游戏标题：
          {activityTitle}
        </p>
        <p>
          游戏链接：
          {actUrl} 复制链接
        </p>
      </div>
      <div className={styles.btnBox}>
        <Button type="primary" onClick={() => gotoRoute('addGame')}>
          再创建一个
        </Button>
        <Button onClick={() => gotoRoute('activity')}>返回营销小游戏</Button>
      </div>
    </div>
  );
}
