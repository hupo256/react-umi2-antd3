export const baseRouteKey = '/portal/activity/mktGame/';
export const prizeImg = 'http://img.inbase.in-deco.com/crm-saas/img/games/prize/';
export const defaultImg = 'http://img.inbase.in-deco.com/crm-saas/img/games/default/';
export const tipsTable = '勾选为奖品，即为中奖';
export const btnInterval = 1000;
export const actColumns = [
  {
    title: '游戏标题',
    width: '130px',
    dataIndex: 'activityTitle',
  },
  {
    title: '状态',
    dataIndex: 'state',
  },
  {
    title: '起止时间',
    dataIndex: 'time',
    render: (text, record, index) => {
      const [st, et] = text.split('_');
      return (
        <span>
          {st} 至 <br /> {et}
        </span>
      );
    },
  },
  {
    title: '小游戏链接',
    textWrap: 'word-break',
    width: '270px',
    dataIndex: 'linkUrl',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '160px',
    render: (text, record, index) => {
      const { createTime, creater = '' } = record;
      return (
        <>
          <span>{createTime} </span>
          <br />
          <span>{creater}</span>
        </>
      );
    },
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
    render: (text, record, index) => text.slice(0, 16),
  },
  {
    title: '抽奖用户手机号',
    dataIndex: 'userPhone',
  },
  {
    title: '抽中奖项',
    dataIndex: 'prizeName',
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
    title: '抽中概率(%)',
    dataIndex: 'probability',
  },
  {
    title: '奖项总量',
    dataIndex: 'prizeNum',
  },
  {
    title: '已抽数量',
    dataIndex: 'prizeBeNum',
  },
  {
    title: '剩余数量',
    dataIndex: 'prizeSuNum',
  },
  {
    title: '是否是奖品',
    dataIndex: 'isPrize',
    render: (text, recod, index) => (text ? '是' : '否'),
  },
];

export const gameTypes = [
  {
    name: '大转盘',
    code: 1,
    imgUrl: `${defaultImg}wheelIcon.png`,
  },
  {
    name: '砸金蛋',
    code: 2,
    imgUrl: `${defaultImg}eggIcon.png`,
  },
  {
    name: '跑马灯',
    code: 3,
    imgUrl: `${defaultImg}gridIcon.png`,
  },
];

export const defaultGoods = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '谢谢参与'];
export const girdGoods = [
  '一等奖',
  '二等奖',
  '三等奖',
  '四等奖',
  '五等奖',
  '六等奖',
  '七等奖',
  '谢谢参与',
];
export const searchTags = ['全部', '未开始', '进行中', '已结束'];
