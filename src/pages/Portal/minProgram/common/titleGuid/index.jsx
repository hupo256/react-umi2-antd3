/*
 * @Author: tdd 
 * @Date: 2021-03-25 16:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-25 16:49:12 
 * 移动端首页 公用头部
 */
import React, { useContext } from 'react';
import { Button } from 'antd';
import { ctx } from '../context';
import {
  updateHomePageEditData,
  publishEditData,
  getHomePagePublishedData,
} from '@/services/miniProgram';
import styles from './titleGuid.less';

const bgImgs = [
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/3c485acbe81f42f1ac621b34496ebf51/img_designer_1.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/17159e292290401cb324c1175ccfe11f/img_designer_2.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/87382388c88646cb914ef521c9f58036/img_designer_3.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/8f8b1e6ce303458bb72764b7ba235a0f/img_designer_4.png',
];

export default function TitleGuid(props) {
  const { title = '标题', disc, isEdit } = props;
  const { pageData, setpageData, setcurFlag } = useContext(ctx);

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
    setcurFlag('');
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

  function addBgImgToDesign(jsonData) {
    const desArr = jsonData[4].list.map((item, ind) => {
      const { name } = item;
      item.name = name.length > 4 ? name.substr(0, 4) : name;
      item.bgImg = bgImgs[ind];
      return item;
    });

    jsonData[4].list = desArr;
  }

  function toPublich() {
    console.log(pageData);
    let { jsonData, themeData } = pageData;
    const { customerService } = JSON.parse(localStorage.getItem('auth'));

    themeData = {
      baseColor: 'rgba(49, 181, 89, 1)',
      gradientColor: {
        header: {
          dark: 'rgba(198, 234, 209, 1)',
          light: 'rgba(236, 248, 240, 1)',
        },
        moduleTitle: {
          dark: 'rgba(58, 184, 96, 1)',
          light: 'rgba(231, 246, 236, 1)',
        },
      },
    };

    const parmas = {
      editTemplateCode: 'WMHPT0001',
      editTemplateJson: { jsonData, themeData, globalInfor: { customerService } },
    };
    updateHomePageEditData(parmas).then(res => {
      res.code === 200 && publishEditData();
    });
  }

  return (
    <div className={styles.guidBox}>
      <h3>
        <span>{title}</span>
        {isEdit && (
          <div className={styles.btnBox}>
            <Button onClick={getJsonData}>放弃更改</Button>
            <Button onClick={toPublich} type="primary">
              发布
            </Button>
          </div>
        )}
      </h3>
      {disc && <p>模板可以帮您一键生成案例、工地和设计师模块，并有多种布局和风格供您选择。</p>}
    </div>
  );
}
