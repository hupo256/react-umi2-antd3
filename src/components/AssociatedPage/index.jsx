import React, { Component } from 'react'
import { Input, Icon, Tooltip, Tabs, Table, Button ,  Radio } from 'antd';
import sty from './index.less'
import _ from 'lodash'
const { TabPane } = Tabs;
const { Search } = Input;

export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            tableShow: false,
            detailType: null,
            currentTab: '0',
            selectLists: [],
            tabPanList: [],
            pageNum: 1,
            pageSize: 10,
            searchText: '',
            tableLoading: false,
            currentarticleDicCode: undefined,
        }
    }
    
    componentDidMount() {
        const { id = '' } = this.props;
        document.body.addEventListener('click', e => {
            // e.stopPropagation();
            // e.preventDefault();
            if (e.target.id===('myInput-' + id) || e.target.parentNode.id === ('mySvg-' + id)) {
                this.setState(prevState => {
                    if (prevState.show) {
                        this.checkValue()
                    }
                    return {
                        show: !prevState.show
                    }
                } )

                return;

            }
            if(!this.refs.tabWrap?.contains(e.target)) {
                this.setState({
                    show: false
                })
                this.checkValue()
            }

        })
    }

    componentDidUpdate(prev) {
        if (this.props.options?.length && (prev.options !== this.props.options) ) {
            this.initData()
        }

        if (this.props.articleDicOpts?.length && (prev.articleDicOpts !== this.props.articleDicOpts)) {
            this.setState({
                currentarticleDicCode: this.props.articleDicOpts[0].code
            })
        }

    }

    // 初始化第一列
    initData = () => {
        const { options } = this.props
        
       
        this.setState({
            tabPanList: [options]
        })
    }

    // 选择完毕检测是否无效选项
    checkValue = () => {
       
        const { selectLists, tabPanList } = this.state;
        const { onResult } = this.props; 
        this.setState({
            show: false,
        })
        
        if(selectLists.length && (selectLists[selectLists.length - 1]?.children?.length || selectLists[selectLists.length - 1]?.linkType === 2 )) {
            tabPanList.splice(1, tabPanList.length - 1);
            this.setState({
                selectLists: [],
                currentTab: '0',
                tabPanList,
                tableShow: false,
            })
            return;
        }
        onResult(selectLists)
    }

    changeTab = key => {
        this.setState({
            currentTab: key
        })
    }

    itemClick = (item, index) => {
        let { tabPanList, selectLists, currentTab} = this.state;
        const { onChange } = this.props;
        tabPanList.splice(index + 1);
        selectLists.splice(index);
        this.setState({
            tableShow: false,
            detailType: null,
            pageNum: 1,
            searchText: '',
            currentarticleDicCode: undefined,
            tableLoading: false,
            tableShow: false
        })
        selectLists[index] = item;   
        if (!!item.children.length) {        
            tabPanList[index + 1] = item.children;
            this.setState({
                currentTab:   +currentTab + 1 + ''
            })
        } else {
            if (item.linkType === 1){
               this.checkValue()
            } else if(item.linkType === 2) {
                this.setState({
                    tableShow: true,
                    detailType: item.detailType,
                    tableLoading: true
                })
                onChange({detailType: item.detailType}).then(res => {
                    this.setState({
                        tableLoading: false
                    })
                })
            }
            
        }
        if (item.linkType === 2) {
            this.setState({
                currentTab:   +currentTab + 1 + ''
            })
        }

        this.setState({
            tabPanList,
            selectLists,
        })
        
    }
    rowClick = (e, item) => {
        const { selectLists } = this.state;
        let index = selectLists.length;
        if (!!selectLists[selectLists.length - 1].detailUid) {
            index = selectLists.length - 1
        }
        selectLists[index] = {
            name: item.name || item.title || item.articleTitle  || item.gongdiTitle || item.specialTitle || item.activityTitle,
            detailUid: item.uid || item.gongdiUid || item.articleUid || item.specialUid,

        }
        this.checkValue()
    }
    pageChange = pageNum => {
        const { onChange, tabData: { detailType } } = this.props;
        this.setState({
            tableLoading: true
        })
        onChange({detailType, pageNum}).then(res => {
            this.setState({
                pageNum,
                tableLoading: false
            })
        })
    }

    /**
     * @description: 模糊查询
     * @param {*}
     * @return {*}
     */    
     handleChange = _.debounce( value => {
        const { onChange, tabData: { detailType } } = this.props;
        const { currentarticleDicCode } = this.state
        const searchText = value.length > 30 ? value.substring(0, 30) : value
        this.setState({
            tableLoading: true,
        })
        onChange({searchText, pageNum: 1, detailType, articleDicCode: currentarticleDicCode }).then(res => {
            this.setState({
                tableLoading: false
            })
        })
    }, 300)

    // 文章类型切换
    radioGroupChange = e => {
        const { searchText } = this.state
        const { onChange, tabData: { detailType } } = this.props;
        this.setState({
            currentarticleDicCode: e.target.value,
            pageNum: 1,
            tableLoading: true
        });
        
        onChange({searchText, pageNum: 1, detailType,  articleDicCode: e.target.value, }).then(res => {
            this.setState({
                tableLoading: false
            })
        })

    }


    render() {
        const { show, currentTab, selectLists, tabPanList, tableShow, pageSize, pageNum, 
            searchText, tableLoading, currentarticleDicCode  } = this.state;
        const { tabData: { tabList, tabTotal, detailType }, articleDicOpts, initValue, id='' } = this.props;
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
        const currentValue = selectLists.length ?  selectLists.map(item => item.name).join('/') : initValue
        return (
            <div ref='wrap' className={sty.wrap}  onClick={this.wrapClick}  style={{minWidth: 200, display: 'inline-block', position: 'relative'}}>
                <Input  
                    className={sty.myInput}
                    id={'myInput-' + id}
                    value={currentValue}
                    placeholder='请选择关联页面'
                    ref='myInput'
                     suffix={                     
                        <Icon type="down" id={'mySvg-' + id} style={{transform: show ? 'rotate(180deg)' : 'none'}} />   
                      }
                    readOnly
                />
                {show && <div ref='tabWrap' className={sty.tabWrap}>
                    <Tabs onChange={this.changeTab} type="card" activeKey={currentTab}>
                        {
                            tabPanList.length && tabPanList.map( (item, index) => <TabPane key={index} tab={selectLists[index] ? selectLists[index].name : '请选择'} key={index + ''}>
                            {
                                item.length && item.map(subitem => <div key={subitem.name} className={sty.item} onClick={() => {this.itemClick(subitem, index)}}>
                                        {subitem.name}
                                    </div>
                                )
                            }
                        </TabPane> )
                        }
                        {tableShow && <TabPane tab='请选择' key={tabPanList.length  + ''}>
                            <Search
                                style={{marginTop: 8}}
                                value={searchText}
                                placeholder={placeholderArr[+detailType - 1] ? `可通过${placeholderArr[(+detailType) - 1]}进行搜索` : '可输入关键字进行检索'}
                                onChange={ e => { const value = e.target.value; this.setState({searchText: value, pageNum: 1}); this.handleChange(value) } }
                            />
                            {detailType === 4 &&  <div>
                                <Radio.Group  buttonStyle="solid" size='small' style={{marginTop: 4}}  value={currentarticleDicCode}  onChange={this.radioGroupChange} >
                                    {
                                        articleDicOpts.map(item => <Radio.Button key={item.code} style={{marginTop: 4}} value={item.code}>{item.name}</Radio.Button>)
                                    }
                                </Radio.Group>
                            </div>}
                            <Table
                                size='small'
                                style={{marginTop: 8, cursor: 'pointer'}}
                                columns={ ColumnsObj[`columns_${detailType}`] }
                                scroll={{ y: 240 }}
                                dataSource={tabList}
                                rowKey={record => record.uid}
                                loading={tableLoading}
                                onRow={record => {
                                    return {
                                        onClick: e => this.rowClick(e, record)
                                    }
                                }}
                                pagination={{
                                    current: pageNum,
                                    pageSize,
                                    total: tabTotal,
                                    onChange: this.pageChange
                                }}
                            />
                        </TabPane>}
                    </Tabs>
                </div>}
               

            </div>
        )
    }
}
