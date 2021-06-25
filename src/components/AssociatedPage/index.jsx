import React, { Component } from 'react'
import { Input, Icon, Radio, Tooltip, Tabs, Table  } from 'antd';
import sty from './index.less'
const { TabPane } = Tabs;

export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            currentTab: '1',
            currentValue: '',
            selectLists: [],

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

    changeTab = key => {
        this.setState({
            currentTab: key
        })
    }

    render() {
        const { options  } = this.props;
        console.log({options})
        const { show, currentTab, currentValue, selectLists } = this.state;
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
                        <TabPane tab={selectLists[0] ? selectLists[0].name : '请选择'} key='1'>
                            {
                                options && options.map(item => <div className={sty.item}>
                                        {item.name}
                                    </div>
                                )
                            }
                        </TabPane>

                    </Tabs>}
                </div>
               

            </div>
        )
    }
}
