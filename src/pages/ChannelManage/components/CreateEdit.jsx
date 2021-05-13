import React, { Component } from 'react'
import { connect } from 'dva'
import { createChannel, getRelatedPage, getDetailApi, editChannelApi,
         siteListApi, designerListApi, caseListApi, articleListApi, articleDicApi  } from '@/services/channelManage'
import { Form, Input, Select, Button, Cascader, message, Tabs, Table, Radio, Tag  } from 'antd'
import styles from '../index.less'


const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs
const { Search } = Input;
@connect(state => ({
    ...state.channelManage
}))
@Form.create()
export default class CreateEdit extends Component {
    constructor(props){
        super(props)
        this.state ={
            relatedPageOption: [],
            currentSelectRelatedPageOpt: [],
            currentKey: '0',
            detailUid: undefined,
            modifyPaths: [],
            recordTotal: 0,
            detailType: 0,
            dataList: [],
            articleDicOpts: [],
            currentarticleDicCode: undefined,
            searchText: '',
            pageNum: 1,
            pageSize: 10,
            showSelectPanl: false,
            btnLoading: false

        }
    }
    async componentDidMount() {
        const { isCreate, currentEditUid } = this.props;
        if (!isCreate) {
            this.getDetail(currentEditUid)
        }
        const res = await getRelatedPage({sceneType: 1});
        this.setState({
            relatedPageOption: this.format(res?.data) 
        })
    }

    async componentDidUpdate( prevProps ) {
        const { form, isCreate } = this.props;

        // 编辑回填默认数据
        if ( this.props.currentEditUid && this.props.showCreateEdit !== prevProps.showCreateEdit &&  this.props.showCreateEdit) {
            this.getDetail(this.props.currentEditUid)
        }

        // 关闭重置表单组件数据
        if (  this.props.showCreateEdit !== prevProps.showCreateEdit  ) {
            form.resetFields()
        }

    }

/**
 * @description: 获取频道详情 
 * @param {*}
 * @return {*}
 */    
    getDetail = async uid => {
        const { form } = this.props;
        if (!uid) return;
        const res = await getDetailApi({ uid });
        this.setState({
            detailUid: res.data.detailUid,
            modifyPaths: res.data.paths
        })
        form.setFieldsValue({
            ...res?.data,
            relatedPage: res?.data?.linkDisplayName
        })
    }

    /**
     * @description: 解构重组后台数据
     * @param {*}
     * @return {*}
     */    
    format = data => {
        if (!Array.isArray(data)) return;
        const newArr = [];
        for (const item of data) {            
            newArr.push ({
                ...item.node,
                children: item.children.length ? this.format(item.children) : []
            })
        } 
        return newArr
    }
 
    handleSubmit =  e => {
        const { form, isCreate, selectDetailData } = this.props
        const { currentSelectRelatedPageOpt, modifyPaths, detailUid } = this.state;
        // console.log({currentSelectRelatedPageOpt})
        const detailUid2 = currentSelectRelatedPageOpt[2]?.uid || currentSelectRelatedPageOpt[2]?.gongdiUid || currentSelectRelatedPageOpt[2]?.articleUid || detailUid
        let arr = this.formatData().map(item => item.code)

        if(arr.length === 3) {
            arr = arr.slice(0, arr.length - 1)
        }
        
        e.preventDefault();
        form.validateFields( (err, values) => {       
            if (err) {
              return
            }
            this.setState({
                btnLoading: true
            })
            if (isCreate) {
                let {   relatedPage, ...params } = { ...values, paths: arr, detailUid: detailUid2 }
                
                createChannel(params).then(res => {
                    if (res?.code === 200) {
                        this.resetHandle();
                        this.setState({
                            btnLoading: false
                        })
                        message.success('频道创建成功!')
                    }
                })

            
            } else {
                const { currentEditUid } = this.props;
                let {   relatedPage, ...params } = { ...values, paths: arr.length > 0 ?  arr : modifyPaths, detailUid: detailUid2, uid: currentEditUid }
                editChannelApi(params).then(res => {
                    if (res?.code === 200) {
                        this.resetHandle();
                        this.setState({
                            btnLoading: false
                        })
                        message.success('编辑已保存，发布后生效 !')
                    }
                })
            }
            

        });
    }

    /**
     * @description: 重置状态框
     * @param {*}
     * @return {*}
     */
    resetHandle = () => {
        const { dispatch, showCreateEdit, form } = this.props;
        dispatch({
            type: 'channelManage/save',
            payload: {
                showCreateEdit: !showCreateEdit,
                currentDetailType: 0,
                selectDetailData: []
            }
        }) 

    }
    /**
     * @description: 选取关联页面
     * @param {*}
     * @return {*}
     */
     onChangeHandle = async (val, opt) => {
        const { form, dispatch } = this.props;

        // 进入详情页选择
        if (opt[opt.length - 1].linkType === 2) {
            dispatch({
                type: 'channelManage/save',
                payload: {
                    selectDetailData: [],
                    currentDetailType: opt[opt.length - 1].detailType,
                }
            })

        }

    }




    // 选择关联页面
    selectedHandle =  ( item, step ) => {
        const { pageNum, searchText, currentarticleDicCode } = this.state
        this.setState(prevState => {
            let arr = prevState.currentSelectRelatedPageOpt;
            arr[+step] = item;
            return ({
                currentSelectRelatedPageOpt: arr,
                currentKey: +step + 1 + '',
                detailType: item.detailType
            })
        }, () => {
            // console.log(this.state.currentSelectRelatedPageOpt)
            this.props.form.setFieldsValue({
                relatedPage:  this.formatData().map(item => {if(item){return item.text}}).join(' / ')
            })
            if (!item.children.length && item.linkType === 1) {
                this.toggleSelectPanlHandle(false)
            }
            this.getDataList({pageNum,  searchText, articleDicCode: currentarticleDicCode});
            
        })
    }

    // tab面板切换
    tabChange = key => {
        this.setState(prevState => {
            const arr = prevState.currentSelectRelatedPageOpt.slice(0, +key)
            return {
                currentKey: key,
                currentSelectRelatedPageOpt: arr,
            }       
        }, () => {
            this.props.form.setFieldsValue({
                relatedPage: this.state.currentSelectRelatedPageOpt?.slice(0, +key).map(item => item.name).join(' / ')
            })
        })
       
    } 


    // 获取表格数据
    getDataList = async ({ status = '1', searchText='', pageNum = 1, pageSize = 10, articleDicCode='' } = {}) => {
        const { detailType } = this.state;
        let res;
        detailType === 1 && (res = await siteListApi({
            gongdiStatus: 0,
            pageNum,
            pageSize,
            searchText
        }))
        detailType === 2 && (res = await designerListApi({
            status,
            searchWord: searchText,
            pageNum,
            pageSize
        })
        )
        detailType === 3 && (res = await caseListApi({
            status,
            searchWord: searchText,
            pageNum,
            pageSize
        }));
        if (detailType === 4) {
            // 没有文章栏目时请求一次
            if (!this.state.articleDicOpts.length) {
                await this.getArticleDic();
            }   
            res = await articleListApi({
                searchText,
                articleDicCode: articleDicCode ||  this.state.currentarticleDicCode,
                pageNum,
                pageSize
            });

        }
        
        // console.log({res})
        this.setState( {
            dataList: res?.data?.list,
            recordTotal: res?.data?.recordTotal
        })
    }

     // 查询文章栏目选项
     getArticleDic = async () => {
        const res = await articleDicApi({dicModuleCodes: 'DM006'});
        if (res?.data?.DM006) {
            this.setState({
                articleDicOpts: res.data.DM006,
                currentarticleDicCode: res.data.DM006[0].code
            })
        }
        
    }

    // 文章类型切换
    radioGroupChange = e => {
        const { pageNum, searchText } = this.state
        // console.log({e: e.target.value})
        this.setState({
            currentarticleDicCode: e.target.value
        });
        
        this.getDataList({articleDicCode: e.target.value,  pageNum, searchText })

    }

    /**
     * @description: 模糊查询
     * @param {*}
     * @return {*}
     */    
     handleChange = _.debounce( value => {
        const searchText = value.length > 30 ? value.substring(0, 30) : value
        const { pageNum } = this.state
        this.getDataList({searchText, pageNum })
    }, 300)

    // 行点击事件
    rowClick = (e, record) => {
        // console.log({record})
        this.setState(prevState => {
            let arr = prevState.currentSelectRelatedPageOpt;
            arr[2] = record;
            return ({
                currentSelectRelatedPageOpt: arr,
                currentKey: 2,
            })
        }, () => {
        
            this.props.form.setFieldsValue({
                relatedPage:  this.formatData().map(item => {if(item){return item.text}}).join(' / ')
            })
           this.toggleSelectPanlHandle(false)
            
        })
        
    }

    // 格式化回显
    formatData = () => {
        const {currentSelectRelatedPageOpt } = this.state;
        return currentSelectRelatedPageOpt.map( item => {
            if (item) {
                return ({
                    text: item.name || item.title || item.articleTitle  || item.gongdiTitle,
                    code: item.uid || item.gongdiUid || item.articleUid
                })
            } 
        })
            
    }

    // 切换选择页面面板显示
    toggleSelectPanlHandle = ( isShow ) => {
        const { currentSelectRelatedPageOpt } = this.state;
        if ( currentSelectRelatedPageOpt[1]?.linkType === 2 && !!!currentSelectRelatedPageOpt[2]) {
            
            this.setState(prevState => {
                
                return ({
                    currentSelectRelatedPageOpt: prevState.currentSelectRelatedPageOpt.slice(0, prevState.currentSelectRelatedPageOpt.length - 1)
                })
            }, () => {
                // console.log({aa:  this.state.currentSelectRelatedPageOpt.slice(0,  this.state.currentSelectRelatedPageOpt.length)})
                this.props.form.setFieldsValue({
                    relatedPage: this.state.currentSelectRelatedPageOpt?.slice(0, this.state.currentSelectRelatedPageOpt.length).map(item => item.name).join(' / ')
                })
            })
           
        }
        this.setState({
            showSelectPanl: isShow
        })
        if (!isShow ) {
            this.setState({
                currentKey: '0',
                searchText: '',
                pageNum: 1,
                pageSize: 10,
            })

        }
    }

    closeHanlde = e => {
        const parent = this.refs.parentNode;

        // console.log({aaa:  parent.contains(e.target) })
        if (!parent?.contains(e.target) && !e.target.className.includes('targetInput')) {
            this.toggleSelectPanlHandle(false)
        }
    }

    clickInputHandle = () => {
        this.toggleSelectPanlHandle(true);
        this.setState({
            currentSelectRelatedPageOpt: [],
            currentKey: '0',
            relatedPageText: undefined
        }, () => {
            this.props.form.setFieldsValue({
                relatedPage:  this.formatData().map(item => {if(item){return item.text}}).join(' / ')
            })
        })
    }

    // 页码变换
    pageChange = page => {
        const { searchText,  currentarticleDicCode } = this.state
        this.setState({
            pageNum: page
        })
        this.getDataList({pageNum: page,  searchText, articleDicCode: currentarticleDicCode});
    }

    

    render() {
        const { form, isCreate  } = this.props;
        const { relatedPageOption, currentSelectRelatedPageOpt, currentKey, dataList,detailType, 
            articleDicOpts, currentarticleDicCode, searchText, relatedPageText, showSelectPanl,
            pageNum, pageSize, recordTotal, btnLoading
        } = this.state
        const { getFieldDecorator } = form
        const ColumnsObj = {
            // 工地详情页表头
            columns_1: [
                {
                    title: <span style={{fontWeight: 300}}>工地</span>,
                    key: 'gongdiTitle',
                    dataIndex: 'gongdiTitle',
                    width: '30%',
                    render: text => <div style={{width: '100%', display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                },
                {
                    title: <span style={{fontWeight: 300}}>工地信息</span>,
                    key: 'buildingName',
                    dataIndex: 'buildingName',
                    // width: 200,
                    render: (text, r) => <div style={{maxWidth: 120}}>
                        <div style={{ display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 2}}>{text}</div>
                        {
                            <div>
                                {r.houseType.bedroom && <Tag color="blue" style={{marginTop: 8}}>{`${r.houseType.bedroom}居室 `}</Tag>}
                                <Tag color="green"  style={{marginTop: 8}}>{r.buildingArea}㎡</Tag>
                                <Tag color="volcano"  style={{marginTop: 8}}>{r.renovationCosts}万</Tag>
                                <Tag color="magenta"  style={{marginTop: 8}}>{r.houseStyleName}</Tag>
                            </div>
                            
                        }
                    </div>
                },
                {
                    title: <span style={{fontWeight: 300}}>阶段</span>,
                    key: 'gongdiStageName',
                    dataIndex: 'gongdiStageName',
                }
            ],

            // 设计师表头
            columns_2: [
                {
                    title: <span style={{fontWeight: 300}}>设计师</span>,
                    key: 'name',
                    dataIndex: 'name',
                    // align: 'left',
                    render: (text, record) => <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src={record?.headPicUrl} alt="" srcset="" style={{ width: 30, height: 30, borderRadius: '100%'}}/>
                        <span style={{marginLeft: 8}}>{text}</span>
                    </div>
                },
                {
                    title: <span style={{fontWeight: 300}}>职级</span>,
                    key: 'position',
                    dataIndex: 'position',
                },
                {
                    title: <span style={{fontWeight: 300}}>案例数</span>,
                    key: 'caseNum',
                    dataIndex: 'caseNum'
                },
            ],

            // 案例表头
            columns_3: [
                {
                    title: <span style={{fontWeight: 300}}>案例</span>,
                    key: 'titleInfo',
                    dataIndex: 'title'
                },
                {
                    title: <span style={{fontWeight: 300}}>案例信息</span>,
                    key: 'buildingName',
                    dataIndex: 'buildingName',
                    render: (text, r) => <div>
                        <div style={{width: 120, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 2}}>{text}</div>
                        {
                            <div>
                                {+r.bedroom != 0 && <Tag color="blue" style={{marginTop: 8}}>{`${r.bedroom}居室 `}</Tag>}
                                <Tag color="green"  style={{marginTop: 8}}>{r.acreage}m²</Tag>
                                <Tag color="volcano"  style={{marginTop: 8}}>{r.decorationCost}万</Tag>
                                <Tag color="magenta"  style={{marginTop: 8}}>{r.styleDic.name}</Tag>
                            </div>
                            
                        }
                    </div>
                },
                {
                    title: <span style={{fontWeight: 300}}>设计师</span>,
                    key: 'designerName',
                    dataIndex: 'designerName'
                },
            ],

            // 文章表头
            columns_4: [
                {
                    title: <span style={{fontWeight: 300}}>文章标题</span>,
                    key: 'articleTitle',
                    dataIndex: 'articleTitle'
                },
                {
                    title: <span style={{fontWeight: 300}}>发布人</span>,
                    key: 'creatorName',
                    dataIndex: 'creatorName'
                },
                {
                    title: <span style={{fontWeight: 300}}>更新时间</span>,
                    key: 'updateTime',
                    dataIndex: 'updateTime'
                },
            ]
        }

       

        
        return (
            <div className='createEdit' onClick={this.closeHanlde}>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 13 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="小程序频道名称">
                        {getFieldDecorator('appletsName', {
                            rules: [
                                { required: true, message: '请输入正确的小程序频道名称!' },
                                { max: 4, message: '限制1-4字符长度' }
                            ],
                        })(<Input placeholder='请输入小程序频道名称' />)}
                    </Form.Item>
                    <Form.Item label="网站频道名称">
                        {getFieldDecorator('websiteName', {
                            rules: [
                                { max: 6, message: '限制0-6字符长度' }
                            ],
                        })(<Input  placeholder='请输入网站频道名称' />)}
                    </Form.Item>
                    <Form.Item label="频道介绍">
                        {getFieldDecorator('brief', {
                            rules: [
                                { max: 30, message: '限制0-30字符长度' }
                            ],
                        })(<Input  placeholder='请输入频道介绍' />)}
                    </Form.Item>
                    <Form.Item label="关联页面">
                        {getFieldDecorator('relatedPage', {
                            rules: [{ required: true, message: '请选择关联页面!' }],
                        })(
                            <Input className='targetInput' readOnly placeholder='请选择关联页面' onClick={ this.clickInputHandle} />             
                        )} 
                        {showSelectPanl && <div ref='parentNode'  className={styles['card-container']}>
                            <Tabs type="card" tabBarGutter={0}  activeKey={currentKey} onChange={this.tabChange}>
                                <TabPane tab={currentSelectRelatedPageOpt[0]?.name || '请选择'} key='0'>
                                    {
                                        relatedPageOption?.map(item => 
                                            <p style={{cursor: 'pointer'}} key={item.uid} onClick={() => this.selectedHandle(item, '0')}>{item.name}</p>
                                        )
                                    }
                                </TabPane>
                                {currentSelectRelatedPageOpt[0]?.children.length && <TabPane tab={currentSelectRelatedPageOpt[1]?.name || '请选择'} key='1'>
                                    {
                                        currentSelectRelatedPageOpt[0].children.map(item => 
                                            <p style={{cursor: 'pointer'}} key={item.uid} onClick={() => this.selectedHandle(item, '1')}>{item.name}</p>)
                                    }
                                </TabPane>}
                                {currentSelectRelatedPageOpt[1]?.linkType === 2  && <TabPane tab={currentSelectRelatedPageOpt[2]?.articleTitle || '请选择'} key='2'>
                                    <Search
                                        value={searchText}
                                        placeholder='可输入关键字进行检索'
                                        onChange={  e => { const value = e.target.value; this.setState({searchText: value, pageNum: 1}); this.handleChange(value) }}
                                    />
                                    <Radio.Group style={{marginTop: 8}} buttonStyle='solid'  size='small' value={currentarticleDicCode} buttonStyle="solid"  onChange={this.radioGroupChange}>
                                        {
                                            articleDicOpts.map(item => <Radio.Button key={item.code} value={item.code}>{item.name}</Radio.Button>)
                                        }
                                    </Radio.Group>
                                    <Table
                                        size='small'
                                        style={{marginTop: 8, cursor: 'pointer'}}
                                        columns={ ColumnsObj[`columns_${detailType}`] }
                                        dataSource={dataList}
                                        onRow={record => {
                                            return {
                                                onClick: e => this.rowClick(e, record)
                                            }
                                        }}
                                        pagination={{
                                            current: pageNum,
                                            pageSize,
                                            total: recordTotal,
                                            onChange: this.pageChange

                                        }}
                                    />
                                </TabPane>}
                            </Tabs>
                        </div>}
                    </Form.Item>
                    
                    <Form.Item label="频道说明">
                        {getFieldDecorator('description', {
                            rules: [
                                { max: 200, message: '限制0-200字符长度' }
                            ],
                        })(<TextArea placeholder='请输入频道说明' autoSize={{minRows: 4}} />)}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span:6, offset: 9 }}>
                        <Button type="primary" loading={btnLoading} htmlType="submit" style={{float: 'left'}}>
                            确定
                        </Button>
                        <Button  style={{float: 'right'}} onClick={this.resetHandle}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
