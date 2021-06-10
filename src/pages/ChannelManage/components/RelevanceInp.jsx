import React, { Component } from 'react'
import { connect } from 'dva'
import { siteListApi, designerListApi, caseListApi, articleListApi, articleDicApi, specialListApi, activeListApi  } from '@/services/channelManage'
import { Form, Input, Tabs, Table, Radio, Icon, Tooltip   } from 'antd'
import styles from '../index.less'

const { TabPane } = Tabs
const { Search } = Input;
@connect(state => ({
    ...state.channelManage
}))
@Form.create()
export default class RelevanceInp extends Component {
    constructor(props){
        super(props)
        this.state ={
            relatedPageOption: [],
            currentSelectRelatedPageOpt: [],
            currentKey: '0',
            recordTotal: 0,
            detailType: 0,
            dataList: [],
            articleDicOpts: [],
            currentarticleDicCode: undefined,
            searchText: '',
            pageNum: 1,
            pageSize: 10,
            showSelectPanl: false,
        }
    }
    async componentDidMount() {
        const { form, relatedPage, curUid } = this.props;
        relatedPage && form.setFieldsValue({ relatedPage })
        curUid === -1 && this.clickInputHandle()  // 为-1则校验没通过
    }

    async componentDidUpdate( prevProps ) {
        const { form, relatedPage } = this.props;
        relatedPage !== prevProps.relatedPage && form.setFieldsValue({ relatedPage })
    }

    // 格式化回显
    formatData = () => {
        const {currentSelectRelatedPageOpt } = this.state;
        let arr = [];
        for (const key in currentSelectRelatedPageOpt) {
            if (currentSelectRelatedPageOpt.hasOwnProperty.call(currentSelectRelatedPageOpt, key)) {
                const {name, uid, icon, appletsLink, linkKey} = currentSelectRelatedPageOpt[key];
                arr.push({
                    text: name,
                    code: uid,
                    icon, linkKey, appletsLink,
                })
            }
        }
        return arr;
    }

    // 解构重组后台数据 
    format = data => {
        if (!Array.isArray(data)) return;
        let newArr = [];
        for (const item of data) {            
            newArr.push ({
                ...item.node,
                children: item.children.length ? this.format(item.children) : []
            })
        } 
        newArr = this.touchSelcOpts(newArr)
        // console.log(newArr)
        return newArr
    }

    // 过滤一级nav, 当children为空，则认为不应出现
    filterLevelOps = () => {
        const { relatedPageOption} = this.props
        const optArr = this.format(relatedPageOption)
        const arr = optArr.filter(ar => ar.children?.length > 0)
        return arr
    }

    // 过滤二级掉已有的nav
    touchSelcOpts = (opts) => {
      const { curNavs, curUid } = this.props
      const tempNavs = [...curNavs]
      const ind = tempNavs.indexOf(curUid)
      ind > -1 && tempNavs.splice(ind, 1)  // 当前的那个选项应该排除在外，如果有的话
      const newOpts = opts.filter(opt => !tempNavs.includes(opt?.uid))
      return newOpts
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

            const {callFun} = this.props
            if(callFun) callFun(this.formatData())
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
       
        this.setState(prevState => {
            let arr = prevState.currentSelectRelatedPageOpt;
            arr.push( record );
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

    // 切换选择页面面板显示
    toggleSelectPanlHandle = ( isShow ) => {
        const { currentSelectRelatedPageOpt } = this.state;
        if ( (currentSelectRelatedPageOpt[1]?.linkType === 2 && !!!currentSelectRelatedPageOpt[2]) || (currentSelectRelatedPageOpt[0]?.linkType === 2 && !!!currentSelectRelatedPageOpt[1] )) {
            
            this.setState(prevState => {
                
                return ({
                    currentSelectRelatedPageOpt: prevState.currentSelectRelatedPageOpt.slice(0, prevState.currentSelectRelatedPageOpt.length - 1)
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
                currentKey: '0',
                searchText: '',
                pageNum: 1,
                pageSize: 10,
            })

        }
    }

    clickInputHandle = () => {
        this.toggleSelectPanlHandle(true);
        this.setState({
            currentSelectRelatedPageOpt: [],
            currentKey: '0',
            relatedPageOption: this.filterLevelOps()
        }, () => {
            this.props.form.setFieldsValue({
                relatedPage:  this.formatData().map(item =>item.text).join(' / ')
            })
        })
    }

    releInpBlur = () => {
        setTimeout(() => {
            const { form, curNavs, curUid } = this.props
            console.log(curUid)
            if(!curUid) {
                this.clickInputHandle()
            }
        }, 400)
        
        return

        form.validateFields( (err, values) => {  
            console.log(values)     
            if (err) return
            console.log(11)
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
        const { form, isCreate, inpDisabled  } = this.props;
        const { relatedPageOption, currentSelectRelatedPageOpt, currentKey, dataList,detailType, 
            articleDicOpts, currentarticleDicCode, searchText, showSelectPanl,
            pageNum, pageSize, recordTotal,
        } = this.state
        const { getFieldDecorator } = form
        const ColumnsObj = {
            // 工地详情页表头
            columns_1: [
                {
                    title: <span style={{fontWeight: 300}}>工地</span>,
                    key: 'gongdiTitle',
                    dataIndex: 'gongdiTitle',
                    // width: '30%',
                    render: (text, r) =>  <Tooltip placement='topLeft' title={text}>
                        <div style={{ maxWidth: 120, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 300}}>工地信息</span>,
                    key: 'buildingName',
                    dataIndex: 'buildingName',
                    // width: 200,
                    render: (text, r) => 
                        <Tooltip placement='topLeft' title={text}>
                            <div style={{ maxWidth: 120, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                        </Tooltip> 
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
                    dataIndex: 'title',
                    render: (text, r) => <Tooltip placement='topLeft' title={text} >
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 300}}>案例信息</span>,
                    key: 'buildingName',
                    dataIndex: 'buildingName',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <span style={{ maxWidth: 120, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</span>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 300}}>设计师</span>,
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
                    title: <span style={{fontWeight: 300}}>文章标题</span>,
                    key: 'articleTitle',
                    dataIndex: 'articleTitle',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 300}}>发布人</span>,
                    key: 'creatorName',
                    dataIndex: 'creatorName',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 300}}>更新时间</span>,
                    key: 'updateTime',
                    dataIndex: 'updateTime'
                },
            ],
            // 专题表头
            columns_5: [
                {
                    title: <span style={{fontWeight: 300}}>专题标题</span>,
                    key: 'specialTitle',
                    dataIndex: 'specialTitle',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 300}}>创建人</span>,
                    key: 'creatorName',
                    dataIndex: 'creatorName',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 300}}>更新时间</span>,
                    key: 'updateTime',
                    dataIndex: 'updateTime'
                },
            ],
             // 小游戏表头
             columns_6: [
                {
                    title: <span style={{fontWeight: 300}}>游戏标题</span>,
                    key: 'activityTitle',
                    dataIndex: 'activityTitle',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
                {
                    title: <span style={{fontWeight: 300}}>状态</span>,
                    key: 'status',
                    dataIndex: 'status',
                    render: (text, r) => {
                        let tex = '未开始';
                        text === 1 && (tex = '进行中');
                        text === 2 && (tex = '已结束');
                        return tex;
                    }
                },
                {
                    title: <span style={{fontWeight: 300}}>创建人</span>,
                    key: 'creater',
                    dataIndex: 'creater',
                    render: (text, r) => <Tooltip placement='topLeft' title={text}>
                        <div style={{maxWidth: 120,  display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</div>
                    </Tooltip> 
                },
               
               
            ]
        }

        return (
        <Form style={{width: '100%'}}>
            <Form.Item>   
            {getFieldDecorator('relatedPage', {
                rules: [{ required: true, message: '请选择关联页面!' }],
            })(
                <Input  
                    disabled={inpDisabled} 
                    readOnly 
                    placeholder='请选择关联页面' 
                    onClick={this.clickInputHandle}
                    // onBlur={this.releInpBlur}
                    suffix={<Icon type="down" />}
                />             
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
                    {(currentSelectRelatedPageOpt[1]?.linkType === 2 || currentSelectRelatedPageOpt[0]?.linkType === 2 ) && <TabPane tab='请选择' key= {currentSelectRelatedPageOpt[0]?.linkType === 2 ? '1' : '2'}>
                        <Search
                            value={searchText}
                            placeholder='可输入关键字进行检索'
                            onChange={  e => { const value = e.target.value; this.setState({searchText: value, pageNum: 1}); this.handleChange(value) }}
                        />
                        {detailType === 4 && <Radio.Group style={{marginTop: 8}} buttonStyle='solid'  size='small' value={currentarticleDicCode} buttonStyle="solid"  onChange={this.radioGroupChange}>
                            {
                                articleDicOpts.map(item => <Radio.Button key={item.code} value={item.code}>{item.name}</Radio.Button>)
                            }
                        </Radio.Group>}
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
        </Form>
        )
    }
}
