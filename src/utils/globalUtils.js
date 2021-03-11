/*
 * @Author: pengyc 
 * @Date: 2020-08-19 13:42:59 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-01-21 16:30:25
 * 新一个公有方法文件
 */
// 离开当前模块 清空搜索数据
export const handleRouterFun = props => {
  const hash = location.hash;

  if (!hash.includes('project')) {
    handleResetProject(props);
  }
};
const handleResetProject = props => {
  props.dispatch({
    type: 'ProjectManage/resetSearchModel',
    payload: {
      pageNum: 1,
    },
  });
};
