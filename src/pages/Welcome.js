/*
 * @Author: your name
 * @Date: 2021-06-10 18:35:51
 * @LastEditTime: 2021-06-25 14:35:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-wechat-saas\src\pages\Welcome.js
 */
import React, { PureComponent } from 'react';
import welcome from '../assets/img_welcome@2x.png';
import { getAuthInfo } from '@/services/miniProgram';
class Welcome extends PureComponent {
  componentDidMount() {
    
     // 查询小程序授权状态并存入缓存
     const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
     getAuthInfo({ saasSellerCode }).then(res => {
      if (res?.code === 200) {
        localStorage.setItem('isCompanyAuthWechatMini', res.data.isCompanyAuthWechatMini)
      }
    })

  }
  render() {
    return (
      <div style={{ textAlign: 'center', paddingTop: 160 }}>
        <img src={welcome} alt="营销站" style={{ width: 284, height: 224, marginBottom: 70 }} />
        <p style={{ fontWeight: 400, fontSize: 20, textAlign: 'center', color: '#222' }}>
          欢迎使用
          <span style={{ color: '#fe6a30' }}>营销站</span>
          管理后台
        </p>
      </div>
    );
  }
}

export default Welcome;
