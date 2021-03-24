/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-24 13:49:12 
 * 抽屉中的编辑组件
 */
import React, { useState, useContext } from 'react';
import { ctx } from '../common/context';
import { Table, message, Button } from 'antd';
import { createUuid } from '../tools';
import styles from './editBar.less';

const maxLen = 6;

export default function EditBar(props) {
  const { comColumn } = props;
  const { tagsData, settagsData } = useContext(ctx);
  const [columns, setcolumns] = useState(() => tuouchColumns());

  function tuouchColumns() {
    const optCol = {
      title: '操作',
      key: 'opration',
      render: (text, record, index) => (
        <div className={styles.tbOpration}>
          <span onClick={() => toMove(index, -1)}>up</span>
          <span onClick={() => toMove(index, 1)}>down</span>
          <span onClick={() => delImg(index)}>del</span>
        </div>
      ),
    };
    return [...comColumn, optCol];
  }

  function toMove(ind, num) {
    const rec = tagsData.splice(num, 1)[0];
    tagsData.splice(ind + num, 0, rec);
    settagsData(tagsData.slice());
  }

  function delImg(num) {
    tagsData.splice(num, 1);
    settagsData(tagsData.slice());
  }

  function addNewImgs() {
    if (tagsData.length === maxLen) return message.warning('最多可添加6张图片');
    const rec = {};
    rec.key = createUuid();
    settagsData([...tagsData, rec]);
  }

  function getChange(e) {
    console.log(e);
  }

  return (
    <>
      <Table size="middle" dataSource={tagsData} columns={columns} pagination={false} />
      <p className={styles.addImg} onClick={addNewImgs}>
        <span>+</span>
        <span>添加轮播图</span>
      </p>

      <Button onClick={getChange} type="primary">
        Submit
      </Button>
    </>
  );
}
