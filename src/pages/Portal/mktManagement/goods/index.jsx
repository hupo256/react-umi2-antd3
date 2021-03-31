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
import { Provider, ctx } from '../common/context';
import { Card, Button, Modal, Table } from 'antd';
import { goodsColumns } from '../tools/data';
import GoodsSearch from './goodsSearch';
import AddNewGoods from './addNewGoods';
import styles from './goods.less';

function GoodsList(props) {
  const { goodsList, setgoodsList, goodsModal, setgoodsModal } = useContext(ctx);

  useEffect(() => {
    const params = {
      // activityId: 0,
      pageNum: 1,
      pageSize: 10,
      // prizeName: '',
    };
    mktApi.queryActivityPrizeList(params).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setgoodsList(data.list);
    });
  }, []);

  function addNew() {
    console.log(22);
    setgoodsModal(true);
  }

  function modalOk() {
    setgoodsModal(false);
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false} style={{ marginTop: 20 }}>
        <GoodsSearch />

        <Button onClick={addNew} className={styles.addBtn} type="primary">
          添加
        </Button>
        <Table size="middle" dataSource={goodsList} columns={goodsColumns} />

        <Modal
          title="添加/编辑商品"
          visible={goodsModal}
          onOk={modalOk}
          onCancel={() => setgoodsModal(false)}
          footer={null}
        >
          <AddNewGoods />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <GoodsList {...props} />
  </Provider>
);
