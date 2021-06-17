/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-06-10 23:11:22
 * 创建工地
 */
import React, { PureComponent } from 'react';
import ContentEditable from 'react-contenteditable';
import { Rnd } from 'react-rnd';
import { connect } from 'dva';
import { Icon, Drawer, Input, Tooltip, InputNumber } from 'antd';
import { SketchPicker } from 'react-color';
import styles from './index.less';
@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class TextComponent extends PureComponent {
  constructor() {
    super();
    this.contentEditable = React.createRef();
    this.state = {
      isTrue: 1,
      visible: false,
      show: false,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    };
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
    return (
      <div>
        {data.checked === 1 ? (
          <div
            className={styles.amgr}
            onClick={() => {
              this.changeChecked();
            }}
          />
        ) : null}
        <Rnd
          minHeight={43}
          size={{ width: isStyle.width ? isStyle.width : 150, height: isStyle.height }}
          position={{ x: isStyle.left, y: isStyle.top }}
          onDrag={(e, d) => {
            this.setState({ x: d.x, y: d.y }, () => {
              this.changeOnDrag(d);
            });
          }}
          onResize={(e, direction, ref, delta, position) => {
            this.setState(
              {
                width: ref.style.width,
                height: ref.style.height,
                ...position,
              },
              () => {
                this.changeSize(ref, delta, position);
              }
            );
          }}
        >
          <div
            className={data.checked === 1 ? styles.ViewFormsg : styles.ViewFormborders}
            style={data.elementStyle ? JSON.parse(data.elementStyle) : {}}
          >
            {isTrue === 1 ? (
              <div
                // onDoubleClick={() => {
                //   this.onDb();
                // }}
                onClick={() => {
                  this.changePic();
                }}
                // onMouseDown={e => {
                //   this.props.fnDown(e, index);
                // }}
                className={styles.vif}
              />
            ) : null}
            <div className={data.checked === 1 ? styles.roundLeftTop : ''} />
            <div className={data.checked === 1 ? styles.roundRightTop : ''} />
            <div className={data.checked === 1 ? styles.roundLeftBottom : ''} />
            <div className={data.checked === 1 ? styles.roundRightBottom : ''} />
            {isTrue === 1 && data.paramList[0].defaultValue === '' ? <div>请输入文本</div> : null}
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
                  src="https://img.inbase.in-deco.com/crm_saas/release/20210427/afc4f2302adc439192da2af49ff8a3b5/ic_delete.png"
                  width="20"
                  height="20"
                />
              </span>
            ) : (
              ''
            )}
          </div>
        </Rnd>
        {visible && data.checked === 1 ? (
          <div>
            <Drawer
              width="375"
              title="编辑文本"
              placement="right"
              onClose={this.onClose}
              visible={visible}
              mask={false}
              headerStyle={{ position: 'relative', marginTop: 65 }}
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
                <em
                  onClick={() => {
                    this.handleListChange(
                      isStyle.fontWeight === 'normal' ? 'bold' : 'normal',
                      'fontWeight'
                    );
                  }}
                >
                  <Tooltip placement="bottom" title={'加粗'}>
                    <Icon
                      type="bold"
                      style={{
                        color: isStyle.fontWeight === 'bold' ? '#FF6700' : 'rgba(0, 0, 0, 0.65)',
                      }}
                    />
                  </Tooltip>
                </em>
                <em
                  onClick={() => {
                    this.handleListChange(
                      isStyle.fontStyle === 'normal' ? 'italic' : 'normal',
                      'fontStyle'
                    );
                  }}
                >
                  <Tooltip placement="bottom" title={'斜体'}>
                    <Icon
                      type="italic"
                      style={{
                        color: isStyle.fontStyle === 'italic' ? '#FF6700' : 'rgba(0, 0, 0, 0.65)',
                      }}
                    />
                  </Tooltip>
                </em>
                <em
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
                    <Icon
                      type="underline"
                      style={{
                        color:
                          isStyle.textDecorationLine === 'underline' ||
                          isStyle.textDecorationLine === 'underline line-through'
                            ? '#FF6700'
                            : 'rgba(0, 0, 0, 0.65)',
                      }}
                    />
                  </Tooltip>
                </em>
                <em
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
                    <Icon
                      type="strikethrough"
                      style={{
                        color:
                          isStyle.textDecorationLine === 'line-through' ||
                          isStyle.textDecorationLine === 'underline line-through'
                            ? '#FF6700'
                            : 'rgba(0, 0, 0, 0.65)',
                      }}
                    />
                  </Tooltip>
                </em>
              </div>
              <div className={styles.fontw}>排版</div>
              <div className={styles.textSet}>
                <em
                  className={isStyle.textAlign === 'left' ? styles.acticve : null}
                  onClick={() => {
                    this.handleListChange('left', 'textAlign');
                  }}
                >
                  <Tooltip placement="bottom" title={'左对齐'}>
                    <Icon type="align-left" />
                  </Tooltip>
                </em>
                <em
                  className={isStyle.textAlign === 'center' ? styles.acticve : null}
                  onClick={() => {
                    this.handleListChange('center', 'textAlign');
                  }}
                >
                  <Tooltip placement="bottom" title={'居中'}>
                    <Icon type="align-center" />
                  </Tooltip>
                </em>
                <em
                  className={isStyle.textAlign === 'right' ? styles.acticve : null}
                  onClick={() => {
                    this.handleListChange('right', 'textAlign');
                  }}
                >
                  <Tooltip placement="bottom" title={'右对齐'}>
                    <Icon type="align-right" />
                  </Tooltip>
                </em>
              </div>
              <div className={styles.textSet} style={{ paddingTop: 0 }}>
                <em>
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
                </em>
                <em>
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
                </em>
              </div>
              {show ? (
                <div className={styles.SketchWraps}>
                  <SketchPicker color={isStyle.color} onChange={this.handleColorChange} />
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
            </Drawer>
          </div>
        ) : null}
      </div>
    );
  }

  changePic() {
    const { index } = this.props;
    this.props.handleCheck(index);
    this.props.handleWidth(-250);
    this.setState({
      visible: true,
      isTrue: 0,
    });
  }
  deletePic() {
    const { index } = this.props;
    this.props.handleDeletePic(index);
    this.props.handleWidth(-80);
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
    let inputVal = evt.target.value
      .replace(/<(?!\/?br|\/?div)[^<>]*>/gi, '')
      .replace(/style\s*?=\s*?(['"])[\s\S]*?\1/g, '');
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
    this.props.handleWidth(-80);
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
  changeSize(ref, delta, position) {
    const {
      dispatch,
      index,
      ProjectLibrary: { compentList },
    } = this.props;
    console.log('ref', ref);
    let aStyle = JSON.parse(compentList[index].elementStyle);
    console.log('aStyle', aStyle);
    let awidth = ref.style.width.replace('px', '');
    let aheight = ref.style.height.replace('px', '');
    aStyle.width = Number(awidth);
    aStyle.height = Number(aheight);
    compentList[index].elementStyle = JSON.stringify(aStyle);
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
  changeOnDrag(d) {
    const {
      dispatch,
      index,
      ProjectLibrary: { compentList },
    } = this.props;
    let aStyle = JSON.parse(compentList[index].elementStyle);
    aStyle.top = d.y;
    aStyle.left = d.x;
    compentList[index].elementStyle = JSON.stringify(aStyle);
    console.log(compentList);
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
  changeChecked() {
    const {
      dispatch,
      index,
      ProjectLibrary: { compentList },
    } = this.props;
    compentList[index].checked = 0;
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
