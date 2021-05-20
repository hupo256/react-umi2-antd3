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
      {_.map(
        pointsList,
        (feature, index) =>
          feature.type === 'games' || (
            <div
              key={index}
              className={styles.featurePoint}
              onClick={() =>
                window.open(
                  `${domain}/${typeMap[feature.type]}/details?${paramMap[feature.type]}=${feature.uid}`,
                  '页面预览',
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <img src={feature.icon} />
              <p className={styles.pointTitle}>{feature.title}</p>
              <p className={styles.pointSubTitle}>{feature.desc}</p>
            </div>
          ),
      )}
    </div>
  )
}

export default KeyPoints
