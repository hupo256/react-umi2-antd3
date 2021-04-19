import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Badge, Menu, Icon, Dropdown, Avatar } from 'antd';
import { getauth } from '../../utils/authority';
import headerimg from '../../assets/headerimg.jpg';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
  };

  render() {
    const {
      currentUser,
      onMenuClick,
      theme,
      //users: { userinfo },
    } = this.props;
    const permissionsBtn = getauth();
    //let dot = userinfo.record == 1 || (userinfo && userinfo.record == undefined) ? false : true;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="resetpasswords">
          <Icon type="edit" />
          <FormattedMessage id="menu.account.resetpasswords" defaultMessage="resetpasswords" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {permissionsBtn && permissionsBtn.nikeName ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={permissionsBtn.userHeadImg || headerimg}
                alt="avatar"
              />
              <span className={styles.name}>
                {permissionsBtn.nikeName ? permissionsBtn.nikeName : ''}
              </span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
