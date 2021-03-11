import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import styles from './index.less';
@connect(({ users }) => ({
  users,
}))
class VersionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {},
      time: 20,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/getHelpInfoModel',
      payload: {},
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({ content: res.data });
        const that = this;
        const timer = setInterval(() => {
          const time = that.state.time - 1;
          if (time < 1) {
            clearInterval(timer);
          }
          that.setState({ time });
        }, 1000);
      }
    });
  }
  render() {
    const { content, time } = this.state;
    time < 1 && this.onCancel();
    return (
      <div className={styles.versionWrap}>
        <Modal
          title="系统更新通知"
          visible={this.props.visible}
          onCancel={() => this.props.handleCancel()}
          width={900}
          footer={null}
          className={styles.preview}
          closable={false}
          maskClosable={false}
        >
          <p>
            更新时间：
            {content.update_time}
          </p>
          <div
            style={{
              height: 483,
              overflowY: 'scroll',
              overflowX: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '10px',
              boxSizing: 'border-box',
            }}
            className={styles.versionCont}
            dangerouslySetInnerHTML={{
              __html: content.content,
            }}
          />
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            {time > 0 ? (
              <Button type="primary" disabled={true}>
                {time}
                S后可关闭弹窗
              </Button>
            ) : (
              <Button type="primary" onClick={() => this.props.handleCancel()}>
                关闭
              </Button>
            )}
          </div>
        </Modal>
      </div>
    );
  }
  // 标记已读
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/closeHelpModel',
      payload: {},
    });
  };
}

export default VersionModal;
