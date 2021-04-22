/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect, useContext, useRef } from 'react';
import router from 'umi/router';
import { ctx } from '../common/context';
import { Button } from 'antd';
import { urlParamHash } from '../tools';
import { baseRouteKey } from '../tools/data';
import HoverMd from './components/hoverMd';
import SwiperBar from '../common/swiperBar';
import CaseMd from './components/caseMd';
import HighlightsMd from './components/highlightsMd';
import SiteMd from './components/siteMd';
import DesignMd from './components/designMd';
import AdMd from './components/adMd';

import './components/fontclass/iconfont.js';
import pageStyle from './preview.less';

const componentMap = {
  banner: {
    tips: '轮播',
    creatCom: e => <SwiperBar {...e} />,
  },
  highlights: {
    tips: '亮点',
    creatCom: e => <HighlightsMd {...e} />,
  },
  case: {
    tips: '精选案例',
    creatCom: e => <CaseMd {...e} />,
  },
  site: {
    tips: '工地',
    creatCom: e => <SiteMd {...e} />,
  },
  design: {
    tips: '设计师',
    creatCom: e => <DesignMd {...e} />,
  },
  advertising: {
    tips: '轮播',
    creatCom: e => <AdMd {...e} />,
  },
};

export default function Preview(props) {
  const { from } = props;
  const { pageData, touchPageData, templateCode } = useContext(ctx);
  const [totopShow, settotopShow] = useState(false);
  const [curTheme, setcurTheme] = useState('WMHPT0001');
  const contentBox = useRef();

  useEffect(() => {
    touchThemes();
    touchPageData();
  }, []);

  useEffect(() => {
    contentBox.current.addEventListener('scroll', conScroll);
    return () => {
      contentBox.current.removeEventListener('scroll', conScroll);
    };
  }, []);

  function touchThemes() {
    const formPre = urlParamHash(location.href).templateCode;
    const code = formPre ? formPre : templateCode;
    setcurTheme(code);
  }

  function conScroll(e) {
    const { target } = e;
    const clientHeight = target.clientHeight; //可视区域高度
    const scrollTop = target.scrollTop; //滚动条滚动高度
    const scrollHeight = target.scrollHeight; //滚动内容高度
    settotopShow(scrollTop > clientHeight / 3);
  }

  function gotoRoute(key) {
    router.push(`${baseRouteKey}${key}`);
  }

  function gotoTop() {
    contentBox.current.scrollTop = 0;
    contentBox.current.scrollTop = '0px';
  }

  return (
    <>
      <div className={`${pageStyle.phoneBox} ${pageStyle[curTheme]} ${from ? pageStyle.min : ''} `}>
        <div className={pageStyle.headerBox}>
          <div className={pageStyle.ptit}>
            <span>首页</span>
          </div>
        </div>

        {/* 循环出主体 */}
        <div className={pageStyle.conBox} ref={contentBox}>
          {pageData?.jsonData?.length > 0 &&
            pageData.jsonData.map((item, ind) => {
              const { flag, list = [] } = item;
              const { tips, creatCom } = componentMap[flag];
              return (
                <HoverMd key={ind} tips={tips} flag={flag} isEmpty={!list?.length}>
                  {creatCom({ ...item })}
                </HoverMd>
              );
            })}
        </div>

        {/* footer */}
        <div className={pageStyle.footerBox}>
          <ul className={pageStyle.flex}>
            <li className={pageStyle.on}>
              <svg className="icon" aria-hidden="true">
                <use href="#iconic_home_no" />
              </svg>
              <span>首页</span>
            </li>
            <li>
              <svg className="icon" aria-hidden="true">
                <use href="#iconic_case_no" />
              </svg>
              <span>案例</span>
            </li>
            <li>
              <svg className="icon" aria-hidden="true">
                <use href="#iconic_site_no" />
              </svg>
              <span>工地</span>
            </li>
            <li>
              <svg className="icon" aria-hidden="true">
                <use href="#iconic_designer_no" />
              </svg>
              <span>设计师</span>
            </li>
          </ul>
        </div>

        <div className={`${pageStyle.totopBox} ${totopShow ? pageStyle.show : ''}`}>
          <span>
            <svg className="icon" aria-hidden="true">
              <use href="#iconic_call" />
            </svg>
          </span>
          <span onClick={gotoTop}>
            <svg className="icon" aria-hidden="true">
              <use href="#iconic_top" />
            </svg>
          </span>
        </div>
      </div>

      {from && (
        <div className={pageStyle.btnbox}>
          <Button onClick={() => gotoRoute(`edit?templateCode=${curTheme}`)} type="primary">
            继续编辑
          </Button>
          <Button onClick={() => gotoRoute(`templates?tochange=1`)}>更换模板</Button>
        </div>
      )}
    </>
  );
}
