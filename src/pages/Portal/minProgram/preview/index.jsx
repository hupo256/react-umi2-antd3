/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect, useContext } from 'react';
import router from 'umi/router';
import { ctx } from '../common/context';
import { updateHomePageEditData, getHomePagePublishedData } from '@/services/miniProgram';
import { Button } from 'antd';
import HoverMd from './components/hoverMd';
import SwiperBar from '../common/swiperBar';
import CaseMd from './components/caseMd';
import HighlightsMd from './components/highlightsMd';
import SiteMd from './components/siteMd';
import DesignMd from './components/designMd';
import AdMd from './components/adMd';

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

  useEffect(() => {
    const { hash } = location;
    hash.includes('/minProgram/edit') && sethomeEdit(true);

    getJsonData();
  }, []);

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
        <div className={pageStyle.conBox}>
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
      </div>

      <div className={pageStyle.footerBox}>
        <div className={pageStyle.flex}>
          <span className={pageStyle.on}>首页</span>
          <span>案例</span>
          <span>工地</span>
          <span>设计师</span>
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
