/*
 * @Author: tdd 
 * @Date: 2021-04-01 09:53:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12 
 * 精选案例
 */
import React, { useState, useEffect } from 'react';
import MdTitle from './mdTitle';
import pageStyle from '../preview.less';

export default function CaseMd(props) {
  const { list } = props;

  return (
    <div className="adbox">
      <SwiperBar />
    </div>
  );
}
