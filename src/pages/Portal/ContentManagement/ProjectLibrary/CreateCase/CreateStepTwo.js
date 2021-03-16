/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-15 14:16:36
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Button } from 'antd';
import { getQueryUrlVal } from '@/utils/utils';
import img from '@/assets/bgimg.png';
import styles from '../index.less';
class CreateStepTwo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  render() {
    return (
      <div>
        <div className={styles.twrap}>
          <img src={img} className={styles.timg} />
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={() => {
              const activeKey = getQueryUrlVal('uid');
              router.push(
                `/portal/contentmanagement/ProjectLibrary/ConfigurationTopic?&uid=${activeKey}`
              );
            }}
          >
            配置专题页面
          </Button>
          <Button onClick={this.handleSubmit}>上一步</Button>
        </div>
      </div>
    );
  }
  handleSubmit = e => {
    this.props.handleOk();
  };
}

export default CreateStepTwo;
