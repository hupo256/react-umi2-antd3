/*
 * @Author: tdd 
 * @Date: 2021-03-25 17:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-25 17:49:12 
 * 添加、修改活动
 */
import React, { useState, useContext } from 'react';
import moment from 'moment';
import mktApi from '@/services/mktActivity';
import { ctx } from '../common/context';
import { Form, Input, DatePicker, Select, InputNumber, Button, Radio } from 'antd';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;
const { Group } = Radio;

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
  const { settbData, setactModal } = useContext(ctx);

  function submitForm() {
    validateFields((err, values) => {
      if (err) return;
      console.log(values);
      const { startTime, endTime } = values;
      const newRec = {
        ...values,
        startTime: moment(startTime).format('YYYY-MM-DD hh:mm:ss'),
        endTime: moment(endTime).format('YYYY-MM-DD hh:mm:ss'),
        // activeId: ''
      };
      console.log(newRec);
      mktApi.newActivity(newRec).then(res => {
        console.log(res);
        const { data } = res;
        if (!data) return;
        settbData(data.list);
        setactModal(false);
      });
    });
  }
  return (
    <Form {...formItemLayout}>
      <Item label="活动名称">
        {getFieldDecorator('activeName', {
          rules: [
            {
              required: true,
              message: 'Please input your name',
            },
          ],
        })(<Input placeholder="" />)}
      </Item>
      <Item label="活动类型">
        {getFieldDecorator('activeType', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(
          <Select style={{ width: 120 }} placeholder="请选择类型">
            <Option value={1}>Jack</Option>
            <Option value={2}>Lucy</Option>
            <Option value={3}>Disabled</Option>
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
        {getFieldDecorator('activeNum', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(<InputNumber min={1} step={1} />)}
      </Item>
      <Item label="是否开启">
        {getFieldDecorator('state', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(
          <Group>
            <Radio value={1}>开启</Radio>
            <Radio value={0}>未开启</Radio>
          </Group>
        )}
      </Item>
      <Item label="活动规则">
        {getFieldDecorator('activeRule', {})(<TextArea autoSize={{ minRows: 3 }} />)}
      </Item>

      <Item {...formTailLayout}>
        <Button onClick={() => setactModal(false)}>取消</Button>
        <Button type="primary" onClick={submitForm}>
          确定
        </Button>
      </Item>
    </Form>
  );
}

export default Form.create({ name: 'add_new_active' })(AddNewAct);
