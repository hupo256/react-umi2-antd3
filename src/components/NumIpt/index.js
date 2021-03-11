/*
 * @Author: xiazhi 
 * @Date: 2020-03-18 20:26:25 
 * @Last Modified by: xiazhi
 * @Last Modified time: 2020-03-19 18:18:47
 * 个人-借款-申请金额
 */
import React, { Component } from 'react';
import { InputNumber, message } from 'antd';
import styles from './Index.less';

class NumIpt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startNum: props.start_percent ? props.start_percent : undefined,
      endNum: props.end_percent ? props.end_percent : undefined,
    };
  }
  //更新值
  componentWillReceiveProps(nextProps) {
    if (!nextProps.value) {
      this.setState({
        startNum: undefined,
        endNum: undefined,
      });
    }
  }
  //起始值赋值
  startonChange = value => {
    this.setState(
      {
        startNum: value,
      },
      () => {
        this.triggerChange();
      }
    );
  };
  //结束值赋值
  endonChange = value => {
    this.setState(
      {
        endNum: value,
      },
      () => {
        this.triggerChange();
      }
    );
  };
  //传递到父组件
  triggerChange = () => {
    const onChange = this.props.onChange;
    let arr = [this.state.startNum, this.state.endNum];
    if (onChange) {
      onChange(arr);
    }
  };
  //判断
  numBlur = () => {
    if (this.state.startNum > this.state.endNum) {
      this.setState(
        {
          startNum: undefined,
          endNum: undefined,
        },
        () => {
          message.warning('起始值不能大于结束值');
        }
      );
    }
    return;
  };

  render() {
    return (
      <div className="NumIpt" className={styles.NumIpt}>
        <InputNumber
          min={0}
          placeholder="请输入金额"
          value={this.state.startNum}
          onChange={this.startonChange}
          onBlur={this.numBlur}
        />
        ~
        <InputNumber
          min={0}
          placeholder="请输入金额"
          value={this.state.endNum}
          onChange={this.endonChange}
          onBlur={this.numBlur}
        />
      </div>
    );
  }
}

export default NumIpt;
