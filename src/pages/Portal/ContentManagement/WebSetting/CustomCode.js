import React, { Component } from 'react';
import { Tabs, Input, Button, message } from 'antd';
const { TextArea } = Input;
const { TabPane } = Tabs;

class CustomCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      footerValue: '',
      headerValue: '',
    };
  }
  async componentWillMount() {
    const { dispatch } = this.props;
    const res = await dispatch({ type: 'WebSettingStroe/customCodeModel' });
    if (res.code == 200) {
      this.setState({
        footerValue: res.data.footer,
        headerValue: res.data.header,
      });
    }
  }
  changeHeaderValue(e) {
    console.log('1', e);
    this.setState({
      headerValue: e.target.value,
    });
  }
  changeFooterValue(e) {
    this.setState({
      footerValue: e.target.value,
    });
  }
  onSave() {
    const { footerValue, headerValue } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'WebSettingStroe/customCodeSave',
      payload: {
        footer: footerValue,
        header: headerValue,
      },
    }).then(res => {
      if (res && res.code === 200) {
        message.success('保存成功');
      }
    });
  }
  render() {
    const { footerValue, headerValue } = this.state;
    return (
      <div>
        <div style={{ color: '#101010', fontSize: '26px', marginBottom: '20px' }}>自定义代码</div>
        <Tabs className="cystomCodeTabs">
          <TabPane tab="页眉" key="1">
            <TextArea
              type="text"
              max={5000}
              value={headerValue}
              style={{ width: 884, height: 650 }}
              onChange={e => this.changeHeaderValue(e)}
              placeholder="一般用于植入各种社交分享、在线咨询（QQ、百度商桥、美洽...）、网站统计（CNZZ）等小插件的代码！！！HTML将被插入标记对之间。在此处，你可以添加元标记并加入脚本。请务必对CSS使用标记对，对JavaScript使用标记对！【同一区域仅支持一种组件】"
            />
            <div>
              <Button
                className="defaultHostButton"
                style={{ marginTop: '20px' }}
                onClick={this.onSave.bind(this)}
              >
                保存
              </Button>
            </div>
          </TabPane>
          <TabPane tab="页尾" key="2">
            <TextArea
              type="text"
              max={5000}
              value={footerValue}
              style={{ width: 884, height: 650 }}
              onChange={e => this.changeFooterValue(e)}
              placeholder="一般用于植入各种社交分享、在线咨询（QQ、百度商桥、美洽...）、网站统计（CNZZ）等小插件的代码！！！HTML将被插入标记对之间。在此处，你可以添加元标记并加入脚本。请务必对CSS使用标记对，对JavaScript使用标记对！【同一区域仅支持一种组件】"
            />
            <div>
              <Button
                className="defaultHostButton"
                style={{ marginTop: '20px' }}
                onClick={this.onSave.bind(this)}
              >
                保存
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default CustomCode;
