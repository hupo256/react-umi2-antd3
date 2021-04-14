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
      const { data } = res;
      if (!data) return;
      const arr = data.list.map(item => {
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
      const [id, showTex] = uid.split('_');
      const curObj = dList[curInd];
      const pName = curFlag === 'highlights' ? 'text' : 'title';
      dList[curInd] = {
        ...curObj,
        uid: id,
        [pName]: showTex,
        type,
      };

      setpageData(pageData);
      setlinkEdtor(false);
    });
  }

  return (
    <Modal
      title="设置跳链接"
      visible={linkEdtor}
      onOk={getItemInfor}
      onCancel={() => setlinkEdtor(false)}
    >
      <Form {...formItemLayout}>
        <Item label="站内链接">
          {getFieldDecorator('type', {
            rules: [{ required: true }],
          })(
            <Select placeholder="请选择跳转类型" onSelect={typeSelect}>
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
            rules: [{ required: true }],
          })(
            <Select placeholder="可输入关键字进行检索">
              {itemList.length > 0 &&
                itemList.map(item => {
                  const { name, value } = item;
                  return (
                    <Option key={value} value={`${value}_${name}`}>
                      {name}
                    </Option>
                  );
                })}
            </Select>
          )}
        </Item>
      </Form>
    </Modal>
  );
}

export default Form.create({ name: 'img_url_edit' })(ImgUrlEdit);
