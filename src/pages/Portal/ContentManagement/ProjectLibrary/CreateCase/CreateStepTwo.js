/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-08 16:09:09
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Button } from 'antd';
import { getQueryUrlVal } from '@/utils/utils';
import img from '@/assets/bgimg.png';
import styles from '../index.less';
@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class CreateStepTwo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  render() {
    const {
      ProjectLibrary: { specialUid },
    } = this.props;
    return (
      <div>
        <div className={styles.twrap}>
          <img src={img} className={styles.timg} />
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={() => {
              router.push(
                `/portal/contentmanagement/ProjectLibrary/ConfigurationTopic?&uid=${specialUid}`
              );
            }}
          >
            配置专题页面
          </Button>
          <Button
            onClick={() => {
              router.push(`/portal/contentmanagement/ProjectLibrary/edit?uid=${specialUid}`);
            }}
          >
            上一步
          </Button>
        </div>
      </div>
    );
  }
}

export default CreateStepTwo;
