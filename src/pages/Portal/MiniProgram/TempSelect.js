/*
 * @Author: zqm 
 * @Date: 2021-03-22 11:42:16 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-22 15:29:40
 * 模板选择
 */
import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Button, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './MiniProgram.less';
import router from 'umi/router';
import { fixedTitle } from '@/utils/utils';
const { Step } = Steps;
class TempSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  componentDidMount() {}

  render() {
    const { step } = this.state;
    const data = [
      {
        url:'https://org.modao.cc/uploads4/images/6237/62376504/v2_qq3qfv.png',
        name:'经典大红色',
        tag:'默认',
        color:'red'
      }, {
        url:'https://org.modao.cc/uploads4/images/6237/62376504/v2_qq3qfv.png',
        name:'经典黑白风',
        tag:'',
        color:'#222'
      },{
        url:'https://org.modao.cc/uploads4/images/6237/62376504/v2_qq3qfv.png',
        name:'简约海风蓝',
        tag:'',
        color:'blue'
      },{
        url:'https://org.modao.cc/uploads4/images/6237/62376504/v2_qq3qfv.png',
        name:'传统清新绿',
        tag:'',
        color:'green'
      },{
        url:'https://org.modao.cc/uploads4/images/6237/62376504/v2_qq3qfv.png',
        name:'缤纷靓丽橙',
        tag:'',
        color:'#fe6a30'
      },{
        url:'https://org.modao.cc/uploads4/images/6237/62376504/v2_qq3qfv.png',
        name:'流行奶茶色',
        tag:'',
        color:'pink'
      },
    ]
    return (
      <div>
        <PageHeaderWrapper  >
          <Card bordered={false} style={{marginTop:0}}>
            <p>请选择一个模板开始</p>
            <p>模板可以帮你自动设计案例、工地、设计师还有功能布局和风格哟，选择后，也可以随时进行更换！</p>
         
            <div>
            {
              data.map((item,index)=>{
                return (
                  <div key={index} className={styles.itemwrap} >
                    <img src={item.url} ></img>
                    <p>{item.name}{item.tag&&<span style={{color:item.color}}>{item.tag}</span>}</p>
                    <div className={styles.model}><Button type='primary' style={{marginTop:260}} onClick={()=>this.handleClick(item.color)}>开始编辑</Button></div>
                  </div>
                )
              })
            }
            </div>
         
            </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
  handleClick=color=>{

    router.push(`/portal/miniprogram/tempdetail?theme=${color}`)
  }
}

export default TempSelect;

