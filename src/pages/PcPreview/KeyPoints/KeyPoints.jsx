import styles from './KeyPoints.less'
import _ from 'lodash'

import { typeMap, paramMap } from '../constants.js'
import { message } from 'antd'

const isHide = feature => {
  return !feature.appletsLinkUrl
}

const KeyPoints = ({ pointsList, domain }) => {
  return (
    <div className={styles.featurePoints}>
      {_.map(pointsList, (feature, index) => (
        <div
          key={index}
          className={styles.featurePoint}
          onClick={() => {
            if (isHide(feature)) {
              return
            }

            if (feature.appletsLinkUrl === 'mkt') {
              message.destroy()
              message.warning('PC端不允许跳转到小游戏')
              return
            }

            if (feature.appletsLinkUrl === 'ShowSpecial') {
              window.open(`${domain}/img/PublicLibraryPc/special.html#/?${paramMap[feature.appletsLinkUrl]}=${feature.detailUid}`, '页面预览')
              return
            }

            if (feature.linkType === 1) {
              //列表
              window.open(
                `${domain}/${typeMap[feature.appletsLinkUrl]}`,
                '页面预览')

            }

            if (feature.linkType === 2) {
              //详情
              window.open(
                `${domain}/${typeMap[feature.appletsLinkUrl]}/details?${paramMap[feature.appletsLinkUrl]}=${feature.detailUid}`,
                '页面预览',
              )
            }


          }}
          style={{ cursor: isHide(feature) ? 'default' : 'pointer' }}
        >
          <img src={feature.icon} />
          <p className={styles.pointTitle}>{feature.title}</p>
          <p className={styles.pointSubTitle}>{feature.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default KeyPoints
