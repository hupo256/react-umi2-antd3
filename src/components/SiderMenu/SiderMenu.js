import React, { PureComponent } from 'react';
import { Layout, Icon, Popover, Button } from 'antd';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import BaseMenu, { getMenuMatches } from './BaseMenu';
import { urlToList } from '../_utils/pathTools';
import { connect } from 'dva';

const { Sider } = Layout;

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );

@connect(({ login }) => ({
  login,
}))
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'login/switchSystemModel',
      payload: {},
    });
  }
  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const {
      logo,
      collapsed,
      onCollapse,
      fixSiderbar,
      theme,
      login: { switchSystemList },
    } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        /* onCollapse={(collapsed, type) => {
          console.log('Sider ==', collapsed);
          console.log('type ==', type);

          onCollapse(collapsed);
        }} */
        width={220}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              style={!collapsed ? { width: 171, height: 38 } : { width: 38, height: 38 }}
            />
            <h1 style={{ display: 'none' }}>营销站</h1>
          </Link>
        </div>
        <BaseMenu
          {...this.props}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: 0, width: '100%' }}
          {...defaultProps}
        />
        {!collapsed && (
          <div className={styles.footerSwitcher}>
            <span className={styles.iconWrapper}>
              <Icon type="swap" theme="outlined" />
            </span>
            <Popover
              placement="top"
              title={null}
              content={
                <div className={styles.popover}>
                  {switchSystemList.map(e => {
                    return (
                      <Button
                        key={e.systemCode}
                        className={e.systemCode === 'S005' ? 'active' : ''}
                        size={'small'}
                        onClick={() => {
                          if (e.systemCode === 'S005') {
                            return;
                          }
                          this.handleSystemRoute(e.systemCode);
                        }}
                        type={'link'}
                      >
                        {e.systemName}
                      </Button>
                    );
                  })}
                </div>
              }
              trigger="click"
            >
              <span className={styles.btn}>切换系统</span>
            </Popover>
            <span>营销站</span>
          </div>
        )}
      </Sider>
    );
  }
  handleSystemRoute = systemCode => {
    let token = localStorage.getItem('crmtoken');
    let targetUrl = '';
    switch (systemCode) {
      case 'S003':
        targetUrl =
          APP_ENVIRONMENT === 'prod'
            ? `http://control.ingongdi.com/#/user/login?token=${token}`
            : APP_ENVIRONMENT === 'test'
              ? `http://test-control.ingongdi.com/#/user/login?token=${token}`
              : `http://dev-control.ingongdi.com/#/user/login?token=${token}`;
        break;
      case 'S004':
        targetUrl =
          APP_ENVIRONMENT === 'prod'
            ? `http://admin.ingongdi.com/#/user/login?token=${token}`
            : APP_ENVIRONMENT === 'test'
              ? `http://test-admin.ingongdi.com/#/user/login?token=${token}`
              : `http://dev-admin.ingongdi.com/#/user/login?token=${token}`;
        break;
      case 'S005':
        targetUrl =
          APP_ENVIRONMENT === 'prod'
            ? `http://wechat.ingongdi.com/#/user/login?token=${token}`
            : APP_ENVIRONMENT === 'test'
              ? `http://test-wechat.ingongdi.com/#/user/login?token=${token}`
              : `http://dev-wechat.ingongdi.com/#/user/login?token=${token}`;
        break;
      case 'S001':
        targetUrl =
          APP_ENVIRONMENT === 'prod'
            ? `http://sys.ingongdi.com/#/user/login?token=${token}`
            : APP_ENVIRONMENT === 'test'
              ? `http://test.sys.ingongdi.com/#/user/login?token=${token}`
              : `http://dev.sys.ingongdi.com/#/user/login?token=${token}`;
        break;
      default:
        break;
    }
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };
}
