/*
 * @Author: tdd 
 * @Date: 2021-04-02 16:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-02 16:49:12 
 * 编辑轮播图的url组件
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { Form, Modal, Select } from 'antd';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
};

function ImgUrlEdit(props) {
  const {
    form: { validateFields, getFieldDecorator },
  } = props;
  const { imgUrlModal, setimgUrlModal } = useContext(ctx);

  function getImgUrl(e) {
    console.log(e);
    validateFields((err, values) => {
      if (err) return;
      console.log(values);
    });
  }

  return (
    <Modal
      title="Basic Modal"
      visible={imgUrlModal}
      onOk={getImgUrl}
      onCancel={() => setimgUrlModal(false)}
    >
      <Form {...formItemLayout}>
        <Item label="站内链接">
          {getFieldDecorator('theurl', {
            rules: [
              {
                required: true,
                // message: 'Please input your name',
              },
            ],
          })(
            <Select placeholder="请选择跳转类型">
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled">Disabled</Option>
            </Select>
          )}
        </Item>

        <Item label="具体页面">
          {getFieldDecorator('thepage', {
            rules: [
              {
                required: true,
                // message: 'Please input your name',
              },
            ],
          })(
            <Select placeholder="可输入关键字进行检索">
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled">Disabled</Option>
            </Select>
          )}
        </Item>
      </Form>
    </Modal>
  );
}

export default Form.create({ name: 'img_url_edit' })(ImgUrlEdit);
