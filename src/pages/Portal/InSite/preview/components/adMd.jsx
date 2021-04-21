/*
 * @Author: tdd 
 * @Date: 2021-04-01 09:53:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12 
 * 广告
 */
import React, { useState, useEffect } from 'react';
import SwiperBar from '../../common/swiperBar';

export default function CaseMd(props) {
  return (
    <div className="adbox">
      <SwiperBar {...props} />
    </div>
  );
}
