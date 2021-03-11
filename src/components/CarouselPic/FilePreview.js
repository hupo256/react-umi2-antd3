/*
 * @Author: zqm 
 * @Date: 2020-12-23 16:29:52 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-02-26 10:55:54
 * 文件预览
 */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { previewAll } from '@/utils/utils';

class FilePreview extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    return (
      <Modal
        title="文件列表"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        width={600}
        footer={null}
      >
        <div style={{ minHeight: 500, height: 500, overflowY: 'scroll' }}>
          {Array.isArray(this.props.fileList) &&
            this.props.fileList.map((item, i) => {
              return (
                <p key={item.path || item.openPath || item.filePath}>
                  <span href={item.path || item.openPath || item.filePath} target="_blank">
                    {item.name || item.fileName}
                  </span>
                  <a
                    style={{
                      marginLeft: 18,
                    }}
                    onClick={() => this.handleFileReview(item)}
                  >
                    在线预览
                  </a>
                </p>
              );
            })}
        </div>
      </Modal>
    );
  }

  handleFileReview = item => {
    if (item.openPath) {
      const tempwindow = window.open('_blank');
      tempwindow.location = item.openPath;
    } else {
      previewAll({
        file_name: item.name || item.fileName,
        displayAddr: item.path || item.filePath,
        downloadAddr: item.path || item.filePath,
      });
    }
  };
}

export default FilePreview;
