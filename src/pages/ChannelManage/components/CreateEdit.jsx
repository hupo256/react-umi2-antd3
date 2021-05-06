import React, { Component } from 'react'
import { connect } from 'dva'
import { createChannel, getRelatedPage, getDetailApi, editChannelApi } from '@/services/channelManage'
import { Form, Input, Select, Button, Cascader, message  } from 'antd'


const { TextArea } = Input;
const { Option } = Select;
@connect(state => ({
    ...state.channelManage
}))
@Form.create()
export default class CreateEdit extends Component {
    constructor(props){
        super(props)
        this.state ={
            relatedPageOption: [],
            currentSelectRelatedPageOpt: [],
            detailUid: undefined
        }
    }
    async componentDidMount() {
        const { isCreate, currentEditUid } = this.props;
        if (!isCreate) {
            this.getDetail(currentEditUid)
        }
        const res = await getRelatedPage({sceneType: 1});
        this.setState({
            relatedPageOption: this.format(res?.data) 
        })
    }

    async componentDidUpdate( prevProps ) {
        const { form, isCreate } = this.props;

        // 编辑回填默认数据
        if ( this.props.currentEditUid && this.props.showCreateEdit !== prevProps.showCreateEdit &&  this.props.showCreateEdit) {
            this.getDetail(this.props.currentEditUid)
        }

        // 关闭重置表单组件数据
        if (  this.props.showCreateEdit !== prevProps.showCreateEdit  ) {
            form.resetFields()
        }

        // 关闭详情弹框重置关联页面选项
        if(!this.props.selectDetailData.length && this.props.currentDetailType !== prevProps.currentDetailType && this.props.currentDetailType === 0) {
            const arr = this.props.form.getFieldValue('relatedPage');
            arr?.pop();
            this.props.form.setFieldsValue({
                relatedPage: arr
            })
        }
    }

/**
 * @description: 获取频道详情 
 * @param {*}
 * @return {*}
 */    
    getDetail = async uid => {
        const { form } = this.props;
        if (!uid) return;
        const res = await getDetailApi({ uid });
        this.setState({
            detailUid: res.data.detailUid
        })
        form.setFieldsValue({
            ...res?.data,
            relatedPage: res?.data?.paths
        })
    }

    /**
     * @description: 解构重组后台数据
     * @param {*}
     * @return {*}
     */    
    format = data => {
        if (!Array.isArray(data)) return;
        const newArr = [];
        for (const item of data) {            
            newArr.push ({
                ...item.node,
                children: item.children.length ? this.format(item.children) : []
            })
        } 
        return newArr
    }
 
    handleSubmit =  e => {
        const { form, isCreate, selectDetailData } = this.props
        e.preventDefault();
        form.validateFields( (err, values) => {       
            if (err) {
              return
            }
            if (isCreate) {
                let {   relatedPage, ...params } = { ...values, paths: values.relatedPage, detailUid: selectDetailData[0]}
                
                createChannel(params).then(res => {
                    if (res?.code === 200) {
                        this.resetHandle();
                        message.success('频道创建成功!')
                    }
                })

            
            } else {
                const { currentEditUid } = this.props;
                let {   relatedPage, ...params } = { ...values, paths: values.relatedPage, detailUid: selectDetailData[0] || this.state.detailUid, uid: currentEditUid }
                editChannelApi(params).then(res => {
                    if (res?.code === 200) {
                        this.resetHandle();
                        message.success('编辑已保存，发布后生效 !')
                    }
                })
            }
            

        });
    }

    /**
     * @description: 重置状态框
     * @param {*}
     * @return {*}
     */
    resetHandle = () => {
        const { dispatch, showCreateEdit, form } = this.props;
        dispatch({
            type: 'channelManage/save',
            payload: {
                showCreateEdit: !showCreateEdit,
                currentDetailType: 0,
                selectDetailData: []
            }
        }) 

    }
    /**
     * @description: 选取关联页面
     * @param {*}
     * @return {*}
     */
     onChangeHandle = async (val, opt) => {
        const { form, dispatch } = this.props;

        // 进入详情页选择
        if (opt[opt.length - 1].linkType === 2) {
            dispatch({
                type: 'channelManage/save',
                payload: {
                    selectDetailData: [],
                    currentDetailType: opt[opt.length - 1].detailType,
                }
            })

        } 
        this.setState({
            currentSelectRelatedPageOpt: opt
        })

    }


    render() {
        const { form, isCreate  } = this.props;
        const { relatedPageOption } = this.state
        const { getFieldDecorator } = form


        
        return (
            <div className='createEdit'>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 13 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="小程序频道名称">
                        {getFieldDecorator('appletsName', {
                            rules: [
                                { required: true, message: '请输入正确的小程序频道名称!' },
                                { max: 4, message: '限制1-4字符长度' }
                            ],
                        })(<Input placeholder='请输入小程序频道名称' />)}
                    </Form.Item>
                    <Form.Item label="网站频道名称">
                        {getFieldDecorator('websiteName', {
                            rules: [
                                { max: 6, message: '限制0-6字符长度' }
                            ],
                        })(<Input  placeholder='请输入网站频道名称' />)}
                    </Form.Item>
                    <Form.Item label="频道介绍">
                        {getFieldDecorator('brief', {
                            rules: [
                                { max: 30, message: '限制0-30字符长度' }
                            ],
                        })(<Input  placeholder='请输入频道介绍' />)}
                    </Form.Item>
                    <Form.Item label="关联页面">
                        {getFieldDecorator('relatedPage', {
                            rules: [{ required: true, message: '请选择关联页面!' }],
                        })(
                            <Cascader
                                options={relatedPageOption}
                                expandTrigger="hover"
                                placeholder='请选择关联页面'
                                allowClear={false}
                                getPopupContainer={() => document.querySelector('.createEdit') }
                                changeOnSelect
                                fieldNames={{
                                    label: 'name',
                                    value: 'uid'
                                }}
                                onChange={this.onChangeHandle}
                                displayRender={this.renderHandle}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="频道说明">
                        {getFieldDecorator('description', {
                            rules: [
                                { max: 200, message: '限制0-30字符长度' }
                            ],
                        })(<TextArea placeholder='请输入频道说明' autoSize={{minRows: 4}} />)}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span:6, offset: 9 }}>
                        <Button type="primary" htmlType="submit" style={{float: 'left'}}>
                            确定
                        </Button>
                        <Button  style={{float: 'right'}} onClick={this.resetHandle}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
