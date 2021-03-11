import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      // placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        // message: 'Please enter username!',
        message: '请输入用户名!',
      },
    ],
  },

  Captchax: {
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      // placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        // message: 'Please enter username!',
        message: '请输入验证码!',
      },
    ],
  },

  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      // placeholder: '888888',
    },
    rules: [
      {
        required: true,
        // message: 'Please enter password!',
        message: '请输入密码',
      },
      {
        pattern: /^[^\s]*$/,
        message: '禁止输入空格',
      },
      { min: 6, message: '密码长度限制为6-20位' },
      { max: 20, message: '密码长度限制为6-20位' },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: '请输入手机号!',
      },
      {
        pattern: /^1([3|4|5|6|7|8|9|])\d{9}$/,
        message: '请输入正确手机号!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: '请输入短信验证码!',
      },
    ],
  },
};
