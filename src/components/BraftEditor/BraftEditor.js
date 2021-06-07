/*
 * @Author: zqm 
 * @Date: 2020-04-15 13:37:41 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-20 15:21:49
 */
import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import { ContentUtils } from 'braft-utils';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import styles from './BraftEditor.less';
import { Upload, message, Modal, Icon, Button } from 'antd';
import { controls, colors, imageControls, fontSizes, accepts } from './utils';

@connect(({ base }) => ({ base }))
export default class EditorDemo extends React.Component {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(this.props.defval),
    defval: '',
    previewContent: '',
    hodt: '',
    picData: {},
    previewVisible: false, //预览
    previewphoneVisible: false,
  };

  render() {
    const { editorState, previewVisible, picData, previewphoneVisible } = this.state;
    const extendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '电脑预览',
        onClick: () => {
          this.preview();
        },
      },
      {
        key: 'custom-button2',
        type: 'button',
        text: '小程序预览',
        onClick: () => {
          this.preview2();
        },
      },
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            style={{ display: 'inline-block' }}
            accept="image/*"
            action={picData && picData.host}
            name="file"
            showUploadList={false}
            data={() => this.redata()}
            onChange={info => this.watchFile(info)}
            beforeUpload={info => this.beforeUpload(info)}
            headers={{
              token: localStorage.getItem('token'),
            }}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        ),
      },
    ];
    return (
      <div className={styles.BraftEditor}>
        <BraftEditor
          width="100%"
          value={editorState}
          media={{ ...accepts }}
          extendControls={extendControls}
          // colors={colors}
          imageControls={imageControls}
          fontSizes={fontSizes}
          onChange={this.handleEditorChange}
          controls={controls}
        />
        {previewVisible && (
          <Modal
            title="预览"
            visible={previewVisible}
            onCancel={this.handleCancel}
            width={900}
            zIndex={999999}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleCancel}>
                关闭
              </Button>,
            ]}
            className={styles.preview}
          >
            <div
              className={styles.previewCont}
              dangerouslySetInnerHTML={{
                __html: this.state.editorState.toHTML(),
              }}
            />
          </Modal>
        )}
        {previewphoneVisible && (
          <Modal
            title="小程序预览"
            visible={previewphoneVisible}
            onCancel={this.handleCancel2}
            width={400}
            zIndex={999999}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleCancel2}>
                关闭
              </Button>,
            ]}
            className={styles.preview}
          >
            <div
              className={styles.previewCont}
              dangerouslySetInnerHTML={{
                __html: this.state.editorState.toHTML(),
              }}
            />
          </Modal>
        )}
      </div>
    );
  }

  preview = () => {
    this.setState({ previewVisible: true });
  };
  preview2 = () => {
    this.setState({ previewphoneVisible: true });
  };
  // 关闭预览
  handleCancel2 = () => {
    this.setState({ previewphoneVisible: false });
  };
  handleEditorChange = editorState => {
    this.setState({ editorState }, () => {
      const previewContent = editorState.toHTML();
      this.setState({ previewContent });
      this.props.editorCont(editorState.toHTML());
    });
  };

  watchFile = info => {
    console.log('====================================');
    console.log(info);
    console.log('====================================');
    let res = info.file.response;
    console.log(res);
    if (res && res.code === 200) {
      this.setState({
        editorState: ContentUtils.insertMedias(this.state.editorState, [
          {
            type: 'IMAGE',
            url: res.data.addr,
          },
        ]),
      });
    }
  };

  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    if (!(isJPG || isJPEG || isGIF || isPNG)) {
      message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片~');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('超过10M限制 不允许上传~');
      return;
    }
    return (isJPG || isJPEG || isGIF || isPNG) && isLt2M && this.checkImageWH(file);
  };
  checkImageWH(file) {
    const { dispatch } = this.props;
    let self = this;
    return new Promise(function(resolve, reject) {
      let filenames = file.name;
      filenames = filenames
        .replace(/\#/gi, '')
        .replace(/\$/gi, '')
        .replace(/\+/gi, '')
        .replace(/\*/gi, '')
        .replace(/\%/gi, '')
        .replace(/\!/gi, '')
        .replace(/\=/gi, '')
        .replace(/\&/gi, '');
      let index1 = filenames.lastIndexOf('.');
      let index2 = filenames.length;
      let fiename = filenames.substring(index1 + 1, index2);
      dispatch({
        type: 'base/photoxImg',
        payload: '',
      }).then(data => {
        if (data && data.code === 200) {
          if (data.data.fileName !== '') {
            filenames = `${data.data.fileName}.${fiename}`;
          }

          self.setState(
            {
              host: data.data.host,
              picData: {
                OSSAccessKeyId: data.data.accessKeyId,
                callback: data.data.callBack,
                dir: data.data.dir,
                expire: data.data.expire,
                key: `${data.data.dir}${filenames}.${fiename}`,
                name: filenames,
                host: data.data.host,
                policy: data.data.policy,
                signature: data.data.signature,
                // success_action_status: data.data.success_action_status,
              },
            },
            () => {
              resolve(true);
            }
          );
        } else {
          message.error(data.message);
          return reject();
        }
      });
    });
  }

  redata = () => {
    const { picData } = this.state;
    return picData;
  };

  // 关闭预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };
}
