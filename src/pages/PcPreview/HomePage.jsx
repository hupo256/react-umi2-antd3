import React, { useState, useEffect } from 'react';

import styles from './Home.module.less';
import _ from 'lodash';
import CaseProjects from './Case/Case.jsx';
import MenuList from './Menu/Menu.jsx';
import KeyPoints from './KeyPoints/KeyPoints.jsx';
import HeaderLayout from './HeaderLayout/HeaderLayout.jsx';
import DesignerContent from './DesignerContent/DesignerContent.jsx';
import Articles from './Articles/Articles.jsx';
import LiveShow from './LiveShow/LiveShow.jsx';
import FooterComp from './FooterComp/FooterComp.jsx';

import { typeMap, paramMap } from './constants.js';
import WebSetting from './WebSettingOut';
import ChannelManage from '../ChannelManage';

import { Layout, Avatar, Carousel, Drawer, Button } from 'antd';

import { getMenuList, getFooter, getPublishedData, getDomain } from '@/services/pcPreview'; //admin特需

const { Content } = Layout;

const ChapterLayout = ({ children, title, description }) => (
  <div className={styles.chapterWrapper}>
    <div className={styles.chapterSection}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
    {children}
  </div>
);

const contentStyle = {
  height: '460px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
  backgroundSize: 'cover',
};
const Home = () => {
  const [menuList, setMenuList] = useState([]);
  const [footerData, setFooterData] = useState([]);
  const [dynamicDomain, setDynamicDomain] = useState([]);
  const [publishedData, setPublishedData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [showHeaderDrawer, setShowHeaderDrawer] = useState(false);
  const [showFooterDrawer, setShowFooterDrawer] = useState(false);


  useEffect(() => {
    (async () => {
      const res = await getMenuList({ keyword: '', pageNum: 1, pageSize: 18 });
      setMenuList(_.get(res, 'data.list', []));
    })();
    (async () => {
      const res = await getPublishedData([{ key: 'article', pageNum: 1, pageSize: 4 }]);
      setPublishedData(_.get(res, 'data.templateJson.jsonData'), []);
    })();
    (async () => {
      const res = await getFooter();
      setFooterData(_.get(res, 'data', []));
    })();
    (async () => {
      const res = await getDomain();
      setDynamicDomain(`http://${_.get(res, 'data.domain', '')}`);
    })();
  }, [refresh]);

  return (
    <div className={styles.container}>
      <Layout className={styles.mainLayout}>
        <div className={styles.editableWrapper}>
          <div className={styles.editHeader}>
            <Button
              className={styles.editBtn}
              type="primary"
              onClick={() => setShowHeaderDrawer(true)}
            >
              编辑
            </Button>
          </div>
          <HeaderLayout
            left={
              <div className={styles.companyHeaderStyle}>
                <Avatar
                  src={footerData.logo}
                  className={'avatar'}
                  style={{ backgroundColor: '#FF7300', verticalAlign: 'middle' }}
                  size="large"
                  gap={20}
                >
                  C
                </Avatar>
                <h1>{footerData.companyName}</h1>
              </div>
            }
            middle={<MenuList menuList={menuList} />}
            right={
              <>
                <img className={styles.phoneIcon} src={'/img/ic_phone_slices/ic_phone.png'} />
                <span className={styles.phone}>{footerData.customerService}</span>
              </>
            }
          />
        </div>

        <Carousel>
          {_.map(_.get(publishedData, '0.list', null), (item, index) => (
            <div
              key={`banner-${index}`}
              onClick={() =>
              (window.location.href = `${dynamicDomain}/${typeMap[item.type]}/details?${paramMap[item.type]
                }=${item.uid}`)
              }
            >
              <h3
                style={{
                  ...contentStyle,
                  background: `url(${_.get(item, 'imgUrl')} ) no-repeat center center`,
                }}
              >
                {' '}
              </h3>
            </div>
          ))}
        </Carousel>

        <Content className={styles.mainWrapper}>
          <ChapterLayout title={'产品特点'} description={'颠覆传统家装企业'}>
            <KeyPoints pointsList={_.get(publishedData, '1.list')} domain={dynamicDomain} />
          </ChapterLayout>

          <ChapterLayout title={'装修案例'} description={'定制全套装修方案'}>
            <CaseProjects data={_.get(publishedData, '2.list')} domain={dynamicDomain} />
          </ChapterLayout>

          <div className={styles.designerSectionWiderBackground}>
            <ChapterLayout title={'首席设计师'} description={'定制全套装修方案'}>
              <DesignerContent data={_.get(publishedData, '4.list')} domain={dynamicDomain} />
            </ChapterLayout>
          </div>

          <ChapterLayout title={'装修攻略'} description={'一分钟了解家装'}>
            <Articles data={_.slice(_.get(publishedData, '5.list'), 0, 3)} domain={dynamicDomain} />
          </ChapterLayout>

          <div className={styles.designerSectionWiderBackground}>
            <ChapterLayout title={'工地直播'} description={'全程透明 追踪可查'}>
              <LiveShow data={_.get(publishedData, '3.list')} domain={dynamicDomain} />
            </ChapterLayout>
          </div>
        </Content>

        <div className={styles.editableWrapper}>
          <div className={styles.editHeader}>
            <Button
              className={styles.editBtn}
              type="primary"
              onClick={() => setShowFooterDrawer(true)}
            >
              编辑
            </Button>
          </div>
          <FooterComp data={footerData} />
        </div>
      </Layout>

      <Drawer
        title="编辑频道"
        placement="right"
        closable={true}
        onClose={() => {
          setRefresh(!refresh);
          setShowHeaderDrawer(false);
        }}
        visible={showHeaderDrawer}
        width={900}
      >
        <ChannelManage />
      </Drawer>

      <Drawer
        title="编辑公司信息"
        placement="right"
        closable={true}
        onClose={() => {
          setRefresh(!refresh);
          setShowFooterDrawer(false);
        }}
        visible={showFooterDrawer}
        width={600}
      >
        <WebSetting />
      </Drawer>

      <div className={styles.scrollToTop} onClick={() => scrollTo(0, 0)} />
    </div>
  );
};

export default Home;
