/*
 * @Author: zqm 
 * @Date: 2021-03-02 11:49:34 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-03 14:54:27
 * 未绑定小程序
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import img from '../../../assets/v2_q1insu.png';
import styles from './MiniProgram.less';

@connect(({ MiniProgram }) => ({ MiniProgram }))
class NotBound extends PureComponent {
  render() {
    const { authorizationUrl } = this.props.MiniProgram;
    console.log('====================================');
    console.log(authorizationUrl);
    console.log('====================================');
    return (
      <div className={styles.miniprogramWrap}>
        <div className={styles.content}>
          <img src={img} />
          <div className={styles.title}>
            <p>404</p>
            <p>抱歉，您还未进行小程序授权，</p>
            <p>请先授权后刷新页面</p>
          </div>
        </div>
        <div className={styles.mark}>
          <p>微门户</p>
          <p>为装企提供可以快速搭建自己微信门户的服务，</p>
          <p>让装企可以通过简单的内容配置，即具备超越90%装企的微信营销能力</p>
        </div>

        <Button
          type="primary"
          style={{ marginLeft: '45%', marginTop: 20 }}
          onClick={() => this.handleUrl()}
        >
          一键授权
        </Button>
      </div>
    );
  }
  handleUrl = () => {
    const { authorizationUrl } = this.props.MiniProgram;
    if (authorizationUrl) {
      window.location.href = authorizationUrl;
    }
  };
}

export default NotBound;
