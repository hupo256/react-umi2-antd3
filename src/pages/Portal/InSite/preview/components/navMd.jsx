/*
 * @Author: tdd
 * @Date: 2021-04-01 09:53:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12
 * 设计师
 */
import React, { useState, useEffect, useContext } from 'react';
import MdTitle from './common/mdTitle';
import EmptyMd from './common/emptyMd';
import pageStyle from '../preview.less';
import { Icon, Tabs } from 'antd';
import { ctx } from '../../common/context';


export default function CaseMd(props) {
  const { pageData, touchPageData, templateCode, curFlag, navData } = useContext(ctx);

  return (
    <div className={pageStyle.footerBox}>
      <ul className={pageStyle.flex}>
        <li className={pageStyle.on}>
          <svg className="icon" aria-hidden="true">
            <use href="#iconic_home_no" />
          </svg>
          <span>首页</span>
        </li>
        {navData?.map(e =>
          <li key={e.navModule} className={pageStyle.on}>
            <svg className="icon" aria-hidden="true">
              <use href={`#${e.navModule === 'case' ? 'iconic_case_no' : e.navModule === 'site' ? 'iconic_site_no' : e.navModule === 'design' ? 'iconic_designer_no' :e.navModule === 'article' ? 'iconic_article_no' : ''}`} />
            </svg>
            <span>{e.name}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
