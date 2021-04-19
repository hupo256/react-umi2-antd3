/*
 * @Author: tdd 
 * @Date: 2021-04-01 09:53:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12 
 * 精选案例
 */
import React, { useState, useEffect } from 'react';
import MdTitle from './common/mdTitle';
import EmptyMd from './common/emptyMd';
import pageStyle from '../preview.less';

export default function CaseMd(props) {
  const { list, title, flag } = props;
  const [curInd, setcurInd] = useState(0);
  const { coverPicUrl, styleDic, acreage, bedroom, decorationCost } = list[curInd] || {};

  return (
    <div className={pageStyle.mdBlock}>
      <MdTitle title={title} />
      {list?.length > 0 ? (
        <div className={pageStyle.caseBox}>
          <div className={pageStyle.hightImg}>
            <img src={coverPicUrl} alt="" />
            <p>{`${styleDic.name || ''} | ${acreage}m² | ${
              bedroom ? bedroom : 1
            }居室 | ${decorationCost}万`}</p>
          </div>

          <div className={`${pageStyle.caseImgs} ${pageStyle.flex}`}>
            <ul className={pageStyle.caseList}>
              {list.map((item, ind) => (
                <li
                  key={ind}
                  onClick={() => setcurInd(ind)}
                  className={`${ind === curInd ? pageStyle.on : ''}`}
                >
                  <img src={item.coverPicUrl} alt="" />
                  <span />
                </li>
              ))}
            </ul>
            <u>免费设计</u>
          </div>
        </div>
      ) : (
        <EmptyMd flag={flag} />
      )}
    </div>
  );
}
