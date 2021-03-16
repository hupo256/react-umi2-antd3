/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-16 11:48:06
 * 专题库
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Input, message, Radio } from 'antd';
const { TextArea } = Input;
@connect(({ FormLibrary, loading }) => ({
  FormLibrary,
}))
@Form.create()
class FormAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  render() {
    const { visible, data } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Modal title={'创建表单'} visible={visible} footer={null} width={600} closable={false}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="专题标题">
              {getFieldDecorator('formTitle', {
                initialValue: data && data.formTitle,
                rules: [
                  {
                    required: true,
                    message: '请输入专题标题',
                  },
                  {
                    max: 30,
                    message: '限制1-30字符长度',
                  },
                ],
              })(<Input placeholder="请输入案例标题" />)}
            </Form.Item>
            <Form.Item label="适用终端">
              {getFieldDecorator('terminalType', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    message: '请选择适用终端',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value={0}>是</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="表单类型">
              {getFieldDecorator('formType', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    message: '请选择表单类型',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value={0}>浮窗</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="专题说明">
              {getFieldDecorator('formDescription', {
                initialValue: data && data.formDescription,
                rules: [{ required: false, message: '请输入专题说明' }],
              })(<TextArea rows={4} placeholder="请输入专题说明" />)}
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                onClick={() => {
                  this.handleCancel();
                }}
              >
                取消
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
  handleCancel() {
    this.props.handleCancel();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;
      const { dispatch, formUid } = this.props;
      if (formUid !== '') {
        values.formUid = formUid;
        dispatch({
          type: 'FormLibrary/formModifyModel',
          payload: {
            ...values,
          },
        }).then(res => {
          if (res && res.code === 200) {
            message.success('编辑成功', 2);
            this.props.handleList();
          }
        });
      } else {
        dispatch({
          type: 'FormLibrary/formCreateModel',
          payload: {
            ...values,
          },
        }).then(res => {
          if (res && res.code === 200) {
            message.success('创建成功', 2);
            this.props.handleList(res.data.formUid);
          }
        });
      }
    });
  };
}

export default FormAdd;
