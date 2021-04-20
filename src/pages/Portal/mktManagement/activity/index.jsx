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
import { Card, Button, Table, Input, Icon, message } from 'antd';
import { actColumns, searchTags } from '../tools/data';
import styles from './activity.less';

const { Search } = Input;

export default function Activityer(props) {
  const [actList, setactList] = useState([]);
  const [tbColumns, settbColumns] = useState([]);
  const [searchInd, setsearchInd] = useState(0);
  const [searchTex, setsearchTex] = useState('');
  const [total, settotal] = useState(0);

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
    router.push(`${baseRouteKey}editGame?uid=${uid}`);
  }

  function toRecod(code) {
    router.push(`${baseRouteKey}drawRec?activityCode=${code}`);
  }

  function creatColumn() {
    const [, col1, col2, col3, col4] = actColumns;
    actColumns[1] = {
      ...col1,
      render: (text, record, index) => {
        const { state } = record;
        const cls = `cls${state}`;
        let tex = '未开始';
        state === 1 && (tex = '进行中');
        state === 2 && (tex = '已结束');
        return (
          <div className={styles.stateBox}>
            <u className={styles[cls]} />
            {tex}
          </div>
        );
      },
    };
    actColumns[2] = {
      ...col2,
      render: (text, record, index) => {
        const [st, et] = text.split('_');
        return (
          <div className={styles.timeBox}>
            {st} 至 <br /> {et}
          </div>
        );
      },
    };
    actColumns[3] = {
      ...col3,
      render: (text, record, index) => {
        const { activityCode, linkUrl } = record;
        return (
          <>
            {linkUrl && (
              <>
                <span>{linkUrl} </span>
                <Input id={activityCode} className={styles.inpHidden} value={linkUrl} />
                <p>
                  <a onClick={() => copyLink(activityCode)} className={styles.tocopy}>
                    <Icon type="copy" /> 复制链接
                  </a>
                </p>
              </>
            )}
          </>
        );
      },
    };
    actColumns[4] = {
      ...col4,
      render: (text, record, index) => {
        const { startTime, creater = '' } = record;
        return (
          <>
            <span>{startTime} </span>
            <p>{creater}</p>
          </>
        );
      },
    };
    const col = {
      title: '操作',
      dataIndex: 'action',
      width: 130,
      render: (text, record, index) => (
        <p className={styles.actions}>
          <a onClick={() => toEdit(record.uid)}>编辑</a>|{' '}
          <a onClick={() => toRecod(record.activityCode)}>抽奖记录</a>
        </p>
      ),
    };
    settbColumns([...actColumns, col]);
  }

  function copyLink(id) {
    const inp = document.getElementById(id);
    console.log(inp);
    inp.select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
    message.success('复制成功!');
  }

  function addNew() {
    router.push(`${baseRouteKey}addGame`);
  }

  // 获取活动们
  function touchActList(config = {}) {
    const param = {
      activityTitle: searchTex,
      pageNum: 1,
      pageSize: 10,
    };
    const conf = searchInd ? { state: searchInd - 1 } : {};
    const params = { ...param, ...conf };
    mktApi.queryActivityList({ ...params, ...config }).then(res => {
      console.log(res);
      if (!res?.data) return;
      const { data } = res;
      const { list, recordTotal } = data;
      setactList(mergeTime(list).slice());
      settotal(recordTotal);
    });
  }

  function mergeTime(arr) {
    if (!arr) return [];
    return arr?.map(item => {
      const { startTime, endTime, createTime } = item;
      item.time = startTime.slice(0, 16) + '_' + endTime.slice(0, 16);
      item.createTime = createTime.slice(0, 16);
      return item;
    });
  }

  function searchWidhTag(ind) {
    setsearchInd(ind);
    const conf = ind ? { state: ind - 1 } : {};
    touchActList(conf);
  }

  function toSearch(tex) {
    setsearchTex(tex);
    touchActList({ activityTitle: tex });
  }

  function pageChange(num, size) {
    console.log(num, size);
    const conf = {
      pageNum: num,
      pageSize: size,
    };
    touchActList(conf);
  }

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
          创建小游戏
        </Button>

        <Table
          size="middle"
          dataSource={actList}
          columns={tbColumns}
          pagination={{ total, onChange: pageChange }}
          rowKey={(r, i) => i}
        />
      </Card>
    </PageHeaderWrapper>
  );
}
