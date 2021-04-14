/*
 * @Author: tdd 
 * @Date: 2021-03-23 18:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-24 18:49:12 
 * mini program 里的store
 */
import React, { useState, createContext } from 'react';

export const ctx = createContext();
export function Provider({ children }) {
  const [pageData, setpageData] = useState({}); // 页面渲染数据
  const [curFlag, setcurFlag] = useState(''); // 当前编辑数据的标签
  const [curInd, setcurInd] = useState(-1); // 当前修改的数据索引值
  const [linkEdtor, setlinkEdtor] = useState(false); //抽屉状态
  const [imgEdtor, setimgEdtor] = useState(false); //抽屉状态

  const [homeEdit, sethomeEdit] = useState(false); // 编辑状态

  const value = {
    curFlag,
    setcurFlag,
    linkEdtor,
    setlinkEdtor,
    imgEdtor,
    setimgEdtor,
    curInd,
    setcurInd,
    homeEdit,
    sethomeEdit,
    pageData,
    setpageData,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
