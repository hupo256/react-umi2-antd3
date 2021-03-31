/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 营销活动管理 活动列表
 */
import React, { useState, useEffect, useContext } from 'react';
import mktApi from '@/services/mktActivity';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Table, Modal, Select } from 'antd';
import { actColumns } from '../tools/data';
import { Provider, ctx } from '../common/context';
import AddNewAct from './addNewAct';
import styles from './activity.less';

const { Option } = Select;

function Activityer(props) {
  const { tbData, settbData, actModal, setactModal } = useContext(ctx);
  const [actList, setactList] = useState([]);
  const [tbColumns, settbColumns] = useState([]);

  useEffect(() => {
    // const params1 = {
    //   activityId: 1,
    //   openId: '1',
    // };
    // mktApi.touchLottery(params1).then(res => {
    //   console.log(res);
    // });
    // mktApi.touchActivity().then(res => {
    //   console.log(res);
    // });
    // const param2 = { activityId: '', openId: '' };
    // mktApi.touchReward(param2).then(res => {
    //   console.log(res);
    // });
  }, []);

  useEffect(() => {
    // 获取第一页的活动列表
    touchActList();

    // 获取下拉选项
    mktApi.activityList().then(res => {
      const { data } = res;
      data && setactList(data);
    });
    // mktApi.getActivity({ activityId: 0 }).then(res => {
    //   console.log(res);
    // });
    // mktApi.getActivityPrize().then(res => {
    //   console.log(res);
    // });
  }, []);

  useEffect(
    () => {
      creatColumn();
    },
    [tbData]
  );

  function creatColumn() {
    const col = {
      title: '操作',
      dataIndex: 'action',
      render: (text, record, index) => (
        <p className={styles.actions}>
          <a onClick={() => toEdit(record)}>编辑</a>
          <a onClick={() => toDelete(index)}>删除</a>
        </p>
      ),
    };
    settbColumns([...actColumns, col]);
  }

  function toEdit(rec) {
    setactModal(true);
  }

  function toDelete(ind) {
    setactModal(true);
  }

  function addNew() {
    setactModal(true);
  }

  function modalOk(e) {
    console.log(e);
    // setactModal(false);
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
      settbData(data.list);
    });
  }

  function selectChange(e) {
    const [, activeName] = e.split('_');
    touchActList({ activeName });
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <div className={styles.searchBox}>
          <label htmlFor="">活动名称:</label>
          <Select style={{ width: 150 }} placeholder="请选择活动" onSelect={selectChange}>
            {actList.length > 0 &&
              actList.map(act => {
                const { activeId, activeName } = act;
                return (
                  <Option key={activeId} value={`${activeId}_${activeName}`}>
                    {activeName}
                  </Option>
                );
              })}
          </Select>
        </div>

        <Button className={styles.addBtn} onClick={addNew} type="primary">
          添加
        </Button>

        <Table
          size="middle"
          dataSource={tbData}
          columns={tbColumns}
          rowKey={rec => rec['activityName']}
        />

        <Modal
          title="添加/编辑活动"
          visible={actModal}
          onOk={modalOk}
          onCancel={() => setactModal(false)}
          footer={null}
        >
          <AddNewAct />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <Activityer {...props} />
  </Provider>
);
