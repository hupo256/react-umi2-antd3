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

const bgImgs = [
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/3c485acbe81f42f1ac621b34496ebf51/img_designer_1.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/17159e292290401cb324c1175ccfe11f/img_designer_2.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/87382388c88646cb914ef521c9f58036/img_designer_3.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/8f8b1e6ce303458bb72764b7ba235a0f/img_designer_4.png',
];

export default function CaseMd(props) {
  const { list, title } = props;

  return (
    <div className={pageStyle.mdBlock}>
      <MdTitle title={title} />
      {list?.length > 0 ? (
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
                  <img src={bgImgs[ind]} alt="" />
                  <div className={`${pageStyle.nameBox} ${pageStyle.flex}`}>
                    <img src={headPicUrl} alt="" />
                    <span>
                      <b>{`${name.length > 4 ? name.substr(0, 4) : name}`}</b>
                      <s>{`${workingTime}年设计经验`}</s>
                    </span>
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
      ) : (
        <div className={pageStyle.defaultImgBox}>
          <svg className="icon" aria-hidden="true">
            <use href="#iconic_case_no" />
          </svg>
          <span>请在设计师库中添加设计师</span>
        </div>
      )}
    </div>
  );
}
