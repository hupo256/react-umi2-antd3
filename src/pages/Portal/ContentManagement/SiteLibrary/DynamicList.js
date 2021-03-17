/*
 * @Author: zqm 
 * @Date: 2021-02-20 10:22:25 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-16 16:26:12
 * 动态列表
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Radio, Pagination, Button, Icon, Modal, message } from 'antd';
import { paginations, getQueryUrlVal , successIcon, waringInfo} from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DynamicAdd from './DynamicAdd';
import RcViewer from 'rc-viewer';
import emptyImage from '../../../../assets/emptyImage.png';

const { confirm } = Modal;
@connect(({ SiteLibrary }) => ({ SiteLibrary }))
class DynamicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      status:null
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.setState({status:getQueryUrlVal('status')})
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
    return (
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Button type="primary" onClick={() => this.setState({ visible: true })}>
              <Icon type="plus" />
              创建动态
            </Button>
          </Card>
          {dynamicList &&
            Array.isArray(dynamicList) &&
            dynamicList.length > 0 && (
              <Card bordered={false} style={{ marginTop: 20 }}>
                {dynamicList.map(item => {
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
                                  this.handleChangeStatus(items,item)
                                 
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
            )}
        </PageHeaderWrapper>

        {visible && (
          <DynamicAdd
            record={{ gongdiUid: getQueryUrlVal('uid') }}
            visible={visible}
            status={this.state.status}
            handleOk={() => this.handleOk()}
            handleCancel={() => this.handleCancel()}
          />
        )}
      </div>
    );
  }
  // 分页
  handlePagination = (page, pageSize, dicCode) => {
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
        message.success('操作成功')
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

    // 切换状态
    handleChangeStatus = (r,item)=> {
      const status = r.appletsShow;
      const { dispatch } = this.props;
      const that = this;
      confirm({
        title: status ? '确认要隐藏当前动态吗？' : '确认要显示当前动态吗？',
        content:
          status ? '隐藏后，将无法在工地详情中显示当前动态！'
            : '显示后，将会在工地详情中显示当前动态！',
        icon: !status ? successIcon : waringInfo,
        onOk() {
          that.handleDiaryShow(
              r.diaryUid,
              r.appletsShow,
              item.dicCode
            );
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
}

export default DynamicList;
