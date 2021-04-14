/*
 * @Author: tdd 
 * @Date: 2021-03-26 14:09:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-26 14:49:12 
 * 添加、修改商品
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import moment from 'moment';
import mktApi from '@/services/mktActivity';
import { Form, Input, InputNumber, Button, Radio, DatePicker } from 'antd';
import styles from './addGame.less';

const { Item } = Form;
const { Group } = Radio;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8, offset: 8 },
};

function AddNewGoods(props) {
  const {
    form: { validateFields, getFieldDecorator, setFieldsValue },
    gData,
  } = props;
  const { setactivityCode, setactivityTitle } = useContext(ctx);

  useEffect(
    () => {
      gData && fillForm();
    },
    [gData]
  );

  function fillForm() {
    const {
      activityType,
      activityTitle,
      activitySubtitle,
      actvityConvertRule,
      activityRule,
      activityJoinNum,
      activityJoinType,
      startTime,
      endTime,
    } = gData;
    const activityTime = [moment(startTime), moment(endTime)];
    setFieldsValue({
      activityType,
      activityTitle,
      activitySubtitle,
      activityTime,
      actvityConvertRule,
      activityRule,
      activityJoinNum,
      activityJoinType,
    });
  }

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  function disabledRangeTime(_, type) {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }

  function updateGame() {
    validateFields((err, values) => {
      if (err) return;
      const { activityTime } = values;
      const [st, et] = activityTime;
      const newRec = {
        ...values,
        startTime: moment(st).format('YYYY-MM-DD hh:mm:ss'),
        endTime: moment(et).format('YYYY-MM-DD hh:mm:ss'),
      };

      mktApi.newActivity(newRec).then(res => {
        console.log(res);
        const { data } = res;
        if (!data && gData) return;
        const { activityCode, activityTitle } = data;
        setactivityCode(activityCode);
        setactivityTitle(activityTitle);
      });
    });
  }

  return (
    <div className={styles.fromOut}>
      <Form {...formItemLayout}>
        <Item label="游戏形式">
          {getFieldDecorator('activityType', { rules: [{ required: true }] })(
            <Group>
              <Radio value={1}>大转盘</Radio>
              <Radio value={2}>砸金蛋</Radio>
              <Radio value={3}>跑马灯</Radio>
            </Group>
          )}
        </Item>
        <Item label="游戏标题">
          {getFieldDecorator('activityTitle', { rules: [{ required: true }] })(
            <Input placeholder="游戏标题" style={{ width: 345 }} />
          )}
        </Item>
        <Item label="游戏副文本">
          {getFieldDecorator('activitySubtitle')(<Input placeholder="游戏副文本" />)}
        </Item>
        <Item label="起止时间">
          {getFieldDecorator('activityTime', { rules: [{ required: true }] })(
            <RangePicker
              disabledDate={disabledDate}
              disabledTime={disabledRangeTime}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          )}
        </Item>
        <Item label="参与次数类型">
          {getFieldDecorator('activityJoinType', { rules: [{ required: true }] })(
            <Group>
              <Radio value={1}>总次数</Radio>
              <Radio value={2}>每日次数</Radio>
            </Group>
          )}
        </Item>
        <Item label=" ">
          {getFieldDecorator('activityJoinNum', { rules: [{ required: true }] })(
            <InputNumber min={1} step={1} />
          )}
          <span style={{ paddingLeft: '.5em' }}>次</span>
        </Item>
        <Item label="规则说明">
          {getFieldDecorator('activityRule')(<TextArea placeholder="请输入规则说明" allowClear />)}
        </Item>
        <Item label="兑换说明">
          {getFieldDecorator('actvityConvertRule', { rules: [{ required: true }] })(
            <TextArea placeholder="请输入兑换说明" allowClear />
          )}
        </Item>

        <Item {...formTailLayout}>
          <Button type="primary" onClick={() => updateGame(gData)}>
            {gData ? '保存' : '下一步'}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'add_new_active' })(AddNewGoods);
