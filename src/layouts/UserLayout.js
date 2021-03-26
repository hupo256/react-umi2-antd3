import React, { Fragment } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Carousel } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import banner from '../assets/insite-banner-01-small.jpg';
import banner2 from '../assets/insite-banner-02-small.jpg';
// import logo from '../assets/logo.svg';
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
          <div className="clearfix">
            <div className={styles.clef}>
              <Carousel autoplay>
                <div style={contentStyle}>
                  <img alt="logo" className={styles.banner} src={banner} />
                </div>
                <div style={contentStyle}>
                  <img alt="logo" className={styles.banner} src={banner2} />
                </div>
              </Carousel>
            </div>
            <div className={styles.contentD}>
              <div className={styles.top}>
                <div className={styles.header}>
                  <span className={styles.title}>{title}</span>
                </div>
              </div>
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
