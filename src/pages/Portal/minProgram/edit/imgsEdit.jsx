/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑轮播
 */
import React, { useContext, useEffect } from 'react';
import { ctx } from '../common/context';
import { Select, Input } from 'antd';
import { dataSource } from '../tools/data';
import EditBar from '../common/editBar/index';
import pholder from '../tools/tempbg.png';
import styles from './edit.less';

const { Option } = Select;
const maxLen = 6;

export default function Templates(props) {
  const { imgsData, setimgsData } = useContext(ctx);

  useEffect(() => {
    setimgsData(dataSource);
  }, []);

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
  ];

  return <EditBar comColumn={columns} />;
}
