/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-07-09 19:58:04
 * 营销活动管理 活动列表
 */
import React, { useState, useEffect } from 'react';
import mktApi from '@/services/mktActivity';
import router from 'umi/router';
import { baseRouteKey } from '../tools/data';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Table, Input, Icon, message } from 'antd';
import { getauth } from '@/utils/authority';
import { actColumns, searchTags } from '../tools/data';
import styles from './activity.less';
import Applets from '../../ContentManagement/components/Applets';
import { connect } from 'dva';

const { Search } = Input;
const permissionsBtn = getauth().permissions || [];

function Activityer(props) {
  const [actList, setactList] = useState([]);
  const [tbColumns, settbColumns] = useState([]);
  const [searchInd, setsearchInd] = useState(0);
  const [searchTex, setsearchTex] = useState('');
  const [total, settotal] = useState(0);
  const [curPage, setcurPage] = useState(1);

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
    const [, col1, col2, col3] = actColumns;
    const isCompanyAuthWechatMini = JSON.parse(localStorage.getItem('isCompanyAuthWechatMini'));
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
                <br />
                <a onClick={() => copyLink(activityCode)} className={styles.tocopy}>
                  <Icon type="copy" /> 复制链接
                </a>
              </>
            )}
          </>
        );
      },
    };
    const col = {
      title: '操作',
      dataIndex: 'action',
      width: 260,
      render: (text, record, index) => (
        <p className={styles.actions}>
          {permissionsBtn.includes('BTN210422000002') && (
            <a onClick={() => toEdit(record.uid)}>编辑</a>
          )}
          {/* {permissionsBtn.includes('BTN210422000002') && permissionsBtn.includes('BTN210422000003') && <span className={styles.operateLine} />} */}
          {permissionsBtn.includes('BTN210422000003') && (
            <a onClick={() => toRecod(record.activityCode)}>抽奖记录</a>
          )}
          {/* {permissionsBtn.includes('BTN210623000007') &&
            isCompanyAuthWechatMini && <span className={styles.operateLine} />} */}
          {permissionsBtn.includes('BTN210623000007') &&
            isCompanyAuthWechatMini && (
              <a className="operateBtn" onClick={() => getWechatCode(record)}>
                小程序码
              </a>
            )}
        </p>
      ),
    };
    settbColumns([...actColumns, col]);
  }

  // 获取小程序码
  const getWechatCode = record => {
    const { dispatch } = props;
    dispatch({
      type: 'ContentManage/getAppletsCode',
      payload: {
        qrCodePage: 'game',
        uid: record.uid,
      },
    });
  };

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
      state: searchInd ? searchInd - 1 : '',
    };
    mktApi.queryActivityList({ ...param, ...config }).then(res => {
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
    const state = ind ? ind - 1 : '';
    touchActList({ state });
  }

  function toSearch(tex) {
    const str = tex.substr(0, 30);
    setsearchTex(str);
    setcurPage(1);
    touchActList({ activityTitle: str });
  }

  function searchChange(e) {
    const val = e.target.value;
    setsearchTex(val);
    val === '' && touchActList({ activityTitle: '' });
  }

  function pageChange(num, size) {
    console.log(num, size);
    const conf = {
      pageNum: num,
      pageSize: size,
    };
    setcurPage(num);
    touchActList(conf);
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false} style={{ marginBottom: '1em' }}>
        <Search
          placeholder="可通过游戏标题进行搜索"
          onSearch={val => toSearch(val)}
          onChange={e => searchChange(e)}
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
        {permissionsBtn.includes('BTN210422000001') && (
          <Button className={styles.addBtn} onClick={addNew} type="primary">
            <Icon type="plus" />
            创建小游戏
          </Button>
        )}

        <Table
          size="middle"
          dataSource={actList}
          columns={tbColumns}
          pagination={{ total, current: curPage, onChange: pageChange }}
          rowKey={(r, i) => i}
        />
      </Card>
      <Applets />
    </PageHeaderWrapper>
  );
}

const mapStateToProps = state => {
  return {
    ...state.ContentManage,
  };
};

export default connect(
  mapStateToProps,
  null
)(Activityer);
