import React, { Component } from 'react';
import { Checkbox } from 'antd';
import isEqual from 'lodash/isEqual';

class CheckboxButton extends Component {
  constructor(props) {
    super(props);
    const initValue = props.value;
    this.state = {
      checkValue: initValue,
    };
  }
  static getDerivedStateFromProps(nextProps, preState) {
    // 获取默认值
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      checkValue: nextProps.value,
    };
  }
  onChange(ind) {
    const { checkValue } = this.state;
    if (checkValue == ind) {
      this.setState({
        checkValue: null,
      });
      this.props.onChange(9);
    } else {
      this.setState({
        checkValue: ind,
      });
      this.props.onChange(ind);
    }
  }

  render() {
    const { checks } = this.props;
    return (
      <div>
        {checks &&
          checks.map((item, index) => {
            return (
              <Checkbox
                key={index}
                onChange={() => this.onChange(index)}
                checked={
                  this.state.checkValue == index && this.state.checkValue !== '' ? true : false
                }
              >
                {item}
              </Checkbox>
            );
          })}
      </div>
    );
  }
}
export default CheckboxButton;
