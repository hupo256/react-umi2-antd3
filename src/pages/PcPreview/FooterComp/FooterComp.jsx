import React, { useEffect, useState } from 'react'
import styles from './FooterComp.module.scss'

export default function FooterComp({ data }) {
  if (!data) return null

  const {
    copyright,
    icp,
    customerService,
    email,
    storeAddress,
    storeCover,
    wechatName,
    wechatNumber,
    wechatQrCode,
  } = data

  return (
    <>
      <div className={styles.companyOut}>
        <div className={styles.companyBox}>
          <div>
            <b>公众号</b>
            <img className={styles.qrCodeImg} src={wechatQrCode} alt="" />
            <p>微信公众号：{wechatNumber}</p>
          </div>
          <div className={styles.contactUs}>
            <b>联系我们</b>
            <p>{customerService}</p>
            <p>{email}</p>
            <p>{wechatNumber}</p>
          </div>
          <div>
            <b>门店地址</b>
            <div className={styles.minImgBox}>
              <img src={storeCover} alt="" />
            </div>
            <p>{storeAddress}</p>
          </div>
        </div>
      </div>

      <div className={styles.copyRightOut}>
        <div className={styles.copyRightBox}>
          <p>
            <span>免责声明：本网站部分内容由用户自行上传，如权利人发现存在误传其作品情形，请及时与本站联系。</span>
            <span>{icp}</span>
          </p>
          <p>{copyright}</p>
        </div>
      </div>
    </>
  )
}
