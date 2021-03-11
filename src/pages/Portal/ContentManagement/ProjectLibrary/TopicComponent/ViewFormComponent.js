/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-10 19:01:48
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Input, Button, Icon, Select, Checkbox } from 'antd';
import { SketchPicker } from 'react-color';
import styles from './index.less';
@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
@Form.create()
class ViewFormComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      istrue: 1,
      inputVal: '',
      color: '#fe6a30',
      inputVal: '立即抢占',
      fontColor: '#fff',
      showFont: false,
      istruev: false,
      show: false,
      formList: [],
      checkList: [],
      checkSelectData: [],
      showSelect: false,
    };
  }
  componentDidMount() {
    const { data } = this.props;
    const { checkList, checkSelectData } = this.state;
    data.paramList &&
      data.paramList.map((item, index) => {
        if (item.paramExtName === undefined) {
          item.paramExtName = item.paramName;
        }
        if (item.paramTips === undefined) {
          item.paramTips = `请输入${item.paramExtName}`;
        }
        if (item.paramField === 'phoneNumber') {
          checkList.push(item);
        } else {
          checkSelectData.push(item);
        }
      });
    this.setState(
      {
        formList: data.paramList,
        checkList,
        checkSelectData,
      },
      () => {
        console.log(this.state.formList);
        console.log(this.state.checkList);
        console.log(this.state.checkSelectData);
      }
    );
  }

  render() {
    const { data, index } = this.props;
    const {
      inputVal,
      fontColor,
      color,
      showFont,
      istruev,
      prefix,
      show,
      checkList,
      checkSelectData,
      showSelect,
    } = this.state;
    let formDa =
      checkList &&
      checkList.map((item, index) => {
        return (
          <div style={{ marginBottom: 15 }} key={index}>
            <div className="clearfix">
              <div className={styles.dragWrap}>
                <Icon type="drag" />
              </div>
              <div className={styles.dragCenWrap}>
                <div className="clearfix" style={{ marginBottom: 15 }}>
                  <div className={styles.tit}>
                    <Icon type="font-size" />
                    字段
                  </div>
                  <div className={styles.FormCont}>
                    <Input style={{ width: 170 }} value={item.paramName} disabled />
                  </div>
                </div>
                <div className="clearfix" style={{ marginBottom: 15 }}>
                  <div className={styles.tit}>
                    <Icon type="font-size" />
                    字段别名
                  </div>
                  <div className={styles.FormCont}>
                    <Input
                      style={{ width: 170 }}
                      maxLength={10}
                      value={item.paramExtName}
                      onChange={e => this.handleListChange(e, 'paramExtName', index)}
                    />
                  </div>
                </div>
                <div className="clearfix" style={{ marginBottom: 15 }}>
                  <div className={styles.tit}>
                    <Icon type="font-size" />
                    提示语
                  </div>
                  <div className={styles.FormCont}>
                    <Input
                      style={{ width: 170 }}
                      maxLength={16}
                      value={item.paramTips}
                      onChange={e => this.handleListChange(e, 'paramTips', index)}
                    />
                  </div>
                </div>
                {item.paramField !== 'phoneNumber' ? (
                  <div className={styles.checkwraps}>
                    <Checkbox
                      checked={item.paramRequired}
                      onChange={e => this.onChangeCheck(e, item, index)}
                    >
                      必填
                    </Checkbox>
                  </div>
                ) : (
                  ''
                )}
              </div>
              {item.paramField !== 'phoneNumber' ? (
                <div className={styles.dragWrap} onClick={() => this.onDeleteFrom(item, index)}>
                  <Icon type="delete" />
                </div>
              ) : null}
            </div>
          </div>
        );
      });
    let selectData =
      checkSelectData &&
      checkSelectData.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              this.addFormList(item, index);
            }}
          >
            <a>{item.paramName}</a>
          </div>
        );
      });
    let formShow =
      checkList &&
      checkList.map((item, index) => {
        return (
          <div className={styles.ViewDiv} key={index}>
            <Input style={{ width: 200 }} maxLength={16} disabled placeholder={item.paramTips} />
          </div>
        );
      });
    return (
      <div className={styles.ViewForm} style={{ top: data.top }}>
        <div
          onClick={() => {
            this.changePic();
          }}
          onMouseDown={e => {
            this.props.fnDown(e, index);
          }}
          className={styles.ViewForms}
        >
          <div
            className={styles.ViewDivForm}
            onClick={() => {
              this.handleChangeFrom();
            }}
          >
            {formShow}
          </div>
          <div
            className={styles.btnWraps}
            onClick={() => {
              this.handleFoot();
            }}
          >
            <Button
              type="primary"
              style={{
                width: 200,
                background: color,
                borderColor: color,
                color: fontColor,
              }}
            >
              {inputVal}
            </Button>
          </div>
          {data.checked === 1 ? (
            <span
              className={styles.closePic}
              onClick={() => {
                this.deletePic();
              }}
            >
              <Icon type="close-circle" />
            </span>
          ) : (
            ''
          )}
        </div>
        {istruev ? (
          <div className={styles.btnChanges}>
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
        <div className={styles.FormWrap}>
          {formDa}
          <div className={styles.addForm}>
            <div
              onClick={() => {
                this.addChangeFrom();
              }}
            >
              <Icon type="plus-circle" />
              <span style={{ marginLeft: 10 }}>
                添加表单字段（
                {checkSelectData.length}
                /4）
              </span>
            </div>
            {showSelect && checkSelectData.length > 0 ? (
              <div className={styles.addSelect}>{selectData}</div>
            ) : (
              ''
            )}
          </div>
          <div className={styles.FormSave}>
            <Button type="primary" size="small" style={{ marginRight: 15 }}>
              保存
            </Button>
            <Button size="small">取消</Button>
          </div>
        </div>
      </div>
    );
  }
  changePic() {
    const { index } = this.props;
    this.props.handleCheck(index);
  }
  deletePic() {
    const { index } = this.props;
    this.props.handleDeletePic(index);
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
  handleFoot() {
    this.setState({
      istrue: 1,
      istruev: true,
    });
  }
  handleColorChange = value => {
    this.setState({ color: value.hex });
  };
  handleFontColorChange = value => {
    this.setState({ fontColor: value.hex });
  };
  handleHideFoot() {
    this.setState({
      istruev: false,
    });
  }
  handleChangeFrom() {}
  onChangeCheck(e, item, index) {
    const { checkList } = this.state;
    checkList[index].paramRequired = e.target.checked ? 1 : 0;
    this.setState({
      checkList: [...checkList],
    });
  }
  //增加表单
  addChangeFrom() {
    this.setState({
      showSelect: true,
    });
  }
  addFormList(item, index) {
    const { checkList, checkSelectData } = this.state;
    checkList.push(item);
    checkSelectData.splice(index, 1);
    this.setState({
      checkList: [...checkList],
      checkSelectData: [...checkSelectData],
      showSelect: false,
    });
  }
  onDeleteFrom(item, index) {
    const { checkList, checkSelectData } = this.state;
    item.paramExtName = item.paramName;
    item.paramTips = `请输入${item.paramExtName}`;
    item.paramRequired = 0;
    checkSelectData.push(item);
    checkList.splice(index, 1);
    this.setState({
      checkList: [...checkList],
      checkSelectData: [...checkSelectData],
    });
  }
  handleListChange(e, name, index) {
    const { checkList } = this.state;
    checkList[index][name] = e.target.value;
    this.setState({
      checkList: [...checkList],
    });
  }
}

export default ViewFormComponent;
