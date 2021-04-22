/*
 * @Author: tdd 
 * @Date: 2021-04-02 16:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-02 16:49:12 
 * 编辑轮播图的url组件
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { LinkType, apiMap } from '../../tools/data';
import mktApi from '@/services/mktActivity';
import { Form, Modal, Select, AutoComplete } from 'antd';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
};

function LinkChoose(props) {
  const {
    form: { validateFields, getFieldDecorator, getFieldsValue, setFieldsValue },
    dList,
  } = props;
  const { linkEdtor, setlinkEdtor, curFlag, curInd, pageData, setpageData } = useContext(ctx);
  const [itemList, setitemList] = useState([]);
  const [curKey, setcurKey] = useState('');
  const [total, settotal] = useState(0);

  function typeSelect(val) {
    const key = apiMap[val];
    setcurKey(key);
    touchItems(key);
  }

  function touchItems(key, config) {
    const param = {
      pageNum: 1,
      pageSize: 10,
      status: 1,
      specialStatus: 1,
      gongdiStatus: 0,
    };
    mktApi[key]({ ...param, ...config }).then(res => {
      console.log(res);
      if (!res?.data) return;
      const { data } = res;
      const arr = data?.list?.map(item => {
        const {
          specialTitle,
          specialUid,
          gongdiTitle,
          gongdiUid,
          title,
          uid,
          name,
          activityTitle,
        } = item;
        return {
          name: specialTitle || gongdiTitle || title || name || activityTitle,
          value: specialUid || gongdiUid || uid,
        };
      });
      setitemList(arr);
      settotal(data.recordTotal);
    });
  }

  function getItemInfor() {
    const { uid = '' } = getFieldsValue();
    uid.includes('_') || setFieldsValue({ uid: '' });
    validateFields((err, vals) => {
      if (err) return;
      console.log(vals);
      const { type, uid } = vals;
      const [showTex, id] = uid.split('_');
      const curObj = dList[curInd];
      const pName = curFlag === 'highlights' ? 'text' : 'title';
      dList[curInd] = {
        ...curObj,
        uid: id,
        [pName]: showTex,
        type,
      };
      const newObj = { ...pageData };
      newObj.maps[curFlag].list = dList;
      setpageData(newObj);
      setlinkEdtor(false);
    });
  }

  function getMoreList(open) {
    open && touchItems(curKey, { pageSize: total });
  }

  return (
    <Modal
      title="设置跳转链接"
      visible={linkEdtor}
      destroyOnClose={true}
      onOk={getItemInfor}
      onCancel={() => setlinkEdtor(false)}
    >
      <Form {...formItemLayout}>
        <Item label="站内链接">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请添加站内链接' }],
          })(
            <Select
              placeholder="请选择跳转类型"
              onSelect={typeSelect}
              getPopupContainer={n => n.parentNode}
            >
              {LinkType.map(item => {
                const { name, value } = item;
                return (
                  <Option key={value} value={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          )}
        </Item>

        <Item label="具体页面">
          {getFieldDecorator('uid', {
            rules: [{ required: true, message: '请添加具体页面' }],
          })(
            <AutoComplete
              style={{ width: 200 }}
              filterOption={(val, opt) => opt?.props?.children.includes(val)}
              placeholder="可输入关键字进行检索"
              onDropdownVisibleChange={getMoreList}
              getPopupContainer={n => n.parentNode}
            >
              {itemList?.map(item => {
                const { name, value } = item;
                return (
                  <Option key={value} value={`${name}_${value}`}>
                    {name}
                  </Option>
                );
              })}
            </AutoComplete>
          )}
        </Item>
      </Form>
    </Modal>
  );
}

export default Form.create({ name: 'img_url_edit' })(LinkChoose);
