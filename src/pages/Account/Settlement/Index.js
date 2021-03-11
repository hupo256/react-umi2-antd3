import React, { Component } from 'react';
import router from 'umi/router';
import { Menu } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Index.less';
const { Item } = Menu;

class Audit extends Component {
  constructor(props) {
    super(props);
    const menuMap = {
      bj: '北京',
      sh: '上海',
      sz: '深圳',
      dkh: 'KA',
    };
    this.state = {
      mode: 'horizontal',
      menuMap,
      selectKey: 'bj',
    };
  }
  static getDerivedStateFromProps(props, state) {
    const { match, location } = props;
    let selectKey = location.pathname.replace(`${match.path}/`, '');
    selectKey = selectKey.replace('\\', '/').replace('\\\\', '/');
    if (selectKey.indexOf('/') > 0) {
      selectKey = selectKey.substring(0, selectKey.indexOf('/'));
    }
    selectKey = state.menuMap[selectKey] ? selectKey : 'bj';
    if (selectKey !== state.selectKey) {
      return { selectKey };
    }
    return null;
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  getmenu = () => {
    const { menuMap } = this.state;
    let arr = [];
    arr.push(<Item key="bj">{menuMap['bj']}</Item>);
    arr.push(<Item key="sh">{menuMap['sh']}</Item>);
    arr.push(<Item key="sz">{menuMap['sz']}</Item>);
    arr.push(<Item key="dkh">{menuMap['dkh']}</Item>);
    return arr;
  };
  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      let mode = 'horizontal';
      const { offsetWidth } = this.main;
      if (offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };
  handleRouter = path => {
    router.push(`/account/Settlement/${path.key}`);
  };

  render() {
    const { children } = this.props;
    const { mode, selectKey } = this.state;

    return (
      <GridContent>
        <Menu mode={mode} selectedKeys={[selectKey]} onClick={this.handleRouter}>
          {this.getmenu()}
        </Menu>
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.right}>{children}</div>
        </div>
      </GridContent>
    );
  }
}

export default Audit;
