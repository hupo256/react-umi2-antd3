/*
 * @Author: zqm 
 * @Date: 2021-03-01 14:47:02 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-04 14:07:53
 */
// 上传VR效果图
import React, { PureComponent, Component } from 'react';
import { Modal, Row, Col, Input, message } from 'antd';
import Upload from '@/components/Upload/Upload';
import { connect } from 'dva';
import router from 'umi/router';
import RcViewer from 'rc-viewer';
import { getQueryUrlVal } from '@/utils/utils';

@connect(({ CaseLibrary }) => ({ CaseLibrary }))
class UploadVR extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      VRUrl: null,
      coverImg: null,
      uploadVisible: false,
    };
  }

  componentDidMount() {}
  render() {
    const { coverImg, uploadVisible } = this.state;
    return (
      <Modal
        title="上传VR效果图"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={() => this.props.handleCancel()}
        width={580}
        maskClosable={false}
      >
        <Row style={{ marginBottom: 20 }}>
          <Col span={6} style={{ textAlign: 'right' }}>
            <span className="beforeStar" style={{ lineHeight: '30px' }}>
              VR效果图URL：
            </span>
          </Col>
          <Col span={17}>
            <Input
              value={this.state.VRUrl}
              placeholder="请输入全景VR效果图链接，例：https://"
              onChange={e => this.handleVrUrl(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={6} style={{ textAlign: 'right' }}>
            <span style={{ lineHeight: '30px' }}>封面图：</span>
          </Col>
          <Col span={17}>
            <div className="coverImg">
              {coverImg ? (
                <div className="previewimg">
                  <img src={coverImg} />
                  <div className="picmodel">
                    <span onClick={() => this.setState({ uploadVisible: true })}>更换图</span>
                    <span
                      onClick={() => {
                        this.setState({ rcviewer: coverImg });
                        const { viewer } = this.refs.viewer;
                        viewer && viewer.show();
                      }}
                    >
                      预览
                    </span>
                  </div>
                </div>
              ) : (
                <div className="previewimg" onClick={() => this.setState({ uploadVisible: true })}>
                  点击上传
                </div>
              )}
            </div>
          </Col>
        </Row>
        {uploadVisible && (
          <Upload
            visible={uploadVisible}
            selectNum={1}
            handleOk={data => this.handleUploadOk(data)}
            handleCancel={() => this.handleUploadCancel()}
          />
        )}
        <RcViewer
          ref="viewer"
          options={{ title: false }}
          style={{
            display: 'none',
            verticalAlign: 'top',
            maxWidth: 300,
            wordWrap: 'break-word',
          }}
        >
          <img src={this.state.rcviewer} />
        </RcViewer>
      </Modal>
    );
  }

  // 图片选择cancel
  handleUploadCancel = () => {
    this.setState({ uploadVisible: false });
  };
  // 图片选择
  handleUploadOk = data => {
    this.setState({ coverImg: data[0].path });
    this.handleUploadCancel();
  };

  handleVrUrl = e => {
    this.setState({ VRUrl: e.target.value });
  };

  handleOk = () => {
    //
    const { VRUrl, coverImg } = this.state;
    const {
      dispatch,
      type,
      CaseLibrary: { stepOne },
    } = this.props;
    if (!VRUrl) {
      message.info('请先上传VR效果图URL');
      return false;
    } else if (VRUrl && !(VRUrl.includes('https://') || VRUrl.includes('HTTPS://'))) {
      message.info('VR效果图URL必须以https://开始');
      return false;
    } else {
      if (type === 'edit') {
        dispatch({
          type: 'CaseLibrary/editCaseModel',
          payload: {
            ...stepOne,
            vrCoverUrl: coverImg,
            vrUrl: VRUrl,
            uid: getQueryUrlVal('uid'),
          },
        }).then(res => {
          if (res && res.code === 200) {
            this.props.handleCancel();
          }
        });
      } else {
        dispatch({
          type: 'CaseLibrary/setVRUrlModel',
          payload: {
            VRUrl,
            coverImg,
          },
        });
        this.props.handleCancel();
      }
    }
  };
}

export default UploadVR;
