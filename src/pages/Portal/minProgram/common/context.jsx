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
  const [tagsData, settagsData] = useState([]); // 亮点数据
  const [imgsData, setimgsData] = useState([]); // 轮播图数据
  const [fromTag, setfromTag] = useState(''); // 轮播图数据
  const [imgUrlModal, setimgUrlModal] = useState(true); //

  const value = {
    tagsData,
    settagsData,
    imgsData,
    setimgsData,
    fromTag,
    setfromTag,
    imgUrlModal,
    setimgUrlModal,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
