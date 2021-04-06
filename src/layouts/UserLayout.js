import React, { Fragment } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Carousel } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import banner from '../assets/banner@2x.png';
import logo from '../assets/logo@2x.png';
const links = [
  // {
  //   key: 'help',
  //   title: '帮助',
  //   href: '',
  // },
  // {
  //   key: 'privacy',
  //   title: '隐私',
  //   href: '',
  // },
  // {
  //   key: 'terms',
  //   title: '条款',
  //   href: '',
  // },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2021 成都我的工滴科技有限公司 出品
  </Fragment>
);
@connect(({ login }) => ({
  login,
}))
class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    const pageStatus = sessionStorage.getItem('pageStatus')
      ? Number(sessionStorage.getItem('pageStatus'))
      : 2;
    const contentStyle = {
      height: '620px',
      color: '#fff',
      lineHeight: '620px',
      textAlign: 'center',
    };
    let title = '';
    switch (pageStatus) {
      case 1:
        title = '营销站';
        break;
      case 2:
        title = '营销站';
        break;
      case 3:
        title = '营销站';
        break;
      case 4:
        title = '重置密码';
        break;
    }
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contentWrap}>
            <div className={styles.contentLeft}>
              <img src={banner} />
            </div>
            <div className={styles.contentRight}>
              <img  src={logo} className={styles.logo}/>
              {children}
            </div>
          </div>
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
