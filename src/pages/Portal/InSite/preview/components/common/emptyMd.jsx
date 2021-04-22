/*
 * @Author: tdd 
 * @Date: 2021-04-19 09:53:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-19 15:23:12 
 * 数据为空时显示默认模块
 */
import React from 'react';
import { emptyMdText, defaultImg } from '../../../tools/data';
import pageStyle from '../../preview.less';

export default function EmptyMd(props) {
  const { flag } = props;

  return (
    <div className={pageStyle.defaultImgBox}>
      <img src={`${defaultImg}ic_Image.png`} alt="" />
      <span>{emptyMdText[flag]}</span>
    </div>
  );
}
