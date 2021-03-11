import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Icon } from 'antd';
import styles from './index.less';
import router from 'umi/router';

@connect(({}) => ({}))
class ProjectHeader extends Component {
  state = {};

  render() {
    return (
      <div className={styles.projectHeader}>
        <span
          className={styles.aSpan}
          onClick={() => this.handleRouter('meetingMinutes', 'newMeetingMinutes')}
        >
          <Icon type="form" />
          &nbsp;建会议纪要
        </span>
        <span className={styles.aSpan} onClick={() => this.handleRouter('task', 'newTask')}>
          <Icon type="carry-out" theme="twoTone" />
          &nbsp;建任务
        </span>
      </div>
    );
  }

  handleClick = () => {};
  handleRouter = (key, val) => {
    const query = JSON.parse(sessionStorage.getItem('query'));
    sessionStorage.setItem(val, val);
    if (key === 'meetingMinutes') {
      key = 'meetingMinutes/add';
    }

    router.push(
      `/project/info/${key}?code=${query.code}&id=${query.id}&project_code=${
        query.project_code
      }&project_name=${query.project_name}&project_code_ext=${query.project_code_ext}&statusCode=${
        query.statusCode
      }&verson=${query.verson}`
    );
  };
}

export default ProjectHeader;
