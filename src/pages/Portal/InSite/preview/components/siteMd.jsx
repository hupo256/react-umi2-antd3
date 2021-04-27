/*
 * @Author: tdd 
 * @Date: 2021-04-01 09:53:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12 
 * 工地直播
 */
import React, { useState, useEffect } from 'react';
import MdTitle from './common/mdTitle';
import EmptyMd from './common/emptyMd';
import pageStyle from '../preview.less';

export default function CaseMd(props) {
  const { list, title, flag } = props;

  return (
    <div className={`${pageStyle.mdBlock} ${pageStyle.hasbg}`}>
      <MdTitle title={title} />
      {list?.length > 0 ? (
        <div className={pageStyle.siteBox}>
          <ul>
            {list.map((site, ind) => {
              const {
                coverImg,
                gongdiTitle,
                buildingArea,
                renovationCosts,
                houseType,
                visitNum,
              } = site;
              const { bedroom } = JSON.parse(houseType);
              return (
                <li key={ind}>
                  <div className={pageStyle.minImgBox}>
                    <img src={coverImg} alt="" />
                  </div>
                  <b>{gongdiTitle}</b>
                  <p>{`${buildingArea}m² | ${bedroom}居室 | ${renovationCosts}万`}</p>
                  <p className={pageStyle.flex}>
                    <span>{`${visitNum}人参观过`}</span>
                    <a className={pageStyle.btn}>预约参观</a>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <EmptyMd flag={flag} />
      )}
    </div>
  );
}
