/*
 * @Author: tdd
 * @Date: 2021-04-01 09:53:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12
 * 精选案例
 */
import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import MdTitle from './common/mdTitle';
import EmptyMd from './common/emptyMd';
import pageStyle from '../preview.less';
import imgWordAbout from '../../../../../assets/img_word_about@2x.png'

export default function CaseMd(props) {
  const { list, title, flag, url, name, content } = props;

  return (
    <div className={`${pageStyle.mdBlock} ${pageStyle.modelEditBox}`}>
      <img className={pageStyle.bg} src={imgWordAbout} alt=''  />
      <h3>
        <b>{title}</b>
      </h3>
      <div className={pageStyle.contentWrapper}>
        <img src={url} alt='' width="100%" />
        <h4>{name}</h4>
        <p>{content}</p>
      </div>
    </div>
  );
}
