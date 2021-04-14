/*
 * @Author: pengyc 
 * @Date: 2020-08-19 13:42:59 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-08 18:22:34
 * 新一个公有方法文件
 */
// 离开当前模块 清空搜索数据
export const handleRouterFun = props => {
  const hash = location.hash;

  if (!hash.includes('customer')) {
    handleResetcustomer(props);
  }
  if (!hash.includes('designerlibrary')) {
    handleResetDesigner(props);
  }
  if (!hash.includes('caselibrary')) {
    handleResetCase(props);
  }
  if (!hash.includes('sitelibrary')) {
    handleResetSite(props);
  }
};
const handleResetcustomer = props => {
  props.dispatch({
    type: 'LeadManage/resetSearchModel',
    payload: {
      pageNum: 1,
    },
  });
};
const handleResetDesigner = props => {
  props.dispatch({
    type: 'DesignerLibrary/resetSearchModel',
    payload: {
      pageNum: 1,
    },
  });
};

const handleResetCase = props => {
  props.dispatch({
    type: 'CaseLibrary/resetSearchModel',
    payload: {
      pageNum: 1,
    },
  });
};
const handleResetSite = props => {
  props.dispatch({
    type: 'SiteLibrary/resetSearchModel',
    payload: {
      pageNum: 1,
    },
  });
};
