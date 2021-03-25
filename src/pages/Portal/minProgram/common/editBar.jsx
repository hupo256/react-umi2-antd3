/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-24 13:49:12 
 * 抽屉中的编辑组件
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import { Table, message, Button } from 'antd';
import { createUuid } from '../tools';
import styles from './editBar.less';

const maxLen = 6;

export default function EditBar(props) {
  const { comColumn } = props;
  const { tagsData, settagsData, imgsData, setimgsData, fromTag } = useContext(ctx);
  const [columns, setcolumns] = useState([]);

  // 作个兼容
  const tbData = fromTag === 'tags' ? tagsData : imgsData;
  const settbData = fromTag === 'tags' ? settagsData : setimgsData;

  useEffect(
    () => {
      setcolumns(tuouchColumns());
    },
    [tbData]
  );

  function tuouchColumns() {
    const optCol = {
      title: '操作',
      key: 'opration',
      render: (text, record, index) => (
        <div className={styles.tbOpration}>
          <a disabled={index === 0} onClick={() => toMove(index, -1)}>
            up
          </a>
          <a disabled={index === tbData.length - 1} onClick={() => toMove(index, 1)}>
            down
          </a>
          <a disabled={tbData.length === 1} onClick={() => delImg(index)}>
            del
          </a>
        </div>
      ),
    };
    return [...comColumn, optCol];
  }

  function delImg(num) {
    tbData.splice(num, 1);
    settbData(tbData.slice());
  }

  function toMove(ind, num) {
    const rec = tbData.splice(num, 1)[0];
    tbData.splice(ind + num, 0, rec);
    settbData(tbData.slice());
  }

  function addNewImgs() {
    if (tbData.length === maxLen) return message.warning('最多可添加6张图片');
    const rec = {};
    rec.key = createUuid();
    settbData([...tbData, rec].slice());
  }

  function getChange(e) {
    console.log(e);
  }

  return (
    <>
      <Table size="middle" dataSource={tbData} columns={columns} pagination={false} />
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
