import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Select, Input, Button, Col, Row, Radio    } from 'antd';
import { siteListApi, designerListApi, caseListApi, articleListApi } from '@/services/channelManage'
import _ from 'lodash'

const { Option } = Select;
const { Search } = Input;

@connect(state => ({
    ...state.channelManage
}))


export default class SelectSite extends Component {
    constructor(props) {
        super(props)
        this.state = {          
            data_1: {
                list: [],
                searchText: undefined,
                pageNum: 1,
                pageSize: 10,
            },                          //工地数据
            data_2: {
                list: [],       
                pageNum: 1,
                pageSize: 10,
            },                          //设计师数据
            data_3: {
                list: [],
                pageNum: 1,
                pageSize: 10,
            },                          //案例数据
            data_4: {
                list: [],
                pageNum: 1,
                pageSize: 10,
            },                           //文章数据
            searchText: ''
        }
    }
    async componentDidMount () {
        this.initData()
    }

    async componentDidUpdate (prevProps) {
        if (prevProps.currentDetailType !== this.props.currentDetailType) {
            this.initData()
        }
    }
    

    initData = () => {
        const { currentDetailType } = this.props;
        currentDetailType === 1 && this.getSiteList();
        currentDetailType === 2 && this.getdesignerList();
        currentDetailType === 3 && this.getCaseList();
        currentDetailType === 4 && this.getArticleList();
    }

    /**
     * @description: 查询工地列表数据
     * @param {*}
     * @return {*}
     */
    getSiteList = async ( { gongdiStatus = 0, pageNum = 1, pageSize = 10, searchText = '' } = {} ) => {
        const res = await siteListApi({
            gongdiStatus,
            pageNum,
            pageSize,
            searchText
        });
        this.setState( prevState => ({
            data_1: {
                ...prevState.data_1,
                list: res?.data?.list
            }
        }))
    }

    //  查询设计师列表数据
    getdesignerList = async({ status = '1', searchText='', pageNum = 1, pageSize = 10 } = {}) => {
        const res = await designerListApi({
            status,
            searchWord: searchText,
            pageNum,
            pageSize
        })
        this.setState(prevState => ({
            data_2: {
                ...prevState.data_2,
                list: res?.data?.list
            }
        }))
    }

    // 查询案例列表
    getCaseList = async ({ status = '1', searchText='', pageNum = 1, pageSize = 10 } = {}) => {
        const res = await caseListApi({
            status,
            searchWord: searchText,
            pageNum,
            pageSize
        })
        this.setState(prevState => ({
            data_3: {
                ...prevState.data_3,
                list: res?.data?.list
            }
        }))
    }


    // 查询文章列表数据
    getArticleList = async ({ articleStatus = '1', searchText='', pageNum = 1, pageSize = 10, articleDicCode='' } = {} ) => {
        const res = articleListApi({
            articleStatus,
            searchText,
            articleDicCode,
            pageNum,
            pageSize
        })
        this.setState(prevState => ({
            data_4: {
                ...prevState.data_4,
                list: res?.data?.article
            }
            
        }))
    }
    
    /**
     * @description: 模糊查询
     * @param {*}
     * @return {*}
     */    
     handleChange = _.debounce( value => {
        const { currentDetailType } = this.props;
        currentDetailType === 1 && this.getSiteList({searchText: value})
        currentDetailType === 2 && this.getdesignerList({searchText: value})
        currentDetailType === 3 && this.getCaseList({searchText: value})
        currentDetailType === 4 && this.getArticleList({searchText: value})
    }, 300)
     

    // 取消选择
    cancelHandle = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'channelManage/save',
            payload: {
                currentDetailType: 0,
                selectDetailData: []
            }
        })
        this.setState({
            searchText: ''
        })

    }

    // 确定选择
    okHandle = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'channelManage/save',
            payload: {
                currentDetailType: 0,

            }
        })
        this.setState({
            searchText: ''
        })
    }

    selectChange = (key, row) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'channelManage/save',
            payload: {
                selectDetailData: key
            }
        })
    } 

    // 文章类型选择
    articleTypeChange = (e) => {
        console.log({e: e.target.value})
    } 
    

    render() {
        const { currentDetailType, selectDetailData  } = this.props;
        const {  searchText  } = this.state;

        const ColumnsObj = {
            // 工地详情页表头
            columns_1: [
                {
                    title: '工地',
                    key: 'gongdiTitle',
                    dataIndex: 'gongdiTitle',
                },
                {
                    title: '阶段',
                    key: 'gongdiDescription',
                    dataIndex: 'gongdiDescription',
                    render: text => <div style={{width: 180, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 2}}>{text}</div>
                },
                {
                    title: '状态',
                    key: 'gongdiStatus',
                    dataIndex: 'gongdiStatus'
                },
                {
                    title: '更新时间',
                    key: 'updateTime',
                    dataIndex: 'updateTime'
                },
            ],

            // 设计师表头
            columns_2: [
                {
                    title: '设计师',
                    key: 'name',
                    dataIndex: 'name',
                    render: text => text
                },
                {
                    title: '职级',
                    key: 'position',
                    dataIndex: 'position',
                },
                {
                    title: '擅长风格',
                    key: 'styles',
                    dataIndex: 'styles',
                    render: text => text.toString()
                },
                {
                    title: '从业年限',
                    key: 'workingTime',
                    dataIndex: 'workingTime'
                },
                {
                    title: '案例数',
                    key: 'caseNum',
                    dataIndex: 'caseNum'
                },
                {
                    title: '更新时间',
                    key: 'operateTime',
                    dataIndex: 'operateTime'
                },
            ],

            // 案例表头
            columns_3: [
                {
                    title: '案例',
                    key: 'title',
                    dataIndex: 'title'
                },
                {
                    title: '案例信息',
                    key: 'title',
                    dataIndex: 'title'
                },
                {
                    title: '设计师',
                    key: 'designerName',
                    dataIndex: 'designerName'
                },
                {
                    title: '更新时间',
                    key: 'operateTime',
                    dataIndex: 'operateTime'
                }
            ],

            // 文章表头
            columns_4: [
                {
                    title: '文章标题',
                    key: 'articleTitle',
                    dataIndex: 'articleTitle'
                },
                {
                    title: '发布人',
                    key: 'creatorName',
                    dataIndex: 'creatorName'
                },
                {
                    title: '更新时间 ',
                    key: 'updateTime',
                    dataIndex: 'updateTime'
                },
            ]
        }

        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {
                        // 文章类型选择器
                        currentDetailType === 4 && 
                        <Radio.Group onChange={this.articleTypeChange} defaultValue="a">
                            <Radio.Button value="a">装修前</Radio.Button>
                            <Radio.Button value="b">施工中</Radio.Button>
                            <Radio.Button value="c">装修后</Radio.Button>
                            <Radio.Button value="d">媒体报道</Radio.Button>
                            <Radio.Button value="e">企业动态</Radio.Button>
                        </Radio.Group>
                    }
                    <Search
                        value={searchText}
                        placeholder='可通过工地标题进行搜索'
                        style={{width: 284}}
                        onChange={  e => { const value = e.target.value; this.setState({searchText: value}); this.handleChange(value) }}
                        // onSearch={e => { console.log(e)}}
                    />
                </div>
               
                <Table 
                    columns={ColumnsObj['columns_' + currentDetailType ]}
                    dataSource= {this?.state['data_' + currentDetailType ]?.list}
                    rowKey={(record) => {
                        const idStringArr = ['', 'gongdiUid', 'uid', 'uid', 'articleUid'];
                        return record[idStringArr[currentDetailType]]
                    }}
                    rowSelection={{
                        type: 'radio',
                        onChange: this.selectChange,
                        selectedRowKeys: selectDetailData
                    }}
                    style={{
                        paddingTop: 16
                    }}
                />
                <Row style={{marginTop: 32}}>
                    <Col span={6} offset={9}>
                        <Button type="primary" onClick={this.okHandle} style={{float: 'left'}}>
                            确定
                        </Button>
                        <Button  onClick={this.cancelHandle} style={{float: 'right'}}>
                            取消
                        </Button>
                    </Col>
                    
                </Row>
               
            </div>
        )
    }
}


