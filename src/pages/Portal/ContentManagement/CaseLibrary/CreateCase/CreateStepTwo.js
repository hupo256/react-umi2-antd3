/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-10 13:35:08
 * 创建工地
 */
import React, { PureComponent, Fragment, Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Button, Icon, Input, message, Steps, Table, Select, Divider, Modal } from 'antd';
import Upload from '@/components/Upload/Upload';
import { DragableBodyRow } from '@/components/DragableBodyRow/DragableBodyRow';
import { getQueryUrlVal, guid, waringInfo, errorIcon } from '@/utils/utils';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from '../CaseLibrary.less';
import RcViewer from 'rc-viewer';
import UploadVR from './UploadVR';
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ CaseLibrary, DictConfig }) => ({
  CaseLibrary,
  DictConfig,
}))
@Form.create()
class CreateStepTwo extends Component {
  lock = null;
  state = {
    visible: false,
    record: null,
    records: null,
    rcviewer: null,
    DicList: [],
    disabled1: [],
    disabled2: [],
    disabled3: [],
    disabled4: [],
    uploadVRVisible: false,
    rep: false,
  };

  componentDidMount() {
    // 获取字典数据 queryDicModel
    const {
      dispatch,
      type,
      CaseLibrary: { stepTwo },
    } = this.props;
    dispatch({
      type: 'DictConfig/queryDicModel',
      payload: { dicModuleCodes: 'DM005,DM002,DM003,DM004' },
    }).then(res => {
      if (res && res.code === 200) {
        const disabled1 = res.data['DM005'].filter(item => item.status === '2');
        const disabled2 = res.data['DM002'].filter(item => item.status === '2');
        const disabled3 = res.data['DM003'].filter(item => item.status === '2');
        const disabled4 = res.data['DM004'].filter(item => item.status === '2');
        this.setState({ disabled1, disabled2, disabled3, disabled4 });
      }
    });
    if (type === 'edit') {
      this.setState({ DicList: stepTwo });
    }
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  };
  render() {
    const {
      uploadVRVisible,
      visible,
      DicList,
      record,
      disabled1,
      disabled2,
      disabled3,
      disabled4,
      rep,
      records,
    } = this.state;
    const {
      DictConfig: { dicData },
    } = this.props;
    const columns = [
      {
        title: '',
        dataIndex: 'drag',
        width: 60,
        render: (t, r) => {
          return <Icon type="drag" style={{ fontSize: 18 }} />;
        },
      },
      {
        title: '案例图片',
        dataIndex: 'path',
        width: 140,
        render: (t, r) => {
          return (
            <div className={styles.picPathwrap}>
              <img src={r.url} />
              {r.isCover && <p>封面</p>}
              <div className={styles.picmodel}>
                <span onClick={() => this.setState({ record: r, visible: true, rep: true })}>
                  更换图
                </span>
                <span
                  onClick={() => {
                    this.setState({ rcviewer: r.url });
                    const { viewer } = this.refs.viewer;
                    viewer && viewer.show();
                  }}
                >
                  预览
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: '图片描述',
        dataIndex: 'picDesc',
        width: 240,
        render: (t, r) => {
          return (
            <TextArea
              value={r.picDesc}
              rows={3}
              style={{ width: '100%' }}
              placeholder="请输入图片描述"
              onChange={e => this.handleTextChange(e, r)}
            />
          );
        },
      },
      {
        title: '空间',
        dataIndex: 'spaceDicCode',
        render: (t, r) => {
          return (
            <Select
              onChange={value => this.handleSelectChange(value, r, 'spaceDicCode')}
              value={r.spaceDicCode || []}
              style={{ width: 140 }}
              placeholder="请选择空间"
            >
              {dicData &&
                dicData['DM003'] &&
                dicData['DM003'].map(item => {
                  if (item.status === '1') {
                    return (
                      <Option value={item.code} key={item.uid}>
                        {item.name}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              {disabled3.map(item => {
                if (r.spaceDicCode && [r.spaceDicCode].includes(item.code)) {
                  return (
                    <Option disabled={true} value={item.code} key={item.uid}>
                      {item.name}
                    </Option>
                  );
                } else {
                  return null;
                }
              })}
            </Select>
          );
        },
      },
      {
        title: '颜色',
        dataIndex: 'colorDicCode',
        render: (t, r) => {
          return (
            <Select
              onChange={value => this.handleSelectChange(value, r, 'colorDicCode')}
              value={r.colorDicCode || []}
              style={{ width: 140 }}
              placeholder="请选择颜色"
            >
              {dicData &&
                dicData['DM004'] &&
                dicData['DM004'].map(item => {
                  if (item.status === '1') {
                    return (
                      <Option value={item.code} key={item.uid}>
                        {item.name}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              {disabled4.map(item => {
                if (r.colorDicCode && [r.colorDicCode].includes(item.code)) {
                  return (
                    <Option disabled={true} value={item.code} key={item.uid}>
                      {item.name}
                    </Option>
                  );
                } else {
                  return null;
                }
              })}
            </Select>
          );
        },
      },
      {
        title: '风格',
        dataIndex: 'styleDicCode',
        render: (t, r) => {
          return (
            <Select
              onChange={value => this.handleSelectChange(value, r, 'styleDicCode')}
              value={r.styleDicCode || []}
              onDropdownVisibleChange={open => this.onDropdownVisibleChange(open, r)}
              style={{ width: 220 }}
              open={records && records.guid === r.guid && this.state.open}
              placeholder="请选择风格"
              dropdownRender={menu => {
                return (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div
                      style={{ padding: '4px 8px', cursor: 'pointer' }}
                      onMouseDown={this.lockClose}
                      onMouseUp={this.lockClose}
                    >
                      <Input
                        onChange={e => {
                          this.setState({ name: e.target.value });
                        }}
                        placeholder="请输入选项"
                        style={{ width: '55%', marginBottom: 6 }}
                      />
                      <span
                        style={{ color: '#fe6a30', marginLeft: 10 }}
                        onClick={() => this.handleAddDic(r)}
                      >
                        <Icon type="plus-circle" />
                        添加选项
                      </span>
                    </div>
                  </div>
                );
              }}
            >
              {dicData &&
                dicData['DM002'] &&
                dicData['DM002'].map(item => {
                  if (item.status === '1') {
                    return (
                      <Option value={item.code} key={item.uid}>
                        {item.name}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              {disabled2.map(item => {
                if (r.styleDicCode && [r.styleDicCode].includes(item.code)) {
                  return (
                    <Option disabled={true} value={item.code} key={item.uid}>
                      {item.name}
                    </Option>
                  );
                } else {
                  return null;
                }
              })}
            </Select>
          );
        },
      },
      {
        title: '类目',
        dataIndex: 'categoryDicCode',
        render: (t, r) => {
          return (
            <Select
              onChange={value => this.handleSelectChange(value, r, 'categoryDicCode')}
              value={r.categoryDicCode || []}
              style={{ width: 140 }}
              placeholder="请选择类目"
            >
              {dicData &&
                dicData['DM005'] &&
                dicData['DM005'].map(item => {
                  if (item.status === '1') {
                    return (
                      <Option value={item.code} key={item.uid}>
                        {item.name}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              {disabled1.map(item => {
                if (r.categoryDicCode && [r.categoryDicCode].includes(item.code)) {
                  return (
                    <Option disabled={true} value={item.code} key={item.uid}>
                      {item.name}
                    </Option>
                  );
                } else {
                  return null;
                }
              })}
            </Select>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 150,
        render: (t, r) => {
          return (
            <div className="operateWrap">
              {!r.isCover && (
                <span className="operateBtn" onClick={() => this.handleDelete(r)}>
                  删除
                </span>
              )}
              {!r.isCover && <span className="operateLine" />}
              {!r.isCover && (
                <span className="operateBtn" onClick={() => this.handleSetPivData(r)}>
                  设为封面
                </span>
              )}
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <p>
          <Button
            type="primary"
            onClick={() => {
              if (DicList.length == 20) {
                message.error('无法上传，最多支持上传20张图片');
              } else {
                this.setState({ visible: true });
              }
            }}
            style={{ marginRight: 16 }}
          >
            <Icon type="plus" />
            上传案例图片
          </Button>
          <Button type="primary" style={{ display: 'none' }} onClick={() => this.handleUploadVR()}>
            <Icon type="plus" />
            上传VR效果图
          </Button>
        </p>

        <DndProvider backend={HTML5Backend}>
          <Table
            columns={columns}
            dataSource={DicList}
            rowKey={record => record.uid}
            components={this.components}
            onRow={(record, index) => {
              return {
                index,
                moveRow: this.moveRow,
              };
            }}
            pagination={false}
          />
        </DndProvider>

        <div
          className="globalFotterStyle"
          style={{ paddingLeft: sessionStorage.collapsed == 'false' ? '256px' : '80px' }}
        >
          <Button type="primary" onClick={() => this.handleOk()} loading={false}>
            {this.props.type === 'edit' ? '保存' : '提交'}
          </Button>
          {this.props.type === 'add' && (
            <Button onClick={() => this.handleBackStep()} style={{ marginLeft: '8px' }}>
              上一步
            </Button>
          )}
        </div>

        {visible && (
          <Upload
            visible={visible}
            selectNum={record ? 1 : 20}
            selected={DicList.length}
            rep={rep}
            handleOk={data => this.handleUploadOk(data)}
            handleCancel={() => this.handleUploadCancel()}
          />
        )}
        <RcViewer
          ref="viewer"
          options={{ title: false }}
          style={{
            display: 'none',
            verticalAlign: 'top',
            maxWidth: 300,
            wordWrap: 'break-word',
          }}
        >
          <img src={this.state.rcviewer} />
        </RcViewer>
        {uploadVRVisible && (
          <UploadVR
            type={this.props.type}
            visible={uploadVRVisible}
            handleCancel={() => this.setState({ uploadVRVisible: false })}
          />
        )}
      </div>
    );
  }
  // 上传VR效果图
  handleUploadVR = () => {
    this.setState({ uploadVRVisible: true });
  };
  // 返回上一页
  handleBackStep = () => {
    const that = this;
    confirm({
      title: '确认要返回上一页吗？',
      content: '当前页面的信息不会保存，如返回上一页，则会丢失当前操作内容',
      icon: waringInfo,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        that.props.handleBackStep();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  handleSubmit = e => {
    this.props.handleOk();
  };
  // 提交
  handleOk = () => {
    const { DicList } = this.state;
    const {
      dispatch,
      CaseLibrary: { stepOne },
    } = this.props;
    if (DicList.length == 0) {
      message.info('请先上传案例图片');
    } else {
      if (this.props.type === 'edit') {
        dispatch({
          type: 'CaseLibrary/updateCasePicModel',
          payload: { caseUid: getQueryUrlVal('uid'), casePics: DicList },
        }).then(res => {
          if (res && res.code === 200) {
            message.success('保存成功');
          }
        });
      } else {
        dispatch({
          type: 'CaseLibrary/createCaseModel',
          payload: { ...stepOne, picList: DicList },
        }).then(res => {
          if (res && res.code === 200) {
            this.props.handleOk();
          }
        });
      }
    }
    //
  };
  // 拖拽排序
  moveRow = (dragIndex, hoverIndex) => {
    const { DicList } = this.state;
    let data = [...DicList];
    const dragRow = data[dragIndex];
    const hoverRow = data[hoverIndex];
    data[dragIndex] = hoverRow;
    data[hoverIndex] = dragRow;
    this.setState({ DicList: data });
  };

  // 图片选择cance
  handleUploadCancel = () => {
    this.setState({ visible: false, record: null, rep: false });
  };
  // 图片选择
  handleUploadOk = data => {
    const { DicList, record } = this.state;
    const {
      dispatch,
      CaseLibrary: { stepOne },
    } = this.props;
    if (record) {
      // 编辑
      const newDicList = DicList.map(item => {
        if (item.guid === record.guid) {
          item.path = data[0].path;
          item.url = data[0].path;
          item.addr = data[0].path;
        }
        return item;
      });
      this.setState({ DicList: newDicList });
      this.handleUploadCancel();
    } else {
      // 新增
      const newData = data.map(item => {
        item.isCover = false;
        item.isVr = false;
        item.picDesc = null;
        item.categoryDicCode = null;
        item.colorDicCode = null;
        item.spaceDicCode = null;
        item.styleDicCode = stepOne.styleDicCode;
        item.url = item.path;
        item.guid = guid();
        return item;
      });
      this.setState({ DicList: [...DicList, ...newData] });
      this.handleUploadCancel();
    }
  };

  // 图片描述
  handleTextChange = (e, r) => {
    const { DicList } = this.state;
    if (e.target.value.length > 200) {
      message.error('图片描述最多输入200位字符');
    } else {
      let newDicList = DicList.map(item => {
        if (item.guid === r.guid) {
          item.picDesc = e.target.value;
        }
        return item;
      });
      this.setState({ DicList: newDicList });
    }
  };
  // 字典下拉选择
  handleSelectChange = (val, r, name) => {
    // this.setState({ record: r });
    const { DicList } = this.state;
    let newDicList = DicList.map(item => {
      if (item.guid === r.guid) {
        item[name] = val;
      }
      return item;
    });
    this.setState({ DicList: newDicList });
  };
  // 设置封面
  handleSetPivData = r => {
    const { DicList } = this.state;
    let newDicList = DicList.map(item => {
      if (item.guid === r.guid) {
        item.isCover = true;
      } else {
        item.isCover = false;
      }
      return item;
    });
    this.setState({ DicList: newDicList });
  };
  // 删除
  handleDelete = r => {
    if (r.isCover) {
      message.error('当前案例图片为封面不能删除');
    } else {
      let { DicList } = this.state;
      const that = this;
      confirm({
        title: '确认要删除当前案例图片吗？',
        content: '删除后，将无法在案例详情中看到当前案例图片，并有可能导致无法精准搜索出当前案例',
        icon: errorIcon,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const newList = DicList.filter(item => item.guid !== r.guid);
          that.setState({ DicList: newList }, () => {
            message.success('删除成功');
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };

  onDropdownVisibleChange = (open, records) => {
    this.setState({ records });
    if (this.lock) return;
    this.setState({ open });
  };
  lockClose = e => {
    clearTimeout(this.lock);
    this.lock = setTimeout(() => {
      this.lock = null;
    }, 100);
  };
  // 添加字典
  handleAddDic = record => {
    const { name } = this.state;
    const { dispatch } = this.props;
    if (!name) {
      message.info('请输入风格名称');
      return false;
    } else if (name && name.trim().length == 0) {
      message.info('请输入风格名称');
      return false;
    } else if (name && name.length > 20) {
      message.info('最多输入20位字符');
      return false;
    } else {
      dispatch({
        type: 'DictConfig/createDicModel',
        payload: { name, dicModuleCode: 'DM002' },
      }).then(res => {
        if (res && res.code === 200) {
          // 获取字典数据 queryDicModel
          dispatch({
            type: 'DictConfig/queryDicModel',
            payload: { dicModuleCodes: 'DM001,DM002,DM003,DM004' },
          });
          // 设置选择值
          this.handleSelectChange(res.data.code, record, 'styleDicCode');
          this.setState({ open: false });
        }
      });
    }
  };
}

export default CreateStepTwo;
