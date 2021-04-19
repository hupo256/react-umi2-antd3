/*
 * @Author: tdd 
 * @Date: 2021-04-01 09:53:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12 
 * 亮点
 */
import React, { useState, useEffect } from 'react';
import pageStyle from '../preview.less';

export default function CaseMd(props) {
  const { list } = props;

  console.log(list);
  return (
    <ul className={pageStyle.tagBox}>
      {list?.map((tag, ind) => {
        const { title, desc, bgImg } = tag;
        return (
          <li key={ind}>
            <h3>{title}</h3>
            <p>{desc}</p>
            <img src={bgImg} alt="" />
          </li>
        );
      })}
    </ul>
  );
}
