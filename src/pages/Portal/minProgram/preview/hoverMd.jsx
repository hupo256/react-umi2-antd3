/*
 * @Author: tdd 
 * @Date: 2021-04-06 10:05:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-07 16:11:12 
 * 内容模块标题
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import { tagsMap } from '../tools/data';
import pageStyle from './preview.less';

export default function MdTitle(props) {
  const { tips = '', children } = props;
  const { setcurFlag } = useContext(ctx);
  const [tit, settit] = useState('');

  function toEdit() {
    tagsMap.forEach(tag => {
      const { name, value } = tag;
      if (name === tips) {
        setcurFlag(value);
        settit(name);
      }
    });
  }

  return (
    <div className={`${pageStyle.hoverBox} ${tit === tips ? pageStyle.curMd : ''}`}>
      <span onClick={toEdit} className={pageStyle.hoverHandle}>{`编辑${tips}`}</span>
      {children}
    </div>
  );
}
