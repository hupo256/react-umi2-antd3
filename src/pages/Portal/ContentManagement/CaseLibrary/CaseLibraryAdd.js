/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-02-25 16:11:38
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateStepOne from './CreateCase/CreateStepOne';
import CreateStepTwo from './CreateCase/CreateStepTwo';
import CreateStepThree from './CreateCase/CreateStepThree';
const { Step } = Steps;
class CaseLibraryAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  componentDidMount() {}

  render() {
    const { step } = this.state;
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Row style={{ margin: 20 }}>
              <Col span={4} />
              <Col span={16}>
                <Steps current={step}>
                  <Step title="填写基本信息" />
                  <Step title="上传案例图片" />
                  <Step title="完成" />
                </Steps>
              </Col>
              <Col span={4} />
            </Row>
            {step === 0 && <CreateStepOne type="add" handleOk={() => this.setState({ step: 1 })} />}
            {step === 1 && (
              <CreateStepTwo
                type="add"
                handleOk={() => this.setState({ step: 2 })}
                handleBackStep={() => this.setState({ step: 0 })}
              />
            )}
            {step === 2 && <CreateStepThree handleOk={() => this.setState({ step: 0 })} />}
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default CaseLibraryAdd;
