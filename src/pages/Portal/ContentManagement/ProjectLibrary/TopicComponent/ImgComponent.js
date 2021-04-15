/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
<<<<<<< HEAD
 * @Last Modified time: 2021-03-30 17:55:10
=======
 * @Last Modified time: 2021-04-09 18:03:16
>>>>>>> 0e94d725a0c0d4eb489ade8a88e7c1ba1fbbe3f8
 * 创建工地
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Upload from '@/components/Upload/Upload';
import { Icon } from 'antd';
import styles from './index.less';
@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class ImgComponent extends PureComponent {
  state = { uploadVisible: false };

  componentDidMount() {}

  render() {
    const { data, index } = this.props;
    const { uploadVisible } = this.state;
    return (
      <div className={styles.changePicWrap}>
        <div
          onClick={() => {
            this.changePic();
          }}
          className={data.checked === 1 ? styles.imgWrap : ''}
        >
          <img
            src={data.paramList[0].defaultValue}
            draggable="false"
            alt="logo"
            style={{ width: '100%' }}
          />
          <div className={data.checked === 1 ? styles.roundLeftTop : ''} />
          <div className={data.checked === 1 ? styles.roundRightTop : ''} />
          <div className={data.checked === 1 ? styles.roundLeftBottom : ''} />
          <div className={data.checked === 1 ? styles.roundRightBottom : ''} />
        </div>
        {data.checked === 1 ? (
          <span
            className={styles.changePic}
            onClick={() => {
              this.changePicStaus();
            }}
          >
            <Icon type="sync" />
            更换图片
          </span>
        ) : (
          ''
        )}
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
        {uploadVisible && (
          <Upload
            visible={uploadVisible}
            selectNum={1}
            handleOk={data => this.handleUploadOk(data)}
            handleCancel={() => this.handleUploadCancel()}
          />
        )}
      </div>
    );
  }
  // 图片选择cancel
  handleUploadCancel = () => {
    this.setState({ uploadVisible: false, record: null });
  };
  // 图片选择
  handleUploadOk = data => {
    const { index } = this.props;
    this.props.handleImg(data, index);
    this.handleUploadCancel();
  };
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

export default ImgComponent;
