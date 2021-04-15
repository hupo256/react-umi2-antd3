/*
 * @Author: tdd 
 * @Date: 2021-03-31 11:12:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-12 10:35:12 
 * 营销管理 里的store
 */
import React, { useState, createContext } from 'react';

export const ctx = createContext();
export function Provider({ children }) {
  const [activityCode, setactivityCode] = useState(''); //活动code
  const [activityTitle, setactivityTitle] = useState(''); //活动标题
  const [newUrl, setnewUrl] = useState(''); // 奖品创建成功与否
  // const [newUrl, setnewUrl] = useState('https://www.baidu.com'); // 奖品创建成功与否
  const [stepNum, setstepNum] = useState(0); // step所处状态

  const value = {
    activityCode,
    setactivityCode,
    activityTitle,
    setactivityTitle,
    newUrl,
    setnewUrl,
    stepNum,
    setstepNum,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
