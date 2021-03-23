/*
 * @Author: zqm 
 * @Date: 2021-02-23 18:59:56 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-23 18:29:46
 * 图片上传
 */
import React, { Component } from 'react';
import { Modal, Button, Tabs, Icon } from 'antd';
import styles from './Upload.less';
import AlreadyUpload from './AlreadyUpload';
import ImageUpload from './ImageUpload';
const { TabPane } = Tabs;

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'key1',
      checkedData: [],
    };
  }
  componentDidMount() {}
  render() {
    const { activeKey, checkedData } = this.state;
    const { selected, selectNum, rep } = this.props;
    const num = rep ? 1 : (selectNum || 1) - (selected || 0);
    return (
      <Modal
        title={`上传图片  ${checkedData.length}/${num}`}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.handleCancel}
        footer={null}
        maskClosable={false}
        width={710}
        className={styles.uploadmodel}
      >
        <div className={styles.uploadwrap}>
          <div className={styles.uploadleft}>
            <Tabs
              tabPosition="left"
              className={styles.dictTabs}
              activeKey={activeKey}
              onChange={activeKey => this.handleChangeTab(activeKey)}
            >
              <TabPane
                tab={
                  <p style={{ margin: 0 }}>
                    <Icon type="cloud-upload" />
                    上传新图片
                  </p>
                }
                key="key1"
              />
              {/*<TabPane
                tab={
                  <p style={{ margin: 0 }}>
                    <Icon type="folder-open" />
                    已上传
                  </p>
                }
                key="key2"
              />*/}
              </Tabs>
          </div>
          <div className={styles.uploadright}>
            {activeKey === 'key1' && (
              <ImageUpload size={this.props.size} selectNum={num } handleOk={data => this.handleConfirm(data)} />
            )}
            {activeKey === 'key2' && (
              <AlreadyUpload selectNum={num || 1} handleOk={data => this.handleConfirm(data)} />
            )}
            <div className={styles.fotter}>
              <Button onClick={() => this.handleOk()} type="primary" style={{ marginRight: 10 }}>
                确认
              </Button>
              <Button onClick={this.props.handleCancel}>取消</Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
  // 字段模块切换
  handleChangeTab = activeKey => {
    this.setState({ activeKey, checkedData: [] });
  };

  handleConfirm = checkedData => {
    this.setState({ checkedData });
  };

  // 确认
  handleOk = () => {
    const { activeKey, checkedData } = this.state;
    if (activeKey === 'key2') {
      this.props.handleOk(checkedData);
    } else {
      const data = checkedData.map(item => {
        item.path = item.addr;
        item.url = item.addr;
        return item;
      });
      this.props.handleOk(data);
    }
  };
}

export default Upload;
