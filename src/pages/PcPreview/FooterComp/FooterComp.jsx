// 注：此文件与marketing版有大量不同，整合的时候需特别注意
import React from 'react'
import cx from 'classnames'
import styles from './FooterComp.less'

const ImgPlaceHolderComp = ({ text = '请上传', iconUrl, manualStyle }) => (
  <div className={styles.placeholderWrap} style={manualStyle}>
    <img className={styles.centerImg} src={iconUrl} alt="" />
    <p className={styles.warningText}>{text}</p>
  </div>
)

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
            {wechatQrCode ? (
              <img className={styles.qrCodeImg} src={wechatQrCode} alt="" />
            ) : (
              <ImgPlaceHolderComp text="请上传" iconUrl="/img/ic_QRcode@2x.png" manualStyle={{ width: '78px' }} />
            )}
            <p className={styles.wechatName}>
              微信公众号：
              {wechatName}
            </p>
          </div>
          <div className={styles.contactUs}>
            <b>联系我们</b>
            {customerService && <p className={styles.customerService}>{customerService}</p>}
            {email && <p className={styles.email}>{email}</p>}
            {wechatNumber && <p className={styles.wechat}>{wechatNumber}</p>}
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
            <img
              src={'/img/ic_edit@2x.png'}
              style={{ width: '14px', height: '14px', marginRight: '5px', marginTop: '-3px' }}
            />
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
