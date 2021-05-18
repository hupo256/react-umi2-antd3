import styles from './KeyPoints.module.scss'
import _ from 'lodash'

import { typeMap, paramMap } from '../constants.js'
const KeyPoints = ({ pointsList, domain = '' }) => {
  return (
    <div className={styles.featurePoints}>
      {_.map(pointsList, (feature, index) => (
        <div
          key={index}
          className={styles.featurePoint}
          onClick={() =>
            feature.type === 'games' ||
            !feature.uid ||
            !feature.type ||
            (window.location.href = `${domain}/${typeMap[feature.type]}/details?${paramMap[feature.type]}=${
              feature.uid
            }`)
          }
          style={{ cursor: feature.type === 'games' ? 'default' : 'pointer' }}
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
