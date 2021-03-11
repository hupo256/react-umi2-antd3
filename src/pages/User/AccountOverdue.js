/*
 * @Author: zqm 
 * @Date: 2021-01-08 11:19:53 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-02-01 11:51:55
 * 公司租约过期
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { Button } from 'antd';
import { MyIcon } from '@/utils/utils';
import styles from './Account.less';
import router from 'umi/router';
@connect(({ login }) => ({
  login,
}))
class AccountOverdue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectNum: '',
      workOrderNum: '',
    };
  }

  componentDidMount() {
    let name = localStorage.getItem('companyName');
    const { dispatch } = this.props;
    dispatch({
      type: 'login/projectQueryNumModel',
      payload: {
        companyName: name,
      },
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({
          projectNum: res.data.projectNum,
          workOrderNum: res.data.workOrderNum,
        });
      }
    });
  }

  render() {
    const { projectNum, workOrderNum } = this.state;
    return (
      <div>
        <div className={styles.UserTooltipWrap} style={{ color: '#cdcdcd' }}>
          <div className={styles.UserTooltipLeft}>
            <MyIcon type="icon-history" style={{ fontSize: 95, color: '#cdcdcd' }} />
          </div>
          <div className={styles.UserTooltipRight}>
            <p style={{ fontSize: 36, color: '#7f7f7f', margin: 0 }}>抱歉，贵公司的租约已过期</p>
            <p style={{ fontSize: 16, color: '#fe6a30', marginTop: 10 }}>
              目前还有
              {projectNum}
              个项目，
              {workOrderNum}
              个工单等待服务。
            </p>
            <p style={{ fontSize: 16, color: '#7f7f7f', marginTop: 10 }}>
              如需继续使用，可致电服务热线：400-056-6800
            </p>
            <Button
              onClick={() => {
                router.push('/user/login');
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

export default AccountOverdue;
