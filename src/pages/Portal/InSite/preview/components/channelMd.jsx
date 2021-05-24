/*
 * @Author: tdd
 * @Date: 2021-05-21 09:53:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-05-24 15:23:12
 * 频道
 */
import React, { useState, useEffect } from 'react';
import pageStyle from '../preview.less';

export default function CaseMd(props) {
  const { list } = props;

  return (
    <ul className={pageStyle.channelBox}>
      {list?.map((channel, ind) => {
        const { appletsName, imgUrl = '' } = channel;
        return (
          <li key={ind}>
            <img src={imgUrl} alt="" />
            <p>{appletsName}</p>
          </li>
        );
      })}
    </ul>
  );
}
