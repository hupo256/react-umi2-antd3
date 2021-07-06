/*
 * @Author: zqm
 * @Date: 2021-02-20 10:22:25
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-29 16:52:26
 * 动态列表
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Radio, Pagination, Button, Icon, Modal, message } from 'antd';
import { paginations, getQueryUrlVal, successIcon, waringInfo } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DynamicAdd from './DynamicAdd';
import RcViewer from 'rc-viewer';
import { getauth } from '@/utils/authority';
import { getSiteDetaiyApi } from '@/services/siteLibrary';
import emptyImage from '../../../../assets/emptyImage.png';
import CarouselPic from '@/components/CarouselPic';

const { confirm } = Modal;
@connect(({ SiteLibrary }) => ({ SiteLibrary }))
class DynamicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      status: null,
      initData: null,
      page: 1,
      pageSize: 10,
      isEdit: false,
      imgvisible: false,
      imageList: [],
      initialSlide: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'SiteLibrary/dynamicStatusModel',
      payload: { gongdiUid: getQueryUrlVal('uid') },
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({ status: res.data.value });
      }
    });
    dispatch({
      type: 'SiteLibrary/dynamicListModel',
      payload: { gongdiUid: getQueryUrlVal('uid'), pageSize: 5 },
    });
  }

  render() {
    const { visible } = this.state;
    const {
      dispatch,
      SiteLibrary: { dynamicList },
    } = this.props;
    const permissionsBtn = getauth().permissions || [];
    return (
      <div>
        <PageHeaderWrapper>
          {permissionsBtn.includes('BTN210326000039') && (
            <Card bordered={false}>
              <Button
                type="primary"
                onClick={() => {
                  dispatch({
                    type: 'SiteLibrary/dynamicStatusModel',
                    payload: { gongdiUid: getQueryUrlVal('uid') },
                  }).then(res => {
                    if (res && res.code === 200) {
                      this.setState({
                        status: res.data.value,
                        visible: true,
                        initData: null,
                        isEdit: false,
                      });
                    }
                  });
                }}
              >
                <Icon type="plus" />
                创建动态
              </Button>
            </Card>
          )}
          {dynamicList &&
            Array.isArray(dynamicList) &&
            dynamicList.length > 0 && (
              <Card bordered={false} style={{ marginTop: 20 }}>
                {dynamicList?.map(item => {
                  return (
                    <div key={item.dicCode} style={{ marginBottom: 20 }}>
                      <p>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#16317a',
                            borderRadius: '0 20px 20px 0',
                            color: '#fff',
                            padding: ' 8px 26px 8px 16px',
                            marginLeft: '-24px',
                            marginBottom: 20,
                          }}
                        >
                          {item.dicName}
                        </span>
                      </p>
                      {item.pageList?.list?.map(items => {
                        return (
                          <div key={items.diaryUid}>
                            <p>
                              <Radio checked={true} />
                              {items.diaryDate}

                              {permissionsBtn.includes('BTN210326000040') && (
                                <span
                                  style={{ float: 'right', cursor: 'pointer' }}
                                  onClick={() => {
                                    this.handleChangeStatus(items, item);
                                  }}
                                >
                                  <Icon type={items.appletsShow ? 'eye-invisible' : 'eye'} />
                                  {items.appletsShow ? '隐藏' : '显示'}
                                </span>
                              )}
                              {
                                // permissionsBtn.includes('BTN210623000001') &&
                                <span
                                  style={{ float: 'right', cursor: 'pointer', marginRight: 16 }}
                                  onClick={() => {
                                    this.editHandle(items);
                                  }}
                                >
                                  <Icon type="edit" />
                                  编辑
                                </span>
                              }
                            </p>
                            <p>{items.diaryContent}</p>
                            {items.fileList &&
                              Array.isArray(items.fileList) &&
                              items.fileList.length > 0 &&
                              items.fileList?.map((item, i) => {
                                const type = item.fileUrl.split('.')[
                                  item.fileUrl.split('.').length - 1
                                ];
                                return type === 'mp4' ? (
                                  <video
                                    onClick={() => this.handlePreview(items.fileList, i)}
                                    key={i}
                                    className="rcviewer"
                                    style={{
                                      width: 102,
                                      height: 102,
                                      verticalAlign: 'middle',
                                      borderStyle: 'none',
                                    }}
                                    src={item.fileUrl}
                                    controls="controls"
                                  />
                                ) : (
                                  <img
                                    onClick={() => this.handlePreview(items.fileList, i)}
                                    className="rcviewer"
                                    style={{ width: 102, height: 102 }}
                                    key={i}
                                    src={item.fileUrl}
                                  />
                                );
                              })}
                          </div>
                        );
                      })}
                      {item.pageList.recordTotal > 5 && (
                        <Pagination
                          size="small"
                          pageSize={5}
                          pageSizeOptions={5}
                          onChange={(page, pageSize) =>
                            this.handlePagination(page, pageSize, item.dicCode)
                          }
                          total={item.pageList.recordTotal}
                        />
                      )}
                    </div>
                  );
                })}
              </Card>
            )}
        </PageHeaderWrapper>

        {visible && (
          <DynamicAdd
            record={{ gongdiUid: getQueryUrlVal('uid') }}
            visible={visible}
            initData={this.state.initData}
            status={this.state.status}
            handleOk={() => this.handleOk()}
            handleCancel={() => this.handleCancel()}
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
      </div>
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
        originalFullUrl: e.fileUrlFiftyPixel,
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
  /**
   * @description: 编辑动态
   * @param {*} item
   * @return {*}
   */
  editHandle = async item => {
    this.setState({
      dicCode: item.gongdiStage,
    });
    try {
      const res = await getSiteDetaiyApi({ diaryUid: item.diaryUid });
      if (res.code === 200) {
        this.setState({ initData: res.data, visible: true, isEdit: true });
      }
    } catch (error) {
      message.error('出错了！');
    }
  };

  // 分页
  handlePagination = (page, pageSize, dicCode) => {
    this.setState({
      page,
      dicCode,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'SiteLibrary/pageDynamicModel',
      payload: {
        gongdiUid: getQueryUrlVal('uid'),
        gongdiStage: dicCode,
        pageNum: page,
        pageSize: 5,
      },
    });
  };
  // 动态显示隐藏
  handleDiaryShow = (diaryUid, status, dicCode) => {
    // dynamicShowModel
    const { dispatch } = this.props;
    dispatch({
      type: 'SiteLibrary/dynamicShowModel',
      payload: { diaryUid, appletsShow: status ? 0 : 1 },
    }).then(res => {
      if (res && res.code === 200) {
        message.success('操作成功');
        dispatch({
          type: 'SiteLibrary/toggleStatusModel',
          payload: { diaryUid, status, dicCode },
        });
      }
    });
  };
  handleOk = () => {
    this.setState({ visible: false });
    const { dispatch } = this.props;
    const { isEdit, page, dicCode } = this.state;
    if (isEdit) {
      this.handlePagination(page, undefined, dicCode);
    } else {
      console.log(123);
      dispatch({
        type: 'SiteLibrary/dynamicListModel',
        payload: { gongdiUid: getQueryUrlVal('uid') },
      });
    }
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  // 切换状态
  handleChangeStatus = (r, item) => {
    const status = r.appletsShow;
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: status ? '确认要隐藏当前动态吗？' : '确认要显示当前动态吗？',
      content: status
        ? '隐藏后，将无法在工地详情中显示当前动态！'
        : '显示后，将会在工地详情中显示当前动态！',
      icon: !status ? successIcon : waringInfo,
      onOk() {
        that.handleDiaryShow(r.diaryUid, r.appletsShow, item.dicCode);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
}

export default DynamicList;
