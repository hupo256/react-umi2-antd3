import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal } from 'antd'
import router from 'umi/router';

@connect(({ ContentManage }) => ({

    ContentManage,
}))
  
export default class Applets extends Component {
    handleCancel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'ContentManage/upData',
            payload: {
                visible: false,
            }
        })
    }
    render() {
        const { showUrl, downloadUrl, visible } = this.props.ContentManage;
        return (
            <div>
                 <Modal
                    title='小程序码'
                    visible={visible}
                    onCancel={this.handleCancel}
                    width='360px'
                    footer={null}
                >
                    <div style={{textAlign: 'center'}}>
                    <img style={{width: '90%'}} src={showUrl} />
                    <a style={{
                        display: 'inline-block', 
                        width: 119, 
                        height: 32, 
                        margin: '32px 0 8px',
                        lineHeight: '32px', 
                        textAlign: 'center', 
                        borderRadius: 4, 
                        background: '#fe6a30', 
                        color: '#fff'
                        }}
                        download
                        href={downloadUrl}         
                    >下载小程序码</a>
                    </div>
                
                </Modal>
            </div>
        )
    }
}
