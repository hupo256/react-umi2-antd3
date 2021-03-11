/*
 * @Author: xiazhi 
 * @Date: 2020-11-10 14:43:47 
 * @Last Modified by: xiazhi
 * @Last Modified time: 2020-11-24 10:46:55
 */
import React, { Component } from 'react';
import { Select , message } from 'antd';

const { Option } = Select;

class UnitRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startNum: props.start ? props.start : undefined,
      endNum: props.end ? props.end : undefined,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UnitRateset) {
      this.setState({
        startNum: undefined,
        endNum: undefined,
      });
    }
  }
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
  triggerChange = () => {
    const onChange = this.props.onChange;
    let obj = {
      expect_single_rate_start:this.state.startNum,
      expect_single_rate_end:this.state.endNum,
    };
    if (onChange) { onChange(obj) };
  };
  startNumBlur = () => {
    if (this.state.endNum && this.state.startNum > this.state.endNum) {
      this.setState(
        {
          startNum: undefined,
          endNum: undefined,
        },
        () => {
          this.triggerChange();
          message.warning('起始值不能大于结束值');
        }
      );
    }
    return;
  };
  numBlur = () => {
    if (this.state.startNum && this.state.startNum > this.state.endNum) {
      this.setState(
        {
          startNum: undefined,
          endNum: undefined,
        },
        () => {
          this.triggerChange();
          message.warning('起始值不能大于结束值');
        }
      );
    }
    return;
  };

  render() {
    const { startText, endText } = this.props;
    
    return (
      <div style={{ display:"flex" }}>
        <Select value={this.state.startNum} onChange={this.startonChange} onBlur={this.startNumBlur} placeholder={startText || '请输入'}>
            <Option value={20} key='1'>20%</Option>
            <Option value={40} key='2'>40%</Option>
            <Option value={60} key='3'>60%</Option>
            <Option value={80} key='4'>80%</Option>
        </Select>
        ~
        <Select value={this.state.endNum} onChange={this.endonChange} onBlur={this.numBlur} placeholder={endText || '请输入'}>
            <Option value={20} key='5'>20%</Option>
            <Option value={40} key='6'>40%</Option>
            <Option value={60} key='7'>60%</Option>
            <Option value={80} key='8'>80%</Option>
        </Select>
      </div>
    );
  }
}

export default UnitRate;
