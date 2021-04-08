/*
 * @Author: tdd 
 * @Date: 2021-04-01 09:53:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12 
 * 设计师
 */
import React, { useState, useEffect } from 'react';
import MdTitle from './mdTitle';
import pageStyle from '../preview.less';

export default function CaseMd(props) {
  const { list } = props;

  return (
    <div className={pageStyle.mdBlock}>
      <MdTitle title="设计师" />

      <div className={pageStyle.designBox}>
        <ul>
          {list.map((design, ind) => {
            const { headPicUrl, position, name, workingTime, styles, caseCoverUrlList } = design;
            let arr = [];
            styles.forEach(st => {
              arr.push(st.name);
            });
            return (
              <li key={ind}>
                <div className={`${pageStyle.nameBox} ${pageStyle.flex}`}>
                  <div className={`${pageStyle.names} ${pageStyle.flex}`}>
                    <img src={headPicUrl} alt="" />
                    <span>
                      <b>{name}</b>
                      <s>{`${workingTime}年设计经验`}</s>
                    </span>
                  </div>
                  <a className={pageStyle.btn}>免费咨询</a>
                </div>
                <p>
                  <span>{position}</span>
                  <span>{`擅长: ${arr.join(' | ')}`}</span>
                </p>
                <div className={`${pageStyle.desCase} ${pageStyle.flex}`}>
                  {caseCoverUrlList.length > 0 &&
                    caseCoverUrlList.map((item, i) => <img key={i} src={item} />)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
