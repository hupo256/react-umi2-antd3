/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect } from 'react';
import mktApi from '@/services/mktActivity';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Table, Input, Modal } from 'antd';
import { actColumns, dataSource } from '../tools/data';
import AddNewAct from './addNewAct';
import styles from './activity.less';

const { Search } = Input;
const baseUrlKey = '/portal/minProgram/';

export default function Templates(props) {
  const [showModal, setshowModal] = useState(false);

  useEffect(() => {
    const params1 = {
      activityId: 1,
      openId: '1',
    };
    mktApi.touchLottery(params1).then(res => {
      console.log(res);
    });
    // mktApi.touchActivity().then(res => {
    //   console.log(res);
    // });
    // const param2 = { activityId: '', openId: '' };
    // mktApi.touchReward(param2).then(res => {
    //   console.log(res);
    // });

    // mktApi.getActivity({ activityId: 0 }).then(res => {
    //   console.log(res);
    // });
    // mktApi.getActivityPrize().then(res => {
    //   console.log(res);
    // });
    // mktApi.activityList().then(res => {
    //   console.log(res);
    // });
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
      <Card bordered={false}>
        <div className={styles.searchBox}>
          <p>
            <label htmlFor="">活动名称</label>
            <Search
              placeholder="input search text"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          </p>

          <Button onClick={addNew} type="primary">
            添加
          </Button>
        </div>

        <Table size="middle" dataSource={dataSource} columns={actColumns} />

        <Modal
          title="添加/编辑活动"
          visible={showModal}
          onOk={modalOk}
          onCancel={() => setshowModal(false)}
        >
          <AddNewAct />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  );
}
