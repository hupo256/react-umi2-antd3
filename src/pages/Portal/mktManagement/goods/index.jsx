/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 商品管理
 */
import React, { useState, useEffect } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Modal, Table } from 'antd';
import { goodsColumns, dataSource } from '../tools/data';
import GoodsSearch from './goodsSearch';
import AddNewGoods from './addNewGoods';
import styles from './goods.less';

export default function Templates(props) {
  const [showModal, setshowModal] = useState(false);

  useEffect(() => {
    // settepList(touchList());
  }, []);

  function addNew() {
    console.log(22);
    setshowModal(true);
  }

  function modalOk() {
    setshowModal(false);
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false} style={{ marginTop: 20 }}>
        <GoodsSearch />

        <Button onClick={addNew} type="primary">
          添加
        </Button>
        <Table size="middle" dataSource={dataSource} columns={goodsColumns} />

        <Modal
          title="添加/编辑商品"
          visible={showModal}
          onOk={modalOk}
          onCancel={() => setshowModal(false)}
        >
          <AddNewGoods />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  );
}
