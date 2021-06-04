/*
 * @Author: pengyc 
 * @Date: 2020-03-02 16:31:12 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-27 16:02:17
 * 日志组件头部信息
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Popover, Modal, Input, Button, message, Icon, Mentions } from 'antd';
import _ from 'lodash';
import styles from './index.less';
import router from 'umi/router';
import CommentItem from './CommentItem';
import ImgModal from './ImgModal';
import { getQueryUrlVal, guid, UtilsSum } from '@/utils/utils';
const { TextArea } = Input;
@connect(({ ProjectDaily, users }) => ({ ProjectDaily, users }))
class CommentWrap extends Component {
  constructor(props) {
    super(props);
    this.myInpRef = React.createRef();
    this.myRef = element => {
      this.myRefNode = element;
    };
    this.state = {
      nextVisible: false, // 更多按钮
      totalText: '展开全部', //日志展开收起
      textVisible: true, // 日志展开收起
      deleteVisible: false, // 删除弹窗
      textBoolVisible: false, // 控制评论
      inputVal: '', // 评论数据
      footerInputDivVisible: true, //评论输入框
      childData: {}, // 回复数据
      imgModalVisible: false, // 图片 附件展示框
      loaded: false, // 请求加载中
      submitKey: 9999999, // 请求KEY
      selectUser: [], //已选择的@人员
      dataList: [],
      pageNum: 1,
      recordTotal: 0,
      pageNums: 1,
    };
  }

  componentDidMount() {
    this.handleDomHeight(this.props, this.state);
    const { data, indexD, dispatch } = this.props;
    if (indexD === 0) {
      dispatch({
        type: 'ProjectDaily/CommentPageListModel',
        payload: {
          businessType: 1,
          businessUid: data.dailyUid,
          pageNum: this.state.pageNum,
          pageSize: 10,
        },
      }).then(res => {
        if (res && res.code === 200) {
          this.setState({
            dataList: res.data.list,
            recordTotal: res.data.recordTotal,
          });
        }
      });
    }
  }
  componentWillUnmount() {
    /*  this.setState({
      nextVisible: false, // 更多按钮
      totalText: '展开全部', //日志展开收起
      textVisible: true, // 日志展开收起
      deleteVisible: false, // 删除弹窗
      textBoolVisible: false, // 控制评论
      inputVal: '', // 评论数据
      footerInputDivVisible: true, //评论输入框
      childData: {}, // 回复数据
      imgModalVisible: false, // 图片 附件展示框
      loaded: false,
    }); */
  }

  render() {
    const {
      data,
      dispatchData,
      users: { userinfo },
    } = this.props;
    const {
      textVisible,
      textBoolVisible,
      inputVal,
      childData,
      imgModalVisible,
      loaded,
      dataList,
      recordTotal,
    } = this.state;
    let fromText = null;
    if (!_.isEmpty(childData)) {
      if (childData.creator_code !== userinfo.user_code) {
        fromText = (
          <span style={{ color: '#999' }}>
            回复 &nbsp;
            {childData.creator} :
          </span>
        );
      }
    }
    const commentsText = (
      <span className={styles.cilckRighrColor} onClick={this.handleViewComments}>
        评论
        {data.commentNum > 0 ? `(${data.commentNum})` : null}
      </span>
    );
    let attachmentNum = data.attachments.length + data.pictures.length;
    data.itemList.map((ite, idx) => {
      let arr = this.overThreeLine(ite.taskContent);
      ite.taskContents = arr.newTitle;
      ite.isShow = arr.isShow;
    });

    let { uid } = JSON.parse(sessionStorage.getItem('query'));
    let arPic = [];
    let arr =
      data.itemList &&
      data.itemList.map((item, index) => {
        if (item.pictures) {
          arPic.push(item.pictures.length || 0);
        }

        return (
          <div key={index}>
            <p>
              <span className={styles.comSpan}>工程项目:</span>
              {item.taskName}
            </p>
            <p className={styles.Pcont}>
              工作内容:
              {item.taskContents}
              {item.isShow === 0 ? <span className={styles.davb}>全部</span> : null}
            </p>
          </div>
        );
      });
    if (data.dailyTemplate === 'EGDT1') {
      attachmentNum = data.attachments.length + data.pictures.length;
    } else {
      attachmentNum = data.attachments.length + UtilsSum(arPic);
    }
    return (
      <section>
        <div className={styles.comWrap}>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              router.push(
                `/project/info/projectdaily/detail/?uid=${getQueryUrlVal('uid') || uid}&code=${
                  data.dailyUid
                }`
              );
            }}
          >
            {data.dailyAppletsShow === 1 ? (
              <div className={styles.comA}>
                <div className={styles.comP}>同步</div>
                <div>甲方</div>
              </div>
            ) : null}
            <div className={styles.centerTop}>
              <div className={styles.header}>
                <div
                  ref={this.myRef}
                  className={textVisible ? styles.headerText : styles.overflowText}
                >
                  <h3>
                    <span className={styles.pFont}>{data.dailyDate}</span>
                    <span className={styles.cardSpan}>
                      {data.dailyWeather.temMax}
                      ℃~
                      {data.dailyWeather.temMin}℃
                    </span>
                    <span>
                      <img
                        src={data.dailyWeather && data.dailyWeather.weaPic}
                        className={styles.wer}
                      />
                    </span>
                  </h3>
                  {data.dailyTemplate === 'EGDT1' ? (
                    <p className={styles.Pcont}>
                      工作内容:
                      {data.dailyContent}
                    </p>
                  ) : (
                    arr
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <Row>
              <Col span={12} />
              <Col span={12}>
                <div className={styles.footerRight}>
                  {attachmentNum > 0 ? (
                    <span
                      className={styles.cilckRighrColor}
                      onClick={attachmentNum > 0 ? this.handleShowImgModal : null}
                    >
                      查看图片/附件
                      {attachmentNum > 0 ? `(${attachmentNum})` : null}
                    </span>
                  ) : null}

                  {dispatchData.editDiplay ? data.comment_num > 0 && commentsText : commentsText}
                  <Popover
                    content={
                      <div>
                        <a onClick={this.handleEditCenter}>编辑</a>
                        <br />
                        <a onClick={this.handleDeleteCenter}>删除</a>
                      </div>
                    }
                    trigger="click"
                    visible={this.state.nextVisible}
                    onVisibleChange={this.handleVisibleChange}
                    placement="bottom"
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <span className={styles.cilckRighrColor}>
                      更多
                      <Icon type="caret-down" />
                    </span>
                  </Popover>
                </div>
              </Col>
            </Row>
          </div>

          <Modal
            title="确认弹窗"
            visible={this.state.deleteVisible}
            onOk={this.handleDeleteVisibleOk}
            onCancel={this.handleDeleteVisibleCancel}
            bodyStyle={{ textAlign: 'center', fontSize: 14 }}
            zIndex={1100}
            footer={[
              <Button loading={loaded} key="back" onClick={this.handleDeleteVisibleCancel}>
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loaded}
                onClick={this.handleDeleteVisibleOk}
              >
                确定
              </Button>,
            ]}
          >
            您确定要删除该动态吗？
          </Modal>
        </div>
        <div className={textBoolVisible ? styles.form : styles.end}>
          {!_.isEmpty(dataList) &&
            dataList.map((elem, i) => {
              return (
                <div key={guid()}>
                  <CommentItem
                    data={elem}
                    dispatchData={dispatchData}
                    handleCommentInput={this.handleCommentInput}
                  />
                  {elem.childCommentList.recordTotal > 10 ? (
                    <div
                      style={{ paddingLeft: 80, paddingTop: 10 }}
                      onClick={() => {
                        this.handleAddLogChild(elem, i);
                      }}
                    >
                      <a>加载更多</a>
                    </div>
                  ) : null}
                </div>
              );
            })}
          {recordTotal > 10 ? (
            <div
              style={{ textAlign: 'center', padding: 10 }}
              onClick={() => {
                this.handleAddLog();
              }}
            >
              <a>加载更多</a>
            </div>
          ) : null}
          {!dispatchData.editDiplay && (
            <div className={styles.footerInputDiv}>
              {fromText}
              <TextArea
                ref={this.myInpRef}
                style={{ display: 'inline-block', height: 32 }}
                className={styles.commentMention}
                maxLength={300}
                autoSize={true}
                value={inputVal}
                onChange={this.handleInputChange}
                placeholder={!_.isEmpty(childData) ? `回复${childData.userRealName}` : '评论'}
              />

              <div className={styles.footerbtnDiv}>
                <Button
                  type="primary"
                  size="small"
                  style={{ fontWeight: 12 }}
                  loading={loaded}
                  onClick={this.handleSubmit}
                >
                  发表
                </Button>
              </div>
            </div>
          )}
        </div>
        {imgModalVisible && (
          <ImgModal
            visible={imgModalVisible}
            data={data}
            handleCancel={this.handleImgModalCancel}
          />
        )}
      </section>
    );
  }

  // 打开图片附件弹窗
  handleShowImgModal = () => {
    this.setState({ imgModalVisible: true });
  };
  // 关闭图片，附件弹窗
  handleImgModalCancel = () => {
    this.setState({ imgModalVisible: false });
  };

  // 发表评论
  handleSubmit = () => {
    const { inputVal, childData } = this.state;
    const { dispatch, data, dispatchData } = this.props;
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth.isExperience) {
      let payload;
      if (!inputVal) {
        message.error('请输入内容再提交~');
        return;
      }
      if (_.isEmpty(childData)) {
        payload = {
          commentContent: inputVal,
          businessType: 1,
          businessUid: data.dailyUid,
          parentCommentUid: '',
        };
      } else {
        payload = {
          commentContent: inputVal,
          businessType: 1,
          businessUid: data.dailyUid,
          parentCommentUid: childData.commentUid,
        };
      }
      dispatch({
        type: 'ProjectDaily/CommentPushModel',
        payload,
      }).then(res => {
        if (res && res.code === 200) {
          dispatch({
            type: dispatchData.queryList,
            payload: dispatchData.payload,
          }).then(param => {
            if (param && param.code === 200) {
              message.success('发表成功！');
              this.setState({
                childData: {},
                inputVal: '',
                loaded: false,
              });
            }
          });
          dispatch({
            type: 'ProjectDaily/CommentPageListModel',
            payload: {
              businessType: 1,
              businessUid: data.dailyUid,
              pageNum: 1,
              pageSize: 10,
            },
          }).then(res => {
            if (res && res.code === 200) {
              this.setState({
                dataList: res.data.list,
                recordTotal: res.data.recordTotal,
                pageNum: 1,
              });
            }
          });
        } else {
          message.error(res.message);
          this.setState({ loaded: false });
        }
      });
    } else {
      message.error('请升级为正式版本后使用，如有需要请联系客服400-056-6800');
    }
  };

  // 输入评论
  handleInputChange = e => {
    const inputVal = e.target.value;
    this.setState({
      inputVal,
    });
  };

  // 控制评论框
  handleCommentInput = childData => {
    const node = this.myInpRef.current;
    node.focus();
    this.setState({
      childData,
    });
  };

  //点击查看评论
  handleViewComments = () => {
    const node = this.myInpRef.current;
    const { dispatchData, data, dispatch } = this.props;
    if (!this.state.textBoolVisible && !dispatchData.editDiplay) {
      node.focus();
    }
    if (!this.state.textBoolVisible) {
      dispatch({
        type: 'ProjectDaily/CommentPageListModel',
        payload: {
          businessType: 1,
          businessUid: data.dailyUid,
          pageNum: 1,
          pageSize: 10,
        },
      }).then(res => {
        if (res && res.code === 200) {
          this.setState({
            textBoolVisible: !this.state.textBoolVisible,
            dataList: res.data.list,
            recordTotal: res.data.recordTotal,
            pageNum: 1,
            childData: {},
            inputVal: '',
          });
        }
      });
    } else {
      this.setState({
        textBoolVisible: !this.state.textBoolVisible,
        dataList: [],
        childData: {},
        inputVal: '',
      });
    }
  };

  // 点击展开全部日志
  handleClickCommentText = () => {
    this.setState({
      textVisible: !this.state.textVisible,
      totalText: !this.state.textVisible ? '收起全部' : '展开全部',
    });
  };

  // 更多操作 start
  // 编辑日志
  handleEditCenter = () => {
    const { data } = this.props;
    let { uid } = JSON.parse(sessionStorage.getItem('query'));
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth.isExperience) {
      router.push(
        `/project/info/projectdaily/add?uid=${getQueryUrlVal('uid') || uid}&isEdit=1&code=${
          data.dailyUid
        }`
      );
    } else {
      message.error('请升级为正式版本后使用，如有需要请联系客服400-056-6800');
    }
  };

  // 删除日志
  handleDeleteCenter = () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth.isExperience) {
      this.setState({
        nextVisible: false,
        deleteVisible: true,
      });
    } else {
      message.error('请升级为正式版本后使用，如有需要请联系客服400-056-6800');
    }
  };
  // 确认删除
  handleDeleteVisibleOk = e => {
    const { dispatchData, dispatch, data } = this.props;
    dispatch({
      type: dispatchData.deleteType,
      payload: {
        dailyUid: data.dailyUid,
      },
    }).then(res => {
      if (res && res.code === 200) {
        dispatch({
          type: dispatchData.queryList,
          payload: dispatchData.payload,
        }).then(param => {
          if (param && param.code === 200) {
            this.props.updata(param.data);
            message.success('删除成功！');
            this.setState({
              deleteVisible: false,
              loaded: false,
            });
          }
        });
      }
    });
  };
  // 返回
  handleDeleteVisibleCancel = e => {
    this.setState({
      deleteVisible: false,
    });
  };

  // 更多操作 end
  handleVisibleChange = visible => {
    this.setState({ nextVisible: visible });
  };
  // 初始化处理
  handleDomHeight = (props, state) => {
    const { data, dispatchData, indexD } = props;
    let totalText = state.totalText;
    let textBoolVisible = state.textBoolVisible;
    let submitKey = state.submitKey;
    let textVisible = state.textVisible;

    if (indexD === 0) {
      // 项目中的线索第一条不展开
      textBoolVisible = true;
    } else {
      textBoolVisible = false;
    }
    this.setState({
      textVisible,
      totalText,
      textBoolVisible,
    });
  };
  //加载更多日志
  handleAddLog() {
    const { pageNum, dataList } = this.state;
    const { data, dispatch } = this.props;
    dispatch({
      type: 'ProjectDaily/CommentPageListModel',
      payload: {
        businessType: 1,
        businessUid: data.dailyUid,
        pageNum: pageNum + 1,
        pageSize: 10,
      },
    }).then(res => {
      if (res && res.code === 200) {
        if (res.data.list && res.data.list.length > 0) {
          this.setState({
            dataList: [...dataList, ...res.data.list],
            pageNum: pageNum + 1,
          });
        } else {
          return message.warning('没有更多评论了', 2);
        }
      }
    });
  }
  handleAddLogChild(elem, i) {
    console.log(elem);
    const { dataList } = this.state;
    const { data, dispatch } = this.props;
    console.log(dataList[i].childCommentList);
    if (dataList[i].pageNums) {
      dataList[i].pageNums = dataList[i].pageNums + 1;
    } else {
      dataList[i].pageNums = 2;
    }
    dispatch({
      type: 'ProjectDaily/CommentPageListModel',
      payload: {
        businessType: 1,
        businessUid: data.dailyUid,
        pageNum: dataList[i].pageNums,
        pageSize: 10,
        rootCommentUid: elem.commentUid,
      },
    }).then(res => {
      if (res && res.code === 200) {
        if (res && res.code === 200) {
          if (res.data.list && res.data.list.length > 0) {
            dataList[i].childCommentList.list = [
              ...dataList[i].childCommentList.list,
              ...res.data.list,
            ];
            this.setState({
              dataList,
            });
          } else {
            return message.warning('没有更多评论了', 2);
          }
        }
      }
    });
  }
  overThreeLine(title) {
    const titleMaxLength = 379;
    let len = 0; // 记录title的字节数
    let newTitle = '';
    let arrShow = {};
    let showContent = '';
    for (let i = 0; i < title.length; i += 1) {
      const charCode = title.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) {
        len += 1;
      } else {
        len += 2;
      }
      if (len < titleMaxLength - 3) newTitle += title[i];
      if (len >= titleMaxLength) {
        showContent = newTitle + '...';
        arrShow = { newTitle: showContent, isShow: 0 };
        return arrShow;
      }
    }
    arrShow = { newTitle: title, isShow: 1 };
    return arrShow;
  }
}

export default CommentWrap;
