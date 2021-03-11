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
          },
          {
            path: '/portal/contentmanagement',
            name: 'contentmanagement',
            routes: [
              {
                path: '/portal/contentmanagement',
                redirect: '/portal/contentmanagement/caselibrary',
              },
              {
                path: '/portal/contentmanagement/caselibrary',
                name: 'caselibrary',
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
                component: './Portal/ContentManagement/ProjectLibrary/ProjectLibrary',
              },
              {
                path: '/portal/contentmanagement/ProjectLibrary/add',
                PageHeaderName: '创建专题',
                component: './Portal/ContentManagement/ProjectLibrary/ProjectLibraryAdd',
              },
              {
                path: '/portal/contentmanagement/FormLibrary',
                name: 'formLibrary',
                component: './Portal/ContentManagement/FormLibrary/FormLibrary',
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
      { path: '/noaccess', component: './User/NoAccess' },
      // exception/403
      {
        component: '404',
      },
    ],
  },
];
