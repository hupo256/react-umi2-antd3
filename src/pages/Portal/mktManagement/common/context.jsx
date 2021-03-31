/*
 * @Author: tdd 
 * @Date: 2021-03-31 10:12:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-31 10:35:12 
 * 营销管理 里的store
 */
import React, { useState, createContext } from 'react';

export const ctx = createContext();
export function Provider({ children }) {
  const [tbData, settbData] = useState([]); //活动数据
  const [actModal, setactModal] = useState(false); // 活动编辑框
  const [goodsList, setgoodsList] = useState([]); //奖品数据
  const [goodsModal, setgoodsModal] = useState(false); //奖品编辑框

  const value = {
    tbData,
    settbData,
    actModal,
    setactModal,
    goodsList,
    setgoodsList,
    goodsModal,
    setgoodsModal,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
