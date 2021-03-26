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
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '活动名称',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '参与次数',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '创建日期',
    dataIndex: 'foundTime',
    key: 'foundTime',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>edit {record.name}</a> | <a>Delete</a>
      </span>
    ),
  },
];

export const goodsColumns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    key: 'id',
  },
  {
    title: '活动名称',
    dataIndex: 'actName',
    key: 'actName',
  },
  {
    title: '商品ID',
    dataIndex: 'goodsId',
    key: 'goodsId',
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
  },
  {
    title: '中奖概率',
    dataIndex: 'odds',
    key: 'odds',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '创建日期',
    dataIndex: 'found',
    key: 'found',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>edit {record.name}</a> | <a>Delete</a>
      </span>
    ),
  },
];
