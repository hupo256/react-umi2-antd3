import React, { Component } from 'react'
import { Input, Icon, Radio, Tooltip, Tabs, Table  } from 'antd';
import sty from './index.less'
import _ from 'lodash'
const { TabPane } = Tabs;
const { Search } = Input;

export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            checkTag: false,
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
        document.body.addEventListener('click', e => {
            // e.stopPropagation();
            e.preventDefault();
            if (e.target.id==='myInput' || e.target.parentNode.id === 'mySvg') {
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
        if (this.props.options.length && (prev.options !== this.props.options) ) {
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
            checkTag: false
        })
        
        if(selectLists.length && (selectLists[selectLists.length - 1]?.children?.length || selectLists[selectLists.length - 1]?.linkType === 2 )) {
            tabPanList.splice(1, tabPanList.length - 1);
            this.setState({
                selectLists: [],
                currentTab: '0',
                tabPanList,
                tableShow: false,
                checkTag: true
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
        console.log({e})
        const { searchText } = this.state
        const { onChange, tabData: { detailType } } = this.props;
        console.log({e: e.target.value})
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
            searchText, tableLoading, currentarticleDicCode, checkTag  } = this.state;
        const { tabData: {tabHead, tabList, tabTotal, detailType }, articleDicOpts } = this.props;
        const placeholderArr = [
            '工地标题',
            '设计师姓名',
            '案例标题',
            '文章标题/内容',
            '专题标题',
            '小游戏标题'
        ];
        // console.log({tabPanList, selectLists,  tabHead, tabList})
        const currentValue = selectLists.map(item => item.name).join('/')
        return (
            <div ref='wrap' className={sty.wrap}  onClick={this.wrapClick}  style={{minWidth: 200, display: 'inline-block', position: 'relative'}}>
                <Input  
                    className={sty.myInput}
                    id='myInput'
                    value={currentValue}
                    placeholder='请选择关联页面'
                    ref='myInput'
                     suffix={                     
                        <Icon type="down" id='mySvg' style={{transform: show ? 'rotate(180deg)' : 'none'}} />   
                      }
                    readOnly
                />
                {checkTag && <div style={{fontSize: 12, color: '#f5222d', height: 22, lineHeight: '22px'}}>请选择关联页面</div>}
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
                            {detailType === 4 && <div>
                                {/* <span style={{ display: 'inline-block', marginTop: 8}}>文章栏目:</span> */}
                                <Radio.Group  buttonStyle="solid"  value={currentarticleDicCode}  onChange={this.radioGroupChange} >
                                    {
                                        articleDicOpts.map(item => <Radio key={item.code} style={{marginTop: 4}} value={item.code}>{item.name}</Radio>)
                                    }
                                </Radio.Group>
                            </div>}
                            <Table
                                size='small'
                                style={{marginTop: 8, cursor: 'pointer'}}
                                columns={ tabHead }
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
