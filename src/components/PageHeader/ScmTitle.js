/*
 * @Author: pengyc 
 * @Date: 2020-09-21 12:35:55 
 * @Last Modified by: pengyc
 * @Last Modified time: 2020-10-27 14:45:20
 * 供应链报价单名称
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Icon, Input, Button } from 'antd';

@connect(({ ScmOffer }) => ({ ScmOffer }))
class ScmTitle extends Component {
  state = {
    name: '',
    isEdit: false,
  };
  componentDidMount() {
    const { scmObj } = this.props;
    if (scmObj) {
      this.setState({
        name: scmObj.name,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { scmObj } = this.props;
    if (!_.isEqual(scmObj, prevProps.scmObj)) {
      this.setState({
        name: scmObj.name,
      });
    }
  }

  render() {
    const { scmObj } = this.props;
    return (
      <div className={styles.ScmTitle}>
        {this.state.isEdit ? (
          <div style={{ display: 'inline-block', width: 320, fontSize: 13 }}>
            <Input
              style={{ display: 'inline-block', width: 240 }}
              value={this.state.name}
              onChange={this.handleChangeName}
            />
            <a style={{ display: 'inline-block', margin: '0px 6px' }} onClick={this.handleOk}>
              确定
            </a>
            <a onClick={this.handleCacel}>取消</a>
          </div>
        ) : (
          this.state.name
        )}
        {!scmObj.isDetails && (
          <Icon
            onClick={this.handleEdit}
            style={{ color: '#1890ff', marginLeft: 10, cursor: 'pointer' }}
            type="edit"
          />
        )}
      </div>
    );
  }

  handleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };

  handleChangeName = e => {
    let { value } = e.target;
    value = _.trim(value);
    if (value.length > 60) {
      message.error('最多输入60个字符!');
      value = '';
    }
    this.setState({
      name: value,
    });
  };

  handleCacel = () => {
    const { scmObj } = this.props;
    this.setState({
      isEdit: !this.state.isEdit,
      name: scmObj.name,
    });
  };

  handleOk = () => {
    const {
      scmObj: { callback },
    } = this.props;
    callback(this.state.name);
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };
}

export default ScmTitle;
