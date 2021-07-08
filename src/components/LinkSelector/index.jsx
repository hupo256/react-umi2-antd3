/*
 * @Author: tdd 
 * @Date: 2020-06-17 14:35:33 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-07-05 11:09:47
 * 关联页面级联选择器
 */

import React, { useState, useEffect } from 'react'
import { siteListApi, designerListApi, caseListApi, articleListApi, articleDicApi, specialListApi, activeListApi } from '@/services/channelManage'
import { Input, Tabs, Table, Radio, Icon } from 'antd'
import { ColumnsObj } from './CasColumn'
import styles from './index.less'

const { TabPane } = Tabs
const { Search } = Input;

const placeholderArr = [
    '工地标题',
    '设计师姓名',
    '案例标题',
    '文章标题/内容',
    '专题标题',
    '小游戏标题'
];

export default function LinkSelector(props){
    const { curItem={}, cascadeClick, disabled, optsArr, curNavs=[], callFun } = props
    const {appletsName, linkDisplayName='', showSec=false} = curItem

    const [showSelectPanl, setshowSelectPanl] = useState(false)  // 选择器的显示开关
    const [relatedPageOption, setrelatedPageOption] = useState([])  // 生成级联选择的数据
    const [currentSelectRelatedPageOpt, setcurrentSelectRelatedPageOpt] = useState([])  // 当前已选
    const [articleDicOpts, setarticleDicOpts] = useState([])  
    const [currentarticleDicCode, setcurrentarticleDicCode] = useState(undefined)  
    const [currentKey, setcurrentKey] = useState('0')  
    const [detData, setdetData] = useState(null)  // 查询出来的详情列表
    const [detailType, setdetailType] = useState(0)   // 祥情页类型 
    const [pageNum, setpageNum] = useState(1)  

    useEffect(() => {
        showSelect()
    }, [showSec])

    useEffect(() => {
        detailType && getDataList();
    }, [detailType])

    function showSelect(){
        setshowSelectPanl(showSec)
        setcurrentKey('0')
        setcurrentSelectRelatedPageOpt([])
        setrelatedPageOption(filterLevelOps())
    }

    // 过滤一级nav, 当children为空，则认为不应出现
    function filterLevelOps(){
        const len = curNavs.length  
        const optArr = format(optsArr)
        const arr = optArr.filter(ar => ar.children?.length > 0)
        return len > 0 ? arr  : optArr // curNavs如果大于0，则表示要去重
    }

    // 过滤二级掉已有的nav
    function touchSelcOpts(opts){
      const tempNavs = [...curNavs]
      const newOpts = opts.filter(opt => !tempNavs.includes(opt?.uid))
      return newOpts
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
        return newArr
    }

    // 格式化回显
    function formatData(opts){
        let arr = [];
        opts.forEach((opt, ind) => {
            const {name, title, articleTitle,gongdiTitle,specialTitle, activityTitle,
                uid, gongdiUid, articleUid, specialUid, icon, appletsLink, linkKey, linkType } = opt;
            // linkType 1 详情页,  2 列表页
            // linkKey 为空则表示选到了详情页
            // linkKey 标注是否到的详情页，isEnd标注是否到的末页
            const isEnd = (ind === 1 && linkType === 1) || linkKey==='home' || ind === 2 // 顺便处理是否到末级的逻辑
            arr.push({
                text: name || title || articleTitle  || gongdiTitle || specialTitle || activityTitle,
                code: uid || gongdiUid || articleUid || specialUid,
                icon, linkKey, linkType, appletsLink, isEnd
            })
        })
        return arr;
    }

    // tab面板切换
    function tabChange(key){
        setcurrentSelectRelatedPageOpt(currentSelectRelatedPageOpt.slice(0, +key))
        setcurrentKey(key)
    } 

    // 选择关联页面
    function selectedHandle(item, step){
        const {children, linkType, detailType} = item
        const arr = [...currentSelectRelatedPageOpt, item]
        setcurrentSelectRelatedPageOpt(arr)
        setcurrentKey(+step + 1 + '')
        setdetailType(detailType)

        if (!children.length && linkType === 1) hidePanel()
        if(callFun) callFun(formatData(arr))
    }

    // 获取表格数据
    async function getDataList (config){
        if(!detailType) return
        const status = detailType === 6 ? '' : '1'
        const searchText = config?.searchText || ''
        const prama = {
            gongdiStatus: 0,
            searchText,
            status,
            specialStatus: status,
            searchWord: searchText,
            activityTitle: searchText,
            articleDicCode: currentarticleDicCode,
            pageNum,
            pageSize: 10,
        }
        // 没有文章栏目时先请求一次
        if (detailType === 4 && !articleDicOpts.length) await getArticleDic();
        const apiKeys = [siteListApi, designerListApi, caseListApi, articleListApi, specialListApi, activeListApi]
        const { data, code } = await apiKeys[detailType-1]({...prama, ...config})
        if(code !== 200 ) return
        setdetData(data)
    }

    // 查询文章栏目选项
    async function getArticleDic(){
        const res = await articleDicApi({dicModuleCodes: 'DM006'});
        if(!res?.data) return
        setarticleDicOpts(res.data)
        setcurrentarticleDicCode(res.data[0]?.code)
    }

    // 文章类型切换
    function radioGroupChange(e){
        const val = e.target.value
        setcurrentarticleDicCode(val)
        getDataList({articleDicCode: val})
    }

    // 模糊查询  
    function handleChange(e){
        const val = e.target.value; 
        const getList =  _.debounce( () => {
            getDataList({searchText: val.slice(0, 30)})
        }, 300)
        setpageNum(1)
        getList()
    }

    // 行点击事件
    function rowClick(record){
        record.linkType = 1  // 到这里来的都是末节点了，作个标记
        const arr = [...currentSelectRelatedPageOpt, record]
        setcurrentSelectRelatedPageOpt(arr)
        hidePanel()

        if(callFun) callFun(formatData(arr))
    }

    // 关闭选择器面板时顺便重置
    function hidePanel(){
        setshowSelectPanl(false)

        setcurrentKey('0')
        setpageNum(1)
    }

    // 页码变换
    function pageChange(page){
        setpageNum(page)
        getDataList({pageNum: page});
    }

    return (
        <div onClick={e => e.stopPropagation()}>
            <Input
                readOnly
                disabled={disabled}
                value={appletsName || linkDisplayName}
                onClick={cascadeClick}
                placeholder="请选择关联页面"
                suffix={<Icon type="down" className={`${styles.inpSuffix} ${showSelectPanl ? styles.on : ''}`} />}
            />
            {showSelectPanl && <div className={styles['card-container']}>
                <Tabs type="card" tabBarGutter={0} activeKey={currentKey} onChange={tabChange}>
                    <TabPane tab={currentSelectRelatedPageOpt[0]?.name || '请选择'} key='0'>
                        {relatedPageOption?.map(item =>
                            <p style={{cursor: 'pointer'}} key={item.uid} onClick={() => selectedHandle(item, '0')}>{item.name}</p>
                        )}
                    </TabPane>
                    {currentSelectRelatedPageOpt[0]?.children.length && 
                        <TabPane tab={currentSelectRelatedPageOpt[1]?.name || '请选择'} key='1'>
                            {currentSelectRelatedPageOpt[0].children.map(item => 
                                <p style={{cursor: 'pointer'}} key={item.uid} onClick={() => selectedHandle(item, '1')}>{item.name}</p>
                            )}
                        </TabPane>}
                    {(currentSelectRelatedPageOpt[1]?.linkType === 2 || currentSelectRelatedPageOpt[0]?.linkType === 2 ) && 
                        <TabPane tab='请选择' key= {currentSelectRelatedPageOpt[0]?.linkType === 2 ? '1' : '2'}>
                            <Search
                                style={{marginTop: 8}}
                                placeholder={placeholderArr[+detailType - 1] ? `可通过${placeholderArr[(+detailType) - 1]}进行搜索` : '可输入关键字进行检索'}
                                onChange={handleChange}
                            />
                                {detailType === 4 && 
                                    <Radio.Group style={{marginTop: 8}} buttonStyle='solid' size='small' value={currentarticleDicCode} buttonStyle="solid" onChange={radioGroupChange}>
                                        {articleDicOpts.map(item => <Radio.Button key={item.code} value={item.code}>{item.name}</Radio.Button>)}
                                    </Radio.Group>
                                }
                            <Table
                                size='small'
                                style={{marginTop: 8, cursor: 'pointer'}}
                                columns={ ColumnsObj[`columns_${detailType}`] }
                                dataSource={detData?.list}
                                rowKey={(r, i) => i}
                                onRow={record => {return {onClick: () => rowClick(record)}}}
                                pagination={{
                                    current: pageNum,
                                    pageSize: 10,
                                    total: detData?.recordTotal,
                                    onChange: pageChange
                                }}
                            />
                        </TabPane>
                    }
                </Tabs>
            </div>}
        </div>
    )
}