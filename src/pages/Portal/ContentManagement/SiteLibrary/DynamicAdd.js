/*
 * @Author: zqm 
 * @Date: 2021-02-20 10:46:16 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-12 18:59:10
 * 创建动态
 */
import React, { Component } from 'react';
import { Modal, Row, Col, Input, message, Select, DatePicker, Icon } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload/Upload';
import RcViewer from 'rc-viewer';
import router from 'umi/router';
const { TextArea } = Input;
const { Option } = Select;

@connect(({ DictConfig, SiteLibrary, loading }) => ({
  DictConfig,
  SiteLibrary,
}))
class DynamicAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diaryContent: null,
      diaryDate: null,
      diaryPics: [],
      gongdiStage: null,
      uploadVisible: false,
      coverImg: null,
      rep: false,
      editIndex: null,
      // gongdiUid: 'string'
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM001' },
    });
  }
  render() {
    const {
      DictConfig: { dicData },
    } = this.props;
    const { diaryContent, uploadVisible, coverImg, rep, diaryPics } = this.state;
    return (
      <Modal
        title="创建动态"
        visible={this.props.visible}
        onOk={() => this.handleOk()}
        onCancel={this.handleCancel}
        centered={true}
        maskClosable={false}
      >
        <Row>
          <Col span={5} className="beforeStar" style={{ textAlign: 'right' }}>
            所属阶段：
          </Col>
          <Col span={18}>
            <Select
              onChange={this.handleSelectChange}
              style={{ width: '100%' }}
              placeholder="请选择所属阶段"
            >
              {dicData &&
                dicData['DM001'] &&
                dicData['DM001'].map(item => {
                  if (item.status === '1') {
                    return (
                      <Option value={item.code} key={item.uid}>
                        {item.name}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
            </Select>
          </Col>
        </Row>
        <Row style={{ margin: '20px 0' }}>
          <Col span={5} className="beforeStar" style={{ textAlign: 'right' }}>
            施工日期：
          </Col>
          <Col span={18}>
            <DatePicker placeholder="请选择施工日期" onChange={this.handleDateChange} />
          </Col>
        </Row>
        <Row style={{ margin: '20px 0' }}>
          <Col span={5} style={{ textAlign: 'right' }}>
            工作内容：
          </Col>
          <Col span={18}>
            <TextArea
              placeholder="请输入工作内容"
              onChange={e => this.handleChange(e.target.value, 'diaryContent', 200)}
              rows={4}
              value={diaryContent}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5} style={{ textAlign: 'right' }}>
            施工照片：
          </Col>
          <Col span={18}>
            <div className="coverImgs">
              {diaryPics.length > 0 &&
                diaryPics.map((item, index) => {
                  return (
                    <div className="previewimg previewimgs" key={item.path}>
                      <img src={item.path} />
                      <div className="picmodel">
                        <span
                          onClick={() =>
                            this.setState({ uploadVisible: true, rep: true, editIndex: index })
                          }
                        >
                          <Icon type="edit" />
                        </span>
                        <span
                          onClick={() => {
                            this.setState({ rcviewer: item.path });
                            const { viewer } = this.refs.viewer;
                            viewer && viewer.show();
                          }}
                        >
                          <Icon type="eye" />
                        </span>
                        <span onClick={() => this.handleDelete(index)}>
                          <Icon type="delete" />
                        </span>
                      </div>
                    </div>
                  );
                })}

              {diaryPics.length <= 9 && (
                <div
                  className="previewimgs"
                  style={{ border: '1px dashed #d9d9d9' }}
                  onClick={() => this.setState({ uploadVisible: true })}
                >
                  点击上传
                </div>
              )}
            </div>
          </Col>
        </Row>
        {uploadVisible && (
          <Upload
            visible={uploadVisible}
            selectNum={9}
            selected={diaryPics.length}
            rep={rep}
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
  handleSelectChange = value => {
    this.setState({ gongdiStage: value });
  };
  handleDateChange = (date, dateString) => {
    console.log(dateString);
    this.setState({ diaryDate: dateString });
  };

  handleChange = (value, name, long) => {
    if (value.length > long) {
      message.info(`最多输入${long}位字符`);
    } else {
      this.setState({ [name]: value });
    }
  };
  handleOk = () => {
    const { diaryContent, diaryDate, gongdiStage, diaryPics } = this.state;
    if (!gongdiStage) {
      message.error('请选择所属阶段');
    } else if (!diaryDate) {
      message.error('请选择施工日期');
    } else {
      // createDynamicModel
      const { dispatch, record } = this.props;
      dispatch({
        type: 'SiteLibrary/createDynamicModel',
        payload: {
          diaryPics: diaryPics.map(item => item.path),
          diaryContent,
          diaryDate,
          gongdiStage,
          gongdiUid: record.gongdiUid,
        },
      }).then(res => {
        if (res && res.code === 200) {
          message.success('创建成功');
          this.setState({
            diaryContent: null,
            diaryDate: null,
            diaryPics: [],
            gongdiStage: null,
          });
          this.props.handleOk();
        }
      });
      // this.props.handleOk({ name: name.trim(), extDescOne, extDescTwo });
    }
  };
  handleCancel = () => {
    this.setState(
      {
        diaryContent: null,
        diaryDate: null,
        diaryPics: [],
        gongdiStage: null,
      },
      () => {
        this.props.handleCancel();
      }
    );
  };

  // 图片选择cance
  handleUploadCancel = () => {
    this.setState({ uploadVisible: false, record: null, rep: false, editIndex: null });
  };
  handleDelete = index => {
    const { diaryPics } = this.state;
    let datas = [...diaryPics];
    datas.splice(index, 1);
    this.setState({ diaryPics: datas });
  };
  // 图片选择
  handleUploadOk = data => {
    const { rep, editIndex, diaryPics } = this.state;
    if (rep) {
      // 编辑
      let datas = [...diaryPics];
      datas[editIndex] = data[0];
      this.setState({ diaryPics: datas }, () => {
        this.handleUploadCancel();
      });
    } else {
      // 新增
      this.setState({ diaryPics: [...diaryPics, ...data] }, () => {
        this.handleUploadCancel();
      });
    }
  };
}

export default DynamicAdd;
