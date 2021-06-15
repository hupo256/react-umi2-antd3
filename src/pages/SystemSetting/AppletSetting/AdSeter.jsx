/*
 * @Author: pengyc 
 * @Date: 2020-01-09 14:35:33 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-08 15:09:47
 * 修改密码
 */
import React, { PureComponent } from 'react';
import { message, Modal, Button, Form, Input, Switch } from 'antd';
import { connect } from 'dva';
import { regExpConfig } from '@/utils/regular.config';
import Upload from '@/components/Upload/Upload';
import styles from './index.less';

const { Item } = Form;

@connect(({ users }) => ({
  users,
}))
@Form.create()
export default class AdSeter extends PureComponent {
  state = {
    btnLoading: false,
    imgEdtor: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
  }

  handleConfirmBlur = e => {
    console.log(e);
  };

  updateGame = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      console.log(values);
    });
  };

  adSwitchClick = e => {
    console.log(e);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { btnLoading } = this.state;
    return (
      <>
        <div className={styles.appleRight}>
          <p style={{ fontWeight: 500, fontSize: 22, color: '#333' }}>广告设置</p>
          <p>
            <span>打开小程序弹屏广告</span>
            <Switch onChange={this.adSwitchClick} />
          </p>
          <div className="adsetBox">
            <Form layout="vertical">
              <Item label="弹屏广告">
                {getFieldDecorator('newPassword', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入新密码' },
                    { validator: this.validateToNextPassword },
                    {
                      pattern: regExpConfig.adminpws,
                      message: '密码格式错误,应包含大小写、特殊字符、数字,且8-30位',
                    },
                  ],
                })(<Input placeholder="请输入新密码" type="password" />)}
              </Item>
              <Item label="弹屏广告关联页面">
                {getFieldDecorator('newPassword1', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入确认' },
                    { validator: this.compareToFirstPassword },
                    {
                      pattern: regExpConfig.adminpws,
                      message: '密码格式错误,应包含大小写、特殊字符、数字,且8-30位',
                    },
                  ],
                })(
                  <Input placeholder="请输入确认" onBlur={this.handleConfirmBlur} type="password" />
                )}
              </Item>

              <Item>
                <Button type="primary" loading={btnLoading} onClick={this.updateGame}>
                  保存
                </Button>
              </Item>
            </Form>
          </div>
        </div>

        <Upload
          visible={imgEdtor}
          selectNum={1}
          destroy={true}
          handleOk={data => handleUploadOk(data)}
          handleCancel={() => setimgEdtor(false)}
        />
      </>
    );
  }
}
