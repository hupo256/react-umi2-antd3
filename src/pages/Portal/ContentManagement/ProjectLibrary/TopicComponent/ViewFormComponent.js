/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-05-28 18:45:47
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Input, Button, Icon, Checkbox, Modal, Drawer } from 'antd';
import { errorIcon } from '@/utils/utils';
import { SketchPicker } from 'react-color';
import styles from './index.less';
const { confirm } = Modal;
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
          paramName: '您的姓名',
          paramExtName: '您的姓名',
          paramRequired: 1,
          paramType: 'String',
          paramTips: '请输入姓名',
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
      visible: false,
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
    const {
      showFont,
      show,
      checkList,
      checkSelectData,
      showSelect,
      checkTable,
      visible,
    } = this.state;
    let topSize = JSON.parse(data.elementStyle);
    let terminalType = localStorage.getItem('terminalType');
    let formDa =
      checkList &&
      checkList.map((item, index) => {
        return (
          <div className={styles.formWrapT} key={index}>
            <div className="clearfix">
              {/*<div className={styles.dragWrap}>
                <Icon type="align-left" />
        </div>*/}
              <div className={styles.dragCenWrap}>
                <div className="clearfix">
                  <div className={styles.FormContg}>
                    <Checkbox
                      checked={item.paramRequired}
                      disabled={item.paramField === 'trackPhone'}
                      onChange={e => this.onChangeCheck(e, item, index)}
                    >
                      设为必填
                    </Checkbox>
                  </div>
                  <div className={styles.dragWraps}>
                    {index != 0 ? (
                      <span
                        className={styles.dSpan}
                        onClick={() => {
                          this.changeOrderUp(index);
                        }}
                      >
                        <Icon type="arrow-up" />
                      </span>
                    ) : (
                      <span className={styles.dSpanv}>
                        <Icon type="arrow-up" />
                      </span>
                    )}
                    {index != checkList.length - 1 ? (
                      <span
                        className={styles.dSpan}
                        onClick={() => {
                          this.changeOrderDown(index);
                        }}
                      >
                        <Icon type="arrow-down" />
                      </span>
                    ) : (
                      <span className={styles.dSpanv}>
                        <Icon type="arrow-down" />
                      </span>
                    )}
                    {item.paramField !== 'trackPhone' ? (
                      <span
                        className={styles.dSpan}
                        onClick={() => {
                          this.onDeleteFrom(item, index);
                        }}
                      >
                        <Icon type="delete" />
                      </span>
                    ) : (
                      <span className={styles.dSpanv}>
                        <Icon type="delete" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="clearfix">
                  <div className={styles.tleftv}>
                    <div className={styles.tits}>字段</div>
                    <div className={styles.tit}>{item.paramName}</div>
                  </div>
                  <div className={styles.tleft}>
                    <div className={styles.tits}>字段别名</div>
                    <div className={styles.FormCont}>
                      <Input
                        maxLength={10}
                        className={styles.FormInput}
                        value={item.paramExtName}
                        onChange={e => this.handleListChange(e, 'paramExtName', index)}
                      />
                    </div>
                  </div>
                </div>
                <div className="clearfix">
                  <div className={styles.tits}>提示语</div>
                  <div className={styles.FormContv}>
                    <Input
                      className={styles.FormInput}
                      maxLength={16}
                      value={item.paramTips}
                      onChange={e => this.handleListChange(e, 'paramTips', index)}
                    />
                  </div>
                </div>
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
            <div
              style={{ color: data.elementButtonColor }}
              className={terminalType == 1 ? styles.chedivc : styles.chediv}
            >
              {item.paramExtName}
            </div>
            <Input
              style={{ width: 260, borderColor: data.elementButtonColor }}
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
                width: 260,
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
              <img
                src="https://img.inbase.in-deco.com/crm_saas/release/20210427/afc4f2302adc439192da2af49ff8a3b5/ic_delete.png"
                width="20"
                height="20"
              />
            </span>
          ) : (
            ''
          )}
        </div>

        {data.checked === 1 ? (
          <Drawer
            width="375"
            placement="right"
            onClose={this.onClose}
            visible={visible}
            mask={false}
            headerStyle={{ position: 'relative', marginTop: 65 }}
            bodyStyle={{ padding: 0 }}
          >
            <div className={styles.FormWrap}>
              <div className={styles.tabwrap}>
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
              </div>
              {checkTable === 1 ? (
                <div className={styles.FormWraw}>{formDa}</div>
              ) : (
                <div className={styles.Forv}>
                  <div className={styles.btnChanges}>
                    <div className="clearfix">
                      <div className={styles.btnlabel}>按钮文字</div>
                      <div className={styles.inputWrap}>
                        <Input
                          placeholder="请输入按钮文字"
                          style={{ width: '100%' }}
                          maxLength={8}
                          className={styles.FormInput}
                          value={data.elementButtonText}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="clearfix">
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
                              style={{
                                background: data.elementButtonTextColor,
                              }}
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
                        {/*<span
                          className={styles.closeColor}
                          onClick={() => {
                            this.closeColor();
                          }}
                        >
                          <img
                            src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210409/3b91901276824e0da6ff9fc49fe729fb/ic_delete.png"
                            width="20"
                            height="20"
                          />
                        </span>*/}
                      </div>
                    ) : (
                      ''
                    )}
                    {show ? (
                      <span
                        className={styles.closePicG}
                        onClick={() => {
                          this.closeColor();
                        }}
                      />
                    ) : null}
                    {showFont ? (
                      <div className={styles.SketchWrap}>
                        <SketchPicker
                          color={data.elementButtonTextColor}
                          onChange={this.handleFontColorChange}
                        />
                        {/*<span
                          className={styles.closeColor}
                          onClick={() => {
                            this.closeFontColor();
                          }}
                        >
                          <img
                            src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210409/3b91901276824e0da6ff9fc49fe729fb/ic_delete.png"
                            width="20"
                            height="20"
                          />
                        </span>*/}
                      </div>
                    ) : (
                      ''
                    )}
                    {showFont ? (
                      <span
                        className={styles.closePicG}
                        onClick={() => {
                          this.closeFontColor();
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              )}
              {checkTable === 1 ? (
                <div className={styles.addForm}>
                  <div className={styles.btw}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        this.addChangeFrom();
                      }}
                      style={{ width: '100%', height: 48 }}
                    >
                      <Icon type="plus" />
                      <span style={{ marginLeft: 10 }}>
                        添加表单字段（
                        {checkList.length}
                        /4）
                      </span>
                    </Button>
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
          </Drawer>
        ) : (
          ''
        )}
      </div>
    );
  }
  changePic() {
    const { index } = this.props;
    this.props.handleCheck(index);
    this.props.handleWidth(-250);
    this.setState({
      visible: true,
    });
  }
  deletePic() {
    const { index } = this.props;
    this.props.handleDeletePic(index);
    this.props.handleWidth(-80);
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
    checkList[index].paramRequired = e.target.checked ? 1 : 0;
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
    const that = this;
    confirm({
      title: '确认要删除当前字段吗？',
      content: '删除后，已填写的内容将无法恢复，请确认是否要删除',
      icon: errorIcon,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        const { checkList, checkSelectData } = that.state;
        item.paramExtName = item.paramName;
        item.paramTips = `请输入${item.paramExtName}`;
        item.paramRequired = 0;
        checkSelectData.push(item);
        checkList.splice(index, 1);
        that.setState(
          {
            checkList: [...checkList],
            checkSelectData: [...checkSelectData],
          },
          () => {
            that.saveCheckList();
          }
        );
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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
  cancel(e) {
    console.log(e);
  }
  //上移
  changeOrderUp(index) {
    const { checkList } = this.state;
    if (index != 0) {
      checkList[index] = checkList.splice(index - 1, 1, checkList[index])[0];
    } else {
      checkList.push(checkList.shift());
    }
    this.setState(
      {
        checkList: [...checkList],
      },
      () => {
        this.saveCheckList();
      }
    );
  }
  //下移
  changeOrderDown(index) {
    const { checkList } = this.state;
    if (index != checkList.length - 1) {
      checkList[index] = checkList.splice(index + 1, 1, checkList[index])[0];
    } else {
      checkList.unshift(checkList.splice(index, 1)[0]);
    }
    this.setState(
      {
        checkList: [...checkList],
      },
      () => {
        this.saveCheckList();
      }
    );
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
    this.props.handleWidth(-80);
  };
}

export default ViewFormComponent;
