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
import { getHomePagePublishedData } from '@/services/miniProgram';
import { Button } from 'antd';
import HoverMd from './components/hoverMd';
import SwiperBar from '../common/swiperBar';
import CaseMd from './components/caseMd';
import HighlightsMd from './components/highlightsMd';
import SiteMd from './components/siteMd';
import DesignMd from './components/designMd';
import AdMd from './components/adMd';

import './components/fontclass/iconfont.js';
import pageStyle from './preview.less';

const baseUrlKey = '/portal/minProgram/';
const componentMap = {
  banner: {
    tips: '轮播',
    creatCom: () => <SwiperBar />,
  },
  highlights: {
    tips: '亮点',
    creatCom: (l, t) => <HighlightsMd list={l} />,
  },
  case: {
    tips: '精选案例',
    creatCom: (l, t) => <CaseMd list={l} title={t} />,
  },
  site: {
    tips: '工地',
    creatCom: (l, t) => <SiteMd list={l} title={t} />,
  },
  design: {
    tips: '设计师',
    creatCom: (l, t) => <DesignMd list={l} title={t} />,
  },
  advertising: {
    tips: '广告',
    creatCom: () => <AdMd />,
  },
};

export default function Preview(props) {
  const { isChange, curFlag, setisChange, setpageData, pageData } = useContext(ctx);
  const [homeEdit, sethomeEdit] = useState(false);
  const [totopShow, settotopShow] = useState(false);
  const contentBox = useRef();

  useEffect(() => {
    const { hash } = location;
    hash.includes('/minProgram/edit') && sethomeEdit(true);
    getJsonData();
  }, []);

  useEffect(() => {
    contentBox.current.addEventListener('scroll', conScroll);
    return () => {
      contentBox.current.removeEventListener('scroll', conScroll);
    };
  }, []);

  function conScroll(e) {
    const { target } = e;
    const clientHeight = target.clientHeight; //可视区域高度
    const scrollTop = target.scrollTop; //滚动条滚动高度
    const scrollHeight = target.scrollHeight; //滚动内容高度
    settotopShow(scrollTop > clientHeight / 2);
  }

  function gotoRoute(key) {
    router.push(`${baseUrlKey}${key}`);
  }

  function getJsonData() {
    const param = [
      {
        key: 'case',
        pageNum: '1',
        pageSize: '4',
      },
      {
        key: 'site',
        pageNum: '1',
        pageSize: '4',
      },
      {
        key: 'design',
        pageNum: '1',
        pageSize: '4',
      },
    ];
    getHomePagePublishedData(param).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setpageData(addMapToData(data.templateJson));
    });
  }

  function addMapToData(pData) {
    const arr = pData.jsonData;
    const map = {};
    arr.forEach(item => {
      const pName = item.flag;
      map[pName] = item;
    });
    pData.maps = map;
    return pData;
  }

  return (
    <div className={pageStyle.viewBox}>
      <div className={pageStyle.phoneBox}>
        <div className={pageStyle.headerBox}>
          <div className={pageStyle.ptit}>
            <span>首页</span>
          </div>
        </div>

        {/* 循环出主体 */}
        <div className={pageStyle.conBox} ref={contentBox}>
          {pageData?.jsonData?.length > 0 &&
            pageData.jsonData.map((item, ind) => {
              const { flag, list = [], title = '' } = item;
              const { tips, creatCom } = componentMap[flag];
              return (
                <HoverMd key={ind} tips={tips} flag={flag}>
                  {creatCom(list, title)}
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
          <span>
            <svg className="icon" aria-hidden="true">
              <use href="#iconic_top" />
            </svg>
          </span>
        </div>
      </div>

      {!homeEdit && (
        <div className={pageStyle.btnbox}>
          <Button onClick={() => gotoRoute('edit')} type="primary">
            继续编辑
          </Button>
          <Button onClick={() => setisChange(true)}>更换模板</Button>
        </div>
      )}
    </div>
  );
}
