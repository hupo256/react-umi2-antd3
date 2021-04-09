/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-09 17:55:54
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from '../index.less';

@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class CreateStepThree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const {
      ProjectLibrary: { uspecialUrlData },
    } = this.props;
    let extra = (
      <div>
        <div>专题标题: {uspecialUrlData.specialTitle}</div>
        <div style={{ paddingTop: 20 }}>
          专题链接:
          <span>
            {uspecialUrlData.specialUrl}
            <Icon
              type="copy"
              onClick={() => {
                this.handleCopy(uspecialUrlData.specialUrl);
              }}
            />
            <span style={{ marginLeft: 5 }}>复制链接</span>
          </span>
          <textarea id="inputv" className={styles.ipt} />
        </div>
      </div>
    );
    return (
      <div style={{ textAlign: 'center', paddingTop: 20 }}>
        <div />
        <Result
          type="success"
          title="发布成功"
          extra={extra}
          description="可在所需的呈现的菜单，选择当前专题页啦"
          style={{ width: '50%' }}
        />

        <div style={{ marginTop: 20 }}>
          <Button
            type="primary"
            onClick={() => {
              this.addNew();
            }}
          >
            在创建一个
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => {
              router.push('/portal/contentmanagement/ProjectLibrary');
            }}
          >
            返回专题库
          </Button>
        </div>
      </div>
    );
  }
  addNew = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'status',
        value: 0,
      },
    });
    router.push('/portal/contentmanagement/ProjectLibrary/add');
  };
  handleCopy(t) {
    let input = document.getElementById('inputv');
    input.value = t; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
    message.success('复制成功');
  }
}

export default CreateStepThree;
