/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 商品管理
 */
import React, { useState, useEffect, useContext } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import mktApi from '@/services/mktActivity';
import { Card, Input, Table, Tabs } from 'antd';
import { calcNumInArr, urlParamHash } from '../tools';
import { recColumns, goodsColumns } from '../tools/data';
import styles from './drawRec.less';

const { Search } = Input;
const { TabPane } = Tabs;

export default function DrawRec(props) {
  const [recList, setrecList] = useState([]);
  const [goodsList, setgoodsList] = useState([]);
  const [recTotal, setrecTotal] = useState(0);
  const [actCode, setactCode] = useState('');

  useEffect(() => {
    const { mobile, activityCode, prizeName } = urlParamHash(location.href);
    setactCode(activityCode);
    touchRecds({ mobile, activityCode });
    touchPrize({ prizeName, activityCode });
  }, []);

  // 获取获奖记录
  function touchRecds(config = {}) {
    const params = {
      mobile: '',
      activityCode: actCode,
      pageNum: 1,
      pageSize: 10,
    };
    mktApi.queryActivityPrizeRewardList({ ...params, ...config }).then(res => {
      console.log(res);
      if (!res?.data) return;
      const { data } = res;
      const { list, recordTotal } = data;
      setrecList(list);
      setrecTotal(recordTotal);
    });
  }

  // 获取奖品
  function touchPrize(config = {}) {
    const params = {
      activityCode: actCode,
      pageNum: 1,
      pageSize: 10,
      prizeName: '',
    };
    mktApi.queryActivityPrizeList({ ...params, ...config }).then(res => {
      console.log(res);
      if (!res?.data) return;
      const { data } = res;
      const { list, recordTotal } = data;
      const arr = calcNumInArr(list);
      setgoodsList(arr);
    });
  }

  function tabChange() {
    console.log();
  }

  function toSearch(tex) {
    touchRecds({ mobile: tex });
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" onChange={tabChange}>
          <TabPane tab="抽奖明细" key="1">
            <div className={styles.recSearch}>
              <Search
                placeholder="可通过领取手机号进行搜索"
                onSearch={val => toSearch(val)}
                style={{ width: 400 }}
              />
            </div>
            <Table
              size="middle"
              dataSource={recList}
              columns={recColumns}
              pagination={{ recTotal }}
              rowKey={(r, i) => i}
            />
          </TabPane>

          <TabPane tab="奖项概况" key="2">
            <Table
              size="middle"
              dataSource={goodsList}
              columns={goodsColumns}
              pagination={false}
              rowKey={(r, i) => i}
            />
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  );
}
