/*
 * @Author: zqm 
 * @Date: 2021-04-29 17:47:52 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-10 16:21:37
 * 公有文章库列表
 */
import React, { Component } from 'react';
import { Modal, Radio, Input, Spin, Button } from 'antd';
import { connect } from 'dva';
import styles from './ArticleLibrary.less';
const { Search } = Input;

@connect(({ ArticleLibrary, loading }) => ({
  ArticleLibrary,
  Loading: loading.effects['ArticleLibrary/getPublicArticleDetailModel'],
}))
class ArticlePreviewModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioval: 'wechat',
    };
  }
  componentDidMount() {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'ArticleLibrary/getPublicArticleDetailModel',
      payload: { articleUid: record.articleUid },
    });
  }

  render() {
    const { radioval } = this.state;
    const {
      Loading,
      ArticleLibrary: { publicListDetail },
    } = this.props;
    console.log('====================================');
    console.log(publicListDetail);
    console.log('====================================');
    return (
      <Modal
        title="文章预览"
        visible={this.props.visible}
        onOk={() => this.handleOk()}
        onCancel={() => this.props.handleCancel()}
        width={800}
        footer={null}
      >
        <div style={{ minHeight: 500, textAlign: 'center' }}>
          <Radio.Group
            value={radioval}
            onChange={e => this.setState({ radioval: e.target.value })}
            style={{ margin: '-20px 0 20px 0' }}
          >
            <Radio.Button value="wechat" style={{ width: 100 }}>
              小程序
            </Radio.Button>
            <Radio.Button value="web" style={{ width: 100 }}>
              网站
            </Radio.Button>
          </Radio.Group>
          <Spin tip="加载中..." delay={100} spinning={Loading}>
            <div
              className={styles.previerArticle}
              style={{
                width: radioval === 'wechat' ? 360 : '100%',
              }}
              dangerouslySetInnerHTML={{
                __html: publicListDetail.articleContent,
              }}
            />
          </Spin>
          <Button type="primary" style={{ margin: '30px auto 0' }}>
            使用文章
          </Button>
        </div>
      </Modal>
    );
  }
  handleOk = () => {
    this.props.handleOk();
  };
}

export default ArticlePreviewModel;
