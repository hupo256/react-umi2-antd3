/*
 * @Author: tdd
 * @Date: 2021-04-01 09:53:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-06 15:23:12
 * 设计师
 */
import React, { useState, useEffect } from 'react';
import MdTitle from './common/mdTitle';
import EmptyMd from './common/emptyMd';
import pageStyle from '../preview.less';
import { Icon, Tabs } from 'antd';

const bgImgs = [
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/3c485acbe81f42f1ac621b34496ebf51/img_designer_1.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/17159e292290401cb324c1175ccfe11f/img_designer_2.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/87382388c88646cb914ef521c9f58036/img_designer_3.png',
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/8f8b1e6ce303458bb72764b7ba235a0f/img_designer_4.png',
];

export default function CaseMd(props) {
  const { list, title, flag, nameListData, showModule } = props;

  return (
    <div className={pageStyle.mdBlock}>
      <MdTitle title={title} />
      <div className={pageStyle.nav}>
        {nameListData.map(e =>
          <div key={e.code}>{e.name}</div>
        )}
      </div>
      <div className={pageStyle.content}>
        {showModule ? <>
          {list.map(i =>
            <div>
              <div className={pageStyle.imgsWrapper}>
                <div className={pageStyle.imgBox}>
                  <img src={i.articleCoverImg} alt='' />
                </div>
                <div className={pageStyle.right}>
                  <div className={pageStyle.title}>{i.articleTitle}</div>
                  <div className={pageStyle.text}>
                    {i.articleShortContent}
                  </div>
                  <div className={pageStyle.view}><Icon type="eye" />&nbsp;{i.view}</div>
                </div>
              </div>
            </div>
          )}
        </> :
        <div className={pageStyle.noData}>
          发布后若该模块无任何一篇文章，该模块在小程序内不展示。
        </div>
        }
      </div>
    </div>
  );
}
