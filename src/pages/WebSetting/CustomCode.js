import React, { Component } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { getauth } from '@/utils/authority';
const permissionsBtn = getauth().permissions || [];
const { TextArea } = Input;
const FormItem = Form.Item;
@Form.create()
class CustomCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerValue: '',
    };
  }
  async componentWillMount() {
    const { dispatch } = this.props;
    await dispatch({ type: 'WebSettingStroe/customCodeModel' }).then(res => {
      if (res && res.code == 200) {
        this.setState({
          headerValue: res.data.header,
        });
      }
    });
  }
  async dispatchValue() {
    const { dispatch } = this.props;
    await dispatch({ type: 'WebSettingStroe/customCodeModel' }).then(res => {
      if (res && res.code == 200) {
        this.setState({
          headerValue: res.data.header,
        });
      }
    });
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }
  saveBef() {
    // this.onSave(e)
    // console.log(document.getElementById('CustomCodeButton'))
    document.getElementById('CustomCodeButton').click();
    this.props.changeHintIf(false);
    // return true;
  }
  onSave(e) {
    // const les = document.getElementsByClassName('customCodeForm');
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        throw err;
      }
      const { dispatch } = this.props;
      const newHeaderValue = values.headerValue.replace(/^\s+|\s+$/g, '');
      console.log('ceshi', newHeaderValue.substr(0, 7) !== '<script');
      console.log('ceshi2', newHeaderValue.substr(newHeaderValue.length - 9, 9) !== '</script>');
      // return
      if (
        newHeaderValue.substr(0, 7) !== '<script' ||
        newHeaderValue.substr(newHeaderValue.length - 9, 9) !== '</script>'
      ) {
        return message.error('请正确填写自定义代码');
      }
      dispatch({
        type: 'WebSettingStroe/customCodeSave',
        payload: {
          header: values.headerValue,
        },
      }).then(res => {
        if (res && res.code === 200) {
          message.success('保存成功');
          this.setState({
            headerValue: values.headerValue,
          });
          this.props.changeHintIf(false);
        }
      });
    });
  }
  changeTextArea() {
    this.props.changeHintIf(true);
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { headerValue } = this.state;
    return (
      <div>
        <div style={{ color: '#101010', fontSize: '22px', marginBottom: '20px' }}>自定义代码</div>
        <Form className="customCodeForm" onSubmit={e => this.onSave(e)}>
          <FormItem>
            {getFieldDecorator('headerValue', {
              initialValue: headerValue,
              rules: [
                {
                  required: false,
                  message: '请正确填写公众号',
                },
                {
                  max: 5000,
                  message: '限制0-5000字符长度',
                },
              ],
            })(
              <TextArea
                type="text"
                value={headerValue}
                style={{ width: 884, height: 650 }}
                onChange={() => this.changeTextArea()}
                placeholder="一般用于植入各种社交分享、在线咨询（QQ、百度商桥、美洽...）、网站统计（CNZZ）等小插件的代码！！！HTML将被插入标记对之间。在此处，你可以添加元标记并加入脚本。请务必对CSS使用标记对，对JavaScript使用标记对！【同一区域仅支持一种组件】"
              />
            )}
          </FormItem>
          <Row>
            <Col span={16}>
              {permissionsBtn.includes('BTN210610000003') && (
                <Button
                  type="primary"
                  id="CustomCodeButton"
                  htmlType="submit"
                  className="defaultHostButton"
                >
                  保存
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default CustomCode;
