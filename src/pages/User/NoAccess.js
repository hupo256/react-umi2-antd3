/*
 * @Author: zqm 
 * @Date: 2021-01-08 11:23:17 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-06 11:02:03
 * 账号禁用 
 */
import React, { Component } from 'react';
import { Button } from 'antd';
import { MyIcon } from '@/utils/utils';
import styles from './Account.less';
import router from 'umi/router';

class NoAccess extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    return (
      <div>
        <div className={styles.UserTooltipWrap} style={{ color: '#cdcdcd' }}>
          <div className={styles.UserTooltipLeft}>
            <MyIcon type="icon-suo" style={{ fontSize: 95, color: '#cdcdcd' }} />
          </div>
          <div className={styles.UserTooltipRight}>
            <p style={{ fontSize: 36, color: '#7f7f7f', margin: 0 }}>抱歉，您没有此功能权限</p>
            <p style={{ fontSize: 16, color: '#7f7f7f', marginTop: 10 }}>
              如需继续访问，请联系贵公司管理员处理
            </p>
            <Button
              onClick={() => {
                window.location.reload();
              }}
              type="primary"
              style={{ minWidth: 100, marginTop: 30, marginRight: 20 ,display:'none'}}
            >
              刷新
            </Button>
            <Button
              onClick={() => {
                router.push(`/`);
              }}
              type="primary"
              style={{ minWidth: 100, marginTop: 30 }}
            >
              返回首页
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

NoAccess.propTypes = {};

export default NoAccess;
