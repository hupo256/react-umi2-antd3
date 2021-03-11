import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Tooltip } from 'antd';
import styles from './index.less';

@connect(({ global }) => ({
  global,
}))
export default class Tooltipicon extends Component {
  state = {
    url: '',
  };
  componentDidMount() {
    this.props
      .dispatch({
        type: 'global/isShow',
        payload: {
          code: this.props.relationUrl,
        },
      })
      .then(res => {
        if (res && res.code && res.code === 200) {
          this.setState({
            url: res.data.url,
          });
        }
      });
  }

  render() {
    if (this.state.url) {
      return (
        <div className={styles.tooltip}>
          <Tooltip placement="bottom" title="使用说明" arrowPointAtCenter>
            <a href={this.state.url} target="_blank">
              <Icon type="question-circle" />
            </a>
          </Tooltip>
        </div>
      );
    } else {
      return null;
    }
  }
}
