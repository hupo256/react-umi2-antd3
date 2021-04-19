/*
 * @Author: tdd 
 * @Date: 2021-03-23 18:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-24 18:49:12 
 * mini program 里的store
 */
import React, { useState, createContext } from 'react';
import {
  getHomePagePublishedData,
  getHomePageEditData,
  getHomePagePublishState,
} from '@/services/miniProgram';

export const ctx = createContext();
export function Provider({ children }) {
  const [pageData, setpageData] = useState({}); // 页面渲染数据
  const [curFlag, setcurFlag] = useState(''); // 当前编辑数据的标签
  const [curInd, setcurInd] = useState(-1); // 当前修改的数据索引值
  const [linkEdtor, setlinkEdtor] = useState(false); //抽屉状态
  const [imgEdtor, setimgEdtor] = useState(false); //抽屉状态
  const [templateCode, settemplateCode] = useState(''); //当前模板code
  const [templateName, settemplateName] = useState(''); //当前模板name

  function touchPageData() {
    // 之前有发布过吗
    getHomePagePublishState().then(res => {
      if (!res?.data) return;
      const { isPublished } = res.data;
      const param = [
        {
          key: 'case',
          pageNum: '1',
          pageSize: '4',
        },
        {
          key: 'site',
          pageNum: '1',
          pageSize: '4',
        },
        {
          key: 'design',
          pageNum: '1',
          pageSize: '4',
        },
      ];
      !isPublished && getEditData(param);
      isPublished && getPublishedData(param);
    });
  }

  function getEditData(pdata) {
    getHomePageEditData(pdata).then(res => {
      console.log(res);
      if (!res?.data) return;
      const { editTemplateCode, editTemplateJson } = res.data;
      setpageData(addMapToData(editTemplateJson));
      settemplateCode(editTemplateCode);
    });
  }

  function getPublishedData(pdata) {
    getHomePagePublishedData(pdata).then(res => {
      console.log(res);
      if (!res?.data) return;
      const { templateCode, templateJson } = res.data;
      setpageData(addMapToData(templateJson));
      settemplateCode(templateCode);
    });
  }

  function addMapToData(pData) {
    const arr = pData.jsonData;
    const map = {};
    arr.forEach(item => {
      const pName = item.flag;
      map[pName] = item;
    });
    pData.maps = map;
    return pData;
  }

  const value = {
    curFlag,
    setcurFlag,
    linkEdtor,
    setlinkEdtor,
    imgEdtor,
    setimgEdtor,
    curInd,
    setcurInd,
    templateCode,
    settemplateCode,
    pageData,
    setpageData,
    touchPageData,
    templateName,
    settemplateName,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
