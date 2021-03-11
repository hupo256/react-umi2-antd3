import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Alert, Pagination, Button, Row, Col } from 'antd';
import styles from './Center.less';
import router from 'umi/router';
@connect(({ users, loading }) => ({
  users,
  loading: loading.effects['users/helpquery'],
}))
class Center extends PureComponent {
  state = {
    pageNum: 1,
  };

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'users/helpquery',
    //   payload: {
    //     pageNum: this.state.pageNum,
    //   },
    // }).then(() => {
    //   dispatch({
    //     type: 'users/getcurrentuser',
    //   });
    // });
  }
  paginationChange = (pagination, filters, sorter) => {
    this.setState(
      {
        pageNum: pagination,
      },
      () => {
        this.props.dispatch({
          type: 'users/helpquery',
          payload: {
            pageNum: this.state.pageNum,
          },
        });
      }
    );
  };
  loadVersion = list => {
    let item = list[0].tAttachment;
    const aLink = document.createElement('a');
    let url = item.path;
    let index = url.lastIndexOf('/');
    let str = url.substring(0, index + 1); //url
    let stg = url.substring(index + 1, url.length); //文件名称
    let indexs = stg.lastIndexOf('.');
    let sur = stg.substring(0, indexs);
    let suh = stg.substring(indexs, stg.length);
    let addr = `${encodeURI(str)}${encodeURIComponent(sur)}${suh}`;
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = addr;
    aLink.download = item.file_name;
    aLink.click();
    document.body.removeChild(aLink);
  };

  render() {
    const {
      users: { helpTable },
      loading,
    } = this.props;
    return (
      <Card loading={loading}>
        <div className={styles.userCenter}>
          <h4>
            <Row>
              <Col span={12}>更新记录</Col>
              <Col span={12}>
                <div style={{ textAlign: 'right' }}>
                  <Button
                    onClick={() => {
                      router.goBack();
                    }}
                  >
                    返回
                  </Button>
                </div>
              </Col>
            </Row>
          </h4>
          {!_.isEmpty(helpTable.list) ? (
            <h5>
              <div>
                <span>温馨提示：</span>
                <span>
                  使用中若存在显示问题，可先用谷歌浏览器查试，下载地址：
                  <a href="https://www.google.cn/chrome" style={{ color: '#1890FF' }}>
                    https://www.google.cn/chrome
                  </a>
                </span>
              </div>
              {/* <Button
                type="primary"
                onClick={() => {
                  this.loadVersion(helpTable.list);
                }}
              >
                下载
              </Button> */}
            </h5>
          ) : null}
        </div>
        {!_.isEmpty(helpTable.list) ? (
          helpTable.list.map((item, index) => {
            return (
              <div key={index} className={styles.help}>
                <div className={styles.helptop}>
                  <h3>{item.version_name}</h3>
                  {/* <button className={styles.loadBtn} onClick={()=>{this.loadVersion(item.tAttachment)}}>下载</button> */}
                </div>
                <div className={styles.helptime}>
                  <div>更新时间：</div>
                  <div>{item.create_time}</div>
                </div>
                <div className={styles.helpcon}>
                  <div style={{ marginBottom: 10 }}>更新内容：</div>
                  <div
                    className={styles.helpCont}
                    dangerouslySetInnerHTML={{
                      __html: item.content.replace(/(\r\n)|(\n)/g, '<br/>'),
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <Alert message="没有任何数据" type="warning" showIcon />
        )}
        <Pagination
          hideOnSinglePage={true}
          pageSize={10}
          current={helpTable.curPage}
          total={helpTable.recordTotal}
          onChange={this.paginationChange}
        />
      </Card>
    );
  }
}

export default Center;
