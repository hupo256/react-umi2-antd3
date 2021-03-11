/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-02-25 15:23:32
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Button, Icon, message } from 'antd';
import { paginations, MyIcon } from '@/utils/utils';
import styles from '../CaseLibrary.less';

@connect(({ CaseLibrary, loading }) => ({
  CaseLibrary,
}))
class CreateStepThree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { caseRes } = this.props.CaseLibrary;
    return (
      <div style={{ textAlign: 'center' }}>
        <MyIcon
          type="icon-dui"
          style={{ fontSize: 58, color: '#34c627', margin: '20px 0 20px 0' }}
        />
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>创建成功</h3>
        <p style={{ fontSize: 12, color: '#999' }}>快去你的站点看看吧</p>
        <div
          style={{
            width: '50%',
            marginLeft: '25%',
            background: '#fafafa',
            paddingTop: 20,
          }}
        >
          <Row>
            <Col span={10} style={{ textAlign: 'right', marginBottom: 20 }}>
              案例标题：
            </Col>
            <Col span={14} style={{ textAlign: 'left' }}>
              {caseRes.title}
            </Col>
          </Row>
          <Row>
            <Col span={10} style={{ textAlign: 'right', marginBottom: 20 }}>
              设计师：
            </Col>
            <Col span={14} style={{ textAlign: 'left' }}>
              {caseRes.designerName}
            </Col>
          </Row>
          <Row>
            <Col span={10} style={{ textAlign: 'right', marginBottom: 20 }}>
              楼盘/楼宇：
            </Col>
            <Col span={14} style={{ textAlign: 'left' }}>
              {caseRes.buildingName}
            </Col>
          </Row>
        </div>
        <Button type="primary" onClick={this.handleSubmit} style={{ margin: '20px 16px 0 0' }}>
          再创建一个
        </Button>
        <Button
          onClick={() => {
            router.push(`/portal/contentmanagement/caselibrary`);
          }}
        >
          返回案例库
        </Button>
      </div>
    );
  }
  handleSubmit = () => {
    //
    this.props.handleOk();

    const { dispatch } = this.props;
    dispatch({
      type: 'CaseLibrary/resetDataModel',
      payload: { caseRes: {}, stepOne: {}, stepTwo: {} },
    });
  };
}

export default CreateStepThree;
