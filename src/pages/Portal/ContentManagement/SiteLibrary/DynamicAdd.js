/*
 * @Author: zqm
 * @Date: 2021-02-20 10:46:16
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-08 14:54:41
 * 创建动态
 */
import React, { Component } from 'react';
import { Modal, Row, Col, Input, message, Select, DatePicker, Icon } from 'antd';
import { connect } from 'dva';
import Upload from '@/components/Upload/Upload';
import { getDay } from '@/utils/utils';
import { editSiteDetailApi } from '@/services/siteLibrary';
import moment from 'moment';
import CarouselPic from '../../../../components/CarouselPic';

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
      imgvisible: false,
      imageList: [],
      initialSlide: '',
    };
  }
  componentDidMount() {
    const { dispatch, status, initData } = this.props;
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM001' },
    }).then(res => {
      if (res && res.code === 200) {
        const data = res.data['DM001']
          .filter(item => item.status === '1')
          .filter(item => item.code === status);
        this.setState({ diaryDate: initData?.diaryDate || getDay() });
      }
    });
    if (initData) {
      this.setState({
        diaryContent: initData.diaryContent,
        gongdiStage: initData.gongdiStage,
        diaryDate: initData.diaryDate,
        diaryPics: initData.fileList
          ? initData.fileList?.map(item => ({ path: item.fileUrl }))
          : [],
      });
    }
  }
  render() {
    const dateFormat = 'YYYY-MM-DD';
    const {
      DictConfig: { dicData },
      initData,
    } = this.props;
    const { diaryContent, uploadVisible, diaryDate, rep, diaryPics } = this.state;
    return (
      <Modal
        title={(initData ? '编辑' : '创建') + '动态'}
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
              value={this.state.gongdiStage || []}
              onChange={this.handleSelectChange}
              style={{ width: '100%' }}
              placeholder="请选择所属阶段"
              // disabled={initData}
            >
              {dicData &&
                dicData['DM001'] &&
                dicData['DM001'].map(item => {
                  if (initData && initData !== {}) {
                    return (
                      <Option value={item.code} key={item.uid}>
                        {item.name}
                      </Option>
                    );
                  } else {
                    if (item.status === '1') {
                      return (
                        <Option value={item.code} key={item.uid}>
                          {item.name}
                        </Option>
                      );
                    } else {
                      return null;
                    }
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
            <DatePicker
              value={moment(diaryDate, dateFormat)}
              allowClear={false}
              format={dateFormat}
              placeholder="请选择施工日期"
              onChange={this.handleDateChange}
            />
          </Col>
        </Row>
        <Row style={{ margin: '20px 0' }}>
          <Col span={5} style={{ textAlign: 'right' }}>
            工作内容：
          </Col>
          <Col span={18}>
            <TextArea
              placeholder="请输入工作内容"
              onChange={e => this.handleChange(e.target.value, 'diaryContent', 300)}
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
              {diaryPics &&
                diaryPics.length > 0 &&
                diaryPics.map((item, index) => {
                  // console.log(item);
                  const type = item.path
                    ? item.path.split('.')[item.path.split('.').length - 1]
                    : '';
                  return (
                    <div className="previewimg previewimgs" key={item.fileUid}>
                      {type === 'mp4' ? (
                        <video src={item.path} style={{ width: 94, height: 94 }} />
                      ) : (
                        <img src={item.path} style={{ width: 94, height: 94 }} />
                      )}
                      <div className="picmodel">
                        <span
                          onClick={() =>
                            this.setState({ uploadVisible: true, rep: true, editIndex: index })
                          }
                        >
                          <Icon type="edit" style={{ color: '#fff' }} />
                        </span>
                        <span
                          onClick={() => {
                            this.handlePreview(diaryPics, index);
                          }}
                        >
                          <Icon type="eye" style={{ color: '#fff', margin: '0 5px' }} />
                        </span>
                        <span onClick={() => this.handleDelete(index)}>
                          <Icon type="delete" style={{ color: '#fff' }} />
                        </span>
                      </div>
                    </div>
                  );
                })}

              {(!diaryPics || diaryPics?.length) < 9 && (
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
            video={true}
            selected={diaryPics?.length}
            rep={rep}
            size={10}
            handleOk={data => this.handleUploadOk(data)}
            handleCancel={() => this.handleUploadCancel()}
          />
        )}
        {this.state.imgvisible && (
          <CarouselPic
            ref="CarouselPic"
            inputData={this.state.imageList || []}
            visible={this.state.imgvisible}
            handleCancel={this.handleImgCancel}
            initialSlide={this.state.initialSlide}
            previewTitle="预览"
            name="addr"
          />
        )}
      </Modal>
    );
  }
  handleImgCancel = () => {
    this.setState({
      imgvisible: false,
      imageList: [],
      initialSlide: '',
    });
  };
  handlePreview = (fileList, index) => {
    const arr = [];
    fileList.map(e => {
      arr.push({
        originalFullUrl: e.path,
      });
    });
    this.setState(
      {
        imgvisible: true,
        imageList: arr,
        initialSlide: index,
      },
      () => {
        if (this.refs.CarouselPic.refs.prics) {
          this.refs.CarouselPic.refs.prics.innerSlider.slickGoTo(index);
        }
      }
    );
  };
  handleSelectChange = value => {
    this.setState({ gongdiStage: value });
  };
  handleDateChange = (date, dateString) => {
    this.setState({ diaryDate: dateString });
  };

  handleChange = (value, name, long) => {
    if (value.length > long) {
      message.warning(`最多输入${long}位字符`);
    } else {
      this.setState({ [name]: value });
    }
  };
  handleOk = async () => {
    const { diaryContent, diaryDate, gongdiStage, diaryPics } = this.state;
    console.log(diaryPics);
    const imglist =
      (diaryPics.length > 0 && diaryPics.map(item => item.path).filter(item => item)) || [];
    const siteDiaryFiles = [];
    imglist.map(item => {
      const type = item.split('.')[item.split('.').length - 1];
      siteDiaryFiles.push({
        fileUrl: item,
        businessPurpose: type === 'mp4' ? 5 : 4,
      });
    });
    if (!gongdiStage) {
      message.error('请选择所属阶段');
      return false;
    } else if (!diaryDate) {
      message.error('请选择施工日期');
      return false;
    } else if (!diaryContent && siteDiaryFiles.length === 0) {
      message.error('请填写 工作内容 或上传 施工照片');
      return false;
    } else {
      // createDynamicModel
      const { dispatch, record, initData } = this.props;
      if (initData) {
        try {
          const res = await editSiteDetailApi({
            diaryContent: diaryContent,
            diaryDate: diaryDate,
            siteDiaryFiles,
            gongdiStage: gongdiStage,
            diaryUid: initData.diaryUid,
          });
          if (res.code === 200) {
            message.success('编辑已保存');
            this.setState({
              diaryContent: null,
              diaryDate: null,
              diaryPics: [],
              gongdiStage: null,
            });
            this.props.handleOk(gongdiStage);
          }
        } catch (error) {
          message.error('请求出错！');
        }
      } else {
        dispatch({
          type: 'SiteLibrary/createDynamicModel',
          payload: {
            siteDiaryFiles,
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
      }

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
