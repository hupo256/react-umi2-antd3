/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-31 19:02:46
 * 创建工地
 */
import React, { PureComponent } from 'react';
import ContentEditable from 'react-contenteditable';
import { connect } from 'dva';
import { Icon, Drawer, Input, Tooltip } from 'antd';
import { SketchPicker } from 'react-color';
import styles from './index.less';
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
    console.log(isStyle.fontSize);
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
            <Icon type="close-circle" />
          </span>
        ) : (
          ''
        )}
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
              <Input
                style={{ width: 50, marginLeft: 10 }}
                value={isStyle.fontSize}
                onChange={e => this.handleListChange(e, 'fontSize')}
              />
            </div>
            <div className={styles.btnColorWrap}>
              <div
                className={styles.btnColor}
                style={{ background: data.elementButtonColor }}
                onClick={() => {
                  this.showColor();
                }}
              />
            </div>
          </div>
          <div className={styles.fontw}>文本设置</div>
          <div className={styles.textSet}>
            <span>
              <Tooltip placement="bottom" title={'加粗'}>
                <Icon type="bold" />
              </Tooltip>
            </span>
            <span>
              <Tooltip placement="bottom" title={'斜体'}>
                <Icon type="italic" />
              </Tooltip>
            </span>
            <span>
              <Tooltip placement="bottom" title={'下划线'}>
                <Icon type="underline" />
              </Tooltip>
            </span>
            <span>
              <Tooltip placement="bottom" title={'删除线'}>
                <Icon type="strikethrough" />
              </Tooltip>
            </span>
          </div>
          <div className={styles.fontw}>排版</div>
          <div className={styles.textSet}>
            <span>
              <Tooltip placement="bottom" title={'左对齐'}>
                <Icon type="align-left" />
              </Tooltip>
            </span>
            <span>
              <Tooltip placement="bottom" title={'居中'}>
                <Icon type="align-center" />
              </Tooltip>
            </span>
            <span>
              <Tooltip placement="bottom" title={'右对齐'}>
                <Icon type="align-right" />
              </Tooltip>
            </span>
            <span>
              <Tooltip placement="bottom" title={'字间距'}>
                <Icon type="column-width" />
              </Tooltip>
              <Input
                style={{ width: 50, marginLeft: 10 }}
                onChange={e => this.handleListChange(e, 'fontSize')}
              />
            </span>
            <span>
              <Tooltip placement="bottom" title={'行间距'}>
                <Icon type="column-height" />
              </Tooltip>
              <Input
                style={{ width: 50, marginLeft: 10 }}
                onChange={e => this.handleListChange(e, 'fontSize')}
              />
            </span>
          </div>
          {show ? (
            <div className={styles.SketchWrap}>
              <SketchPicker color={data.elementButtonColor} onChange={this.handleColorChange} />
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
        </Drawer>
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
    const { index } = this.props;
    this.props.handleColor(value.hex, index, 1);
  };
  closeColor() {
    this.setState({
      show: false,
    });
  }
  handleListChange(name, index) {}
}

export default TextComponent;
