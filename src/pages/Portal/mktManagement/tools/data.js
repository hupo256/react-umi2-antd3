export const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园2号',
  },
];

export const actColumns = [
  {
    title: '编号',
    dataIndex: 'order',
    render: (text, record, index) => index + 1,
  },
  {
    title: '活动名称',
    dataIndex: 'activeName',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
  },
  {
    title: '参与次数',
    dataIndex: 'activeNum',
  },
  {
    title: '状态',
    dataIndex: 'state',
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
  },
];

export const goodsColumns = [
  {
    title: 'ID',
    dataIndex: 'activityId',
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
  },
  {
    title: '商品ID',
    dataIndex: 'prizeId',
  },
  {
    title: '商品名称',
    dataIndex: 'prizeName',
  },
  {
    title: '中奖概率',
    dataIndex: 'winRate',
  },
  {
    title: '状态',
    dataIndex: 'state',
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => (
      <span>
        <a>edit {record.name}</a> | <a>Delete</a>
      </span>
    ),
  },
];
