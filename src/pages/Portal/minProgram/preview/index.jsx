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
import SwiperBar from '../common/swiperBar';
import HoverMd from './components/hoverMd';
import CaseMd from './components/caseMd';
import HighlightsMd from './components/highlightsMd';
import SiteMd from './components/siteMd';
import DesignMd from './components/designMd';
import { Button } from 'antd';
import pageStyle from './preview.less';

const baseUrlKey = '/portal/minProgram/';
const MdList = [{}];

export default function Preview(props) {
  const { isChange, setisChange, setpageData, pageData } = useContext(ctx);
  const [homeEdit, sethomeEdit] = useState(false);
  const banList = pageData?.maps?.banner?.list || [];
  const tagList = pageData?.maps?.highlights?.list || [];
  const caseList = pageData?.maps?.case?.list || [];
  const siteList = pageData?.maps?.site?.list || [];
  const designList = pageData?.maps?.design?.list || [];
  const adList = pageData?.maps?.advertising?.list || [];

  useEffect(() => {
    const { hash } = location;
    hash.includes('/minProgram/edit') && sethomeEdit(true);

    getJsonData();
  }, []);

  function gotoRoute(key) {
    router.push(`${baseUrlKey}${key}`);
  }

  function submitJsonData() {
    const jsonData = [
      {
        title: 'banner',
        flag: 'banner',
        height: 176,
        styleType: '',
        list: [
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/110115b6fd56492e816ccf9609f3f363/2.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
            title: 'banner one',
            type: 'case',
          },
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/a2e690cb46e84a0d8d527b658d221560/v2-7df0e47eee1d0f1c7b5a6932fba58edb_720w.jpg',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
            title: 'banner two',
            type: 'design',
          },
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/b9131878ceff4b20932e79164cc3fc59/12.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
            title: 'banner three',
            type: 'site',
          },
        ],
      },
      {
        title: '亮点',
        flag: 'highlights',
        styleType: '',
        list: [
          {
            title: '专属服务',
            desc: '1v1服务对接 方便省心',
            type: 'case',
            bgImg: 'https://img.inbase.in-deco.com/crm-saas/img/highlights/img_%201@2x.png',
            uid: 'a5539d14b1df443ba574a4c2b1b7c491',
          },
          {
            title: '资深设计',
            desc: '100+设计师提供专业服务',
            type: 'design',
            bgImg: 'https://img.inbase.in-deco.com/crm-saas/img/highlights/img_2@2x.png',
            uid: 'a5539d14b1df443ba574a4c2b1b7c491',
          },
          {
            title: '优质选材',
            desc: '品牌材料直供',
            type: 'site',
            bgImg: 'https://img.inbase.in-deco.com/crm-saas/img/highlights/img_3@2x.png',
            uid: 'a5539d14b1df443ba574a4c2b1b7c491',
          },
          {
            title: '无忧服务',
            desc: '全流程负责到底',
            type: 'case',
            bgImg: 'https://img.inbase.in-deco.com/crm-saas/img/highlights/img_3@2x(1).png',
            uid: 'a5539d14b1df443ba574a4c2b1b7c491',
          },
        ],
      },
      {
        title: '精选案例',
        flag: 'case',
        styleType: '',
        list: caseList,
      },
      {
        title: '工地直播',
        flag: 'site',
        styleType: '',
        list: siteList,
      },
      {
        title: '设计师',
        flag: 'design',
        styleType: '',
        list: designList,
      },
      {
        title: '轮播广告',
        flag: 'advertising',
        height: 85,
        styleType: '',
        list: [
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/110115b6fd56492e816ccf9609f3f363/2.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
            type: 'site',
          },
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
            type: 'design',
          },
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/b9131878ceff4b20932e79164cc3fc59/12.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
            type: 'case',
          },
        ],
      },
    ];
    const themeData = {
      baseColor: '#DE392D',
      gradientColor: {
        header: {
          dark: 'rgba(255, 214, 187, 1)',
          light: 'rgba(255, 242, 234, 1)',
        },
        moduleTitle: {
          dark: 'rgba(255, 117, 22, 1)',
          light: 'rgba(255, 239, 229, 1)',
        },
      },
    };
    const params = {
      editTemplateCode: 'string',
      editTemplateJson: { jsonData, themeData },
    };
    updateHomePageEditData(params).then(res => {
      console.log(res);
    });
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
          <div className={pageStyle.ptit} onClick={submitJsonData}>
            <span>首页</span>
          </div>
        </div>

        <div className={pageStyle.conBox}>
          {/* 轮播 */}
          {banList?.length > 0 && (
            <HoverMd tips="轮播">
              <SwiperBar />
            </HoverMd>
          )}

          {/* 精选案例 */}
          {tagList?.length > 0 && (
            <HoverMd tips="亮点">
              <HighlightsMd list={tagList} />
            </HoverMd>
          )}

          {/* 精选案例 */}
          {caseList?.length > 0 && (
            <HoverMd tips="案例">
              <CaseMd list={caseList} />
            </HoverMd>
          )}

          {/* 工地直播 */}
          {siteList?.length > 0 && (
            <HoverMd tips="工地">
              <SiteMd list={siteList} />
            </HoverMd>
          )}

          {/* 设计师 */}
          {designList?.length > 0 && (
            <HoverMd tips="设计师">
              <DesignMd list={designList} />
            </HoverMd>
          )}

          {/* 广告 */}
          {adList?.length > 0 && (
            <HoverMd tips="广告">
              <SwiperBar />
            </HoverMd>
          )}
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
