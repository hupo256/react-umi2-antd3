import styles from './KeyPoints.less'
import _ from 'lodash'

import { typeMap, paramMap } from '../constants.js'
import { message } from 'antd'

const isHide = feature => {
  return !feature.uid || !feature.type
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
            if (feature.type === 'games') {
              message.destroy()
              message.warning('PC端不允许跳转到小游戏')
              return
            }
            if (feature.type === 'special') {
              window.open(`${domain}/img/PublicLibraryPc/special.html#/?uid=${feature.uid}`, '页面预览')
              return
            }
            window.open(
              `${domain}/${typeMap[feature.type]}/details?${paramMap[feature.type]}=${feature.uid}`,
              '页面预览',
            )
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
