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
  const [stepNum, setstepNum] = useState(1); // step所处状态
  const [newAct, setnewAct] = useState(null); // 新增游戏 暂存数据
  const [curActDate, setcurActDate] = useState(null); // 当前游戏数据
  const [curGoods, setcurGoods] = useState([]); // 当前奖项数据

  const value = {
    activityCode,
    setactivityCode,
    activityTitle,
    setactivityTitle,
    newUrl,
    setnewUrl,
    stepNum,
    setstepNum,
    newAct,
    setnewAct,
    curActDate,
    setcurActDate,
    curGoods,
    setcurGoods,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
