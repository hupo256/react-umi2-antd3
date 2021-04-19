export const baseRouteKey = '/portal/activity/mktGame/';
export const prizeImg = 'http://img.inbase.in-deco.com/crm-saas/img/games/prize/';
export const defaultImg = 'http://img.inbase.in-deco.com/crm-saas/img/games/default/';
export const actColumns = [
  {
    title: '游戏标题',
    width: 100,
    dataIndex: 'activityTitle',
  },
  {
    title: '状态',
    dataIndex: 'state',
  },
  {
    title: '起止时间',
    dataIndex: 'time',
  },
  {
    title: '小游戏链接',
    dataIndex: 'linkUrl',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

export const recColumns = [
  {
    title: '序号',
    dataIndex: 'no',
    render: (text, record, index) => index + 1,
  },
  {
    title: '抽奖时间',
    dataIndex: 'createTime',
  },
  {
    title: '抽奖用户昵称',
    dataIndex: 'userName',
  },
  {
    title: '抽中奖项',
    dataIndex: 'prizeName',
  },
  {
    title: '领取手机号',
    dataIndex: 'userPhone',
  },
];

//
export const goodsColumns = [
  {
    title: '奖项图片',
    dataIndex: 'prizeImage',
    render: (text, record, index) => (
      <div className="minImgBox">
        <img src={record.prizeImage} />
      </div>
    ),
  },
  {
    title: '奖项名称',
    dataIndex: 'prizeName',
  },
  {
    title: '奖项数量',
    dataIndex: 'prizeNum',
  },
  {
    title: '抽中概率(%)',
    dataIndex: 'qq',
  },
  {
    title: '已抽数量',
    dataIndex: 'ww',
  },
  {
    title: '剩余数量',
    dataIndex: 'ee',
  },
  {
    title: '是否是奖品',
    dataIndex: 'tt',
  },
];

export const defaultGoods = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '谢谢参与'];
export const searchTags = ['全部', '未开始', '进行中', '已结束'];
