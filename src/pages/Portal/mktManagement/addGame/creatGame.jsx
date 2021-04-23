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
import { Form, Input, InputNumber, Button, Radio, DatePicker, message } from 'antd';
import { urlParamHash } from '../tools';
import { gameTypes } from '../tools/data';
import styles from './addGame.less';

const { Item } = Form;
const { Group } = Radio;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 8 },
};

function AddNewGoods(props) {
  const {
    form: { validateFields, getFieldDecorator, setFieldsValue, getFieldsValue },
    isEdit,
  } = props;
  const { setstepNum, stepNum, setnewAct, newAct, curActDate } = useContext(ctx);
  const [typeOpts, settypeOpts] = useState([]);
  const [curType, setcurType] = useState(1);
  const [formDatas, setformDatas] = useState({});
  const [initSubTit, setinitSubTit] = useState('');

  useEffect(
    () => {
      if (isEdit) {
        const type = curActDate?.activityType;
        const arr = gameTypes.filter(opt => opt.code === type);
        arr.length && settypeOpts(arr);
        type && fillForm();
      } else {
        settypeOpts(gameTypes);
      }
    },
    [curActDate]
  );

  // useEffect(
  //   () => {
  //     stepNum === 0 && setFieldsValue(newAct);
  //   },
  //   [stepNum]
  // );

  useEffect(
    () => {
      let tit = '幸运大转盘';
      curType === 2 && (tit = '幸运砸金蛋');
      curType === 3 && (tit = '幸运跑马灯');
      setinitSubTit(tit);
    },
    [curType]
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
    } = curActDate;
    const activityTime = [moment(startTime), moment(endTime)];

    setFieldsValue({
      activityType,
      activityTitle,
      activitySubtitle,
      activityTime,
      activityJoinNum,
      activityJoinType,
      activityRule: htmlToStr(activityRule),
      actvityConvertRule: htmlToStr(actvityConvertRule),
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

  function htmlToStr(str = '') {
    str = str.replace(/<br\/>/g, '\r\n'); //IE9、FF、chrome
    str = str.replace(/&nbsp;/g, 's'); //空格处理
    return str;
  }

  function strToHtml(str = '') {
    str = str.replace(/\r\n/g, '<br/>'); //IE9、FF、chrome
    str = str.replace(/\s/g, '&nbsp;'); //空格处理
    return str;
  }

  function updateGame() {
    validateFields((err, values) => {
      console.log(values);
      if (err) return;
      const { uid } = urlParamHash(location.href);
      const { activityTime, actvityConvertRule, activityRule } = values;
      const [st, et] = activityTime;
      const newAct = {
        ...values,
        uid,
        actvityConvertRule: strToHtml(actvityConvertRule),
        activityRule: strToHtml(activityRule),
        startTime: moment(st).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(et).format('YYYY-MM-DD HH:mm:ss'),
      };

      setnewAct(newAct); // 刷新一下以便下步使用
      if (!isEdit) {
        setstepNum(1);
      } else {
        mktApi.reviseActivity(newAct).then(res => {
          console.log(res);
          res?.data && message.success('保存成功');
        });
      }
    });
  }

  function onRadioChange(e) {
    const val = e.target.value;
    setformDatas({ ...formDatas, [curType]: getFieldsValue() }); //切换前先存一下
    setFieldsValue(formDatas[val]); // 刷新form数据
    setcurType(val); // 刷新当前的type
  }

  return (
    <div className={styles.fromOut}>
      <Form {...formItemLayout}>
        <Item label="游戏形式">
          {getFieldDecorator('activityType', {
            initialValue: 1,
            rules: [{ required: true, message: '请选择游戏形式' }],
          })(
            <Group onChange={onRadioChange}>
              {typeOpts?.map(opt => {
                const { name, code, imgUrl } = opt;
                return (
                  <div key={code} className={styles.typeOpt}>
                    <Radio value={code}>
                      <img src={imgUrl} />
                      <p>{name}</p>
                    </Radio>
                  </div>
                );
              })}
            </Group>
          )}
        </Item>
        <Item label="游戏标题">
          {getFieldDecorator('activityTitle', {
            initialValue: initSubTit,
            rules: [
              { required: true, message: '请填写游戏标题' },
              { max: 15, message: '最多输入15个字符' },
            ],
          })(<Input placeholder="游戏标题" style={{ width: 410 }} />)}
        </Item>
        <Item label="游戏副文本">
          {getFieldDecorator('activitySubtitle', {
            initialValue: '-好运连连，点击GO开启好运-',
            rules: [
              { required: true, message: '请填写游戏副文本' },
              { max: 15, message: '最多输入15个字符' },
            ],
          })(<Input placeholder="游戏副文本" style={{ width: 410 }} />)}
        </Item>
        <Item label="起止时间">
          {getFieldDecorator('activityTime', {
            rules: [{ required: true, message: '请选择起止时间' }],
          })(
            <RangePicker
              // disabledDate={disabledDate}
              // disabledTime={disabledRangeTime}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm'), moment('23:59:59', 'HH:mm')],
              }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: 410 }}
            />
          )}
        </Item>
        <Item label="参与次数">
          {getFieldDecorator('activityJoinType', {
            initialValue: 1,
            rules: [{ required: true, message: '请选择参与次数类型' }],
          })(
            <Group>
              <Radio value={1}>总次数</Radio>
              <Radio value={2}>每日次数</Radio>
            </Group>
          )}
        </Item>
        <Item label=" " className="joinNumTag">
          {getFieldDecorator('activityJoinNum', {
            initialValue: 1,
            rules: [{ required: true, message: '请填写参与次数' }],
          })(<InputNumber min={1} step={1} precision={0} style={{ width: 150 }} />)}
          <span style={{ paddingLeft: '.5em' }}>次</span>
        </Item>
        <Item label="规则说明">
          {getFieldDecorator('activityRule', {
            rules: [{ max: 200, message: '最多输入200个字符' }],
          })(<TextArea placeholder="请输入规则说明" />)}
        </Item>
        <Item label="兑换说明">
          {getFieldDecorator('actvityConvertRule', {
            rules: [
              { required: true, message: '请填写兑换说明' },
              { max: 200, message: '最多输入200个字符' },
            ],
          })(<TextArea placeholder="请输入兑换说明" />)}
        </Item>

        <Item {...formTailLayout}>
          <Button type="primary" onClick={updateGame}>
            {isEdit ? '保存' : '下一步'}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'add_new_active' })(AddNewGoods);
