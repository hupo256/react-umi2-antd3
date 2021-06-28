import React, { Component } from 'react'
import { Input, Icon, Radio, Tooltip, Tabs, Table  } from 'antd';
import sty from './index.less'
const { TabPane } = Tabs;

export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            currentTab: '0',
            currentValue: '',
            selectLists: [],
            tabPanList: []
        }
    }
    
    componentDidMount() {
        document.body.addEventListener('click', e => {
            // e.stopPropagation();
            e.preventDefault();
            if (e.target.id==='myInput' || e.target.parentNode.id === 'mySvg') {
                this.setState(prevState => ({
                    show: !prevState.show
                }))
                return;

            }
            if(!this.refs.tabWrap?.contains(e.target)) {
                this.setState({
                    show: false
                })
            }

        })
    }

    componentDidUpdate(prev) {
        if (this.props.options.length && (prev.options !== this.props.options) ) {
            this.initData()
        }

    }

    // 初始化第一列
    initData = () => {
        const { options } = this.props
        
       
        this.setState({
            tabPanList: [options]
        })
    }

    changeTab = key => {
        this.setState({
            currentTab: key
        })
    }

    itemClick = (item, index) => {
        console.log(index)
        let { tabPanList, selectLists} = this.state;
        selectLists.push( item)
        if (item?.children.length) {
            tabPanList.splice(index, 0, item.children  )
            
            this.setState({
                tabPanList,
                selectLists
            })
                // this.setState(prev => ({
                //     tabPanList: prev.tabPanList.splice(index, 0, item.children  ),
                //     selectLists: prev.selectLists.splice(index, 0, item  )
                // }))
        }
        
    }

    render() {
        const { options  } = this.props;
        const { show, currentTab, currentValue, selectLists, tabPanList } = this.state;
        console.log({tabPanList, selectLists})
        return (
            <div ref='wrap' className={sty.wrap}  onClick={this.wrapClick}  style={{minWidth: 200, display: 'inline-block', position: 'relative'}}>
                <Input  
                    className={sty.myInput}
                    id='myInput'
                    value={currentValue}
                    ref='myInput'
                     suffix={                     
                        <Icon type="down" id='mySvg' style={{transform: show ? 'rotate(180deg)' : 'none'}} />   
                      }
                    readOnly
                />
                <div ref='tabWrap'>
                    {show && <Tabs onChange={this.changeTab} type="card" activeKey={currentTab}>
                        {
                            tabPanList.length && tabPanList.map( (item, index) => <TabPane tab={selectLists[index] ? selectLists[index].name : '请选择'} key={index + ''}>
                            {
                                item.length && item.map(item => <div className={sty.item} onClick={() => {this.itemClick(item, index)}}>
                                        {item.name}
                                    </div>
                                )
                            }
                        </TabPane> )
                        }
                        
                        {

                        }
                    </Tabs>}
                </div>
               

            </div>
        )
    }
}
