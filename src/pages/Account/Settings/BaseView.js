import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Empty, Row, Col, Table } from 'antd';
import RcViewer from 'rc-viewer';
import { getQueryUrlVal } from '@/utils/utils';

@connect(({ ProjectManage, loading }) => ({
  ProjectManage, //
  Loading: loading.effects['ProjectManage/queryDesignFilesModel'],
}))
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ProjectManage/queryDesignFilesModel',
      payload: { projectUid: getQueryUrlVal('uid') },
    });
  }

  render() {
    const {
      Loading,
      ProjectManage: { DesignFiles },
    } = this.props;

    return (
      <div>
        <Card bordered={false}>
          <div>
            <p className={styles.projectAddTitle}>设计效果图</p>
            <div className={styles.designCont}>
              <div className={styles.designContLeft}>图片：</div>
              <div className={styles.designContRight}>
                {DesignFiles &&
                Array.isArray(DesignFiles.designPicFiles) &&
                DesignFiles.designPicFiles.length > 0 ? (
                  <RcViewer
                    options={{ title: false }}
                    style={{ display: 'inline-block', verticalAlign: 'top' }}
                  >
                    {DesignFiles.designPicFiles.map((item, i) => {
                      return (
                        <img
                          className="rcviewer"
                          style={{ width: 102, height: 102 }}
                          key={i}
                          src={item.path}
                        />
                      );
                    })}
                  </RcViewer>
                ) : (
                  <Empty
                    image={empty}
                    imageStyle={{
                      height: 130,
                    }}
                    description={<span>暂无图片</span>}
                  />
                )}
              </div>
            </div>
            <div className={styles.designCont}>
              <div className={styles.designContLeft}>文件：</div>
              <div className={styles.designContRight}>
                {DesignFiles &&
                Array.isArray(DesignFiles.designFiles) &&
                DesignFiles.designFiles.length > 0 ? (
                  DesignFiles.designFiles.map(item => {
                    return (
                      <p key={item.path}>
                        {item.name}
                        <a onClick={() => this.handleFileReview(item)}>在线预览</a>
                      </p>
                    );
                  })
                ) : (
                  <Empty
                    image={empty}
                    imageStyle={{
                      height: 130,
                    }}
                    description={<span>暂无文件</span>}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <p className={styles.projectAddTitle}>竣工交付图</p>
            {DesignFiles &&
            Array.isArray(DesignFiles.completeFiles) &&
            DesignFiles.completeFiles.length > 0 ? (
              <RcViewer
                options={{ title: false }}
                style={{ display: 'inline-block', verticalAlign: 'top' }}
              >
                {DesignFiles.completeFiles.map((item, i) => {
                  return (
                    <img
                      className="rcviewer"
                      style={{ width: 102, height: 102 }}
                      key={i}
                      src={item.path}
                    />
                  );
                })}
              </RcViewer>
            ) : (
              <Empty
                image={empty}
                imageStyle={{
                  height: 130,
                }}
                description={<span>暂无图片</span>}
              />
            )}
          </div>
        </Card>
      </div>
    );
  }
}

export default BaseView;
