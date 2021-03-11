/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-05 18:32:48
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Icon, Input, Select } from 'antd';
import { SketchPicker } from 'react-color';
import styles from './index.less';

@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class FootComponent extends PureComponent {
  state = {
    istrue: 0,
    prefix: '',
    color: '#fe6a30',
    show: false,
    inputVal: '立即预约',
    fontColor: '#fff',
    showFont: false,
    istruev: false,
  };

  componentDidMount() {}

  render() {
    const { data } = this.props;
    const { istrue, prefix, show, inputVal, fontColor, color, showFont, istruev } = this.state;
    return (
      <div className={styles.footerWrap}>
        <div
          onClick={() => {
            this.handleFoot();
          }}
        >
          <div className="clearfix">
            <div className={styles.phoneWrap}>{data.paramList[0].defaultValue}</div>
            <div className={styles.btnWrap}>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  background: color,
                  borderColor: color,
                  color: fontColor,
                }}
              >
                {inputVal}
              </Button>
            </div>
          </div>
          {istrue === 1 ? (
            <span
              className={styles.closePics}
              onClick={() => {
                this.deleteFoot();
              }}
            >
              <Icon type="close-circle" />
            </span>
          ) : (
            ''
          )}
        </div>
        {istruev ? (
          <div className={styles.btnChange}>
            <div className="clearfix" style={{ marginBottom: 15 }}>
              <div className={styles.btnlabel}>按钮文字</div>
              <div className={styles.inputWrap}>
                <Input
                  placeholder="请输入按钮文字"
                  style={{ width: 170 }}
                  maxLength={8}
                  value={inputVal}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="clearfix" style={{ marginBottom: 15 }}>
              <div className={styles.btnlabel}>文字颜色</div>
              <div className={styles.inputWrap}>
                <div
                  className={styles.btnColor}
                  style={{ background: this.state.fontColor }}
                  onClick={() => {
                    this.showFontColor();
                  }}
                />
              </div>
            </div>
            <div className="clearfix" style={{ marginBottom: 15 }}>
              <div className={styles.btnlabel}>按钮颜色</div>
              <div className={styles.inputWrap}>
                <div
                  className={styles.btnColor}
                  style={{ background: this.state.color }}
                  onClick={() => {
                    this.showColor();
                  }}
                />
              </div>
            </div>
            <div className="clearfix">
              <div className={styles.btnlabel}>设置链接</div>
              <div className={styles.inputWrap}>
                <Select value={prefix} style={{ width: 170 }} onChange={this.changePrefix}>
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                </Select>
              </div>
            </div>
            {show ? (
              <div className={styles.SketchWrap}>
                <SketchPicker color={this.state.color} onChange={this.handleColorChange} />
                <span
                  className={styles.closeColor}
                  onClick={() => {
                    this.closeColor();
                  }}
                >
                  <Icon type="close-circle" />
                </span>
              </div>
            ) : (
              ''
            )}
            {showFont ? (
              <div className={styles.SketchWrap}>
                <SketchPicker color={this.state.fontColor} onChange={this.handleFontColorChange} />
                <span
                  className={styles.closeColor}
                  onClick={() => {
                    this.closeFontColor();
                  }}
                >
                  <Icon type="close-circle" />
                </span>
              </div>
            ) : (
              ''
            )}
            <span
              className={styles.closePic}
              onClick={() => {
                this.handleHideFoot();
              }}
            >
              <Icon type="close-circle" />
            </span>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
  handleColorChange = value => {
    this.setState({ color: value.hex });
  };
  handleFontColorChange = value => {
    this.setState({ fontColor: value.hex });
  };
  handleFoot() {
    this.setState({
      istrue: 1,
      istruev: true,
    });
  }
  handleHideFoot() {
    this.setState({
      istruev: false,
    });
  }
  deleteFoot() {
    const { index } = this.props;
    this.props.handleDeleteFoot(index);
  }
  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };
  closeColor() {
    this.setState({
      show: false,
    });
  }
  showColor() {
    this.setState({
      show: true,
    });
  }
  closeFontColor() {
    this.setState({
      showFont: false,
    });
  }
  showFontColor() {
    this.setState({
      showFont: true,
    });
  }
  handleInputChange = e => {
    const inputVal = e.target.value;
    this.setState({
      inputVal,
    });
  };
}

export default FootComponent;
