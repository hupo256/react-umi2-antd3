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
import { Card, Button, Input, Table, Tabs } from 'antd';
import { recColumns, goodsColumns } from '../tools/data';
import styles from './drawRec.less';

const { Search } = Input;
const { TabPane } = Tabs;

export default function DrawRec(props) {
  const [recList, setrecList] = useState([]);
  const [goodsList, setgoodsList] = useState([]);

  useEffect(() => {
    const params = {
      mobile: '',
      pageNum: 1,
      pageSize: 10,
    };

    mktApi.queryActivityPrizeRewardList(params).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setrecList(data.list);
    });
  }, []);

  useEffect(() => {
    const listParam = {
      activityCode: '',
      pageNum: 1,
      pageSize: 10,
      prizeName: '',
    };
    mktApi.queryActivityPrizeList(listParam).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setgoodsList(data.list);
    });
  }, []);

  function tabChange() {
    console.log();
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" onChange={tabChange}>
          <TabPane tab="抽奖明细" key="1">
            <Search
              placeholder="可通过领取手机号进行搜索"
              onSearch={val => console.log(val)}
              style={{ width: 200 }}
            />
            <Table size="middle" dataSource={recList} columns={recColumns} rowKey={(r, i) => i} />
          </TabPane>

          <TabPane tab="奖项概况" key="2">
            <Table
              size="middle"
              dataSource={goodsList}
              columns={goodsColumns}
              rowKey={(r, i) => i}
            />
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  );
}
