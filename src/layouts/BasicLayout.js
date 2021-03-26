import React from 'react';
import { Layout, BackTop, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../assets/whiteLog.png';
import logoImg from '../assets/logoImg.png';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import { getauth } from '../utils/authority';
import moment from 'moment';
import { handleRouterFun } from '@/utils/globalUtils';
const { Content } = Layout;
moment.locale('zh-cn');
// Conversion router to menu.
function formatter(data, parentPath = '', parentAuthority, parentName) {
  const permissionsBtn = getauth();
  return data.map(item => {
    let locale = 'menu';
    if (parentName && item.name) {
      locale = `${parentName}.${item.name}`;
    } else if (item.name) {
      locale = `menu.${item.name}`;
    } else if (parentName) {
      locale = parentName;
    }
    let result = {};
    result = {
      ...item,
      locale,
      authority: item.code
        ? permissionsBtn.permissions && permissionsBtn.permissions.includes(item.code)
          ? 'admin'
          : 'gest'
        : item.authority || parentAuthority,
    };

    if (item.routes) {
      const children = formatter(item.routes, `${parentPath}${item.path}/`, item.authority, locale);
      // Reduce memory usage
      result.children = children;
    }
    delete result.routes;
    return result;
  });
}

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
  }

  state = {
    rendering: true,
    isMobile: false,
  };

  componentDidMount() {
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    let aa = formatter(routes);
    return aa;
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  getPageTitle = pathname => {
    let currRouterData = null;
    // match params path
    Object.keys(this.breadcrumbNameMap).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = this.breadcrumbNameMap[key];
      }
    });
    if (!currRouterData) {
      return '营销站';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - 营销站`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    const isScm = _.includes(location.href, 'wholePage');
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      if (isScm) {
        return null;
      } else {
        return {
          paddingLeft: collapsed ? '80px' : '220px',
        };
      }
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    const isScm = _.includes(location.href, 'wholePage');
    return {
      margin: '12px',
      paddingTop: fixedHeader && !isScm ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer() {
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  handleClick = () => {
    // 点击路由处理事件
    handleRouterFun(this.props);
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      users: { userinfo },
      collapsed,
    } = this.props;
    const { isMobile } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const menuData = this.getMenuData();
    const auth = JSON.parse(localStorage.getItem('auth'));
    const bigLogo = (auth && auth.logoBig) || logo;
    const smallLogo = (auth && auth.logoSmall) || logoImg;
    let newLog = !collapsed ? bigLogo : smallLogo;
    // 是否是报价
    const isScm = _.includes(location.href, 'wholePage');
    const isSider = isTop && !isMobile ? true : false;
    const layout = (
      <Layout>
        {isSider || isScm ? null : (
          <SiderMenu
            logo={newLog}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            handleClick={this.handleClick}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          {!isScm && (
            <Header
              menuData={menuData}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={newLog}
              isMobile={isMobile}
              {...this.props}
            />
          )}
          <Content style={this.getContentStyle()}>
            {children}
            <BackTop>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  textAlign: 'center',
                  background: '#fe6a30',
                  opacity: '0.8',
                  lineHeight: '100%',
                }}
              >
                <Icon
                  type="arrow-up"
                  style={{
                    color: '#fff',
                    fontSize: 24,
                    marginTop: 9,
                  }}
                />
              </div>
            </BackTop>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return (
      <ConfigProvider locale={zhCN}>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>

        {/* 去掉设置框 */}
      </ConfigProvider>
    );
  }
}

export default connect(({ global, setting, users }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
  users,
}))(BasicLayout);
