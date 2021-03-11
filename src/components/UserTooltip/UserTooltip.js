/*
 * @Author: zqm 
 * @Date: 2020-12-23 11:00:57 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-02-03 18:55:15
 */
import React, { Component } from 'react';
import { Card, Form, Row, Col, Table } from 'antd';
import styles from './UserTooltip.less';
import { MyIcon } from '@/utils/utils';
import img from '../../assets/img_update.png';
class UserTooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card bordered={false}>
        <div className={styles.UserTooltipWrap} style={{ color: '#cdcdcd' }}>
          <div className={styles.UserTooltipLeft}>
            <MyIcon type="icon-suo" style={{ fontSize: 65, color: '#cdcdcd', display: 'none' }} />
            <img src={img} style={{ width: 234 }} />
          </div>
          <div className={styles.UserTooltipRight}>
            <p className={styles.UserTooltipRightp1}>
              该功能升级正式版后可查看，如需使用，欢迎致电
            </p>
            <p className={styles.UserTooltipRightp2}>400-056-6800</p>
          </div>
        </div>
      </Card>
    );
  }
}

export default UserTooltip;
