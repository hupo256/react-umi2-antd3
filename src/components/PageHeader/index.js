import React, { PureComponent, createElement } from 'react';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb, Tabs, Skeleton, Modal, Row, Col, Affix } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { urlToList } from '../_utils/pathTools';
import router from 'umi/router';
import Tooltipicon from './Tooltipicon';
import ProjectHeader from './ProjectHeader';
import TotalSearch from './TotalSearch';
import ScmTitle from './ScmTitle';
import { connect } from 'dva';
const { TabPane } = Tabs;
const confirm = Modal.confirm;
export const getBreadcrumb = (breadcrumbNameMap, url) => {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  if (breadcrumb && breadcrumb.children) {
    breadcrumb.children.forEach((v, i) => {
      if (v.path == breadcrumb.path) {
        breadcrumb = v;
      }
    });
    return breadcrumb;
  }
  return breadcrumb || {};
};
@connect(({ ScmOffer }) => ({ ScmOffer }))
export default class PageHeader extends PureComponent {
  state = {
    breadcrumb: null,
  };

  componentDidMount() {
    this.getBreadcrumbDom();
  }

  componentDidUpdate(preProps) {
    const { location } = this.props;
    if (!location || !preProps.location) {
      return;
    }
    const prePathname = preProps.location.pathname;
    if (prePathname !== location.pathname) {
      this.getBreadcrumbDom();
    }
  }

  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };

  getBreadcrumbProps = () => {
    const { routes, params, location, breadcrumbNameMap } = this.props;
    return {
      routes,
      params,
      routerLocation: location,
      breadcrumbNameMap,
    };
  };

  getBreadcrumbDom = () => {
    const breadcrumb = this.conversionBreadcrumbList();
    this.setState({
      breadcrumb,
    });
  };

  // Generated according to props
  conversionFromProps = () => {
    const { breadcrumbList, breadcrumbSeparator, itemRender, linkElement = 'a' } = this.props;
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => {
          const title = itemRender ? itemRender(item) : 'item.title';
          return (
            <Breadcrumb.Item key={item.title}>
              {item.href
                ? createElement(
                    linkElement,
                    {
                      [linkElement === 'a' ? 'href' : 'to']: item.href,
                    },
                    title
                  )
                : title}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { breadcrumbSeparator, home, itemRender, linkElement = 'a' } = this.props;
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      if (currentBreadcrumb.inherited) {
        return null;
      }
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      const name = itemRender ? itemRender(currentBreadcrumb) : currentBreadcrumb.name;
      return (currentBreadcrumb.name || currentBreadcrumb.PageHeaderName) &&
        !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {isLinkable ? (
            <a onClick={() => this.handleLeave(url)}>{currentBreadcrumb.PageHeaderName || name}</a>
          ) : (
            <span>{currentBreadcrumb.PageHeaderName || name}</span>
          )}
        </Breadcrumb.Item>
      ) : null;
    });
    // Add home breadcrumbs to your head
    extraBreadcrumbItems.unshift(
      <Breadcrumb.Item key="home">
        <a onClick={() => this.handleLeave('/')}>{home || 'Home'}</a>
      </Breadcrumb.Item>
    );
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  };

  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className={styles.breadcrumb}
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  };

  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          href: paths.join('/') || '/',
          to: paths.join('/') || '/',
        },
        route.breadcrumbName
      )
    );
  };

  /* 离开页面的处理 */
  handleLeave = url => {
    let hrefs = location.href;
    const statusCode = sessionStorage.getItem('statusCode');
    hrefs = hrefs.split('?')[0].split('/');
    const nowRul = _.last(hrefs);
    if (nowRul == 'gongcheng') {
      if (statusCode == 'PP_001' || statusCode == '') {
        const SchedulingCondition = sessionStorage.getItem('SchedulingCondition');
        if (SchedulingCondition === 'change') {
          confirm({
            title: '离开页面前是否保存了排期修改？',
            content: '已保存请点击确定。未保存请点击取消，保存后再跳转！',
            onOk() {
              sessionStorage.setItem('SchedulingCondition', 'nochange');
              router.push(url);
            },
          });
        } else {
          router.push(url);
        }
      } else {
        router.push(url);
      }
    } else {
      if (url == '/supplyChainPages/scmquotation/quotationList') {
        // 去往供应链报价列表添加参数
        const {
          ScmOffer: { SubOfferTab },
        } = this.props;
        router.push(
          `/supplyChainPages/scmquotation/quotationList?projectCode=${
            SubOfferTab.projectCode
          }&projectName=${SubOfferTab.projectName}`
        );
      } else {
        router.push(url);
      }
    }
  };

  render() {
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
      loading = false,
      wide = false,
      relationUrl,
      headerType,
      srarchObj,
      headerTop,
      scmObj,
    } = this.props;
    const { breadcrumb } = this.state;

    const clsString = classNames(styles.pageHeader, className);
    const activeKeyProps = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }
    return (
      <Affix offsetTop={headerTop ? headerTop : -64}>
        <div className={clsString} style={this.props.fixedTitle ? this.props.fixedTitle : {}}>
          <div className={wide ? styles.wide : ''}>
            <Skeleton
              loading={loading}
              title={false}
              active
              paragraph={{ rows: 3 }}
              avatar={{ size: 'large', shape: 'circle' }}
            >
              <Row type="flex" justify="space-between">
                <Col span={16}>{breadcrumb}</Col>
                <Col span={8}>
                  <div className={styles.pageHeadRightDiv}>
                    {headerType && headerType == 'project' && <ProjectHeader />}
                    {relationUrl ? <Tooltipicon relationUrl={relationUrl} /> : null}
                  </div>
                </Col>
              </Row>
              {headerType &&
                headerType == 'supplyChainPagesSearch' && <TotalSearch srarchObj={srarchObj} />}
              {headerType && headerType == 'ScmQuotation' && <ScmTitle scmObj={scmObj} />}
              <div className={styles.detail}>
                {logo && <div className={styles.logo}>{logo}</div>}
                <div className={styles.main}>
                  <div className={styles.row}>
                    {title && (
                      <h1
                        className={styles.title}
                        // dangerouslySetInnerHTML={{
                        //   __html: title,
                        // }}
                      >
                        {title}
                      </h1>
                    )}
                    {action && <div className={styles.action}>{action}</div>}
                  </div>
                  <div className={styles.row}>
                    {content && <div className={styles.content}>{content}</div>}
                    {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
                  </div>
                </div>
              </div>
              {tabList && tabList.length ? (
                <Tabs
                  className={styles.tabs}
                  {...activeKeyProps}
                  onChange={this.onChange}
                  tabBarExtraContent={tabBarExtraContent}
                >
                  {tabList.map(item => (
                    <TabPane tab={item.tab} key={item.key} />
                  ))}
                </Tabs>
              ) : null}
            </Skeleton>
          </div>
        </div>
      </Affix>
    );
  }
}
