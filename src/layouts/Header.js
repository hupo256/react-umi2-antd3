import React, { PureComponent } from 'react';
import { Layout, message, Modal, Button } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import EditPassword from '@/components/EditPassword';
import VersionModal from '@/components/VersionModal';
import styles from './Header.less';
import Authorized from '@/utils/Authorized';
import { getauth } from '@/utils/authority';

const { Header } = Layout;
class HeaderView extends PureComponent {
  state = {
    visible: true,
    versionVisible: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    const nowpermissionsBtn = getauth();
    const {
      users: { userinfo },
      dispatch,
    } = this.props;

    dispatch({
      type: 'login/setAuthModel',
      payload: {},
    }).then(res => {
      if (res && res.code === 200) {
        if (!_.isEqual(res.data, nowpermissionsBtn)) {
          // window.location.reload();
        }
      }
    });

    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 220px)';
  };

  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  // 个人页面跳转
  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;

    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'resetpasswords') {
      router.push('/account/resetpasswords');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings/base');
      return;
    }
    if (key === 'Settlement') {
      router.push('/account/Settlement');
      return;
    }
    if (key === 'targetment') {
      router.push('/account/targetment');
      return;
    }
    if (key === 'personalfinance') {
      router.push('/account/personalfinance');
      return;
    }
    if (key === 'collection') {
      router.push('/account/collection');
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logoutModel',
      });
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
          this.scrollTop = scrollTop;
          return;
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
    this.ticking = false;
  };

  // 关闭更新提示框
  handleVersionCancel = () => {
    this.setState({ versionVisible: false });
  };
  render() {
    const {
      isMobile,
      handleMenuCollapse,
      setting,
      users: { userinfo },
    } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();

    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {/* isTop && */ !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            Authorized={Authorized}
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
        <EditPassword />
        {this.state.versionVisible && (
          <VersionModal
            handleCancel={this.handleVersionCancel}
            visible={this.state.versionVisible}
          />
        )}
      </Header>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect(({ users, global, setting, loading, login }) => ({
  currentUser: users.userinfo,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  setting,
  login,
}))(HeaderView);
