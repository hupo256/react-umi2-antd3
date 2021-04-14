/*
 * @Author: pengyc 
 * @Date: 2020-03-02 16:31:12 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-08 15:09:55
 * 日志组件头部信息
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Popover, Modal, Input, Button, message, Icon, Mentions } from 'antd';
import _ from 'lodash';
import styles from './index.less';
import router from 'umi/router';
import CommentItem from './CommentItem';
const { TextArea } = Input;
import { getQueryUrlVal, guid, UtilsSum } from '@/utils/utils';
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
    const { data, dispatch } = this.props;

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

  render() {
    const {
      data,
      dispatchData,
      users: { userinfo },
    } = this.props;
    const { textBoolVisible, inputVal, childData, loaded, dataList, recordTotal } = this.state;
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
    return (
      <section>
        <div className={styles.form}>
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
          <div className={styles.footerInputDiv}>
            {fromText}
            <TextArea
              ref={this.myInpRef}
              className={styles.commentMention}
              maxLength={300}
              autoSize={{ minRows: 1 }}
              value={inputVal}
              onChange={this.handleInputChange}
              placeholder={!_.isEmpty(childData) ? `回复${childData.userRealName}` : '评论'}
            />

            <div className={styles.footerbtnDiv}>
              <Button type="primary" loading={loaded} onClick={this.handleSubmit}>
                发表
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  // 发表评论
  handleSubmit = () => {
    const { inputVal, childData } = this.state;
    const { dispatch, data, dispatchData } = this.props;
    const auth = JSON.parse(localStorage.getItem('auth'));
    let payload;
    if (!auth.isExperience) {
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
          this.setState({
            childData: {},
            inputVal: '',
            loaded: false,
          });
          const {
            ProjectDaily: { formValues },
          } = this.props;
          formValues.pageNum = 1;
          dispatch({
            type: 'ProjectDaily/saveDataModel',
            payload: {
              key: 'engineeringDailyList',
              value: {},
            },
          });
          dispatch({
            type: 'ProjectDaily/saveDataModel',
            payload: {
              key: 'formValues',
              value: formValues,
            },
          });
          dispatch({
            type: 'ProjectDaily/saveDataModel',
            payload: {
              key: 'isShow',
              value: 0,
            },
          });
          message.success('发布成功！');
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

  // 返回
  handleDeleteVisibleCancel = e => {
    this.setState({
      deleteVisible: false,
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
    const { dataList } = this.state;
    const { data, dispatch } = this.props;
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
}

export default CommentWrap;
