import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Button, Table, Modal, Divider, Icon, Popover, message, Tooltip } from 'antd'
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import styles from './index.less'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateEdit from './components/CreateEdit'
import SelectSite from './components/SelectSite'
import { getList, sortApi, toggleStatusApi } from '@/services/channelManage'

const { confirm } = Modal;

let dragingIndex = -1;



class BodyRow extends Component {
    render() {
      const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
      const style = { ...restProps.style, cursor: 'move' };
  
      let { className } = restProps;
      let className2
      if (isOver) {
        if (restProps.index > dragingIndex) {
            className2 = styles['drop-over-downward']
        }
        if (restProps.index < dragingIndex) {
            className2 = styles['drop-over-upward']
        }
      }

      return connectDragSource(
        connectDropTarget(<tr {...restProps} className={`${className} ${className2}`} style={style} />),
      );
    }
  }
const rowSource = {
    beginDrag(props) {
      dragingIndex = props.index;
      return {
        index: props.index,
      };
    },
  };
  
  const rowTarget = {
    drop(props, monitor) {
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;
      if (dragIndex === hoverIndex) {
        return;
      }
      props.moveRow(dragIndex, hoverIndex);
      monitor.getItem().index = hoverIndex;
    },
  };
  

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }))(
    DragSource('row', rowSource, connect => ({
      connectDragSource: connect.dragSource(),
    }))(BodyRow),
  );

@connect(state => ({
    ...state.channelManage
}))

export default class ChannelManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pageNum: 1,
            // recordTotal: 0,
            maxLength: 20,
            data: null,
            pageSize: 20
        }
    }

    async componentDidMount() {
        this.getList()
    }

    async componentDidUpdate(prevProps) {
        const { pageNum } = this.state;
        if (prevProps.showCreateEdit !== this.props.showCreateEdit && !this.props.showCreateEdit  ) {
            this.getList({pageNum})
        }
    }

    /**
     * @description: 请求列表数据
     * @param {*}
     * @return {*}
     */    
    // 请求数据
    getList = async ({pageNum = 1, pageSize=20, keyword='' }={}) => {
        const res = await getList({keyword, pageNum, pageSize})
        this.setState({
            list: res?.data?.list,
            // recordTotal: res?.data?.recordTotal,
            pageNum: res?.data?.curPage,
        })
    }

    moveRow = async (dragIndex, hoverIndex, record) => {
        
        
        const { list, pageNum, pageSize } = this.state;
        const { dispatch } = this.props;
        const dragRow = list[dragIndex];
        if (list[dragIndex].isIndex === 1) {
            message.warning('首页不支持排序！')
            return
        }
        if (hoverIndex < 1 && list[0].isIndex === 1 ) {
            message.warning('不可排于首页之前！')
            return
        }
        try {
            const res = await sortApi({
                uid: list[dragIndex].uid,
                seq: (pageNum - 1) * pageSize + hoverIndex + 1
            })
            if (res?.code === 200) {
                message.success('排序成功')
                this.setState(
                    update(this.state, {
                      list: {
                        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                      },
                    }),
                  );
            } else {
                message.warning('排序失败，请稍后重试')
            }
        } catch (error) {
            message.error('请求失败，请稍后重试')
        }
        
        
      };
    /**
     * @description: 切换面板展示隐藏
     * @param typeString {string}  要切换的面板
     * @return {*}
     */
    toggleShow = () => {
        const { maxLength, list } = this.state;
        const { dispatch, showCreateEdit } = this.props;
        // 超过20条禁止再创建
        if ( list.length >= maxLength && !showCreateEdit) {
            message.warning(`最多支持创建${maxLength}条频道！`);
            return;
        }
        dispatch({
            type: 'channelManage/save',
            payload: {
                showCreateEdit: !showCreateEdit,
                currentEditUid: '',
                isCreate: true, 
                selectDetailData: []
            }
        }) 
        
    }
    /**
     * @description: 启用停用展示
     * @param {*}
     * @return {*}
     */
    showConfirmHandle = (record) => {
        confirm({
            title: `确定要${record.status === 2 ? '启' : '停'}用当前频道吗?`,
            content: record.status === 2 ? '启用后，将可以在装企小程序和网站中显示' : '停用后，在装企小程序和网站中均不会显示当前频道',
            icon: record.status === 2 ? <Icon style={{color: '#52c41a'}} theme='filled'  type="check-circle" /> :  "question-circle",
            cancelText: '取消',
            okText: '确定',
            onOk: async () => {
                try {
                    const res = await toggleStatusApi({
                        uid: record.uid,
                        status: record.status === 2 ? '1' : '2'
                    })
                    if ( res?.code === 200 ){
                        this.getList();
                        message.success('操作成功')
                    } else {
                        message.warning('操作失败')
                    }
                } catch (error) {
                    message.error('请求失败')
                }
                
            },
        });
    }

    /**
     * @description: 编辑弹框
     * @param {*}
     * @return {*}
     */
    editHandle = uid => {
        const { dispatch } = this.props;
        dispatch({
            type: 'channelManage/save',
            payload: {
                isCreate: false,
                currentEditUid: uid,
                showCreateEdit: true
            }
        })
    }

    pageNumChange = pageNum => {
        this.setState({
            pageNum
        })
        this.getList({pageNum})
    }

    render() {
        const { isShow, list, pageNum, recordTotal, pageSize } = this.state;
        const { isOver, connectDragSource, connectDropTarget, moveRow, showCreateEdit,  isCreate, currentDetailType, isPcPreview } = this.props;
        const appTip = <img width='160'  src={require('@/assets/wechartNav.png')} alt="" srcset=""/>
        const webTip = <img height='50' src={require('@/assets/pcNav.png')} alt="" srcset=""/>


        let columns = [
            {
                dataIndex: 'icon',
                width: 60,
                align: 'center',
                key: 'icon', 
                render: (text, record) => record.isIndex === 0 && <Icon type="fullscreen" rotate={45} style={{fontSize: 20}} />
            },
            {
                title: <div ref='weChartDom'>
                            <span>小程序频道名称</span>
                            {!!!isPcPreview &&
                            <Popover content={appTip} forceRender={true}>
                                <Icon type="question-circle" className={styles['table-header-icon']} />
                            </Popover>}
                            
                        </div>,
                dataIndex: 'appletsName',
                key: 'appletsName',   
            },
            {
                title: <div>
                            <span>网站频道名称</span>
                            {!!!isPcPreview &&
                            <Popover content={webTip} forceRender={true}>
                                <Icon type="question-circle" className={styles['table-header-icon']} />
                            </Popover>}

                        </div>,
                key: 'websiteName',
                dataIndex: 'websiteName',
            },
            {
                title: '链接',
                key: 'linkDisplayName',   
                dataIndex: 'linkDisplayName',
                render: (text, record) =>
                    <Tooltip placement="topLeft" title={text}>
                        <div style={{maxWidth: 180, overflow:'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{text}</div>
                    </Tooltip>     
            },
            {
                title: '是否小程序可用',
                key: 'is_applets',
                dataIndex: 'is_applets',
                render: (text, record) => text === 0 ? '否' : '是'
            },
            {
                title: '是否网站可用',
                key: 'is_website',
                dataIndex: 'is_website',
                render: (text, record) => text === 0 ? '否' : '是'
            },
            {
                title: '状态',
                key: 'status',
                dataIndex: 'status',
                render: text => {
                    return (
                        <div className={styles['table-header-status-div']}> 
                            <i className={`${styles['table-header-status-icon']} 
                            ${text === 1 ? styles['table-header-status-icon-1'] : styles['table-header-status-icon-2'] }`} />
                            <span style={{marginLeft: 8}}>{text === 1 ? '正常' : '停用'}</span>
                        </div>
                    )
                }

            },
            {
                title: '更新时间',
                key: 'updateTime',
                dataIndex: 'updateTime',
                render: (text, record) => {
                    return (
                        <div>
                            <div>{text}</div>
                            <div>{record.operator}</div>
                        </div>
                    )
                }   
            },
            {
                title: <span style={{padding: '0 15px'}}>操作</span> ,
                key: 'modify',
                render: (text, record) => {
                    if (record?.isIndex === 0) {
                        return (
                            <div>
                                <Button type='link' onClick={() => this.editHandle(record.uid)}>编辑</Button>
                                <Divider type='vertical' style={{background: '#ff8e59', margin: 0 }} />
                                <Button type='link' onClick={() => this.showConfirmHandle(record)}>{record.status === 2 ? '启用' : '停用'}</Button>
                            </div>
                        )
                    }
                    
                }       
            },
        ];
        if (isPcPreview) {
            columns.splice(5 , 1);
        }
        const components = {
            body: {
              row: DragableBodyRow,
            },
        };
        
        return (
            <PageHeaderWrapper>
                <div>
                    <Card>
                        <Button type='primary' icon="plus" onClick={this.toggleShow}>创建频道</Button>
                        <div style={{marginTop: 16}}>
                            <DndProvider backend={HTML5Backend}>
                                <Table
                                    columns={columns}
                                    id={styles.componentsTableSorting}
                                    dataSource={list}
                                    components={components}
                                    rowKey={record => record.uid}
                                    onRow={(record, index) => ({
                                        index,
                                        moveRow:  this.moveRow 
                                    })}
                                    pagination={{
                                        // current: pageNum,
                                        // total: recordTotal,
                                        pageSize: 20,
                                        hideOnSinglePage: true,
                                        // onChange: this.pageNumChange
                                    }}
                                />
                            </DndProvider>
                        </div>
                        
                    </Card>
                    <Modal
                        title={`${isCreate? '创建' : '编辑'}频道`}
                        width='750px'
                        footer={null}
                        visible={ showCreateEdit }
                        onCancel={this.toggleShow}
                    >
                        <CreateEdit />
                    </Modal>
                    {/* <Modal
                        title={`选择${DETAIL_TYPE_MAP[currentDetailType]}`}
                        width='800px'
                        footer={null}
                        visible={ currentDetailType !== 0 }
                        onOk={this.handleOk}
                        onCancel={() => {this.toggleShow('selectSite')}}
                    >
                        <SelectSite />
                    </Modal> */}
                </div>
            </PageHeaderWrapper>          
        )
    }
}