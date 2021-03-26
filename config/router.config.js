export default [
  { path: '/disabled', component: './User/AccountDisabled' },
  { path: '/overdue', component: './User/AccountOverdue' },
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  {
    path: '/ChoiceCompany',
    component: './ChoiceCompany/ChoiceCompany',
  },
  {
    path: '/portal/contentmanagement/ProjectLibrary/ConfigurationTopic',
    PageHeaderName: '专题配置',
    component: './Portal/ContentManagement/ProjectLibrary/ConfigurationTopic',
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin'],
    routes: [
      {
        path: '/',
        name: 'index',
        redirect: '/portal/contentmanagement/caselibrary',
      },
      {
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            component: './Account/Center/Center',
          },
          {
            path: '/account/settings/base',
            PageHeaderName: '个人资料设置',
            component: './Account/BaseView',
          },
          {
            path: '/account/resetpasswords',
            PageHeaderName: '修改密码',
            component: './Account/ResetPassword',
          },
        ],
      },

      // v2.0
      // 门户
      {
        path: '/portal',
        name: 'portal',
        icon: 'dashboard',
        // code: 'P2020010110010',
        routes: [
          {
            path: '/portal',
            redirect: '/portal/contentmanagement',
            code: 'MU9000',
          },
          {
            path: '/portal/contentmanagement',
            name: 'contentmanagement',
            code: 'MU90000001',
            routes: [
              {
                path: '/portal/contentmanagement',
                redirect: '/portal/contentmanagement/caselibrary',
                code: 'MU900000010001',
              },
              {
                path: '/portal/contentmanagement/caselibrary',
                name: 'caselibrary',
                code: 'MU900000010001',
                component: './Portal/ContentManagement/CaseLibrary/CaseLibrary',
              },
              {
                path: '/portal/contentmanagement/caselibrary/add',
                PageHeaderName: '创建案例',
                component: './Portal/ContentManagement/CaseLibrary/CaseLibraryAdd',
              },
              {
                path: '/portal/contentmanagement/caselibrary/edit',
                PageHeaderName: '编辑案例',
                component: './Portal/ContentManagement/CaseLibrary/CaseLibraryEdit',
              },
              {
                path: '/portal/contentmanagement/sitelibrary',
                name: 'sitelibrary',
                component: './Portal/ContentManagement/SiteLibrary/SiteLibrary',
                code: 'MU900000010002',
              },
              {
                path: '/portal/contentmanagement/sitelibrary/add',
                PageHeaderName: '创建工地',
                component: './Portal/ContentManagement/SiteLibrary/SiteLibraryAdd',
              },
              {
                path: '/portal/contentmanagement/sitelibrary/edit',
                PageHeaderName: '编辑工地',
                component: './Portal/ContentManagement/SiteLibrary/SiteLibraryEdit',
              },
              {
                path: '/portal/contentmanagement/sitelibrary/dynamic',
                PageHeaderName: '工地动态',
                component: './Portal/ContentManagement/SiteLibrary/DynamicList',
              },
              {
                path: '/portal/contentmanagement/designerlibrary',
                name: 'designerlibrary',
                code: 'MU900000010003',
                component: './Portal/ContentManagement/DesignerLibrary/DesignerLibrary',
              },
              {
                path: '/portal/contentmanagement/designerlibrary/add',
                PageHeaderName: '创建设计师',
                component: './Portal/ContentManagement/DesignerLibrary/DesignerLibraryAdd',
              },
              {
                path: '/portal/contentmanagement/designerlibrary/edit',
                PageHeaderName: '编辑设计师',
                component: './Portal/ContentManagement/DesignerLibrary/DesignerLibraryEdit',
              },
              // {
              //   path: '/portal/contentmanagement/articlelibrary',
              //   name: 'articlelibrary',
              //   component: './Portal/ContentManagement/ArticleLibrary/ArticleLibrary',
              // },
              {
                path: '/portal/contentmanagement/projectlibrary',
                name: 'projectlibrary',
                code: 'MU900000010004',
                component: './Portal/ContentManagement/ProjectLibrary/ProjectLibrary',
              },
              {
                path: '/portal/contentmanagement/ProjectLibrary/add',
                PageHeaderName: '创建专题',
                component: './Portal/ContentManagement/ProjectLibrary/ProjectLibraryAdd',
              },
              {
                path: '/portal/contentmanagement/ProjectLibrary/edit',
                PageHeaderName: '创建专题',
                component: './Portal/ContentManagement/ProjectLibrary/ProjectLibraryEdit',
              },
              {
                path: '/portal/contentmanagement/FormLibrary',
                name: 'formLibrary',
                code: 'MU900000010005',
                component: './Portal/ContentManagement/FormLibrary/FormLibrary',
              },
            ],
          },

          {
            path: '/portal/minProgram', // 定义左侧菜单栏 与 CN文件相匹配
            name: 'minProgram',
            routes: [
              {
                path: '/portal/minProgram', // 入口文件，要用redirect作标记，这相路由刷新时才能正确匹配模块下的子路由们
                redirect: '/portal/minProgram/home',
              },
              {
                path: '/portal/minProgram/home', // 接下来，path,name/PageHeaderName, component三要素常规配置
                PageHeaderName: '当前模板',
                component: './Portal/minProgram/home',
              },
              {
                path: '/portal/minProgram/templates',
                PageHeaderName: '选择模板',
                component: './Portal/minProgram/templates',
              },
              {
                path: '/portal/minProgram/edit',
                PageHeaderName: '编辑模板',
                component: './Portal/minProgram/edit',
              },
            ],
          },

          {
            path: '/portal/mktManagement',
            name: 'mktManagement',
            routes: [
              {
                path: '/portal/mktManagement',
                redirect: '/portal/mktManagement/activity',
              },
              {
                path: '/portal/mktManagement/activity',
                name: 'activity',
                component: './Portal/mktManagement/activity',
              },
              {
                path: '/portal/mktManagement/goods',
                name: 'goods',
                component: './Portal/mktManagement/goods',
              },
            ],
          },
          // {
          //   path: '/portal/mysite',
          //   name: 'mysite',
          //   routes: [
          //     {
          //       path: '/portal/mysite',
          //       redirect: '/portal/mysite/sitepanel',
          //     },
          //     {
          //       path: '/portal/mysite/sitepanel',
          //       name: 'sitepanel',
          //       component: './Portal/MySIte/SitePanel/SitePanel',
          //     },
          //   ],
          // },
        ],
      },
      // v1.1
      // 客户
      {
        path: '/customer',
        name: 'customer',
        icon: 'retweet',
        code: 'MU90000002',
        component: './Customer/LeadManagement/LeadManagement',
        // routes: [
        //   {
        //     path: '/customer',
        //     redirect: '/customer/companyinformation',
        //   },
        //   // 线索管理
        //   {
        //     path: '/customer/leadmanagement',
        //     name: 'leadmanagement',
        //     icon: 'retweet',
        //     //code: 'P2020010110015',
        //     component: './Customer/LeadManagement/LeadManagement',
        //   },
        // ],
      },
      // 配置
      {
        path: '/setting',
        name: 'setting',
        icon: 'setting',
        code: 'MU90000003',
        routes: [
          {
            path: '/setting',
            redirect: '/setting/dictconfig',
            code: 'MU900000030001',
          },
          // 字典配置
          {
            path: '/setting/dictconfig',
            name: 'dictconfig',
            code: 'MU900000030001',
            component: './SystemSetting/DictConfig/DictConfig',
          },
          // 小程序授权
          {
            path: '/setting/miniprogram',
            name: 'miniprogram',
            code: 'MU900000030002',
            component: './SystemSetting/MiniProgram/MiniProgram',
          },
        ],
      },
      { path: '/noaccess', component: './User/NoAccess' },
      // exception/403
      {
        component: '404',
      },
    ],
  },
];
