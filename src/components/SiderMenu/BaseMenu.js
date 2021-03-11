import React, { PureComponent } from 'react';
import { Menu, Icon, Modal, message } from 'antd';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';
import router from 'umi/router';
import { MyIcon } from '@/utils/utils';

const { SubMenu } = Menu;
const confirm = Modal.confirm;

const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('MyIcon') > -1) {
    const newicon = icon.split('@')[1];
    return <MyIcon type={newicon} />;
  }
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => item && pathToRegexp(item).test(path));

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(this.flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu

    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const name = formatMessage({ id: item.locale });
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          //onTitleClick={this.share}
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };
  share = ({ key }) => {
    if (key == '/share') {
      let crmtoken = localStorage.getItem('crmtoken');
      //window.location.href = 'http://test.spark.in-deco.com/user/login?token=' + token;
      window.open('http://spark.in-deco.com/user/login?token=' + crmtoken);
    }
    return;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const name = formatMessage({ id: item.locale });
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    /**
     * 彭玉成
     * 因为工程排期跳转页面需要保存，所以改变这里的代码,取代Link
     */
    return (
      <div
        onClick={() => {
          this.handleRouter(itemPath);
        }}
      >
        {icon}
        <span>{name}</span>
      </div>
    );
  };

  handleRouter = itemPath => {
    let hrefs = location.href;
    const statusCode = sessionStorage.getItem('statusCode');
    hrefs = hrefs.split('?')[0].split('/');
    const nowRul = _.last(hrefs);
    const _this = this;
    if (nowRul == 'gongcheng') {
      if (statusCode == 'PP_001' || statusCode == '') {
        const SchedulingCondition = sessionStorage.getItem('SchedulingCondition');
        if (SchedulingCondition === 'change') {
          confirm({
            title: '离开页面前是否保存了排期修改？',
            content: '已保存请点击确定。未保存请点击取消，保存后再跳转！',
            onOk() {
              sessionStorage.setItem('SchedulingCondition', 'nochange');
              _this.handleRouterPush(itemPath);
            },
            onCancel() {},
          });
        } else {
          _this.handleRouterPush(itemPath);
        }
      } else {
        _this.handleRouterPush(itemPath);
      }
    } else if (nowRul == 'bjedit') {
      _this.handleRouterPush(itemPath);
    } else {
      if (itemPath == '/supplychain/suppliermenu') {
        let path = itemPath + '/laowu';
        this.handleRouterPush(path);
      } else if (itemPath == '/share') {
        let crmtoken = localStorage.getItem('crmtoken');
        if (APP_ENVIRONMENT == 'prod') {
          window.open('http://spark.in-deco.com/user/login?token=' + crmtoken);
        } else {
          window.open('http://test.spark.in-deco.com/user/login?token=' + crmtoken);
        }
      } else {
        this.handleRouterPush(itemPath);
      }
    }
  };

  handleRouterPush = itemPath => {
    const { isMobile, onCollapse } = this.props;
    isMobile
      ? () => {
          onCollapse(true);
        }
      : undefined;
    router.push(itemPath);
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };
  render() {
    const { openKeys, theme, mode } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, menuData, handleClick } = this.props;
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        onClick={handleClick}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
