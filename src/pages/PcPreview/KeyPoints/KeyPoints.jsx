import styles from './KeyPoints.module.scss'
import _ from 'lodash'

const KeyPoints = ({ pointsList }) => {
  return (
    <div className={styles.featurePoints}>
      {_.map(pointsList, (feature, index) => (
        <div key={index} className={styles.featurePoint}>
          <img src={feature.imgUrl}></img>
          <p className={styles.pointTitle}>{feature.title}</p>
          <p className={styles.pointSubTitle}>{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

export default KeyPoints
