/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-13 11:12:39
 * 创建工地
 */
import React, { PureComponent } from 'react';
import ContentEditable from 'react-contenteditable';
import { connect } from 'dva';
import { Icon, Drawer, Input, Tooltip, InputNumber } from 'antd';
import { SketchPicker } from 'react-color';
import styles from './index.less';
import { concatSeries } from 'async';
@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class TextComponent extends PureComponent {
  constructor() {
    super();
    this.contentEditable = React.createRef();
    this.state = { isTrue: 1, visible: false, show: false };
  }
  componentDidMount() {}

  render() {
    const { data, index } = this.props;
    const { isTrue, visible, show } = this.state;
    let isStyle = JSON.parse(data.elementStyle);
    const limitDecimals = value => {
      const reg = /^(\-)*(\d+)\.(\d\d).*$/;
      if (value === '-') {
        return '-';
      } else if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
      } else {
        return '';
      }
    };
    console.log(data);
    return (
      <div
        className={data.checked === 1 ? styles.ViewFormsg : styles.ViewFormborders}
        style={data.elementStyle ? JSON.parse(data.elementStyle) : {}}
      >
        {isTrue === 1 ? (
          <div
            onDoubleClick={() => {
              this.onDb();
            }}
            onClick={() => {
              this.changePic();
            }}
            onMouseDown={e => {
              this.props.fnDown(e, index);
            }}
            className={styles.vif}
          />
        ) : null}
        <div className={data.checked === 1 ? styles.roundLeftTop : ''} />
        <div className={data.checked === 1 ? styles.roundRightTop : ''} />
        <div className={data.checked === 1 ? styles.roundLeftBottom : ''} />
        <div className={data.checked === 1 ? styles.roundRightBottom : ''} />
        <div className={styles.arwrap}>
          <ContentEditable
            innerRef={this.contentEditable}
            html={data.paramList[0].defaultValue} // innerHTML of the editable div
            disabled={false} // use true to disable editing
            onChange={this.handleChange} // handle innerHTML change
            onBlur={this.handleonBlur}
            tagName="article" // Use a custom HTML tag (uses a div by default)
          />
        </div>
        {data.checked === 1 ? (
          <span
            className={styles.closePic}
            onClick={() => {
              this.deletePic();
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
        {visible && data.checked === 1 ? (
          <Drawer
            width="550"
            title="编辑文本"
            placement="right"
            onClose={this.onClose}
            visible={visible}
            mask={false}
          >
            <div className={styles.fontw}>文本</div>
            <div className="clearfix" style={{ marginTop: 20, marginBottom: 20 }}>
              <div className={styles.fontC}>
                <Tooltip placement="bottom" title={'文字大小'}>
                  <Icon type="font-size" />
                </Tooltip>
                <InputNumber
                  style={{ width: 80, marginLeft: 10 }}
                  value={isStyle.fontSize}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => this.handleListChange(e, 'fontSize')}
                />
              </div>
              <div className={styles.btnColorWrap}>
                <div
                  className={styles.btnColor}
                  style={{ background: isStyle.color }}
                  onClick={() => {
                    this.showColor();
                  }}
                />
              </div>
            </div>
            <div className={styles.fontw}>文本设置</div>
            <div className={styles.textSet}>
              <span
                onClick={() => {
                  this.handleListChange(
                    isStyle.fontWeight === 'normal' ? 'bold' : 'normal',
                    'fontWeight'
                  );
                }}
              >
                <Tooltip placement="bottom" title={'加粗'}>
                  <Icon type="bold" />
                </Tooltip>
              </span>
              <span
                onClick={() => {
                  this.handleListChange(
                    isStyle.fontStyle === 'normal' ? 'italic' : 'normal',
                    'fontStyle'
                  );
                }}
              >
                <Tooltip placement="bottom" title={'斜体'}>
                  <Icon type="italic" />
                </Tooltip>
              </span>
              <span
                onClick={() => {
                  let arr = '';
                  if (isStyle.textDecorationLine === 'none') {
                    arr = 'underline';
                  } else if (isStyle.textDecorationLine === 'underline') {
                    arr = 'none';
                  } else if (isStyle.textDecorationLine === 'line-through') {
                    arr = 'underline line-through';
                  } else if (isStyle.textDecorationLine === 'underline line-through') {
                    arr = 'line-through';
                  }
                  this.handleListChange(arr, 'textDecorationLine');
                }}
              >
                <Tooltip placement="bottom" title={'下划线'}>
                  <Icon type="underline" />
                </Tooltip>
              </span>
              <span
                onClick={() => {
                  let arr = '';
                  if (isStyle.textDecorationLine === 'none') {
                    arr = 'line-through';
                  } else if (isStyle.textDecorationLine === 'line-through') {
                    arr = 'none';
                  } else if (isStyle.textDecorationLine === 'underline') {
                    arr = 'underline line-through';
                  } else if (isStyle.textDecorationLine === 'underline line-through') {
                    arr = 'underline';
                  }
                  this.handleListChange(arr, 'textDecorationLine');
                }}
              >
                <Tooltip placement="bottom" title={'删除线'}>
                  <Icon type="strikethrough" />
                </Tooltip>
              </span>
            </div>
            <div className={styles.fontw}>排版</div>
            <div className={styles.textSet}>
              <span
                className={isStyle.textAlign === 'left' ? styles.acticve : null}
                onClick={() => {
                  this.handleListChange('left', 'textAlign');
                }}
              >
                <Tooltip placement="bottom" title={'左对齐'}>
                  <Icon type="align-left" />
                </Tooltip>
              </span>
              <span
                className={isStyle.textAlign === 'center' ? styles.acticve : null}
                onClick={() => {
                  this.handleListChange('center', 'textAlign');
                }}
              >
                <Tooltip placement="bottom" title={'居中'}>
                  <Icon type="align-center" />
                </Tooltip>
              </span>
              <span
                className={isStyle.textAlign === 'right' ? styles.acticve : null}
                onClick={() => {
                  this.handleListChange('right', 'textAlign');
                }}
              >
                <Tooltip placement="bottom" title={'右对齐'}>
                  <Icon type="align-right" />
                </Tooltip>
              </span>
              <span>
                <Tooltip placement="bottom" title={'字间距'}>
                  <Icon type="column-width" />
                </Tooltip>
                <InputNumber
                  style={{ width: 80, marginLeft: 10 }}
                  value={isStyle.letterSpacing}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => this.handleListChange(e, 'letterSpacing')}
                />
              </span>
              <span>
                <Tooltip placement="bottom" title={'行间距'}>
                  <Icon type="column-height" />
                </Tooltip>
                <InputNumber
                  style={{ width: 80, marginLeft: 10 }}
                  value={isStyle.lineHeight}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => this.handleListChange(e, 'lineHeight')}
                />
              </span>
            </div>
            {show ? (
              <div className={styles.SketchWraps}>
                <SketchPicker color={isStyle.color} onChange={this.handleColorChange} />
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
          </Drawer>
        ) : null}
      </div>
    );
  }

  changePic() {
    const { index } = this.props;
    this.props.handleCheck(index);
    this.setState({
      visible: true,
    });
  }
  deletePic() {
    const { index } = this.props;
    this.props.handleDeletePic(index);
  }
  changePicStaus() {
    this.setState({
      uploadVisible: true,
    });
  }
  handleChange = evt => {
    const {
      dispatch,
      ProjectLibrary: { compentList },
      index,
    } = this.props;
    const inputVal = evt.target.value;
    compentList[index].paramList[0].defaultValue = inputVal;
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  };
  onDb() {
    this.setState({
      isTrue: 0,
    });
  }
  handleonBlur = e => {
    this.setState({
      isTrue: 1,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  showColor() {
    this.setState({
      show: true,
    });
  }
  handleColorChange = value => {
    const {
      dispatch,
      index,
      ProjectLibrary: { compentList },
    } = this.props;
    let aStyle = JSON.parse(compentList[index].elementStyle);
    aStyle.color = value.hex;
    compentList[index].elementStyle = JSON.stringify(aStyle);
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  };
  closeColor() {
    this.setState({
      show: false,
    });
  }
  handleListChange(e, name) {
    const {
      dispatch,
      index,
      ProjectLibrary: { compentList },
    } = this.props;
    let aStyle = JSON.parse(compentList[index].elementStyle);
    aStyle[name] = e;
    compentList[index].elementStyle = JSON.stringify(aStyle);
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
}

export default TextComponent;
