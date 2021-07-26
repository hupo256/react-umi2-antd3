/*
 * @Author: zqm
 * @Date: 2021-02-24 10:49:10
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-23 18:34:12
 * 图片上传
 */
import React, { Component } from 'react';
import ImgUploads from './ImgUploads';
import { message } from 'antd';
class ImageUpload extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div style={{ height: 356, overflowY: 'scroll', padding: 20 }}>
        {this.props.selectNum&&<ImgUploads
          name="Img"
          uploadSuccess={(data, name) => this.uploadSuccess(data, name, this.props.selectNum)}
          previewTitle="设计效果图"
          video={this.props.video}
          type={'edit'}
          long={this.props.selectNum}
          accept=".png,.jpg,.jpeg"
          defauleUrl={[]}
          size={this.props.size}
        />||null}
      </div>
    );
  }
  // 图片上传成功回调
  uploadSuccess = (list, name, long) => {
    const lists = list.map(item => {
      return (item.response && item.response.data) || [];
    });
    if (list.length > long) {
      message.error(`最多上传${long}个文件`);
      this.setState({ [name]: lists.slice(0, long) });
    } else {
      this.props.handleOk([...lists]);
    }
  };
}

export default ImageUpload;
