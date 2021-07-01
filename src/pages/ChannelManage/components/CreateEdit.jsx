import React, { Component } from 'react'
import { connect } from 'dva'
import { createChannel, getRelatedPage, getDetailApi, editChannelApi,
         siteListApi, designerListApi, caseListApi, articleListApi, articleDicApi, specialListApi, activeListApi  } from '@/services/channelManage'
import { Form, Input, Select, Button, Cascader, message, Tabs, Table, Radio, Tag, Tooltip, Checkbox, Icon   } from 'antd'
import styles from '../index.less'
import Page from '@/components/AssociatedPage'


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
            recordTotal: 0,
            detailType: 0,
            dataList: [],
            articleDicOpts: [],
            currentarticleDicCode: undefined,
            searchText: '',
            pageNum: 1,
            pageSize: 10,
            showSelectPanl: false,
            btnLoading: false,

            // 插件参数
            plugDetailType: null,
            plugDataList: [],
            plugDataTotal: 0,
            relatedPage: null,

            // 关联页面回调参数
            paths: [],
            detailUid: undefined,

            isNull: false

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
            relatedPage: res?.data?.linkDisplayName,
            paths: res?.data?.paths,
        })
        form.setFieldsValue({
            ...res?.data,
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
        const {  detailUid, paths } = this.state;
        if (!paths.length) {
            this.setState({
                isNull: true
            })
            return;
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
                let { ...params } = { ...values, paths, detailUid }

                
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
                let { ...params } = { ...values, paths, detailUid, uid: currentEditUid }
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
            }
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


   




    getTabData = async ({detailType, status = '1', searchText='', pageNum = 1, pageSize = 10, articleDicCode=''} ) => {
        this.setState({
            plugDetailType: detailType,
            plugDataList: []
        })
        try {
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
                plugDataList: res?.data?.list,
                plugDataTotal: res?.data?.recordTotal
            })
            return Promise.resolve()
        } catch (error) {
            message.error('请求出错！')
            return Promise.reject()
        }
       
    }
    resultHandle = res => {
        if (res?.length) {
            let paths = res.map(item => item.uid)
            if (!paths[paths.length - 1]) {
                paths = paths.slice(0, paths.length - 1);
            }
            this.setState({
                detailUid: res[res.length - 1]?.detailUid,
                paths
            })
        }
    }


    render() {
        
        const { form, isCreate  } = this.props;
        const { relatedPageOption, currentSelectRelatedPageOpt, currentKey, dataList,detailType, 
            articleDicOpts, currentarticleDicCode, searchText, showSelectPanl,
            pageNum, pageSize, recordTotal, btnLoading, 
            // 插件数据
            plugDetailType, plugDataList, plugDataTotal, relatedPage,
            isNull
        } = this.state
        const { getFieldDecorator } = form

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
                
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 13 }}>
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
                    <Form.Item label="关联页面" required={true} help={isNull && <span style={{fontSize:12, color: 'red'}} >请选择关联页面</span>}>                      
                        <Page 
                            options={relatedPageOption}
                            onChange={this.getTabData}
                            onResult={this.resultHandle}
                            tabData = {{
                                tabHead: ColumnsObj[`columns_${plugDetailType}`],
                                tabList: plugDataList,
                                tabTotal: plugDataTotal,
                                detailType: plugDetailType
                            }}
                            articleDicOpts={articleDicOpts}
                            initValue={relatedPage}
                        />
                    </Form.Item>
                    
                    <Form.Item label="频道说明">
                        {getFieldDecorator('description', {
                            rules: [
                                { max: 200, message: '限制0-200字符长度' }
                            ],
                        })(<TextArea placeholder='请输入频道说明' autoSize={{minRows: 4}} />)}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span:6, offset: 9 }}>
                        <Button type="primary" loading={btnLoading} onClick={this.handleSubmit} style={{float: 'left'}}>
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
