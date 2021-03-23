/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-23 17:44:15
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Input, Button, Icon, Radio } from 'antd';
import { SketchPicker } from 'react-color';
import { getQueryUrlVal } from '@/utils/utils';
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
      showFont: false,
      istruev: false,
      show: false,
      formList: [],
      checkList: [],
      checkSelectData: [],
      showSelect: false,
      checkTable: false,
      checkTable: 1,
      arr: [
        {
          defaultValue: null,
          defaultValueUpdate: 1,
          paramField: 'trackName',
          paramName: '业主姓名',
          paramExtName: '业主姓名',
          paramRequired: 1,
          paramType: 'String',
          paramTips: '请输入业主姓名',
          paramUid: 'c834a6d6735411eb999e00505694ddf5',
          paramValid: null,
        },
        {
          defaultValue: null,
          defaultValueUpdate: 1,
          paramField: 'trackAddress',
          paramName: '楼盘/楼宇',
          paramExtName: '楼盘/楼宇',
          paramTips: '请输入楼盘/楼宇',
          paramRequired: 1,
          paramType: 'String',
          paramUid: '00b53e1d735511eb999e00505694ddf5',
          paramValid: null,
        },
        {
          defaultValue: null,
          defaultValueUpdate: 1,
          paramField: 'trackArea',
          paramName: '建筑面积',
          paramExtName: '建筑面积',
          paramTips: '请输入建筑面积',
          paramRequired: 1,
          paramType: 'String',
          paramUid: '15949455735511eb999e00505694ddf5',
          paramValid: null,
        },
      ],
    };
  }
  componentDidMount() {
    const { data } = this.props;
    let { checkList, checkSelectData, arr } = this.state;
    arr.map((item, index) => {
      if (item.paramExtName === undefined) {
        item.paramExtName = item.paramName;
      }
      if (item.paramTips === undefined) {
        item.paramTips = `请输入${item.paramExtName}`;
      }
    });
    if (data.isEdit) {
      checkList.push(...data.paramList);
      let arr3 = arr.filter(v => {
        return data.paramList.every(e => e.paramName != v.paramName);
      });
      checkSelectData.push(...arr3);
      console.log(checkSelectData);
    } else {
      data.paramList &&
        data.paramList.map((item, index) => {
          if (item.paramExtName === undefined) {
            item.paramExtName = item.paramName;
          }
          if (item.paramTips === undefined) {
            item.paramTips = `请输入${item.paramExtName}`;
          }
          if (item.paramName === '联系电话') {
            checkList.push(item);
          } else {
            checkSelectData.push(item);
          }
        });
    }

    this.setState(
      {
        formList: data.paramList,
        checkList,
        checkSelectData,
      },
      () => {
        this.saveCheckList();
      }
    );
  }

  render() {
    const { data, index } = this.props;
    const { showFont, show, checkList, checkSelectData, showSelect, checkTable } = this.state;
    let formDa =
      checkList &&
      checkList.map((item, index) => {
        return (
          <div style={{ marginBottom: 15 }} className={styles.formWrapT} key={index}>
            <div className="clearfix">
              <div className={styles.dragWrap}>
                <Icon type="align-left" />
              </div>
              <div className={styles.dragCenWrap}>
                <div className="clearfix" style={{ marginBottom: 15 }}>
                  <div className={styles.tit}>字段</div>
                  <div className="clearfix" style={{ width: 144, float: 'left' }}>
                    <div className={styles.FormCont}>{item.paramName}</div>
                    {item.paramField !== 'trackPhone' ? (
                      <div
                        className={styles.dragWraps}
                        onClick={() => this.onDeleteFrom(item, index)}
                      >
                        <Icon type="delete" />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="clearfix" style={{ marginBottom: 15 }}>
                  <div className={styles.tit}>字段别名</div>
                  <div className={styles.FormCont}>
                    <Input
                      style={{ width: 144 }}
                      maxLength={10}
                      className={styles.FormInput}
                      value={item.paramExtName}
                      onChange={e => this.handleListChange(e, 'paramExtName', index)}
                    />
                  </div>
                </div>
                <div className="clearfix" style={{ marginBottom: 15 }}>
                  <div className={styles.tit}>提示语</div>
                  <div className={styles.FormCont}>
                    <Input
                      style={{ width: 144 }}
                      className={styles.FormInput}
                      maxLength={16}
                      value={item.paramTips}
                      onChange={e => this.handleListChange(e, 'paramTips', index)}
                    />
                  </div>
                </div>
                {item.paramField !== 'trackPhone' ? (
                  <div className="clearfix">
                    <div className={styles.tit}>是否必填</div>
                    <div className={styles.FormCont}>
                      <Radio.Group
                        onChange={e => this.onChangeCheck(e, item, index)}
                        value={item.paramRequired}
                      >
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
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
            <Input
              style={{ width: 200, borderColor: data.elementButtonColor }}
              maxLength={16}
              disabled
              placeholder={item.paramTips}
            />
          </div>
        );
      });
    return (
      <div
        className={data.checked === 1 ? styles.ViewForm : styles.ViewFormborder}
        style={data.elementStyle ? JSON.parse(data.elementStyle) : {}}
      >
        <div
          onClick={() => {
            this.changePic();
          }}
          onMouseDown={e => {
            this.props.fnDown(e, index);
          }}
          className={styles.ViewForms}
        >
          <div className={styles.ViewDivForm}>{formShow}</div>
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
                background: data.elementButtonColor,
                borderColor: data.elementButtonColor,
                color: data.elementButtonTextColor,
              }}
            >
              {data.elementButtonText}
            </Button>
          </div>
          <div className={data.checked === 1 ? styles.roundLeftTop : ''} />
          <div className={data.checked === 1 ? styles.roundRightTop : ''} />
          <div className={data.checked === 1 ? styles.roundLeftBottom : ''} />
          <div className={data.checked === 1 ? styles.roundRightBottom : ''} />
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

        {data.checked === 1 ? (
          <div className={styles.FormWrap}>
            <div className="clearfix">
              <div
                className={checkTable === 1 ? styles.isList : styles.isLists}
                onClick={() => {
                  this.checkTable(1);
                }}
              >
                字段设置
              </div>
              <div
                className={checkTable === 2 ? styles.isList : styles.isLists}
                onClick={() => {
                  this.checkTable(2);
                }}
              >
                表单设置
              </div>
            </div>
            {checkTable === 1 ? (
              <div className={styles.FormWraw}>{formDa}</div>
            ) : (
              <div className={styles.Forv}>
                <div className={styles.btnChanges}>
                  <div className="clearfix" style={{ marginBottom: 15 }}>
                    <div className={styles.btnlabel}>按钮文字</div>
                    <div className={styles.inputWrap}>
                      <Input
                        placeholder="请输入按钮文字"
                        style={{ width: 144 }}
                        maxLength={8}
                        value={data.elementButtonText}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="clearfix" style={{ marginBottom: 15 }}>
                    <div className={styles.btnlabel}>颜色</div>
                    <div className={styles.inputWrap}>
                      <div className="clearfix">
                        <div className={styles.btnColorWrap}>
                          <div
                            className={styles.btnColor}
                            style={{ background: data.elementButtonColor }}
                            onClick={() => {
                              this.showColor();
                            }}
                          />
                          按钮
                        </div>
                        <div className={styles.btnColorWrap}>
                          <div
                            className={styles.btnColor}
                            style={{ background: data.elementButtonTextColor }}
                            onClick={() => {
                              this.showFontColor();
                            }}
                          />
                          文字
                        </div>
                      </div>
                    </div>
                  </div>

                  {show ? (
                    <div className={styles.SketchWrap}>
                      <SketchPicker
                        color={data.elementButtonColor}
                        onChange={this.handleColorChange}
                      />
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
                      <SketchPicker
                        color={data.elementButtonTextColor}
                        onChange={this.handleFontColorChange}
                      />
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
                </div>
              </div>
            )}
            {checkTable === 1 ? (
              <div className={styles.addForm}>
                <div
                  onClick={() => {
                    this.addChangeFrom();
                  }}
                >
                  <Icon type="plus-circle" />
                  <span style={{ marginLeft: 10 }}>
                    添加表单字段（
                    {checkList.length}
                    /4）
                  </span>
                </div>
                {showSelect && checkSelectData.length > 0 ? (
                  <div className={styles.addSelect}>{selectData}</div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
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
      showFont: false,
    });
  }
  closeFontColor() {
    this.setState({
      showFont: false,
    });
  }
  closeBgColor() {
    this.setState({
      showBg: false,
    });
  }
  showFontColor() {
    this.setState({
      showFont: true,
      show: false,
    });
  }

  handleInputChange = e => {
    const {
      dispatch,
      ProjectLibrary: { compentList },
      index,
    } = this.props;
    const inputVal = e.target.value;
    compentList[index].elementButtonText = inputVal;
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  };
  handleFoot() {
    this.setState({
      istrue: 1,
      istruev: true,
    });
  }
  handleColorChange = value => {
    const { index } = this.props;
    this.props.handleColor(value.hex, index, 1);
  };
  handleFontColorChange = value => {
    const { index } = this.props;
    this.props.handleColor(value.hex, index, 2);
  };
  handleHideFoot() {
    this.setState({
      istruev: false,
    });
  }
  onChangeCheck(e, item, index) {
    const { checkList } = this.state;
    checkList[index].paramRequired = e.target.value;
    this.setState(
      {
        checkList: [...checkList],
      },
      () => {
        this.saveCheckList();
      }
    );
  }
  //增加表单
  addChangeFrom() {
    const { checkSelectData } = this.state;
    if (checkSelectData.length > 0) {
      this.setState({
        showSelect: true,
      });
    }
  }
  addFormList(item, index) {
    const { checkList, checkSelectData } = this.state;
    checkList.push(item);
    checkSelectData.splice(index, 1);
    this.setState(
      {
        checkList: [...checkList],
        checkSelectData: [...checkSelectData],
        showSelect: false,
      },
      () => {
        this.saveCheckList();
      }
    );
  }
  onDeleteFrom(item, index) {
    const { checkList, checkSelectData } = this.state;
    item.paramExtName = item.paramName;
    item.paramTips = `请输入${item.paramExtName}`;
    item.paramRequired = 0;
    checkSelectData.push(item);
    checkList.splice(index, 1);
    this.setState(
      {
        checkList: [...checkList],
        checkSelectData: [...checkSelectData],
      },
      () => {
        this.saveCheckList();
      }
    );
  }
  handleListChange(e, name, index) {
    const { checkList } = this.state;
    checkList[index][name] = e.target.value;
    this.setState(
      {
        checkList: [...checkList],
      },
      () => {
        this.saveCheckList();
      }
    );
  }
  checkTable(code) {
    this.setState({
      checkTable: code,
    });
  }
  saveCheckList() {
    const {
      dispatch,
      ProjectLibrary: { compentList },
      index,
    } = this.props;
    const { checkList } = this.state;
    compentList[index].paramList = checkList;
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
}

export default ViewFormComponent;
