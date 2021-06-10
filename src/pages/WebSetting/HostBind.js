import React, { Component } from 'react';
import { Input, Icon, Button, Form, message } from 'antd';
import { regExpConfig } from '@/utils/regular.config';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getauth } from '@/utils/authority';
const permissionsBtn = getauth().permissions || [];
const FormItem = Form.Item;
@Form.create()
class HostBind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hostSuffix: '-site.ingongdi.com',
      defaultHostValue: '',
    };
  }
  componentWillMount() {
    // console.log('hostcomponentWillMount', this.props);
    //ceshi
    const { dispatch } = this.props;
    let defaultDomain = '';
    dispatch({ type: 'WebSettingStroe/hostSettingModel' }).then(res => {
      if (res && res.code === 200) {
        const { isBind, domain, randomDomain, suffix } = res.data;
        if (isBind) {
          const resIndex = domain.indexOf(suffix);
          if (resIndex == -1) {
            defaultDomain = domain;
          } else {
            defaultDomain = domain.slice(0, resIndex);
          }
        } else {
          const resIndex = randomDomain.indexOf(suffix);
          if (resIndex == -1) {
            defaultDomain = randomDomain;
          } else {
            defaultDomain = randomDomain.slice(0, resIndex);
          }
        }
        console.log(defaultDomain);
        this.setState({
          hostSuffix: res.data.suffix,
          defaultHostValue: defaultDomain,
        });
      }
    });
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }
  async dispatchValue() {
    const { dispatch } = this.props;
    let defaultDomain = '';
    await dispatch({ type: 'WebSettingStroe/hostSettingModel' }).then(async res => {
      if (res && res.code === 200) {
        const { isBind, domain, randomDomain, suffix } = res.data;
        if (isBind) {
          const resIndex = domain.indexOf(suffix);
          if (resIndex == -1) {
            defaultDomain = domain;
          } else {
            defaultDomain = domain.slice(0, resIndex);
          }
        } else {
          const resIndex = randomDomain.indexOf(suffix);
          if (resIndex == -1) {
            defaultDomain = randomDomain;
          } else {
            defaultDomain = randomDomain.slice(0, resIndex);
          }
        }

        await this.setState({
          hostSuffix: res.data.suffix,
          defaultHostValue: defaultDomain,
        });
      }
    });
  }
  async onDefaultHost(e) {
    await this.setState({
      defaultHostValue: e.target.value,
    });
    await this.props.changeHintIf(true);
  }
  onEnrollHost() {
    window.open('https://wanwang.aliyun.com/domain/searchresult/#/?keyword=&suffix=com');
  }
  onHost() {
    window.open('https://docs.qq.com/doc/DR3FTRnBqWmhOc1RB');
  }
  async onHostBind() {
    const { dispatch } = this.props;
    const { hostSuffix, defaultHostValue } = this.state;
    const ifDefaultHost = regExpConfig.defalutHostType.test(defaultHostValue);
    const ifDefaultHosts =
      defaultHostValue.indexOf('ingongdi.com') != -1 ||
      defaultHostValue.indexOf('in-deco.com') != -1 ||
      defaultHostValue.indexOf('in-site.com') != -1 ||
      defaultHostValue.indexOf('in-spire.com') != -1 ||
      defaultHostValue.indexOf('in-create.com') != -1;
    let payload;
    if (
      !ifDefaultHost ||
      defaultHostValue.length < 1 ||
      defaultHostValue.length > 20 ||
      ifDefaultHosts
    ) {
      message.error('请正确填写二级域名');
      return;
    } else {
      payload = {
        domain: defaultHostValue + hostSuffix,
        type: 0,
      };
    }

    await dispatch({ type: 'WebSettingStroe/hostSettingBind', payload: payload }).then(res => {
      if (res && res.code == 200) {
        // console.log(payload.type);
        this.props.changeHintIf(false);
        message.success('保存成功');
      }
    });
  }
  render() {
    const { hostSuffix, defaultHostValue } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className="hostBindContent">
        <div style={{ color: '#101010', fontSize: '22px', marginBottom: '10px' }}>
          域名绑定
          <Icon
            type="question-circle"
            style={{ margin: ' 5px 0 0 10px', cursor: 'pointer', fontSize: '20px' }}
            onClick={this.onHost.bind(this)}
          />
        </div>
        <div>
          <div style={{ display: 'flex' }}>
            <Form id="HostBindForm">
              <FormItem label="默认域名（二级域名）">
                {getFieldDecorator('defaultHost', {
                  initialValue: defaultHostValue || '',
                  rules: [
                    {
                      pattern: regExpConfig.defalutHostType,
                      message: '请正确填写二级域名',
                    },
                    {
                      max: 20,
                      message: '限制1-20字符长度',
                    },
                    {
                      min: 1,
                      message: '限制1-20字符长度',
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
            <CopyToClipboard
              text={defaultHostValue + hostSuffix}
              onCopy={() => message.success('复制成功')}
            >
              <div className="defaultHostCopyDiv">
                <Icon type="copy" />
                复制链接
              </div>
            </CopyToClipboard>
          </div>
          {permissionsBtn.includes('BTN210610000001') && (
            <Button className="defaultHostButton" onClick={this.onHostBind.bind(this)}>
              保存
            </Button>
          )}

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
