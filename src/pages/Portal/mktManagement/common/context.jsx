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
  const [goodsDone, setgoodsDone] = useState(false); // 奖品创建成功与否

  const value = {
    activityCode,
    setactivityCode,
    activityTitle,
    setactivityTitle,
    goodsDone,
    setgoodsDone,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
