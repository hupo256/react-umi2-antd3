/*
 * @Author: zqm 
 * @Date: 2021-02-20 10:22:25 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-02-20 18:05:09
 * 动态列表
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Radio, Pagination, Button, Icon, Empty, message } from 'antd';
import { paginations, getQueryUrlVal } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DynamicAdd from './DynamicAdd';
import RcViewer from 'rc-viewer';
import emptyImage from '../../../../assets/emptyImage.png';

@connect(({ SiteLibrary }) => ({ SiteLibrary }))
class DynamicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'SiteLibrary/dynamicListModel',
      payload: { gongdiUid: getQueryUrlVal('uid') },
    });
  }

  render() {
    const { visible } = this.state;
    const {
      SiteLibrary: { dynamicList },
    } = this.props;
    console.log('====================================');
    console.log(dynamicList);
    console.log('====================================');
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Button type="primary" onClick={() => this.setState({ visible: true })}>
              <Icon type="plus" />
              创建动态
            </Button>
          </Card>
          <Card bordered={false} style={{ marginTop: 20 }}>
            {dynamicList &&
              Array.isArray(dynamicList) &&
              dynamicList.map(item => {
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
                    {item.pageList.list.map(items => {
                      return (
                        <div key={items.diaryUid}>
                          <p>
                            <Radio checked={true} />
                            {items.diaryDate}

                            <span
                              style={{ float: 'right', cursor: 'pointer' }}
                              onClick={() => {
                                this.handleDiaryShow(
                                  items.diaryUid,
                                  items.appletsShow,
                                  item.dicCode
                                );
                              }}
                            >
                              <Icon type={items.appletsShow ? 'eye-invisible' : 'eye'} />
                              {items.appletsShow ? '隐藏' : '显示'}
                            </span>
                          </p>
                          <p>{items.diaryContent}</p>
                          {items.fileList &&
                            Array.isArray(items.fileList) &&
                            items.fileList.length > 0 && (
                              <RcViewer
                                options={{ title: false }}
                                style={{ display: 'inline-block', verticalAlign: 'top' }}
                              >
                                {items.fileList.map((item, i) => {
                                  return (
                                    <img
                                      className="rcviewer"
                                      style={{ width: 102, height: 102 }}
                                      key={i}
                                      src={item.fileUrl}
                                    />
                                  );
                                })}
                              </RcViewer>
                            )}
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
        </PageHeaderWrapper>

        {visible && (
          <DynamicAdd
            record={{ gongdiUid: getQueryUrlVal('uid') }}
            visible={visible}
            handleOk={() => this.handleOk()}
            handleCancel={() => this.handleCancel()}
          />
        )}
      </div>
    );
  }
  // 分页
  handlePagination = (page, pageSize, dicCode) => {
    console.log('====================================');
    console.log(page);
    console.log(pageSize);
    console.log(dicCode);
    console.log('====================================');
    // pageDynamicModel
    const { dispatch } = this.props;
    dispatch({
      type: 'SiteLibrary/pageDynamicModel',
      payload: {
        gongdiUid: getQueryUrlVal('uid'),
        gongdiStage: dicCode,
        pageNum: page,
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
    dispatch({
      type: 'SiteLibrary/dynamicListModel',
      payload: { gongdiUid: getQueryUrlVal('uid') },
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
}

export default DynamicList;
