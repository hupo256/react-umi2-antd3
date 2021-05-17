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
      randomDomain: '',
      custonHostValue: '',
      defaultHostValue: '',
    };
  }
  componentWillMount() {
    // console.log('hostcomponentWillMount', this.props);
    //ceshi
    const { dispatch } = this.props;
    let customDomain = '',
      defaultDomain = '',
      randomDomains = '';
    dispatch({ type: 'WebSettingStroe/hostSettingModel' }).then(res => {
      if (res && res.code === 200) {
        const { isBind, type, domain, randomDomain, suffix } = res.data;
        if (isBind && type == 0) {
          const resIndex = domain.indexOf(suffix);
          if (resIndex == -1) {
            defaultDomain = domain;
          } else {
            defaultDomain = domain.slice(0, resIndex);
          }
          customDomain = domain;
          const resIndexs = randomDomain.indexOf('-');
          randomDomains = randomDomain.slice(0, resIndexs);
        } else if (isBind && type == 1) {
          const resIndex = randomDomain.indexOf(suffix);
          if (resIndex == -1) {
            defaultDomain = randomDomain;
          } else {
            defaultDomain = randomDomain.slice(0, resIndex);
          }
          customDomain = domain;
          randomDomains = defaultDomain;
        } else {
          const resIndex = randomDomain.indexOf('-');
          defaultDomain = randomDomain.slice(0, resIndex);
          customDomain = randomDomain;
          randomDomains = defaultDomain;
        }
        console.log(customDomain, defaultDomain);
        this.setState({
          tabsValue: res.data.type,
          randomDomain: randomDomains,
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
  onHost() {
    window.open('https://help.aliyun.com/document_detail/31836.html');
  }
  async onHostBind() {
    const { dispatch } = this.props;
    const { tabsValue, hostSuffix, custonHostValue, defaultHostValue, randomDomain } = this.state;
    const ifCustomHost = regExpConfig.customHostType.test(custonHostValue);
    const ifDefaultHost = regExpConfig.defalutHostType.test(defaultHostValue);
    const ifCustomHosts =
      custonHostValue.indexOf('ingongdi.com') != -1 ||
      custonHostValue.indexOf('in-deco.com') != -1 ||
      custonHostValue.indexOf('in-site.com') != -1 ||
      custonHostValue.indexOf('in-spire.com') != -1 ||
      custonHostValue.indexOf('in-create.com') != -1;
      console.log('ifCustomHosts', ifCustomHosts)
    let payload;
    if (tabsValue == 0) {
      if (defaultHostValue.length < 4 || defaultHostValue.length > 20 || !ifDefaultHost) {
        message.error('请正确填写二级域名');
        return;
      }
      payload = {
        domain: defaultHostValue + hostSuffix,
        type: 0,
      };
    } else if (tabsValue == 1) {
      if (custonHostValue.length < 4 || custonHostValue.length > 100 || !ifCustomHost) {
        message.error('绑定失败，请检查输入后再试');
        return;
      } else if (ifCustomHosts) {
        message.error('当前域名已被注册，请检查后重试');
        return;
      }
      payload = {
        domain: custonHostValue,
        type: 1,
      };
    }
    await dispatch({ type: 'WebSettingStroe/hostSettingBind', payload: payload }).then(res => {
      if (res && res.code == 200) {
        console.log(payload.type);
        message.success('保存成功');
        if (payload.type == 1) {
          this.setState({
            defaultHostValue: randomDomain,
          });
        } else {
          this.setState({
            custonHostValue: defaultHostValue + hostSuffix,
          });
        }
      }
    });
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
                    {
                      max: 20,
                      message: '限制5-min20字符长度',
                    },
                    {
                      min: 5,
                      message: '限制5-20字符长度',
                    },
                  ],
                })(
                  <Input
                    type="text"
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
            text={defaultHostValue + hostSuffix}
            onCopy={() => message.success('复制成功')}
          >
            <div className="defaultHostCopyDiv">
              <Icon type="copy" />
              复制链接
            </div>
          </CopyToClipboard>
          <Button className="defaultHostButton" onClick={this.onHostBind.bind(this)}>
            保存
          </Button>
        </div>
        <div style={{ display: tabsValue == 1 ? 'block' : 'none', position: 'relative' }}>
          <Icon
            type="question-circle"
            style={{ position: 'absolute', left: 150, top: -26, cursor: 'pointer' }}
            onClick={this.onHost.bind(this)}
          />
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
                    {
                      max: 100,
                      message: '限制1-100字符长度',
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
