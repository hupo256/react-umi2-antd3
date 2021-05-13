/*
 * @Author: tdd 
 * @Date: 2021-03-23 18:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-24 18:49:12 
 * mini program 里的store
 */
import React, { useState, createContext } from 'react';
import { getHomePageEditData } from '@/services/miniProgram';
import { highlightsBgImgs } from '../tools/data';

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
    getHomePageEditData(param).then(res => {
      console.log(res);
      if (!res?.data) return;
      const { editTemplateCode, editTemplateJson } = res.data;
      setpageData(addMapToData(editTemplateJson));
      settemplateCode(editTemplateCode);
      settemplateName(editTemplateJson.templateName);
    });
  }

  function addMapToData(pData) {
    const arr = pData.jsonData;
    const map = {};
    arr.forEach(item => {
      const { flag, list } = item;
      if (flag === 'highlights') item.list = addLightBg(list);
      map[flag] = item;
    });
    pData.maps = map;
    return pData;
  }

  function addLightBg(arr) {
    return arr?.map((item, ind) => {
      item.imgUrl = highlightsBgImgs[ind];
      return item;
    });
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