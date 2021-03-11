import React, { Component } from 'react';
import { InputNumber, message } from 'antd';
import { regExpConfig } from '@/utils/regular.config';
class NumIpt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startNum: props.value ? props.value[0] : undefined,
      endNum: props.value ? props.value[1] : undefined,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.NumIptreset) {
      this.setState({
        startNum: undefined,
        endNum: undefined,
      });
    }
    //this.setState({ someThings: nextProps.someThings });
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
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    let arr = [this.state.startNum, this.state.endNum];
    if (onChange) {
      onChange(arr);
    }
  };
  startNumBlur = () => {
    const { integer } = this.props;
    if (integer) {
      if (this.state.startNum && !regExpConfig.isNozeroNumber.test(this.state.startNum)) {
        this.setState(
          {
            startNum: undefined,
          },
          () => {
            message.warning('请输入正数');
          }
        );
        return;
      }
    }
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
  };
  numBlur = () => {
    const { integer } = this.props;
    if (integer) {
      if (this.state.endNum && !regExpConfig.isNozeroNumber.test(this.state.endNum)) {
        this.setState(
          {
            endNum: undefined,
          },
          () => {
            message.warning('请输入正数');
          }
        );
        return;
      }
    }
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
    const { min, max } = this.props;
    const minNum = min ? min.num : 0;
    const minText = min ? min.text : '请输入数字';
    const maxNum = max ? max.num : Infinity;
    const maxText = max ? max.text : '请输入数字';
    return (
      <div className="NumIpt">
        <InputNumber
          min={minNum}
          max={maxNum}
          placeholder={minText}
          value={this.state.startNum}
          onChange={this.startonChange}
          onBlur={this.startNumBlur}
        />
        ~
        <InputNumber
          min={0}
          max={maxNum}
          placeholder={maxText}
          value={this.state.endNum}
          onChange={this.endonChange}
          onBlur={this.numBlur}
        />
      </div>
    );
  }
}

export default NumIpt;
