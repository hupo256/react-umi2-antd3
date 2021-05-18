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
    disclaimer,
  } = data

  return (
    <>
      <div className={styles.companyOut}>
        <div className={styles.companyBox}>
          <div>
            <b>公众号</b>
            <img className={styles.qrCodeImg} src={wechatQrCode} alt="" />
            <p>
              微信公众号：
              {wechatName}
            </p>
          </div>
          <div className={styles.contactUs}>
            <b>联系我们</b>
            <p className={styles.customerService}>{customerService}</p>
            <p className={styles.email}>{email}</p>
            <p className={styles.wechat}>{wechatNumber}</p>
          </div>
          <div>
            <b>门店地址</b>
            <div className={styles.minImgBox}>
              <img src={storeCover} alt="" />
            </div>
            <p className={styles.storeAddress}>{storeAddress}</p>
          </div>
        </div>
      </div>

      <div className={styles.copyRightOut}>
        <div className={styles.copyRightBox}>
          <p>
            <span>{disclaimer}</span>
            <span>{icp}</span>
          </p>
          <p>{copyright}</p>
        </div>
      </div>
    </>
  )
}
