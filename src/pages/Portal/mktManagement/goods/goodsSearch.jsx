/*
 * @Author: tdd 
 * @Date: 2021-03-26 13:23:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-26 13:49:12 
 * 商品搜索
 */
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

function GoodsSearch(props) {
  const {
    form: { validateFields, getFieldDecorator },
  } = props;
  const [checkNick, setcheckNick] = useState(false);

  function check() {
    validateFields(err => {
      !err && console.info('success');
    });
  }

  function handleChange(e) {
    setcheckNick(e.target.checked);
    validateFields(['nickname'], { force: true });
  }

  return (
    <Form layout="inline">
      <Item label="活动名称">
        {getFieldDecorator('actName', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(
          <Select defaultValue="lucy" style={{ width: 120 }} placeholder="请选择类型">
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled">Disabled</Option>
          </Select>
        )}
      </Item>
      <Item label="商品名称">
        {getFieldDecorator('goodsName', {
          rules: [
            {
              required: true,
              message: 'Please input your name',
            },
          ],
        })(<Input placeholder="" />)}
      </Item>
      <Item>
        <Button type="primary">搜索</Button>
      </Item>
    </Form>
  );
}

export default Form.create({ name: 'goods_search' })(GoodsSearch);
