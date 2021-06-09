import React, { Component } from 'react'
import { connect } from 'dva'
import { createChannel, getRelatedPage, getDetailApi, editChannelApi,
         siteListApi, designerListApi, caseListApi, articleListApi, articleDicApi, specialListApi, activeListApi  } from '@/services/channelManage'
import { Form, Input, Select, Button, Cascader, message, Tabs, Table, Radio, Tag, Tooltip, Checkbox, Icon   } from 'antd'
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
        const { form, relatedPage } = this.props;

        if ( relatedPage !== prevProps.relatedPage ) {
            form.setFieldsValue({ relatedPage })
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
            detailUid: res?.data?.detailUid,
            modifyPaths: res?.data?.paths
        })
        form.setFieldsValue({
            ...res?.data,
            relatedPage: res?.data?.linkDisplayName
        })
    }

    // 解构重组后台数据 
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
        const optArr = this.formatData();
        e.preventDefault();
        form.validateFields( (err, values) => {       
            if (err) {
              return
            }
           
            let detailUid2;
            let arr = optArr.map(item => item.code);
            if (optArr[0]?.text === '专题' || optArr[0]?.text === '小游戏') {
                detailUid2 = optArr[1].code;
                arr = optArr.map(item => item.code).slice(0, arr.length - 1)
            }

            if(arr.length === 3) {
                detailUid2 = arr.pop()
            }
        
            this.setState({
                btnLoading: true
            })
            if (isCreate) {
                let {   relatedPage, ...params } = { ...values, paths: arr, detailUid: detailUid2 }
                
                createChannel(params).then(res => {
                    if (res?.code === 200) {
                        this.resetHandle();
                        message.success('频道创建成功!')
                    }
                    this.setState({
                        btnLoading: false
                    })
                })

            
            } else {
                const { currentEditUid } = this.props;
                let {   relatedPage, ...params } = { ...values, paths: arr.length > 0 ?  arr : modifyPaths, detailUid: detailUid2 || detailUid, uid: currentEditUid }
                editChannelApi(params).then(res => {
                    if (res?.code === 200) {
                        this.resetHandle();
                        message.success('编辑已保存，发布后生效 !')
                    }
                    this.setState({
                        btnLoading: false
                    })
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
        if (step === '0') {
            this.setState({
                currentSelectRelatedPageOpt: [],
                currentKey: 0
            })
        }

        const { pageNum, searchText, currentarticleDicCode, currentSelectRelatedPageOpt } = this.state
        this.setState(prevState => {
            let arr = prevState.currentSelectRelatedPageOpt;
            arr[+step] = item;
            return ({
                currentSelectRelatedPageOpt: arr,
                currentKey: (arr[+step].linkType == '1' && !arr[+step].children.length) ?  step : +step + 1 + ''  ,
                detailType: item.detailType,

            })
        }, () => {
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
                pageSize,
                articleStatus: status
            });

        }
        detailType === 5 && (res = await specialListApi({
            specialStatus: status,
            searchText,
            pageNum,
            pageSize
        }));
        detailType === 6 && (res = await activeListApi({
            state: '',
            activityTitle: searchText,
            pageNum,
            pageSize
        }));
        
        this.setState( {
            dataList: res?.data?.list,
            recordTotal: res?.data?.recordTotal
        })
    }

     // 查询文章栏目选项
     getArticleDic = async () => {
        const res = await articleDicApi({dicModuleCodes: 'DM006'});
        if (res?.data.length) {
            this.setState({
                articleDicOpts: res.data,
                currentarticleDicCode: res.data[0].code
                
            })
        }
        
    }

    // 文章类型切换
    radioGroupChange = e => {
        const { searchText } = this.state
        this.setState({
            currentarticleDicCode: e.target.value,
            pageNum: 1
        });
        
        this.getDataList({articleDicCode: e.target.value,  pageNum: 1, searchText })

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
       
        this.setState(prevState => {
            let arr = prevState.currentSelectRelatedPageOpt;
            if (arr[arr.length - 1]?.linkKey) {
                arr.push( record );
            } else {
                arr[arr.length - 1] = record
            }
            
            return ({
                currentSelectRelatedPageOpt: arr,
                // currentKey: 2,
            })
        }, () => {
            this.props.form.setFieldsValue({
                relatedPage:  this.formatData().map(item =>item.text).join(' / ')
            })
           this.toggleSelectPanlHandle(false)
            
        })
        
    }

    // 格式化回显
    formatData = () => {
        const {currentSelectRelatedPageOpt } = this.state;
        let arr = [];
        for (const key in currentSelectRelatedPageOpt) {
            if (currentSelectRelatedPageOpt.hasOwnProperty.call(currentSelectRelatedPageOpt, key)) {
                const item = currentSelectRelatedPageOpt[key];
                arr.push({
                    text: item.name || item.title || item.articleTitle  || item.gongdiTitle || item.specialTitle || item.activityTitle,
                    code: item.uid || item.gongdiUid || item.articleUid || item.specialUid
                })
            }
        }
        return arr;
            
    }

    // 切换选择页面面板显示
    toggleSelectPanlHandle = ( isShow ) => {
        const { currentSelectRelatedPageOpt } = this.state;
        if ((currentSelectRelatedPageOpt[1]?.linkType === 2 && !!!currentSelectRelatedPageOpt[2]) || 
            (currentSelectRelatedPageOpt[0]?.linkType === 2 && !!!currentSelectRelatedPageOpt[1] ) ||
            currentSelectRelatedPageOpt[currentSelectRelatedPageOpt.length - 1]?.children?.length) {
            
            this.setState(prevState => {
                
                return ({
                    currentSelectRelatedPageOpt: [],
                    currentKey: '0'
                })
            }, () => {
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
                // currentKey: '0',
                searchText: '',
                pageNum: 1,
                pageSize: 10,
            })

        }
    }

    closeHanlde = e => {
        const parent = this.refs.parentNode;
        if (!parent?.contains(e.target) && (e.target?.id !== 'relatedPage' && e.target.tagName !== 'svg')) {
            this.toggleSelectPanlHandle(false)
        }
    }

    clickInputHandle = e => {
        const { showSelectPanl } = this.state;
        const { isCreate} = this.props;
        this.setState({
            currentSelectRelatedPageOpt: [],
            currentKey: '0',
        })
        if (!showSelectPanl) {
            this.toggleSelectPanlHandle(true);
            return;
        } 
        this.toggleSelectPanlHandle(false);
        
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
            articleDicOpts, currentarticleDicCode, searchText, showSelectPanl,
            pageNum, pageSize, recordTotal, btnLoading
        } = this.state
        const { getFieldDecorator } = form
        
        const placeholderArr = [
            '工地标题',
            '设计师姓名',
            '案例标题',
            '文章标题/内容',
            '专题标题',
            '小游戏标题'
        ];
        const ColumnsObj = {
            // 工地详情页表头
            columns_1: [
                {
                    title: <span style={{fontWeight: 600}}>工地</span>,
                    key: 'gongdiTitle',
                    dataIndex: 'gongdiTitle',
                    // width: '30%',
                    render: (text, r) =>  <Tooltip placement='topLeft' title={text}>
                        <div style={{ maxWidth: 120, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 600}}>工地信息</span>,
                    key: 'buildingName',
                    dataIndex: 'buildingName',
                    // width: 200,
                    render: (text, r) => 
                        <Tooltip placement='topLeft' title={text}>
                            <div style={{ maxWidth: 120, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                        </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 600}}>阶段</span>,
                    key: 'gongdiStageName',
                    dataIndex: 'gongdiStageName',
                }
            ],

            // 设计师表头
            columns_2: [
                {
                    title: <span style={{fontWeight: 600}}>设计师</span>,
                    key: 'name',
                    dataIndex: 'name',
                    // align: 'left',
                    render: (text, record) => <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src={record?.headPicUrl} alt="" srcset="" style={{ width: 30, height: 30, borderRadius: '100%'}}/>
                        <span style={{marginLeft: 8}}>{text}</span>
                    </div>
                },
                {
                    title: <span style={{fontWeight: 600}}>职级</span>,
                    key: 'position',
                    dataIndex: 'position',
                },
                {
                    title: <span style={{fontWeight: 600}}>案例数</span>,
                    key: 'caseNum',
                    dataIndex: 'caseNum'
                },
            ],

            // 案例表头
            columns_3: [
                {
                    title: <span style={{fontWeight: 600}}>案例</span>,
                    key: 'titleInfo',
                    dataIndex: 'title',
                    render: (text, r) => 
                        <div  style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>
                            <Tooltip placement='topLeft' title={text}>
                                {text}
                            </Tooltip>
                        </div>
                },
                {
                    title: <span style={{fontWeight: 600}}>案例信息</span>,
                    key: 'buildingName',
                    dataIndex: 'buildingName',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <span style={{ maxWidth: 120, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</span>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 600}}>设计师</span>,
                    key: 'designerName',
                    dataIndex: 'designerName',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
            ],

            // 文章表头
            columns_4: [
                {
                    title: <span style={{fontWeight: 600}}>文章标题</span>,
                    key: 'articleTitle',
                    dataIndex: 'articleTitle',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 600}}>发布人</span>,
                    key: 'creatorName',
                    dataIndex: 'creatorName',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 600}}>更新时间</span>,
                    key: 'updateTime',
                    dataIndex: 'updateTime'
                },
            ],
            // 专题表头
            columns_5: [
                {
                    title: <span style={{fontWeight: 600}}>专题标题</span>,
                    key: 'specialTitle',
                    dataIndex: 'specialTitle',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 600}}>创建人</span>,
                    key: 'creatorName',
                    dataIndex: 'creatorName',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 600}}>更新时间</span>,
                    key: 'updateTime',
                    dataIndex: 'updateTime'
                },
            ],
            // 小游戏表头
            columns_6: [
                {
                    title: <span style={{fontWeight: 600}}>游戏标题</span>,
                    key: 'activityTitle',
                    dataIndex: 'activityTitle',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 600}}>状态</span>,
                    key: 'state',
                    dataIndex: 'state',
                    render: (text, r) => {
                        let tex = '未开始';
                        text === 1 && (tex = '进行中');
                        text === 2 && (tex = '已结束');
                        return tex;
                    }
                },
                {
                    title: <span style={{fontWeight: 600}}>创建人</span>,
                    key: 'creater',
                    dataIndex: 'creater',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
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
                    <Form.Item label="适用频道">
                        {getFieldDecorator('usageScene', {
                            initialValue: [2, 1],
                            rules: [{ required: true, message: '请选择适用频道!' }],
                            
                        })(<Checkbox.Group options={[{label: '小程序', value: 2}, {label: '网站', value: 1}]}/>)}
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
                            <Input 
                                className='targetInpu'
                                readOnly placeholder='请选择关联页面' 
                                onClick={ this.clickInputHandle}
                                suffix={
                                    <span id= 'icon'>
                                        <Icon type="down"  onClick={ this.clickInputHandle} style={{transform: showSelectPanl ? 'rotate(180deg)' : 'rotate(0deg)'}} />
                                    </span>
                                    
                                }
                            />              
                        )} 
                        {showSelectPanl && <div ref='parentNode'  className={styles['card-container']}>
                            <Tabs size='small' animated={false} type="card" tabBarGutter={0}  activeKey={currentKey} onChange={this.tabChange}>
                                <TabPane tab={currentSelectRelatedPageOpt[0]?.name || '请选择'} key='0'>
                                    {
                                        relatedPageOption?.map(item => 
                                            <div className={styles['card-item']} key={item.uid} onClick={() => this.selectedHandle(item, '0')}>{item.name}</div>
                                        )
                                    }
                                </TabPane>
                                {currentSelectRelatedPageOpt[0]?.children.length && <TabPane tab={currentSelectRelatedPageOpt[1]?.name || '请选择'} key='1'>
                                    {
                                        currentSelectRelatedPageOpt[0].children.map(item => 
                                            <div className={styles['card-item']} key={item.uid} onClick={() => this.selectedHandle(item, '1')}>{item.name}</div>)
                                    }
                                </TabPane>}
                                {(currentSelectRelatedPageOpt[1]?.linkType === 2 || currentSelectRelatedPageOpt[0]?.linkType === 2 ) && <TabPane tab='请选择' key= {currentSelectRelatedPageOpt[0]?.linkType === 2 ? '1' : '2'}>
                                    <Search
                                        style={{marginTop: 8}}
                                        value={searchText}
                                        placeholder={placeholderArr[+detailType - 1] ? `可通过${placeholderArr[(+detailType) - 1]}进行搜索` : '可输入关键字进行检索'}
                                        onChange={  e => { const value = e.target.value; this.setState({searchText: value, pageNum: 1}); this.handleChange(value) }}
                                    />
                                    {detailType === 4 && <div>
                                        <span style={{ display: 'inline-block', marginTop: 8}}>文章栏目:</span>
                                        <Radio.Group style={{margin: 8}}   size='small' value={currentarticleDicCode} buttonStyle="solid"  onChange={this.radioGroupChange}>
                                            {
                                                articleDicOpts.map(item => <Radio.Button key={item.code} style={{marginTop: 4}} value={item.code}>{item.name}</Radio.Button>)
                                            }
                                        </Radio.Group>
                                    </div>   }
                                    <Table
                                        size='middle'
                                        style={{marginTop: 8, cursor: 'pointer'}}
                                        columns={ ColumnsObj[`columns_${detailType}`] }
                                        scroll={{ y: 240 }}
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
