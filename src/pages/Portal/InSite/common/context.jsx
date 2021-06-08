/*
 * @Author: tdd
 * @Date: 2021-03-23 18:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-24 18:49:12
 * mini program 里的store
 */
import React, { useState, createContext } from 'react';
import { message } from 'antd';
import {
  getHomePageEditData,
  updateHomePageEditData,
  queryNavEditData,
  saveNavEditData,
} from '@/services/miniProgram';
import { highlightsBgImgs } from '../tools/data';
import { getauth } from '@/utils/authority';
import {
  queryArticleTopicDic, //其他模块查询字典
} from '@/services/dictConfig';

export const ctx = createContext();
export function Provider({ children }) {
  const [pageData, setpageData] = useState({}); // 页面渲染数据
  const [curFlag, setcurFlag] = useState(''); // 当前编辑数据的标签
  const [curInd, setcurInd] = useState(-1); // 当前修改的数据索引值
  const [linkEdtor, setlinkEdtor] = useState(false); //关联页面弹层状态
  const [imgEdtor, setimgEdtor] = useState(false); //添加图片弹层状态
  const [MdTip, setMdTip] = useState(''); //当前编辑模块的tips
  const [templateCode, settemplateCode] = useState(''); //当前模板code
  const [templateName, settemplateName] = useState(''); //当前模板name
  const [navData, setNavData] = useState([]); //导航数据
  const [choiceData, setChoiceData] = useState([
    {
      navModule: 'case',
      name: '案例',
      icon: 'iconic_case_no',
      disabled: false,
    },
    {
      navModule: 'site',
      name: '工地',
      icon: 'iconic_site_no',
      disabled: false,
    },
    {
      navModule: 'design',
      name: '设计师',
      icon: 'iconic_designer_no',
      disabled: false,
    },
    {
      navModule: 'article',
      name: '文章',
      icon: 'iconic_article',
      disabled: false,
    },
  ]); //导航数据

  function touchPageData() {
    message.loading('正在加载，请稍后...');
    queryArticleTopicDic().then(r => {
      if (r && r.code === 200) {
        const dictionaries = r.data;
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
          {
            key: 'article',
            pageNum: '1',
            pageSize: '2',
            articleDicCode: dictionaries.length ? dictionaries[0].code : '',
          },
          {
            key: 'aboutUs',
            pageNum: '1',
            pageSize: '4',
          },
          {
            key: 'channel',
            pageNum: '1',
            pageSize: '20',
          },
        ];
        getHomePageEditData(param).then(res => {
          message.destroy();
          if (!res?.data) return;
          const userInfo = getauth();
          const aboutUs = res.data.editTemplateJson.jsonData.find(e => e.flag === 'aboutUs');
          const article = res.data.editTemplateJson.jsonData.find(e => e.flag === 'article');
          if (!article) {
            res.data.editTemplateJson.jsonData.push({
              flag: 'article',
              list: [],
              title: '装修攻略',
              afterName: '装修攻略',
              styleType: '',
              showModule: true,
              nameListData: [],
            });
          }
          if (!aboutUs) {
            res.data.editTemplateJson.jsonData.push({
              flag: 'aboutUs',
              title: '关于我们',
              name: userInfo.abbreviateName || '公司简介',
              content: '请用一句简明扼要的话，来描述下您的公司吧',
              url: 'http://img.inbase.in-deco.com/crm-saas/img/banner_about.png',
            });
          }
          const { editTemplateCode, editTemplateJson } = res.data;
          editTemplateJson.jsonData.map(e => {
            if (e.flag === 'article') {
              e.nameListData = dictionaries.filter(i => i.status === '1');
            }
            if (e.title) {
              e.afterName = e.title;
            }
          });
          setpageData(addMapToData(editTemplateJson));
          settemplateCode(editTemplateCode);
          settemplateName(editTemplateJson.templateName);
        });
      }
    });
    queryNavEditData().then(r => {
      if (r && r.code === 200) {
        setNavData(r.data);
      }
    });
  }

  function addMapToData(pData) {
    const arr = pData.jsonData;
    const map = {};
    arr.forEach(item => {
      const { flag, list } = item;
      if (flag === 'highlights') item.list = addLightBg(list);
      map[flag] = item;
    });
    pData.maps = map;
    return pData;
  }

  function addLightBg(arr) {
    return arr?.map((item, ind) => {
      item.imgUrl = highlightsBgImgs[ind];
      return item;
    });
  }

  function savePageData(params, callBack) {
    if (!pageData?.jsonData) return message.error('访问过于频繁，请稍后再试');
    updateHomePageEditData(params).then(res => {
      if (res.code === 200) {
        const newArr = [...navData];
        const arr = [];
        newArr.forEach(e => {
          e.navModule && arr.push(e);
        });
        saveNavEditData(arr).then(r => {
          r.code === 200 && callBack && callBack();
        });
      }
    });
  }

  const value = {
    curFlag,
    setcurFlag,
    linkEdtor,
    setlinkEdtor,
    imgEdtor,
    setimgEdtor,
    curInd,
    setcurInd,
    templateCode,
    settemplateCode,
    pageData,
    setpageData,
    touchPageData,
    templateName,
    settemplateName,
    navData,
    setNavData,
    choiceData,
    setChoiceData,
    MdTip,
    setMdTip,
    savePageData,
  };

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
