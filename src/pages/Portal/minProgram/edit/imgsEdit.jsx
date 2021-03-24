/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑轮播
 */
import React, { useState, useEffect } from 'react';
import { Table, Select, Input, message } from 'antd';
import { dataSource } from '../tools/data';
import { createUuid } from '../tools';
import pholder from '../tools/tempbg.png';
import styles from './edit.less';

const { Option } = Select;
const maxLen = 6;

export default function Templates(props) {
  const [tbData, setdataSource] = useState(dataSource);

  function selectChange(e) {
    console.log(e);
  }

  const columns = [
    {
      title: '图片',
      key: 'name',
      width: 100,
      render: (text, record, index) => (
        <div className={styles.minImgBox}>
          <img src={pholder} alt="" />
        </div>
      ),
    },
    {
      title: '链接',
      key: 'age',
      width: 270,
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
    {
      title: '尺寸(宽*高)',
      key: 'address',
      width: 150,
      render: (text, record, index) => (
        <div className={styles.inpBox}>
          <Input defaultValue={record.key} />
          <Input />
        </div>
      ),
    },
    {
      title: '操作',
      key: 'opration',
      render: (text, record, index) => (
        <div className={styles.tbOpration}>
          <span onClick={() => toMove(index, -1)}>up</span>
          <span onClick={() => toMove(index, 1)}>down</span>
          <span onClick={() => delImg(index)}>del</span>
        </div>
      ),
    },
  ];

  function toMove(ind, num) {
    const rec = tbData.splice(num, 1)[0];
    tbData.splice(ind + num, 0, rec);
    setdataSource(tbData.slice());
  }

  function delImg(num) {
    tbData.splice(num, 1);
    setdataSource(tbData.slice());
  }

  function addNewImgs() {
    if (tbData.length === maxLen) return message.warning('最多可添加6张图片');
    const rec = {};
    rec.key = createUuid();
    setdataSource([...tbData, rec]);
  }

  return (
    <>
      <Table size="middle" dataSource={tbData} columns={columns} pagination={false} />
      <p className={styles.addImg} onClick={addNewImgs}>
        <span>+</span>
        <span>添加轮播图</span>
      </p>
    </>
  );
}
