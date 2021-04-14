/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-12 19:49:07
 * 专题库
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Input, message, Icon, Radio } from 'antd';
import { errorIcon } from '@/utils/utils';
import Upload from '@/components/Upload/Upload';
import { SketchPicker } from 'react-color';
import styles from './index.less';
const { confirm } = Modal;
@connect(({ FormLibrary, ProjectLibrary }) => ({
  FormLibrary,
  ProjectLibrary,
}))
@Form.create()
class FormConfiguration extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkSelectData: [],
      checkList: [],
      color: '#fe6a30',
      inputVal: '立即抢占',
      fontColor: '#fff',
      showPic: false,
      uploadVisible: false,
      showForm: false,
      showSelect: false,
      checkTable: 1,
      show: false,
      showFont: false,
      showBg: false,
      elementList: [],
    };
  }

  componentDidMount() {
    const { data, dispatch } = this.props;
    dispatch({
      type: 'ProjectLibrary/elementTreeModels',
      payload: {
        businessType: 2,
        terminalType: 1,
      },
    }).then(res => {
      if (res && res.code === 200) {
        let checkList = [];
        let arr = [];
        res.data[0].elementList[1].elementButtonColor = '#fe6a30';
        res.data[0].elementList[1].elementButtonTextColor = '#fff';
        res.data[0].elementList[1].elementButtonText = '立即抢占';
        res.data[0].elementList[1].paramList.map((item, index) => {
          if (item.paramExtName === undefined) {
            item.paramExtName = item.paramName;
          }
          if (item.paramTips === undefined) {
            item.paramTips = `请输入${item.paramExtName}`;
          }
          if (item.paramName === '联系电话') {
            checkList.push(item);
          } else {
            arr.push(item);
          }
        });
        if (data) {
          let arr3 = [];
          if (data.elementList[1].paramList.length !== 4) {
            arr3 = res.data[0].elementList[1].paramList.filter(v => {
              return data.elementList[1].paramList.every(e => e.paramField != v.paramField);
            });
          }
          this.setState({
            elementList: data.elementList,
            checkSelectData: arr3,
          });
        } else {
          res.data[0].elementList[1].paramList = checkList;
          this.setState({
            elementList: res.data[0].elementList,
            checkSelectData: arr,
          });
        }
      }
    });
  }
  render() {
    const {
      showPic,
      uploadVisible,
      showForm,
      checkSelectData,
      showSelect,
      checkTable,
      show,
      showFont,
      elementList,
      showBg,
    } = this.state;
    let formDa =
      elementList[1] &&
      elementList[1].paramList.map((item, index) => {
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
                      ) : null}
                      {index != elementList[1].paramList.length - 1 ? (
                        <span
                          className={styles.dSpan}
                          onClick={() => {
                            this.changeOrderDown(index);
                          }}
                        >
                          <Icon type="arrow-down" />
                        </span>
                      ) : null}
                      {item.paramField !== 'trackPhone' ? (
                        <span
                          className={styles.dSpan}
                          onClick={() => {
                            this.onDeleteFrom(item, index);
                          }}
                        >
                          <Icon type="delete" />
                        </span>
                      ) : null}
                    </div>
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
      elementList[1] &&
      elementList[1].paramList.map((item, index) => {
        return (
          <div className={styles.ViewDiv} key={index}>
            <Input
              style={{ width: 200 }}
              disabled
              maxLength={16}
              placeholder={item.paramTips}
              style={{ borderColor: elementList[1].elementButtonColor }}
            />
          </div>
        );
      });
    return (
      <div>
        <div className={styles.bg} />
        <div className={styles.ConWrap}>
          <div className={styles.Context}>
            <div className={styles.picWrap}>
              <div
                onClick={() => {
                  this.changePic();
                }}
                className={showPic ? styles.borderWrap : ''}
              >
                <img
                  src={elementList[0] && elementList[0].paramList[0].defaultValue}
                  alt="logo"
                  style={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
              </div>
              {showPic ? (
                <span
                  className={styles.changePic}
                  onClick={() => {
                    this.changePicStaus();
                  }}
                >
                  <Icon type="sync" /> 更换图片
                </span>
              ) : (
                ''
              )}
            </div>
            <div
              className={showForm ? styles.ViewDivForms : styles.ViewDivForm}
              style={{
                background: elementList && elementList[1] && elementList[1].elementColor,
              }}
              onClick={() => {
                this.handleChangeFrom();
              }}
            >
              <div> {formShow}</div>
              <div className={styles.btnWraps}>
                <Button
                  type="primary"
                  style={{
                    width: 260,
                    background: elementList[1] && elementList[1].elementButtonColor,
                    borderColor: elementList[1] && elementList[1].elementButtonColor,
                    color: elementList[1] && elementList[1].elementButtonTextColor,
                  }}
                >
                  {elementList[1] && elementList[1].elementButtonText}
                </Button>
              </div>
              <div className={showForm ? styles.roundLeftTop : ''} />
              <div className={showForm ? styles.roundRightTop : ''} />
              <div className={showForm ? styles.roundLeftBottom : ''} />
              <div className={showForm ? styles.roundRightBottom : ''} />
            </div>
          </div>
          {uploadVisible && (
            <Upload
              visible={uploadVisible}
              selectNum={1}
              handleOk={data => this.handleUploadOk(data)}
              handleCancel={() => this.handleUploadCancel()}
            />
          )}
          {showForm ? (
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
                          value={elementList[1] && elementList[1].elementButtonText}
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
                              style={{ background: elementList[1] && elementList[1].elementColor }}
                              onClick={() => {
                                this.showBgColor();
                              }}
                            />
                            背景
                          </div>
                          <div className={styles.btnColorWrap}>
                            <div
                              className={styles.btnColor}
                              style={{
                                background: elementList[1] && elementList[1].elementButtonColor,
                              }}
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
                                background: elementList && elementList[1].elementButtonTextColor,
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
                          color={elementList[1] && elementList[1].elementButtonColor}
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
                          color={elementList[1] && elementList[1].elementButtonTextColor}
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
                    {showBg ? (
                      <div className={styles.SketchWrap}>
                        <SketchPicker
                          color={elementList[1] && elementList[1].elementColor}
                          onChange={this.handleBgColorChange}
                        />
                        <span
                          className={styles.closeColor}
                          onClick={() => {
                            this.closeBgColor();
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
                      {elementList[1] && elementList[1].paramList.length}
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
          <div className={styles.btnWrap}>
            <Button
              type="primary"
              onClick={() => {
                this.add();
              }}
            >
              保存
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              onClick={() => {
                this.props.handleCancel();
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }
  handleChangeFrom() {
    this.setState({
      showPic: false,
      showForm: true,
    });
  }
  changePic() {
    this.setState({
      showPic: true,
      showForm: false,
    });
  }

  changePicStaus() {
    this.setState({
      uploadVisible: true,
    });
  }
  // 图片选择cancel
  handleUploadCancel = () => {
    this.setState({ uploadVisible: false });
  };
  // 图片选择
  handleUploadOk = data => {
    let { elementList } = this.state;
    elementList[0].paramList[0].defaultValue = data[0].addr;
    this.setState({
      uploadVisible: false,
      elementList,
    });
  };
  checkTable(code) {
    this.setState({
      checkTable: code,
    });
  }
  addFormList(item, index) {
    const { elementList, checkSelectData } = this.state;
    elementList[1].paramList.push(item);
    checkSelectData.splice(index, 1);
    this.setState({
      elementList: [...elementList],
      checkSelectData: [...checkSelectData],
      showSelect: false,
    });
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
        const { elementList, checkSelectData } = that.state;
        item.paramExtName = item.paramName;
        item.paramTips = `请输入${item.paramExtName}`;
        item.paramRequired = 0;
        checkSelectData.push(item);
        elementList[1].paramList.splice(index, 1);
        that.setState({
          elementList: [...elementList],
          checkSelectData: [...checkSelectData],
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //上移
  changeOrderUp(index) {
    const { elementList } = this.state;
    if (index != 0) {
      elementList[1].paramList[index] = elementList[1].paramList.splice(
        index - 1,
        1,
        elementList[1].paramList[index]
      )[0];
    }
    this.setState({
      elementList: [...elementList],
    });
  }
  //下移
  changeOrderDown(index) {
    const { elementList } = this.state;
    if (index != elementList[1].paramList.length - 1) {
      elementList[1].paramList[index] = elementList[1].paramList.splice(
        index + 1,
        1,
        elementList[1].paramList[index]
      )[0];
    } else {
      elementList[1].paramList.unshift(elementList[1].paramList.splice(index, 1)[0]);
    }
    this.setState({
      elementList: [...elementList],
    });
  }
  handleListChange(e, name, index) {
    const { elementList } = this.state;
    elementList[1].paramList[index][name] = e.target.value;
    this.setState({
      elementList: [...elementList],
    });
  }
  handleInputChange = e => {
    const inputVal = e.target.value;
    const { elementList } = this.state;
    elementList[1].elementButtonText = inputVal;
    this.setState({
      elementList: [...elementList],
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
      showBg: false,
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
      showBg: false,
    });
  }
  showBgColor() {
    this.setState({
      showBg: true,
      show: false,
      showFont: false,
    });
  }
  handleColorChange = value => {
    const { elementList } = this.state;
    elementList[1].elementButtonColor = value.hex;
    this.setState({
      elementList: [...elementList],
    });
  };
  handleFontColorChange = value => {
    const { elementList } = this.state;
    elementList[1].elementButtonTextColor = value.hex;
    this.setState({
      elementList: [...elementList],
    });
  };
  onChangeCheck(e, item, index) {
    const { elementList } = this.state;
    elementList[1].paramList[index].paramRequired = e.target.value;
    this.setState({
      elementList: [...elementList],
    });
  }
  handleBgColorChange = value => {
    const { elementList } = this.state;
    elementList[1].elementColor = value.hex;
    this.setState({
      elementList: [...elementList],
    });
  };
  //增加表单
  addChangeFrom() {
    const { checkSelectData } = this.state;
    if (checkSelectData.length > 0) {
      this.setState({
        showSelect: true,
      });
    }
  }
  cancel(e) {
    console.log(e);
  }
  add() {
    const { elementList } = this.state;
    const { dispatch, formUid } = this.props;
    let arr = {
      formUid,
      elementList,
    };
    dispatch({
      type: 'FormLibrary/formCollocateModel',
      payload: arr,
    }).then(res => {
      if (res && res.code === 200) {
        message.success('配置成功', 2);
        this.props.handleAdd();
      }
    });
  }
}

export default FormConfiguration;
