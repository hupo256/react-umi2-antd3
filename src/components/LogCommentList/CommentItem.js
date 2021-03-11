/*
 * @Author: pengyc 
 * @Date: 2020-03-03 11:21:41 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-02-23 17:32:39
 * 评论
 */
import React, { Component } from 'react';
import { Avatar } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './index.less';

@connect(({ customer }) => ({ customer }))
class CommentItem extends Component {
  state = {};

  render() {
    let { data, dispatchData } = this.props;

    return (
      <div className={styles.comment}>
        <section className={styles.comentWrap}>
          <div className={styles.commentFlesDiv}>
            <div className={styles.titleImg}>
              <Avatar size={30} icon="user" src={data.userHeadImg} />
            </div>
            <div className={styles.textDIv}>
              <div className={styles.textDIvCenter}>
                {data.atUserRealName !== null ? (
                  <span>
                    <span className={styles.nameColor}>{data.userRealName}</span>
                    <span className={styles.margr}>回复</span>
                    <span className={styles.nameColor}>{data.atUserRealName}</span>
                  </span>
                ) : (
                  <span className={styles.nameColor}>{data.userRealName}</span>
                )}

                <span
                  dangerouslySetInnerHTML={{
                    __html: this.userStyle(data.commentContent, data.remindUserList),
                  }}
                />
              </div>
              <div className={styles.textDIvEdit}>
                <span className={styles.timeColorCenter}>{data.createTime}</span>
                {!dispatchData.editDiplay && (
                  <span
                    className={styles.returnNameColor}
                    onClick={() => this.handleShowInput(data)}
                  >
                    回复
                  </span>
                )}
              </div>
            </div>
          </div>
          {!_.isEmpty(data.childCommentList && data.childCommentList.list) &&
            data.childCommentList.list.map(elem => {
              return (
                <div key={elem.commentUid}>
                  <CommentItem
                    data={elem}
                    dispatchData={dispatchData}
                    handleCommentInput={() =>
                      this.props.handleCommentInput({ ...elem, nextComment: 'next' })
                    }
                  />
                </div>
              );
            })}
        </section>
      </div>
    );
  }

  // 显示回复框
  handleShowInput = data => {
    console.log(data);
    this.props.handleCommentInput(data);
  };

  // 被@人样式
  userStyle = (data, user) => {
    let newText = data;
    const users = user || [];
    users.forEach(item => {
      let re = '/@' + item.name + '/g;';
      let str = "<span style='color:#108ee9'>@" + item.name + '</span>';
      newText = newText.replace(eval(re), str);
    });
    return newText;
  };
}

export default CommentItem;
