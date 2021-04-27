import React, { Component } from 'react';
import { Radio, Input, Icon, Button, Form, message } from 'antd';
import { regExpConfig } from '@/utils/regular.config';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const FormItem = Form.Item;
@Form.create()
class HostBind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsValue: 2,
      hostSuffix: '',
      custonHostValue: '',
      defaultHostValue: '',
    };
  }
  componentWillMount() {
    // console.log('hostcomponentWillMount', this.props);
    //ceshi
    const { dispatch } = this.props;
    let customDomain = '',
      defaultDomain = '';
    dispatch({ type: 'WebSettingStroe/hostSettingModel' }).then(res => {
      if (res && res.code === 200) {
        if (res.data.domain == '') {
          defaultDomain = Math.random()
            .toString(36)
            .slice(-6);
          customDomain = defaultDomain + res.data.suffix;
        } else {
          const resIndex = res.data.domain.indexOf('.');
          defaultDomain = res.data.domain.slice(0, resIndex);
          customDomain = res.data.domain;
        }
        this.setState({
          tabsValue: res.data.type,
          hostSuffix: res.data.suffix,
          custonHostValue: customDomain,
          defaultHostValue: defaultDomain,
        });
      }
    });
  }
  onTabsChange(e) {
    this.setState({
      tabsValue: e.target.value,
    });
  }
  onCustomHost(e) {
    this.setState({
      custonHostValue: e.target.value,
    });
  }
  onDefaultHost(e) {
    this.setState({
      defaultHostValue: e.target.value,
    });
  }
  onEnrollHost() {
    window.open('https://wanwang.aliyun.com/domain/searchresult/#/?keyword=&suffix=com');
  }
  async onHostBind() {
    const { dispatch } = this.props;
    const { tabsValue, hostSuffix, custonHostValue, defaultHostValue } = this.state;
    const ifCustomHost = regExpConfig.customHostType.test(custonHostValue);
    const ifDefaultHost = regExpConfig.defalutHostType.test(defaultHostValue);
    let payload;
    if (tabsValue == 0) {
      if (defaultHostValue.length < 4 || !ifDefaultHost) {
        message.error('请正确填写二级域名');
        return;
      }
      payload = {
        domain: defaultHostValue + hostSuffix,
        type: 0,
      };
    } else if (tabsValue == 1) {
      if (custonHostValue.length < 4 || !ifCustomHost) {
        message.error('请正确填写域名');
        return;
      }
      payload = {
        domain: custonHostValue,
        type: 1,
      };
    }
    const res = await dispatch({ type: 'WebSettingStroe/hostSettingBind', payload: payload });
    switch (res.code) {
      case 200:
        message.success('保存成功');
        break;
      case 210001:
        message.error(res.message);
        break;
      case 210002:
        message.error(res.message);
        break;
      default:
        message.error('绑定失败，请检查输入后再试');
    }
    console.log('1', res);
  }
  render() {
    const { tabsValue, hostSuffix, custonHostValue, defaultHostValue } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className="hostBindContent">
        <div style={{ color: '#101010', fontSize: '26px', marginBottom: '20px' }}>域名绑定</div>
        <Radio.Group
          onChange={e => this.onTabsChange(e)}
          value={tabsValue}
          className="hostBindRadio"
        >
          <Radio value={0}>默认</Radio>
          <Radio value={1}>自定义</Radio>
        </Radio.Group>
        <div style={{ display: tabsValue == 0 ? 'block' : 'none' }}>
          <div style={{ display: 'flex' }}>
            <Form>
              <FormItem label="默认域名（二级域名）">
                {getFieldDecorator('defaultHost', {
                  initialValue: defaultHostValue,
                  rules: [
                    {
                      pattern: regExpConfig.defalutHostType,
                      message: '请正确填写二级域名',
                    },
                  ],
                })(
                  <Input
                    type="text"
                    maxLength={20}
                    autoComplete="off"
                    placeholder="请输入域名"
                    className="defaultHostInput"
                    onChange={e => {
                      this.onDefaultHost(e);
                    }}
                  />
                )}
              </FormItem>
            </Form>
            <div style={{ marginTop: '49px' }}>{hostSuffix}</div>
          </div>
          <CopyToClipboard
            text={defaultHostValue + '.ingongdi.com'}
            onCopy={() => message.success('复制成功')}
          >
            <div className="defaultHostCopyDiv">
              <Icon type="copy" />
              复制连接
            </div>
          </CopyToClipboard>
          <Button className="defaultHostButton" onClick={this.onHostBind.bind(this)}>
            保存
          </Button>
        </div>
        <div style={{ display: tabsValue == 1 ? 'block' : 'none' }}>
          <div style={{ display: 'flex' }}>
            <Form>
              <FormItem label="自定义域名">
                {getFieldDecorator('customHost', {
                  initialValue: custonHostValue,
                  rules: [
                    {
                      pattern: regExpConfig.customHostType,
                      message: '请正确填写域名',
                    },
                  ],
                })(
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="请定义域名"
                    className="customHostInput"
                    onChange={e => {
                      this.onCustomHost(e);
                    }}
                  />
                )}
              </FormItem>
            </Form>
            <Button className="customHostBind" onClick={this.onHostBind.bind(this)}>
              <Icon type="save" />
              立即绑定
            </Button>
          </div>
          <div className="customHostWire" />
          <div className="customHostText">没有域名？快去注册一个吧，价格低至￥29/年</div>
          <Button className="customHostA" onClick={this.onEnrollHost.bind(this)}>
            注册新域名
          </Button>
        </div>
      </div>
    );
  }
}

export default HostBind;