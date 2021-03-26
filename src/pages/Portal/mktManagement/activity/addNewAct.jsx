/*
 * @Author: tdd 
 * @Date: 2021-03-25 17:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-25 17:49:12 
 * 添加、修改活动
 */
import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, InputNumber } from 'antd';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

function AddNewAct(props) {
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
    <Form {...formItemLayout}>
      <Item label="活动名称">
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: 'Please input your name',
            },
          ],
        })(<Input placeholder="" />)}
      </Item>
      <Item label="活动类型">
        {getFieldDecorator('actType', {
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
      <Item label="开始时间">
        {getFieldDecorator('startTime', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            // value={startValue}
            placeholder="Start"
            // onChange={this.onStartChange}
            // onOpenChange={this.handleStartOpenChange}
          />
        )}
      </Item>
      <Item label="结束时间">
        {getFieldDecorator('endTime', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            // value={endValue}
            placeholder="End"
            // onChange={this.onEndChange}
            // open={endOpen}
            // onOpenChange={this.handleEndOpenChange}
          />
        )}
      </Item>
      <Item label="参与次数">
        {getFieldDecorator('actCount', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(<InputNumber min={1} step={1} />)}
      </Item>
      <Item label="是否开启">
        {getFieldDecorator('isOpen', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(<Input placeholder="" />)}
      </Item>
      <Item label="活动规则">
        {getFieldDecorator('actCount', {})(<TextArea autoSize={{ minRows: 3 }} />)}
      </Item>
    </Form>
  );
}

export default Form.create({ name: 'add_new_active' })(AddNewAct);
