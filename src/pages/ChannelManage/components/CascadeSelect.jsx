import React, { useState, useEffect } from 'react'
import { siteListApi, designerListApi, caseListApi, articleListApi, articleDicApi, specialListApi, activeListApi  } from '@/services/channelManage'
import { Input, Tabs, Table, Radio, Tooltip } from 'antd'
import styles from '../index.less'

const { TabPane } = Tabs
const { Search } = Input;
export default function CascadeSelect(props){
    const { optsArr, curNavs=[], callFun } = props

    const [relatedPageOption, setrelatedPageOption] = useState([])  // 生成级联选择的数据
    const [currentSelectRelatedPageOpt, setcurrentSelectRelatedPageOpt] = useState([])  // 当前已选
    const [dataList, setdataList] = useState([])  
    const [articleDicOpts, setarticleDicOpts] = useState([])  
    const [currentarticleDicCode, setcurrentarticleDicCode] = useState(undefined)  
    const [currentKey, setcurrentKey] = useState('0')  
    const [recordTotal, setrecordTotal] = useState(0)  
    const [detailType, setdetailType] = useState(0)   // 祥情页类型 
    const [showSelectPanl, setshowSelectPanl] = useState(false)  
    const [searchText, setsearchText] = useState('')  
    const [pageNum, setpageNum] = useState(1)  
    const [pageSize, setpageSize] = useState(10)  

    useEffect(() => {
        showSelect()
    }, [])

    useEffect(() => {
        detailType && getDataList({pageNum, searchText, articleDicCode: currentarticleDicCode});
    }, [detailType])

    function showSelect(){
        toggleSelectPanlHandle(true);
        setcurrentSelectRelatedPageOpt([])
        setrelatedPageOption(filterLevelOps())
    }

    // 格式化回显
    function formatData(opts){
        console.log(opts)
        let arr = [];
        opts.forEach((opt, ind) => {
            const {name, title, articleTitle,gongdiTitle,specialTitle, activityTitle,
                uid, gongdiUid, articleUid, specialUid, icon, appletsLink, linkKey, linkType } = opt;
            const isEnd = ind === 2 || (ind === 1 && linkType === 1)  // 顺便处理是否到末级的逻辑
            arr.push({
                text: name || title || articleTitle  || gongdiTitle || specialTitle || activityTitle,
                code: uid || gongdiUid || articleUid || specialUid,
                icon, linkKey, appletsLink, linkType, isEnd
            })
        })
        return arr;
    }

    // 解构重组后台数据 
    function format(data){
        if (!Array.isArray(data)) return;
        let newArr = [];
        for (const item of data) {            
            newArr.push ({
                ...item.node,
                children: item.children.length ? format(item.children) : []
            })
        } 
        newArr = touchSelcOpts(newArr)
        // console.log(newArr)
        return newArr
    }

    // 过滤一级nav, 当children为空，则认为不应出现
    function filterLevelOps(){
        const optArr = format(optsArr)
        const arr = optArr.filter(ar => ar.children?.length > 0)
        return arr
    }

    // 过滤二级掉已有的nav
    function touchSelcOpts(opts){
      const tempNavs = [...curNavs]
      const newOpts = opts.filter(opt => !tempNavs.includes(opt?.uid))
      return newOpts
    }

    // tab面板切换
    function tabChange(key){
        setcurrentSelectRelatedPageOpt(currentSelectRelatedPageOpt.slice(0, +key))
        setcurrentKey(key)
    } 

    // 选择关联页面
    function selectedHandle(item, step ){
        const arr = [...currentSelectRelatedPageOpt, item]
        setcurrentSelectRelatedPageOpt(arr)
        setcurrentKey(+step + 1 + '')
        setdetailType(item.detailType)

        if (!item.children.length && item.linkType === 1) toggleSelectPanlHandle(false)
        if(callFun) callFun(formatData(arr))
    }

    // 获取表格数据
    async function getDataList ({ status = '1', searchText='', pageNum = 1, pageSize = 10, articleDicCode='' } = {}){
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
            if (!articleDicOpts.length) {
                await getArticleDic();
            }   
            res = await articleListApi({
                searchText,
                articleDicCode: articleDicCode ||  currentarticleDicCode,
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
        setdataList(res?.data?.list)
        setrecordTotal(res?.data?.recordTotal)
    }

     // 查询文章栏目选项
     async function getArticleDic(){
        const res = await articleDicApi({dicModuleCodes: 'DM006'});
        const { DM006} = res?.data
        if(DM006){
            setarticleDicOpts(DM006)
            setcurrentarticleDicCode(DM006[0].code)
        }
    }

    // 文章类型切换
    function radioGroupChange(e){
        const val = e.target.value
        setcurrentarticleDicCode(val)
        getDataList({articleDicCode: val,  pageNum, searchText })
    }

    /**
     * @description: 模糊查询
     * @param {*}
     * @return {*}
     */    
    function handleChange(e){
        const value = e.target.value; 
        setsearchText(value) 
        setpageNum(1)

        const getList =  _.debounce( value => {
            const searchText = value.length > 30 ? value.substring(0, 30) : value
            getDataList({searchText, pageNum })
        }, 300)

        getList()
    }

    // 行点击事件
    function rowClick(e, record){
        const arr = [...currentSelectRelatedPageOpt, record]
        toggleSelectPanlHandle(false)
        setcurrentSelectRelatedPageOpt(arr)

        if(callFun) callFun(formatData(arr))
    }

    // 切换选择页面面板显示
    function toggleSelectPanlHandle(isShow){
        setshowSelectPanl(isShow)
        if ( (currentSelectRelatedPageOpt[1]?.linkType === 2 && !!!currentSelectRelatedPageOpt[2]) || 
             (currentSelectRelatedPageOpt[0]?.linkType === 2 && !!!currentSelectRelatedPageOpt[1] )) {
            setcurrentSelectRelatedPageOpt(currentSelectRelatedPageOpt.slice(0, currentSelectRelatedPageOpt.length - 1))
        }
        if (!isShow ) {
            setcurrentKey('0')
            setsearchText('')
            setpageNum(1)
            setpageSize(10)
        }
    }

    // 页码变换
    function pageChange(page){
        setpageNum(page)
        getDataList({pageNum: page, searchText, articleDicCode: currentarticleDicCode});
    }

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
        <>  
            {showSelectPanl && <div className={styles['card-container']}>
                <Tabs type="card" tabBarGutter={0}  activeKey={currentKey} onChange={tabChange}>
                    <TabPane tab={currentSelectRelatedPageOpt[0]?.name || '请选择'} key='0'>
                        {
                            relatedPageOption?.map(item => 
                                <p style={{cursor: 'pointer'}} key={item.uid} onClick={() => selectedHandle(item, '0')}>{item.name}</p>
                            )
                        }
                    </TabPane>
                    {currentSelectRelatedPageOpt[0]?.children.length && <TabPane tab={currentSelectRelatedPageOpt[1]?.name || '请选择'} key='1'>
                        {
                            currentSelectRelatedPageOpt[0].children.map(item => 
                                <p style={{cursor: 'pointer'}} key={item.uid} onClick={() => selectedHandle(item, '1')}>{item.name}</p>)
                        }
                    </TabPane>}
                    {(currentSelectRelatedPageOpt[1]?.linkType === 2 || currentSelectRelatedPageOpt[0]?.linkType === 2 ) && <TabPane tab='请选择' key= {currentSelectRelatedPageOpt[0]?.linkType === 2 ? '1' : '2'}>
                        <Search
                            value={searchText}
                            placeholder='可输入关键字进行检索'
                            onChange={handleChange}
                        />
                        {detailType === 4 && <Radio.Group style={{marginTop: 8}} buttonStyle='solid'  size='small' value={currentarticleDicCode} buttonStyle="solid"  onChange={radioGroupChange}>
                            {
                                articleDicOpts.map(item => <Radio.Button key={item.code} value={item.code}>{item.name}</Radio.Button>)
                            }
                        </Radio.Group>}
                        <Table
                            size='small'
                            style={{marginTop: 8, cursor: 'pointer'}}
                            columns={ ColumnsObj[`columns_${detailType}`] }
                            dataSource={dataList}
                            rowKey={(r, i) => i}
                            onRow={record => {
                                return {
                                    onClick: e => rowClick(e, record)
                                }
                            }}
                            pagination={{
                                current: pageNum,
                                pageSize,
                                total: recordTotal,
                                onChange: pageChange
                            }}
                        />
                    </TabPane>}
                </Tabs>
            </div>}
            </>
        )
}
