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
  render() {
    return (
      <div style={{ height: '100%' }}>
        <PageHeaderWrapper>
          <WebSetting />
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default WebsettingIndex;
