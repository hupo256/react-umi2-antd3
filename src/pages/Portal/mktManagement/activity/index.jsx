/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 营销活动管理 活动列表
 */
import React, { useState, useEffect, useContext } from 'react';
import mktApi from '@/services/mktActivity';
import router from 'umi/router';
import { baseRouteKey } from '../tools/data';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Table, Input } from 'antd';
import { actColumns, searchTags } from '../tools/data';
import styles from './activity.less';

const { Search } = Input;

export default function Activityer(props) {
  const [actList, setactList] = useState([]);
  const [tbColumns, settbColumns] = useState([]);
  const [searchInd, setsearchInd] = useState(0);

  useEffect(() => {
    // 获取第一页的活动列表
    touchActList();
  }, []);

  useEffect(
    () => {
      creatColumn();
    },
    [actList]
  );

  function toEdit(uid) {
    router.push(`${baseRouteKey}activityEdit?uid=${uid}`);
  }

  function toDelete(uid) {
    mktApi.delActivity({ uid }).then(res => {
      console.log(res);
    });
  }

  function creatColumn() {
    const col = {
      title: '操作',
      dataIndex: 'action',
      render: (text, record, index) => (
        <p className={styles.actions}>
          <a onClick={() => toEdit(record.uid)}>编辑</a>|{' '}
          <a onClick={() => toDelete(record.uid)}>删除</a>
        </p>
      ),
    };
    actColumns[1] = {
      title: '状态',
      dataIndex: 'state',
      render: (text, record, index) => {
        let tex = '未开始';
        const { state } = record;
        state === 1 && (tex = '进行中');
        state === 2 && (tex = '已结束');
        return (
          <div className={styles.stateBox}>
            <u />
            <span>{tex}</span>
          </div>
        );
      },
    };
    settbColumns([...actColumns, col]);
  }

  // 获取活动们
  function touchActList(config = {}) {
    const params = {
      activeName: '',
      endTime: '',
      pageNum: 1,
      pageSize: 10,
      startTime: '',
      state: 0,
    };
    mktApi.queryActivityList({ ...params, ...config }).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setactList(data.list);
    });
  }

  function addNew() {
    console.log();
  }

  function searchWidhTag(ind) {
    setsearchInd(ind);
    console.log(ind);
  }

  function toSearch() {}

  return (
    <PageHeaderWrapper>
      <Card bordered={false} style={{ marginBottom: '1em' }}>
        <Search
          placeholder="可通过游戏标题进行搜索"
          onSearch={val => toSearch(val)}
          style={{ width: 400 }}
        />

        <div className={styles.searchTags}>
          <span>状态: </span>
          <div className={styles.tagbox}>
            {searchTags.map((tag, ind) => (
              <span
                key={ind}
                className={`${searchInd === ind ? styles.on : ''}`}
                onClick={() => searchWidhTag(ind)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <Card bordered={false}>
        <Button className={styles.addBtn} onClick={addNew} type="primary">
          建议小游戏
        </Button>

        <Table size="middle" dataSource={actList} columns={tbColumns} rowKey={(r, i) => i} />
      </Card>
    </PageHeaderWrapper>
  );
}
