export const baseRouteKey = '/portal/insite/decorate/';
export const canEditTags = ['banner', 'highlights', 'advertising', 'editModel', 'aboutUs', 'nav'];
export const defaultImg = 'http://img.inbase.in-deco.com/crm-saas/img/games/default/';
export const editText = '编辑模块后，【模块标题】将按照您编辑后的展示。 鼠标悬浮示例，查看示例图片。';
export const tipsText =
  '您的“案例、工地直播、设计师团队、公司电话/名称”在内容管理维护后，会依据您已有的内容自动生成样式。';
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

export const emptyMdText = {
  case: '请在案例库中添加案例',
  site: '请在工地库中添加工地',
  design: '请在设计师库中添加设计师',
};

const highlightsImgBase = 'https://img.inbase.in-deco.com/crm-saas/img/highlights/';
export const highlightsBgImgs = [
  `${highlightsImgBase}img_ 1@2x.png`,
  `${highlightsImgBase}img_2@2x.png`,
  `${highlightsImgBase}img_3@2x.png`,
  `${highlightsImgBase}img_3@2x(1).png`,
  `${highlightsImgBase}img_5@2x.png`,
  `${highlightsImgBase}img_ 6@2x.png`,
];

export const themes = {
  WMHPT0001: {
    baseColor: 'rgba(222, 57, 45, 1)',
    gradientColor: {
      header: {
        dark: 'rgba(255, 215, 212, 1)',
        light: 'rgba(252, 237, 236, 1)',
      },
      moduleTitle: {
        dark: 'rgba(223, 64, 53, 1)',
        light: 'rgba(251, 233, 231, 1)',
      },
    },
  },
  WMHPT0002: {
    baseColor: 'rgba(255, 111, 12, 1)',
    gradientColor: {
      header: {
        dark: 'rgba(255, 214, 187, 1)',
        light: 'rgba(255, 242, 234, 1)',
      },
      moduleTitle: {
        dark: 'rgba(255, 117, 22, 1)',
        light: 'rgba(255, 239, 229, 1)',
      },
    },
  },
  WMHPT0003: {
    baseColor: 'rgba(49, 181, 89, 1)',
    gradientColor: {
      header: {
        dark: 'rgba(198, 234, 209, 1)',
        light: 'rgba(236, 248, 240, 1)',
      },
      moduleTitle: {
        dark: 'rgba(58, 184, 96, 1)',
        light: 'rgba(231, 246, 236, 1)',
      },
    },
  },
  WMHPT0004: {
    baseColor: 'rgba(55, 184, 194, 1)',
    gradientColor: {
      header: {
        dark: 'rgba(200, 235, 238, 1)',
        light: 'rgba(236, 248, 249, 1)',
      },
      moduleTitle: {
        dark: 'rgba(65, 190, 199, 1)',
        light: 'rgba(229, 246, 247, 1)',
      },
    },
  },
  WMHPT0005: {
    baseColor: 'rgba(4, 118, 213, 1)',
    gradientColor: {
      header: {
        dark: 'rgba(185, 216, 243, 1)',
        light: 'rgba(234, 243, 251, 1)',
      },
      moduleTitle: {
        dark: 'rgba(15, 124, 214, 1)',
        light: 'rgba(228, 240, 250, 1)',
      },
    },
  },
  WMHPT0006: {
    baseColor: 'rgba(173, 143, 104, 1)',
    gradientColor: {
      header: {
        dark: 'rgba(255, 255, 255, 1)',
        light: 'rgba(255, 255, 255, 1)',
      },
      moduleTitle: {
        dark: 'rgba(175, 133, 80, 1)',
        light: 'rgba(245, 241, 235, 1)',
      },
    },
  },
  WMHPT0007: {
    baseColor: 'rgba(34, 34, 34, 1)',
    gradientColor: {
      header: {
        dark: 'rgba(255, 255, 255, 1)',
        light: 'rgba(255, 255, 255, 1)',
      },
      moduleTitle: {
        dark: 'rgba(44, 44, 44, 1)',
        light: 'rgba(233, 233, 233, 1)',
      },
    },
  },
};
