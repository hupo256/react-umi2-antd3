/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-27 16:58:21
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Icon, Input, Select, Drawer } from 'antd';
import { SketchPicker } from 'react-color';
import FormAdd from '../../FormLibrary/FormComponent/FormAdd';
import FormConfiguration from '../../FormLibrary/FormComponent/FormConfiguration';
import styles from './index.less';

@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class FootComponent extends PureComponent {
  state = {
    istrue: 0,
    show: false,
    showFont: false,
    istruev: false,
    formList: [],
    visible: false,
    title: '',
    visibleForm: false,
    formUid: '',
    visibleDrawer: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ProjectLibrary/formListModel',
      payload: { formStatus: 1 },
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({
          formList: res.data,
        });
      }
    });
  }

  render() {
    const { data, companyPhone } = this.props;
    const {
      show,
      showFont,
      formList,
      visible,
      title,
      visibleForm,
      formUid,
      visibleDrawer,
    } = this.state;
    let formCont = [];

    formList.forEach(function(item, index) {
      formCont.push(
        <Select.Option value={item.formUid} key={item.formUid}>
          {item.formTitle}
        </Select.Option>
      );
    });
    formCont.push(
      <Select.Option value="" key="">
        创建浮窗表单
      </Select.Option>
    );
    return (
      <div className={data.checked === 1 ? styles.footerBorder : styles.footerWrap}>
        <div
          onClick={() => {
            this.handleCheck();
          }}
        >
          <div className="clearfix">
            <div className={styles.phoneWrap}>
              <div>
                <img
                  src="https://img.inbase.in-deco.com/crm_saas/release/20210426/7f28e9b033204fc2bd628d0f82fbdfc8/ic_call.png"
                  width="25"
                  height="25"
                />
              </div>
              <div>{companyPhone}</div>
            </div>
            <div className={styles.btnWrap}>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  background: data.elementButtonColor,
                  borderColor: data.elementButtonColor,
                  color: data.elementButtonTextColor,
                  height: 42,
                }}
              >
                {data.elementButtonText}
              </Button>
            </div>
          </div>
          <div className={data.checked === 1 ? styles.roundLeftTop : ''} />
          <div className={data.checked === 1 ? styles.roundRightTop : ''} />
          <div className={data.checked === 1 ? styles.roundLeftBottom : ''} />
          <div className={data.checked === 1 ? styles.roundRightBottom : ''} />
          {data.checked === 1 ? (
            <span
              className={styles.closePics}
              onClick={() => {
                this.deleteFoot();
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
            title="表单设置"
            placement="right"
            onClose={this.onClose}
            visible={visibleDrawer}
            mask={false}
            headerStyle={{ position: 'relative', marginTop: 65 }}
            bodyStyle={{ padding: 0 }}
          >
            <div className={styles.FormWrap}>
              <div className={styles.Forv}>
                <div className={styles.btnChanges}>
                  <div className="clearfix" style={{ marginBottom: 15 }}>
                    <div className={styles.btnlabel}>按钮文字</div>
                    <div className={styles.inputWrap}>
                      <Input
                        placeholder="请输入按钮文字"
                        maxLength={8}
                        className={styles.FormInput}
                        value={data.elementButtonText}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="clearfix" style={{ marginBottom: 15 }}>
                    <div className={styles.btnlabel}>跳转表单</div>
                    <div className={styles.inputWrap}>
                      <Select
                        placeholder="请选择"
                        style={{ width: '100%' }}
                        className={styles.FormInput}
                        value={data.formUid}
                        onChange={e => {
                          this.handleForm(e);
                        }}
                      >
                        {formCont}
                      </Select>
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
            </div>
          </Drawer>
        ) : (
          ''
        )}
        {visible ? (
          <FormAdd
            visible={visible}
            title={title}
            //formUid={formUid}
            handleCancel={this.handleCancel}
            handleList={data => {
              this.handleList(data);
            }}
          />
        ) : (
          ''
        )}
        {visibleForm ? (
          <FormConfiguration
            formUid={formUid}
            handleCancel={this.handleCancelForm}
            handleAdd={this.handleAddConfig}
          />
        ) : null}
      </div>
    );
  }
  handleCheck() {
    const { index } = this.props;
    this.props.handleCheck(index);
    this.props.handleWidth(-250);
    this.setState({
      visibleDrawer: true,
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

  deleteFoot() {
    const { index } = this.props;
    this.props.handleDeleteFoot(index);
    this.props.handleWidth(-160);
  }
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
  showFontColor() {
    this.setState({
      showFont: true,
      show: false,
    });
  }
  handleForm(e) {
    const {
      dispatch,
      ProjectLibrary: { compentList },
      index,
    } = this.props;
    if (e === '') {
      this.props.handleWidth(-160);
      this.setState(
        {
          visible: true,
        },
        () => {
          const {
            dispatch,
            ProjectLibrary: { compentList },
          } = this.props;
          compentList.map((item, idx) => {
            compentList[idx].checked = 0;
          });
          dispatch({
            type: 'ProjectLibrary/saveDataModel',
            payload: {
              key: 'compentList',
              value: [...compentList],
            },
          });
        }
      );
    } else {
      compentList[index].formUid = e;
      dispatch({
        type: 'ProjectLibrary/saveDataModel',
        payload: {
          key: 'compentList',
          value: [...compentList],
        },
      });
    }
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
  //新建表单操作
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handleCancelForm = () => {
    this.setState({
      visibleForm: false,
    });
  };
  handleAddConfig = () => {
    this.setState(
      {
        visibleForm: false,
      },
      () => {
        this.getList();
      }
    );
  };
  handleList(data) {
    this.setState({
      visibleForm: true,
      formUid: data,
      visible: false,
    });
  }
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ProjectLibrary/formListModel',
      payload: { formStatus: 1 },
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({
          formList: res.data,
        });
      }
    });
  };
  onClose = () => {
    this.setState({
      visibleDrawer: false,
    });
    this.props.handleWidth(-160);
  };
}

export default FootComponent;
