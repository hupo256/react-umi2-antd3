/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { updateHomePageEditData, getHomePageEditData } from '@/services/miniProgram';
import mktApi from '@/services/mktActivity';
import SwiperBar from '../common/swiperBar';
import MdTitle from './mdTitle';
import { Button, Icon } from 'antd';
import styles from './preview.less';

const baseUrlKey = '/portal/minProgram/';

export default function Preview(props) {
  const [designList, setdesignList] = useState([]);
  const [caseList, setcaseList] = useState([]);
  const [siteList, setsiteList] = useState([]);

  useEffect(() => {
    const param = {
      pageNum: 1,
      pageSize: 10,
      status: 1,
    };
    mktApi.queryCaseList(param).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setcaseList(data.list);
    });
    mktApi.queryDesignerList(param).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setdesignList(data.list);
    });
    const param1 = {
      pageNum: 1,
      pageSize: 10,
      gongdiStatus: 1,
    };
    mktApi.sitePageList(param1).then(res => {
      console.log(res);
      const { data } = res;
      if (!data) return;
      setsiteList(data.list);
    });
  }, []);

  function gotoRoute(key) {
    router.push(`${baseUrlKey}${key}`);
  }

  function submitJsonData() {
    const jsonData = [
      {
        title: 'banner',
        flag: 'banner',
        list: [
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/110115b6fd56492e816ccf9609f3f363/2.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
          },
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/a2e690cb46e84a0d8d527b658d221560/v2-7df0e47eee1d0f1c7b5a6932fba58edb_720w.jpg',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
          },
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/b9131878ceff4b20932e79164cc3fc59/12.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
          },
        ],
      },
      {
        title: '亮点',
        flag: 'highlights',
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
        list: caseList,
      },
      {
        title: '工地直播',
        flag: 'site',
        list: siteList,
      },
      {
        title: '设计师',
        flag: 'design',
        list: designList,
      },
      {
        title: '轮播广告',
        flag: 'advertising',
        list: [
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/110115b6fd56492e816ccf9609f3f363/2.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
          },
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
          },
          {
            imgUrl:
              'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/b9131878ceff4b20932e79164cc3fc59/12.png',
            uid: '8d5e7025d86f4038ab24e22cc608c321',
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
    getHomePageEditData().then(res => {
      console.log(res);
    });
  }

  return (
    <div className={styles.currTepBox}>
      <div className={styles.phoneBox}>
        <div onClick={submitJsonData} className={styles.headerBox} />

        <div className={styles.conBox}>
          <SwiperBar />

          <ul onClick={getJsonData} className={styles.tagBox}>
            <li>
              <h3>专属服务</h3>
              <p>1v1服务对接 方便省心</p>
            </li>
            <li>
              <h3>资深设计</h3>
              <p>1v1服务对接 方便省心</p>
            </li>
            <li>
              <h3>优质选材</h3>
              <p>1v1服务对接 方便省心</p>
            </li>
            <li>
              <h3>无忧服务</h3>
              <p>1v1服务对接 方便省心</p>
            </li>
          </ul>

          <div className={styles.mdBlock}>
            <MdTitle title="精选案例" />

            <div className={styles.caseBox}>
              <div className={styles.hightImg}>
                <img
                  src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png"
                  alt=""
                />
                <p>简约风 | 100m² | 三居室 | 25.6万</p>
              </div>

              <div className={`${styles.caseImgs} ${styles.flex}`}>
                <div className={styles.caseList}>
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <u>免费设计</u>
              </div>
            </div>
          </div>

          <div className={`${styles.mdBlock} ${styles.hasbg}`}>
            <MdTitle title="工地直播" />

            <div className={styles.siteBox}>
              <ul>
                <li>
                  <img
                    src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png"
                    alt=""
                  />
                  <b>蔚蓝世纪 张女士</b>
                  <p>100m² | 二居室 | 20万</p>
                  <p className={styles.flex}>
                    <span>10人参观过</span>
                    <a className={styles.btn} href="">
                      预约参观
                    </a>
                  </p>
                </li>
                <li>
                  <img
                    src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png"
                    alt=""
                  />
                  <b>蔚蓝世纪 张女士</b>
                  <p>100m² | 二居室 | 20万</p>
                  <p className={styles.flex}>
                    <span>10人参观过</span>
                    <a className={styles.btn} href="">
                      预约参观
                    </a>
                  </p>
                </li>
                <li>
                  <img
                    src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png"
                    alt=""
                  />
                  <b>蔚蓝世纪 张女士</b>
                  <p>100m² | 二居室 | 20万</p>
                  <p className={styles.flex}>
                    <span>10人参观过</span>
                    <a className={styles.btn} href="">
                      预约参观
                    </a>
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.mdBlock}>
            <MdTitle title="设计师" />

            <div className={styles.designBox}>
              <ul>
                {/* {designList.length > 0 && designList.map((design, ind) => {
                  const {headPicUrl, position,name,caseCoverUrlList, styles, workingTime} = design
                })} */}
                <li>
                  <div className={`${styles.nameBox} ${styles.flex}`}>
                    <div className={`${styles.names} ${styles.flex}`}>
                      <img
                        src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png"
                        alt=""
                      />
                      <span>
                        <b>Hera YU</b>
                        <s>10年设计经验</s>
                      </span>
                    </div>
                    <a className={styles.btn} href="#">
                      免费咨询
                    </a>
                  </div>
                  <p>
                    <span>首席设计师</span>
                    <span>擅长: 现代风 | 简约</span>
                  </p>
                  <div className={`${styles.desCase} ${styles.flex}`}>
                    <img
                      src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210312/3fe3679f524149f08f933c1f05c56eb0/QRCode.jpg"
                      alt=""
                    />
                    <img
                      src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210312/3fe3679f524149f08f933c1f05c56eb0/QRCode.jpg"
                      alt=""
                    />
                    <img
                      src="https://test.img.inbase.in-deco.com/crm_saas/dev/20210312/3fe3679f524149f08f933c1f05c56eb0/QRCode.jpg"
                      alt=""
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBox}>footer</div>
      </div>

      <div className={styles.btnbox}>
        <Button onClick={() => gotoRoute('edit')} type="primary">
          继续编辑
        </Button>
        <Button onClick={() => gotoRoute('templates')}>更换模板</Button>
      </div>
    </div>
  );
}
