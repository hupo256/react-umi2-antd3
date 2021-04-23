import React, { Component } from 'react';
import WebSetting from './WebSetting';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class WebsettingIndex extends Component {
    componentWillMount(){
    }
  render() {
    return (
      <div style={{height:'100%'}}>
        <PageHeaderWrapper>
            <WebSetting/>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default WebsettingIndex;
