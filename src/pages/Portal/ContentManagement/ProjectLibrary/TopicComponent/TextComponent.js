/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-31 10:18:34
 * 创建工地
 */
import React, { PureComponent } from 'react';
import ContentEditable from 'react-contenteditable';
import { connect } from 'dva';
import Upload from '@/components/Upload/Upload';
import { Icon } from 'antd';
import styles from './index.less';
@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class TextComponent extends PureComponent {
  constructor() {
    super();
    this.contentEditable = React.createRef();
    this.state = { isTrue: 1 };
  }
  componentDidMount() {}

  render() {
    const { data, index } = this.props;
    const { isTrue } = this.state;
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
        <ContentEditable
          innerRef={this.contentEditable}
          html={data.paramList[0].defaultValue} // innerHTML of the editable div
          disabled={false} // use true to disable editing
          onChange={this.handleChange} // handle innerHTML change
          onBlur={this.handleonBlur}
          tagName="article" // Use a custom HTML tag (uses a div by default)
        />
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
}

export default TextComponent;
