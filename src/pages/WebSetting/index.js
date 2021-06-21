/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-06-10 19:34:14
 * 网站设置
 */
import React, { Component } from 'react';
import WebSetting from './WebSetting';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class WebsettingIndex extends Component {
  componentWillMount() {}
  // componentDidMount(){
  //   let ua = navigator.userAgent.toLocaleLowerCase();
  //   if(ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null){
  //     const iconDiv = document.querySelector('.ant-layout-content');
  //     const indexDiv = document.querySelector('.websettingIndexDiv');
  //     iconDiv.style.position = 'relative';
  //     indexDiv.style.position = 'absolute';
  //     indexDiv.style.width = '100%';
  //     console.log('iconDiv',iconDiv)
  //     // iconDiv.style.top = '-65px';
  //   }
  // }
  render() {
    return (
      <div className='websettingIndexDiv' style={{ height: '96%' }}>
        <PageHeaderWrapper>
          <WebSetting />
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default WebsettingIndex;
