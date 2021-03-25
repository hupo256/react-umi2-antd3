/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑亮点
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import { Select, Input } from 'antd';
import { dataSource } from '../tools/data';
import EditBar from '../common/editBar';
import styles from './edit.less';

const { Option } = Select;

export default function Templates(props) {
  const { tagsData, settagsData } = useContext(ctx);

  useEffect(() => {
    settagsData(dataSource);
  }, []);

  function selectChange(e) {
    console.log(e);
  }

  const columns = [
    {
      title: '主标题',
      key: 'name',
      width: 100,
      render: (text, record, index) => (
        <Input placeholder="请输入主标题" defaultValue={record.key} />
      ),
    },
    {
      title: '副文本',
      key: 'age',
      width: 270,
      render: (text, record, index) => <Input placeholder="请输入副文本" />,
    },
    {
      title: '链接',
      key: 'address',
      width: 150,
      render: (text, record, index) => (
        <div className={styles.inpBox}>
          <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            onChange={selectChange}
            placeholder="请选择类型"
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled">Disabled</Option>
          </Select>
          <Input placeholder="具体页面，输入文字搜索" />
        </div>
      ),
    },
  ];

  return <EditBar comColumn={columns} />;
}
