import styles from './KeyPoints.less'
import _ from 'lodash'

import { typeMap, paramMap } from '../constants.js'

const isHide = feature => {
  return feature.type === 'games' || !feature.uid || !feature.type
}

const KeyPoints = ({ pointsList, domain }) => {
  return (
    <div className={styles.featurePoints}>
      {_.map(pointsList, (feature, index) => (
        <div
          key={index}
          className={styles.featurePoint}
          onClick={() =>
            isHide(feature) ||
            window.open(
              `${domain}/${typeMap[feature.type]}/details?${paramMap[feature.type]}=${feature.uid}`,
              '页面预览',
            )
          }
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
