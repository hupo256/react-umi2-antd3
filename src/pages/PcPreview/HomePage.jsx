import React, { useState, useEffect } from 'react'

import styles from './Home.less'
import _ from 'lodash'
import CaseProjects from './Case/Case.jsx'
import MenuList from './Menu/Menu.jsx'
import KeyPoints from './KeyPoints/KeyPoints.jsx'
import HeaderLayout from './HeaderLayout/HeaderLayout.jsx'
import DesignerContent from './DesignerContent/DesignerContent.jsx'
import Articles from './Articles/Articles.jsx'
import LiveShow from './LiveShow/LiveShow.jsx'
import FooterComp from './FooterComp/FooterComp.jsx'

import { typeMap, paramMap } from './constants.js'
import WebSetting from './WebSettingOut' // 注意：此处营销站独有
import ChannelManage from '../ChannelManage' // 注意：此处营销站独有

import { Layout, Carousel, Drawer, message } from 'antd'

import { getMenuList, getFooter, getPublishedData, getDomain } from '@/services/pcPreview' // 注意：此处营销站独有

const { Content } = Layout

const ChapterLayout = ({ children, title, description }) => (
  <div className={styles.chapterWrapper}>
    <div className={styles.chapterSection}>
      <h2 className={styles.title}>{title}</h2>
      {/* <p className={styles.description}>{description}</p> */}
    </div>
    {children}
  </div>
)

const Home = () => {
  const [menuList, setMenuList] = useState([])
  const [footerData, setFooterData] = useState([])

  const [publishedData, setPublishedData] = useState([])
  const [totopShow, settotopShow] = useState(false)

  const [dynamicDomain, setDynamicDomain] = useState([]) // 注意：此处营销站独有
  const [refresh, setRefresh] = useState(false) // 注意：此处营销站独有
  const [showHeaderDrawer, setShowHeaderDrawer] = useState(false) // 注意：此处营销站独有
  const [showFooterDrawer, setShowFooterDrawer] = useState(false) // 注意：此处营销站独有

  useEffect(
    () => {
      ;(async () => {
        const res = await getMenuList({ keyword: '', pageNum: 1, pageSize: 18 })
        setMenuList(_.get(res, 'data.list', []))
      })()
      ;(async () => {
        const res = await getPublishedData([{ key: 'article', pageNum: 1, pageSize: 4 }])
        setPublishedData(_.get(res, 'data.templateJson.jsonData'), [])
      })()
      ;(async () => {
        const res = await getFooter()
        setFooterData(_.get(res, 'data', []))
      })()
      ;(async () => {
        const res = await getDomain()
        setDynamicDomain(`http://${_.get(res, 'data.domain', '')}`)
      })()
    },
    [refresh],
  )

  useEffect(() => {
    document.addEventListener('scroll', conScroll)
    return () => {
      document.removeEventListener('scroll', conScroll)
    }
  }, [])

  function conScroll() {
    const clientHeight = document.documentElement.clientHeight //可视区域高度
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop //滚动条滚动高度
    settotopShow(scrollTop > clientHeight / 3)
  }

  if (_.isEmpty(menuList) || _.isEmpty(publishedData) || _.isEmpty(footerData)) return null
  return (
    <div className={styles.container}>
      <Layout className={styles.mainLayout}>
        <div className={styles.editableWrapper}>
          <HeaderLayout
            left={
              <div className={styles.companyHeaderStyle}>
                <img src={footerData.logo} className={styles.logoStyle} />
              </div>
            }
            middle={
              <MenuList menuList={menuList} setShowHeaderDrawer={setShowHeaderDrawer} dynamicDomain={dynamicDomain} />
            }
            right={
              <div className={styles.contactHeader}>
                <img className={styles.phoneIcon} src={'/img/ic_phone_slices/ic_phone.png'} />
                <span className={styles.phone}>{footerData.customerService}</span>
              </div>
            }
          />
        </div>

        <Carousel autoplay>
          {_.map(_.find(publishedData, { flag: 'banner' })['list'], (item, index) => (
            <div
              key={`banner-${index}`}
              onClick={() => {
                if (!item.uid) {
                  return
                }
                if (item.type === 'games') {
                  message.warning('PC端不允许跳转到小游戏')
                  return
                }
                window.open(
                  `${dynamicDomain}/${typeMap[item.type]}/details?${paramMap[item.type]}=${item.uid}`,
                  '页面预览',
                )
              }}
            >
              <h3 className={styles.banner} style={{ backgroundImage: `url(${_.get(item, 'imgUrl')})` }}>
                {' '}
              </h3>
            </div>
          ))}
        </Carousel>

        <Content className={styles.mainWrapper}>
          <ChapterLayout title={'产品特点'} description={'颠覆传统家装企业'}>
            <KeyPoints pointsList={_.find(publishedData, { flag: 'highlights' })['list']} domain={dynamicDomain} />
          </ChapterLayout>

          <ChapterLayout title={'装修案例'} description={'定制全套装修方案'}>
            <CaseProjects data={_.find(publishedData, { flag: 'case' })['list']} domain={dynamicDomain} />
          </ChapterLayout>

          <div className={styles.designerSectionWiderBackground}>
            <ChapterLayout title={'参观工地'} description={'全程透明 追踪可查'}>
              <LiveShow data={_.find(publishedData, { flag: 'site' })['list']} domain={dynamicDomain} />
            </ChapterLayout>
          </div>

          <ChapterLayout title={'首席设计师'} description={'定制全套装修方案'}>
            <DesignerContent data={_.find(publishedData, { flag: 'design' })['list']} domain={dynamicDomain} />
          </ChapterLayout>

          <div className={styles.designerSectionWiderBackground}>
            <ChapterLayout title={'装修攻略'} description={'一分钟了解家装'}>
              <Articles
                data={_.slice(
                  _.find(publishedData, {
                    flag: 'article',
                  })['list'],
                  0,
                  3,
                )}
                domain={dynamicDomain}
              />
            </ChapterLayout>
          </div>
        </Content>

        <FooterComp data={footerData} setShowFooterDrawer={setShowFooterDrawer} />
      </Layout>

      <Drawer
        title="编辑频道"
        placement="right"
        closable={true}
        onClose={() => {
          setRefresh(!refresh)
          setShowHeaderDrawer(false)
        }}
        visible={showHeaderDrawer}
        width={900}
        headerStyle={{ border: 'none', marginBottom: '-18px' }}
        destroyOnClose
      >
        <ChannelManage isPcPreview={true} />
      </Drawer>

      <Drawer
        title="编辑公司信息"
        placement="right"
        closable={true}
        onClose={() => {
          setRefresh(!refresh)
          setShowFooterDrawer(false)
        }}
        visible={showFooterDrawer}
        width={800}
        headerStyle={{ border: 'none', marginBottom: '-18px' }}
        destroyOnClose
      >
        <WebSetting />
      </Drawer>

      <div className={`${styles.scrollToTop} ${totopShow ? styles.show : ''}`} onClick={() => scrollTo(0, 0)} />
    </div>
  )
}

export default Home
