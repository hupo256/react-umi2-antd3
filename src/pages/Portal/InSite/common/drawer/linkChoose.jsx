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

function ImgUrlEdit(props) {
  const {
    form: { validateFields, getFieldDecorator },
    dList,
  } = props;
  const { linkEdtor, setlinkEdtor, curFlag, curInd, pageData, setpageData } = useContext(ctx);
  const [itemList, setitemList] = useState([]);

  function typeSelect(val) {
    const key = apiMap[val];
    const param = {
      pageNum: 1,
      pageSize: 10,
      status: 1,
      specialStatus: 1,
      gongdiStatus: 1,
    };
    mktApi[key](param).then(res => {
      console.log(res);
      if (!res?.data) return;
      const arr = res.data?.list?.map(item => {
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
    });
  }

  function getItemInfor(e) {
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
      console.log(newObj);
      setpageData(newObj);
      setlinkEdtor(false);
    });
  }

  return (
    <Modal
      title="设置跳转链接"
      visible={linkEdtor}
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

export default Form.create({ name: 'img_url_edit' })(ImgUrlEdit);
