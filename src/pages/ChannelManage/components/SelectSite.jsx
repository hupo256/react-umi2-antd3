import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Select, Input, Button, Col, Row, Radio, Tag    } from 'antd';
import { siteListApi, designerListApi, caseListApi, articleListApi, articleDicApi } from '@/services/channelManage'
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
            articleDicOpts: [],
            data_1: {
                list: [],
                placeholder: '可通过工地标题进行搜索',
            },                          //工地数据
            data_2: {
                list: [],
                placeholder: '可通过设计师姓名进行搜索',
            },                          //设计师数据
            data_3: {
                list: [],
                placeholder: '可通过案例标题进行搜索',
            },                          //案例数据
            data_4: {
                list: [],
                placeholder: '可通过文章标题进行搜索',
            },                           //文章数据
            searchText: '',
            articleDicCode: '',
            pageNum: 1,
            pageSize: 10,
            recordTotal: 0
        }
    }
    async componentDidMount () {
        await this.getArticleDic();
        await this.getData();
        
    }

    async componentDidUpdate (prevProps) {
        if (prevProps.currentDetailType !== this.props.currentDetailType) {
            await this.resetStatus()
            await this.getArticleDic();
            this.getData();
            
        }
    }

    // 查询文章栏目选项
    getArticleDic = async () => {
        const { currentDetailType } = this.props;
        if (currentDetailType === 4) {
            const res = await articleDicApi({dicModuleCodes: 'DM006'});
            if (res?.data?.DM006) {
                this.setState({
                    articleDicOpts: res.data.DM006,
                    articleDicCode: res.data.DM006[0].code
                })
            }
        }
        
    }
    

    getData = (params) => {
        const { currentDetailType } = this.props;
        const { articleDicCode } = this.state
        currentDetailType === 1 && this.getSiteList(params);
        currentDetailType === 2 && this.getdesignerList(params);
        currentDetailType === 3 && this.getCaseList(params);
        currentDetailType === 4 && this.getArticleList({articleDicCode, ...params});
    }

    resetStatus = () => {
        const { dispatch } = this.props;
        this.setState({
            searchText: '',
            pageNum: 1,
            recordTotal: 0,
            articleDicCode: ''
        })
    }

    
    
    /**
     * @description: 模糊查询
     * @param {*}
     * @return {*}
     */    
     handleChange = _.debounce( value => {
        const searchText = value.length > 30 ? value.substring(0, 30) : value
        this.getData({searchText })
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
        this.resetStatus();
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
        this.resetStatus();
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
    articleDicCodeChange = e => {
        const { pageNum, searchText, pageSize} = this.state
        this.setState({
            articleDicCode: e.target.value,
            pageNum: 1,
            searchText: ''
        }, () => {
            this.getData({ articleDicCode: e.target.value, pageSize})
        });
        
    } 

    // 页数变化
    pageChange = (pageNum) => {

        const { searchText, articleDicCode, pageSize } = this.state
        this.getData({pageNum, searchText, articleDicCode, pageSize })
        this.setState({
            pageNum,
        })
    }

    // 选择行
    rowClickHandle = (e, r) => {
        const { dispatch, currentDetailType, selectDetailData  } = this.props;
        const idStringArr = ['', 'gongdiUid', 'uid', 'uid', 'articleUid'];
        dispatch({
            type: 'channelManage/save',
            payload: {
                selectDetailData: [r[idStringArr[currentDetailType]]]
            }
        })
    }
    

    render() {
        const { currentDetailType, selectDetailData  } = this.props;
        const {  searchText, recordTotal, pageNum, pageSize, articleDicCode, articleDicOpts  } = this.state;

        const ColumnsObj = {
            // 工地详情页表头
            columns_1: [
                {
                    title: '工地',
                    key: 'gongdiTitle',
                    dataIndex: 'gongdiTitle',
                    render: text => <div style={{width: 180, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 2}}>{text}</div>
                },
                {
                    title: '工地信息',
                    key: 'gongdiDescription',
                    dataIndex: 'gongdiDescription',
                    width: 200,
                    render: (text, r) => <div>
                        <div style={{width: 180, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 2}}>{text}</div>
                        {
                            <div>
                                {r.houseType.bedroom && <Tag color="blue" style={{marginTop: 8}}>{`${r.houseType.bedroom}居室 `}</Tag>}
                                <Tag color="green"  style={{marginTop: 8}}>{r.buildingArea}</Tag>
                                <Tag color="volcano"  style={{marginTop: 8}}>{r.renovationCosts}万</Tag>
                                <Tag color="magenta"  style={{marginTop: 8}}>{r.houseStyleName}</Tag>
                            </div>
                            
                        }
                    </div>
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
                    // align: 'left',
                    render: (text, record) => <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src={record?.headPicUrl} alt="" srcset="" style={{ width: 30, height: 30, borderRadius: '100%'}}/>
                        <span style={{marginLeft: 8}}>{text}</span>
                    </div>
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
                    render: text => {
                        const str = text.map(item => item.name)
                        return str.join('，')
                    }
                },
                {
                    title: '从业年限',
                    key: 'workingTime',
                    dataIndex: 'workingTime',
                    render: text => text + '年'
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
                    key: 'titlestr',
                    dataIndex: 'title',
                    render: (text, r) => <div>
                        <div style={{width: 180, display: '-webkit-box', textOverflow: 'ellipsis',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 2}}>{text}</div>
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
                    title: '案例信息',
                    key: 'titleInfo',
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
                        <Radio.Group onChange={this.articleDicCodeChange} value={articleDicCode}>
                            {
                                articleDicOpts.map(item => <Radio.Button key={item.code} value={item.code}>{item.name}</Radio.Button>)
                            }

                        </Radio.Group>
                    }
                    <Search
                        value={searchText}
                        placeholder={this?.state['data_' + currentDetailType ]?.placeholder}
                        style={{width: 284}}
                        onChange={  e => { const value = e.target.value; this.setState({searchText: value, pageNum: 1}); this.handleChange(value) }}
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
                    onRow={record => {
                        return {
                            onClick: e =>  this.rowClickHandle(e, record)
                        }
                        
                    }}
                    style={{
                        paddingTop: 16
                    }}
                    pagination={{
                        hideOnSinglePage: true,
                        current: pageNum,
                        pageSize,
                        total: recordTotal,
                        onChange: this.pageChange
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


