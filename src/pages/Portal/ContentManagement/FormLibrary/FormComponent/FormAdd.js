/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-06-10 14:10:26
 * 专题库
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Input, message, Radio } from 'antd';
const { TextArea } = Input;
import styles from './index.less';
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
    const { visible, data, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let tit = <div className={styles.agModel}>{title}</div>;
    return (
      <div>
        <Modal title={tit} visible={visible} footer={null} width={600} closable={false}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="表单标题">
              {getFieldDecorator('formTitle', {
                initialValue: data && data.formTitle,
                rules: [
                  {
                    required: true,
                    message: '请输入表单标题',
                  },
                  {
                    max: 6,
                    message: '限制1-6字符长度',
                  },
                ],
              })(<Input placeholder="请输入表单标题" />)}
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
            <Form.Item label="表单说明">
              {getFieldDecorator('formDescription', {
                initialValue: data && data.formDescription,
                rules: [
                  { required: false, message: '请输入表单说明' },
                  {
                    max: 200,
                    message: '限制1-200字符长度',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入表单说明" />)}
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
      if (formUid && formUid !== '') {
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
