import React, { useState, useEffect, useContext, useRef } from 'react';
import router from 'umi/router';
import { ctx } from '../common/context';
import { getauth } from '@/utils/authority';
import { urlParamHash } from '../tools';
import { baseRouteKey } from '../tools/data';
import HoverMd from './components/hoverMd';
import SwiperBar from '../common/swiperBar';
import CaseMd from './components/caseMd';
import HighlightsMd from './components/highlightsMd';
import SiteMd from './components/siteMd';
import DesignMd from './components/designMd';
import AdMd from './components/adMd';
import AboutUsMd from './components/aboutUsMd';
import ArticleMd from './components/articleMd';
import NavMd from './components/navMd';
import ChannelMd from './components/channelMd';

import './components/fontclass/iconfont.js';
import pageStyle from './preview.less';
const permissionsBtn = getauth().permissions || [];

const componentMap = {
  banner: {
    tips: '图片广告',
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
    tips: '图片广告',
    creatCom: e => <AdMd {...e} />,
  },
  aboutUs: {
    tips: '关于我们',
    creatCom: e => <AboutUsMd {...e} />,
  },
  article: {
    tips: '文章',
    creatCom: e => <ArticleMd {...e} />,
  },
  channel: {
    tips: '频道',
    creatCom: e => <ChannelMd {...e} />,
  },
};

export default function Preview(props) {
  const { from } = props;
  const { pageData, touchPageData, templateCode, navData } = useContext(ctx);
  const [totopShow, settotopShow] = useState(false);
  const [curTheme, setcurTheme] = useState('WMHPT0001');
  const contentBox = useRef();

  useEffect(() => {
    touchPageData();
  }, []);

  useEffect(
    () => {
      touchThemes();
    },
    [templateCode]
  );

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
    <div className={pageStyle.phoneOut}>
      <div className={`${pageStyle.phoneBox} ${pageStyle[curTheme]} ${from ? pageStyle.min : ''} `}>
        <div className={pageStyle.headerBox}>
          <div className={pageStyle.ptit}>
            <span>首页</span>
          </div>
        </div>
        {/* 循环出主体 */}
        <div className={pageStyle.conBox} ref={contentBox}>
          <div className={pageStyle.conInnerBox}>
            {pageData?.jsonData?.length > 0 &&
              pageData.jsonData.map((item, ind) => {
                const { flag, list = [] } = item;
                if (flag === 'channel' && list.length === 0) return;
                const model = componentMap[flag];
                if (model) {
                  const { tips, creatCom } = model;
                  return (
                    <HoverMd key={ind} tips={tips} flag={flag} isEmpty={!list?.length}>
                      {creatCom({ ...item })}
                    </HoverMd>
                  );
                }
              })}

            {/* 底部导航 */}
            <NavMd />
          </div>
        </div>

        {/* totopBox */}
        <div className={pageStyle.totopBox}>
          <span>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-ic_share" />
            </svg>
          </span>
          <span>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-ic_call" />
            </svg>
          </span>
          <span>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-ic_more" />
            </svg>
          </span>
          <span onClick={gotoTop} className={`${totopShow ? pageStyle.show : ''}`}>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-ic_top" />
            </svg>
          </span>
        </div>

        {from && (
          <div className={pageStyle.btnbox}>
            {permissionsBtn.includes('BTN210422000004') && (
              <a onClick={() => gotoRoute(`edit?templateCode=${curTheme}`)}>继续编辑</a>
            )}
            {permissionsBtn.includes('BTN210422000005') && (
              <a onClick={() => gotoRoute(`templates?tochange=1`)}>更换模板</a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
