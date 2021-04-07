/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-24 13:49:12 
 * 抽屉中的编辑组件
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { Table, message, Radio, Input } from 'antd';
import { createUuid } from '../../tools';
import LinkChoose from './linkChoose';
import Upload from '@/components/Upload/Upload';
import styles from './editBar.less';

const maxLen = 6;
const { Group } = Radio;

export default function EditBar(props) {
  const { comColumn, dList, isTags } = props;
  const { imgEdtor, setimgEdtor, curInd, pageData, setpageData } = useContext(ctx);

  const [tbData, settbData] = useState(dList);
  const [columns, setcolumns] = useState([]);
  const [imgHeightType, setimgHeightType] = useState(1);

  useEffect(
    () => {
      setcolumns(tuouchColumns());
    },
    [tbData]
  );

  function tuouchColumns() {
    const optCol = {
      title: '操作',
      width: '140px',
      key: 'opration',
      render: (text, record, index) => (
        <div className={styles.tbOpration}>
          {index !== 0 && <a onClick={() => toMove(index, -1)}>up</a>}
          {index !== tbData.length - 1 && <a onClick={() => toMove(index, 1)}>down</a>}
          {tbData.length !== 1 && <a onClick={() => delImg(index)}>del</a>}
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

  function radioChage(e) {
    console.log(e);
    setimgHeightType(e.target.value);
  }

  function widthChange(e) {
    console.log(e);
    pageData.jsonData[0].height = +e;
  }

  // 图片选择
  function handleUploadOk(data) {
    console.log(data);
    dList[curInd].imgUrl = data[0].path;
    setpageData(pageData);
    setimgEdtor(false);
  }

  return (
    <>
      {!isTags && (
        <div className={styles.widthBox}>
          图片高度：
          <Group onChange={radioChage} value={imgHeightType}>
            <Radio value={1}>默认</Radio>
            <Radio value={2}>自定义</Radio>
          </Group>
          {imgHeightType === 2 && (
            <Input size="small" style={{ width: 70, marginLeft: '-10px' }} onChange={widthChange} />
          )}
        </div>
      )}
      <Table
        size="middle"
        dataSource={tbData}
        columns={columns}
        pagination={false}
        showHeader={false}
        rowKey={(r, i) => i}
      />
      <p className={styles.addImg} onClick={addNewImgs}>
        <span>+</span>
        <span>添加轮播图</span>
      </p>

      <Upload
        visible={imgEdtor}
        selectNum={1}
        handleOk={data => handleUploadOk(data)}
        handleCancel={() => setimgEdtor(false)}
      />

      <LinkChoose dList={tbData} />
    </>
  );
}
