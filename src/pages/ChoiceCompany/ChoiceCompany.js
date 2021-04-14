import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { message } from 'antd';
import styles from './ChoiceCompany.less';

@connect(({ login }) => ({
  login,
}))
class ChoiceCompany extends Component {
  state = {
    count: 0,
  };

  componentDidMount() {
    const {
      login: { companyList },
    } = this.props;
    // if (companyList.length === 0) {
    //   window.location.href = '/';
    // }
  }

  render() {
    const companyList = JSON.parse(sessionStorage.getItem('companyList'));
    console.log(companyList);
    let arr =
      companyList &&
      companyList.map((item, index) => {
        return (
          <div
            className={styles.cptt}
            key={index}
            onClick={() => {
              this.handleLogin(item);
            }}
          >
            {item.companyName}
          </div>
        );
      });
    return (
      <div className={styles.maint}>
        <h1>欢迎回来</h1>
        <div className={styles.tip}>您的账号属于多个公司，请选择要登录的公司</div>
        {arr}
      </div>
    );
  }
  handleLogin(item) {
    const { dispatch } = this.props;
    const PasswordData = JSON.parse(sessionStorage.getItem('PasswordData'));
    dispatch({
      type: 'login/loginPasswordModel',
      payload: {
        companyCode: item.companyCode,
        systemCode: 'S005',
        ...PasswordData,
      },
    }).then(res => {
      localStorage.setItem('companyCode', item.companyCode);
      if (res && res.code === 200) {
        dispatch({
          type: 'login/setAuthModel',
          payload: {},
        }).then(res => {
          if (res && res.code === 200) {
            window.location.href = '/';
          }
        });
      } else {
        if (res && res.message) {
          message.warning(res.message);
          history.go(-1);
        }
      }
    });
  }
}

export default ChoiceCompany;
