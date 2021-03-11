import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Menu, Layout, Card } from 'antd';

const { Item } = Menu;

export default class SettlementRoute extends PureComponent {
  constructor(props) {
    super(props);
    const { match, location } = props;

    const menuMap = {
      NoSettlement: '未确认结算',
      YesSettlement: '已确认结算',
    };
    let key = location.pathname.replace(`${match.path}/`, '');
    key = key.replace('\\', '/').replace('\\\\', '/');
    if (key.indexOf('/') > 0) {
      key = key.substring(0, key.indexOf('/'));
    }
    this.state = {
      menuMap,
      selectKey: menuMap[key] ? key : 'NoSettlement',
      role: match.path.slice(match.path.lastIndexOf('/') + 1),
    };
  }
  static getDerivedStateFromProps(props, state) {
    const { match, location } = props;
    let selectKey = location.pathname.replace(`${match.path}/`, '');
    selectKey = selectKey.replace('\\', '/').replace('\\\\', '/');
    if (selectKey.indexOf('/') > 0) {
      selectKey = selectKey.substring(0, selectKey.indexOf('/'));
    }
    selectKey = state.menuMap[selectKey] ? selectKey : 'NoSettlement';
    if (selectKey !== state.selectKey) {
      return { selectKey };
    }
    return null;
  }
  handleRouter = path => {
    router.push(`/account/Settlement/${this.state.role}/${path.key}`);
  };
  getmenu = () => {
    const { menuMap } = this.state;
    let arr = [];
    for (let v in menuMap) {
      arr.push(
        <Item style={{ fontWeight: 'normal' }} key={v}>
          {menuMap[v]}
        </Item>
      );
    }
    return arr;
  };

  render() {
    const { children } = this.props;
    return (
      <Layout style={{ background: '#fff' }}>
        <Menu onClick={this.handleRouter} selectedKeys={[this.state.selectKey]} mode="horizontal">
          {this.getmenu()}
        </Menu>
        <div style={{ marginTop: '24px' }}>{children}</div>
      </Layout>
    );
  }
}
