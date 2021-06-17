/*
 * @Author: tdd
 * @Date: 2021-04-01 09:53:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-06-03 13:23:12
 * 底部导航
 */
import React, { useContext } from 'react';
import { ctx } from '../../common/context';
import HoverMd from './hoverMd';
import pageStyle from '../preview.less';

export default function NavMd(props) {
  const { navData } = useContext(ctx);

  return (
    <div className={pageStyle.footerBox}>
      <HoverMd tips="导航" flag="nav">
        <ul className={pageStyle.flex}>
          {navData?.map((nav, ind) => {
            let { icon, name } = nav;
            icon = 'icon-' + icon?.split('icon')[1]; // 兼容iconfont在生成时加的前辍
            return (
              <li key={ind} className={`${icon === 'icon-ic_home_no' ? pageStyle.on : ''}`}>
                <svg className="icon">
                  <use href={`#${icon}`} />
                </svg>
                <span>{name}</span>
              </li>
            );
          })}
        </ul>
      </HoverMd>
    </div>
  );
}
