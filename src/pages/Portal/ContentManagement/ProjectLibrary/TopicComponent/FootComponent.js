/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-12 20:09:33
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Icon, Input, Select } from 'antd';
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
    const { show, showFont, formList, visible, title, visibleForm, formUid } = this.state;
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
                <Icon type="phone" />
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
                src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210409/3b91901276824e0da6ff9fc49fe729fb/ic_delete.png"
                width="20"
                height="20"
              />
            </span>
          ) : (
            ''
          )}
        </div>
        {data.checked === 1 ? (
          <div className={styles.FormWrap} style={{ top: 585 }}>
            <div className="clearfix">
              <div className={styles.isList} style={{ width: '100%' }}>
                表单设置
              </div>
            </div>
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
                  <div className={styles.btnlabel}>跳转表单</div>
                  <div className={styles.inputWrap}>
                    <Select
                      placeholder="请选择"
                      style={{ width: 144 }}
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
                    <span
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
                      <img
                        src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210409/3b91901276824e0da6ff9fc49fe729fb/ic_delete.png"
                        width="20"
                        height="20"
                      />
                    </span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
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
}

export default FootComponent;
