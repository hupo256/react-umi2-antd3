const imgBaseUrl = 'https://img.inbase.in-deco.com/crm-saas/img/highlights/';

export const highlights = [
  {
    title: '专属服务',
    desc: '1v1服务对接 方便省心',
    type: 'case',
    bgImg: `${imgBaseUrl}img_ 1@2x.png`,
    uid: 'a5539d14b1df443ba574a4c2b1b7c491',
  },
  {
    title: '资深设计',
    desc: '100+设计师提供专业服务',
    type: 'design',
    bgImg: `${imgBaseUrl}img_2@2x.png`,
    uid: 'a5539d14b1df443ba574a4c2b1b7c491',
  },
  {
    title: '优质选材',
    desc: '品牌材料直供',
    type: 'site',
    bgImg: `${imgBaseUrl}img_3@2x.png`,
    uid: 'a5539d14b1df443ba574a4c2b1b7c491',
  },
  {
    title: '无忧服务',
    desc: '全流程负责到底',
    type: 'case',
    bgImg: `${imgBaseUrl}img_3@2x(1).png`,
    uid: 'a5539d14b1df443ba574a4c2b1b7c491',
  },
];

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

export const tagList = [
  {
    title: '专属服务',
    desc: '1v1服务对接 方便省心',
    type: 'case',
    bgImg: 'https://img.inbase.in-deco.com/crm-saas/img/highlights/img_%201@2x.png',
    uid: 'a5539d14b1df443ba574a4c2b1b7c491',
  },
  {
    title: '资深设计',
    desc: '100+设计师提供专业服务',
    type: 'design',
    bgImg: 'https://img.inbase.in-deco.com/crm-saas/img/highlights/img_2@2x.png',
    uid: 'a5539d14b1df443ba574a4c2b1b7c491',
  },
  {
    title: '优质选材',
    desc: '品牌材料直供',
    type: 'site',
    bgImg: 'https://img.inbase.in-deco.com/crm-saas/img/highlights/img_3@2x.png',
    uid: 'a5539d14b1df443ba574a4c2b1b7c491',
  },
  {
    title: '无忧服务',
    desc: '全流程负责到底',
    type: 'case',
    bgImg: 'https://img.inbase.in-deco.com/crm-saas/img/highlights/img_3@2x(1).png',
    uid: 'a5539d14b1df443ba574a4c2b1b7c491',
  },
];
