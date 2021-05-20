/*
 * @Author: tdd
 * @Date: 2021-04-01 09:53:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12
 * 亮点
 */
import React, { useState, useEffect } from 'react';
import { highlightsBgImgs } from '../../tools/data';
import pageStyle from '../preview.less';

export default function CaseMd(props) {
  const { list } = props;

  return (
    <ul className={pageStyle.tagBox}>
      {list?.map((channel, ind) => {
        const { appletsName } = channel;
        return (
          <li key={ind}>
            <h3>{appletsName}</h3>
            {/* <p>{desc}</p>
            <img src={highlightsBgImgs[ind]} alt="" /> */}
          </li>
        );
      })}
    </ul>
  );
}
