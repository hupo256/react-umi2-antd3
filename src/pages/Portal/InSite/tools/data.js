export const baseRouteKey = '/portal/insite/decorate/';
export const canEditTags = ['banner', 'highlights', 'advertising'];
export const LinkType = [
  {
    name: '案例',
    value: 'case',
  },
  {
    name: '工地',
    value: 'site',
  },
  {
    name: '设计师',
    value: 'design',
  },
  {
    name: '专题',
    value: 'special',
  },
  {
    name: '营销游戏',
    value: 'games',
  },
];

export const apiMap = {
  case: 'queryCaseList',
  site: 'sitePageList',
  design: 'queryDesignerList',
  special: 'specialPageList',
  games: 'queryActivityList',
};
