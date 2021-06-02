// 注：此文件与marketing版有大量不同，整合的时候需特别注意
import React from 'react'
import cx from 'classnames'
import styles from './FooterComp.less'

export default function FooterComp({ data, setShowFooterDrawer }) {
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
        <div className={cx(styles.companyBox, styles.editMode)}>
          <div className={styles.wechatWrapper}>
            <b>公众号</b>
            <img className={styles.qrCodeImg} src={wechatQrCode} alt="" />
            <p className={styles.wechatName}>
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
          <div className={styles.companyAddressWrapper}>
            <b>门店地址</b>
            <div className={styles.minImgBox}>
              <img src={storeCover} alt="" />
            </div>
            <div className={styles.storeAddress}>
              <img src="/img/add.png" alt="" style={{ height: '20px', width: '13px' }} />
              <div>{storeAddress}</div>
            </div>
          </div>
          <div className={styles.editButton} onClick={() => setShowFooterDrawer(true)}>
            编辑
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
