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
        light: 'rgba(255, 239, 229, 1))',
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
