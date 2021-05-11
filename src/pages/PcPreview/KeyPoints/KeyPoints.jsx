import styles from './KeyPoints.module.less';
import _ from 'lodash';

const KeyPoints = ({ pointsList }) => {
  return (
    <div className={styles.featurePoints}>
      {_.map(pointsList, (feature, index) => (
        <div key={index} className={styles.featurePoint}>
          <img src={feature.icon} />
          <p className={styles.pointTitle}>{feature.title}</p>
          <p className={styles.pointSubTitle}>{feature.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default KeyPoints;
