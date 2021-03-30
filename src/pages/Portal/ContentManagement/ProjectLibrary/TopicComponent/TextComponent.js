/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-30 16:33:56
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
    this.state = { html: '<b>Hello <i>World</i></b>' };
  }
  componentDidMount() {}

  render() {
    const { data, index } = this.props;
    return (
      <div className={styles.changePicWrap}>
        <div
          onClick={() => {
            this.changePic();
          }}
          className={data.checked === 1 ? styles.imgWrap : ''}
        >
          <div
            suppressContentEditableWarning="true"
            contentEditable="true"
            className={styles.element}
          >
            {data.paramList[0].defaultValue}
          </div>
          <ContentEditable
            innerRef={this.contentEditable}
            html={this.state.html} // innerHTML of the editable div
            disabled={false} // use true to disable editing
            onChange={this.handleChange} // handle innerHTML change
            tagName="article" // Use a custom HTML tag (uses a div by default)
          />
          <div className={data.checked === 1 ? styles.roundLeftTop : ''} />
          <div className={data.checked === 1 ? styles.roundRightTop : ''} />
          <div className={data.checked === 1 ? styles.roundLeftBottom : ''} />
          <div className={data.checked === 1 ? styles.roundRightBottom : ''} />
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
}

export default TextComponent;
