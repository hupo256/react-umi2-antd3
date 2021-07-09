/*
 * @Author: tdd 
 * @Date: 2020-06-17 17:35:33 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-06-17 18:09:47
 * 级联选择器要用的的表头
 */

import React from 'react';
import { Tooltip } from 'antd';
import styles from './index.less';

const HeadTip = ({ text }) => (
  <Tooltip placement="topLeft" title={text}>
    <p style={{maxWidth: 120,  display: '-webkit-box',"WebkitBoxOrient": 'vertical', overflow:'hidden',  "WebkitLineClamp": 1}}>{text}</p>
  </Tooltip>
);

export const ColumnsObj = {
  // 工地详情页表头
  columns_1: [
    {
      title: '工地',
      key: 'gongdiTitle',
      dataIndex: 'gongdiTitle',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '工地信息',
      key: 'buildingName',
      dataIndex: 'buildingName',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '阶段',
      key: 'gongdiStageName',
      dataIndex: 'gongdiStageName',
    },
  ],

  // 设计师表头
  columns_2: [
    {
      title: '设计师',
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => (
        <div className={styles.desigTit}>
          <img src={record?.headPicUrl} alt="" srcSet="" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '职级',
      key: 'position',
      dataIndex: 'position',
    },
    {
      title: '案例数',
      key: 'caseNum',
      dataIndex: 'caseNum',
    },
  ],

  // 案例表头
  columns_3: [
    {
      title: '案例',
      key: 'titleInfo',
      dataIndex: 'title',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '案例信息',
      key: 'buildingName',
      dataIndex: 'buildingName',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '设计师',
      key: 'designerName',
      dataIndex: 'designerName',
      render: (text, r) => <HeadTip text={text} />,
    },
  ],

  // 文章表头
  columns_4: [
    {
      title: '文章标题',
      key: 'articleTitle',
      dataIndex: 'articleTitle',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '发布人',
      key: 'creatorName',
      dataIndex: 'creatorName',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
    },
  ],
  // 专题表头
  columns_5: [
    {
      title: '专题标题',
      key: 'specialTitle',
      dataIndex: 'specialTitle',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '创建人',
      key: 'creatorName',
      dataIndex: 'creatorName',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
    },
  ],
  // 小游戏表头
  columns_6: [
    {
      title: '游戏标题',
      key: 'activityTitle',
      dataIndex: 'activityTitle',
      render: (text, r) => <HeadTip text={text} />,
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (text, r) => {
        const { state } = r;
        let tex = '未开始';
        state === 1 && (tex = '进行中');
        state === 2 && (tex = '已结束');
        return tex;
      },
    },
    {
      title: '创建人',
      key: 'creater',
      dataIndex: 'creater',
      render: (text, r) => <HeadTip text={text} />,
    },
  ],
};
