/*
 * @Author: pengyc 
 * @Date: 2020-03-04 11:42:51 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-12-29 16:50:10
 * 图片旋转组件
 */
import React, { Component } from 'react';
import { Modal } from 'antd';
import RcViewer from 'rc-viewer';

import styles from './ImgModal.less';

class ImgModal extends Component {
  state = {};

  render() {
    const { visible, data, handleCancel } = this.props;
    const options = {
      title: false,
    };
    let arr = [];
    if (data.dailyTemplate === 'EGDT1') {
      data.pictures.map((imgitem, ind) => {
        arr.push(imgitem);
      });
    } else {
      data.itemList &&
        data.itemList.map((item, index) => {
          arr.push(...item.pictures);
        });
    }
    return (
      <Modal
        footer={null}
        visible={visible}
        onCancel={handleCancel}
        className={styles.InvoiceDrawer}
        title="查看图片/附件"
        zIndex={1166}
      >
        <div className={styles.con}>
          图片:
          <div className={styles.imgWrap}>
            <RcViewer options={options}>
              {arr.map((imgitem, ind) => {
                return <img key={ind} src={imgitem.fileFullUrl} />;
              })}
            </RcViewer>
          </div>
        </div>
        <div className={styles.con}>
          <div>附件:</div>
          {data &&
            data.attachments &&
            data.attachments.map((item, ind) => {
              return (
                <p key={ind}>
                  <a
                    onClick={() => {
                      this.previewAll(item);
                    }}
                  >
                    {item.fileName + '、'}
                  </a>
                </p>
              );
            })}
        </div>
      </Modal>
    );
  }
  previewAll = item => {
    const nameLast = item.fileName ? item.fileName.split('.')[1] : null;
    // xls xlsx doc docx ppt pptx pdf txt 预览
    switch (nameLast) {
      case 'xls':
      case 'xlsx':
      case 'doc':
      case 'docx':
      case 'ppt':
      case 'pptx':
        const aLink = document.createElement('a');
        document.body.appendChild(aLink);
        aLink.style.display = 'none';
        aLink.href = `https://view.officeapps.live.com/op/view.aspx?src=${item.fileFullUrl}`;
        aLink.target = '_blank';
        aLink.click();
        document.body.removeChild(aLink);
        break;
      case 'pdf':
      case 'txt':
        this.preview(item);
        break;
      default:
        this.downfile(item);
        break;
    }
  };
  preview = item => {
    const aLink = document.createElement('a');
    let url = item.fileFullUrl || item.response.data.fileFullUrl;
    let downass = url.lastIndexOf('/'); //url
    let str = url.substring(0, downass + 1);
    let stg = url.substring(downass + 1); //文件名称
    let indexs = stg.lastIndexOf('.');
    let sur = stg.substring(0, indexs);
    let suh = stg.substring(indexs);
    let addr = `${encodeURI(str)}${encodeURIComponent(sur)}${suh}`;
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = addr;
    aLink.target = '_blank';
    aLink.download = item.fileName;
    aLink.click();
    document.body.removeChild(aLink);
  };
  downfile = (item, dispatch) => {
    const aLink = document.createElement('a');
    let url = item.fileFullUrl;
    let downass = url.lastIndexOf('/'); //url
    let str = url.substring(0, downass + 1);
    let stg = url.substring(downass + 1); //文件名称
    let indexs = stg.lastIndexOf('.');
    let sur = stg.substring(0, indexs);
    let suh = stg.substring(indexs);
    let addr = `${encodeURI(str)}${encodeURIComponent(sur)}${suh}`;

    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = addr;
    aLink.target = '_blank';
    aLink.download = item.file_name;
    aLink.click();
    document.body.removeChild(aLink);
  };
}

export default ImgModal;
