/*
 * @Author: zqm 
 * @Date: 2021-01-08 11:23:17 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-01-22 00:47:01
 * 账号禁用 
 */
import React, { Component } from 'react';
import { Button } from 'antd';
import { MyIcon } from '@/utils/utils';
import styles from './Account.less';
import router from 'umi/router';

class AccountDisabled extends Component {
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
            <p style={{ fontSize: 36, color: '#7f7f7f', margin: 0 }}>您的账号已被禁用</p>
            <p style={{ fontSize: 16, color: '#7f7f7f', marginTop: 10 }}>
              如需继续使用，请联系贵公司管理员处理
            </p>
            <Button
              onClick={() => {
                history.go(-1);
              }}
              type="primary"
              style={{ minWidth: 100, marginTop: 30 }}
            >
              返回
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

AccountDisabled.propTypes = {};

export default AccountDisabled;
