import React, { useState, useRef } from 'react'
import ReactCardCarousel from 'react-card-carousel'
import _ from 'lodash'
import styles from './DesignerContent.module.scss'
import { BtnMore } from '../btn'
import cx from 'classnames'

const DesignerContent = ({ data, domain = '' }) => {
  if (_.isEmpty(data)) return null

  const [currentIndex, setCurrentIndex] = useState(0)
  const Carousel = useRef()

  return (
    <div className={styles.carouselContainer}>
      <div style={{ height: '500px' }}>
        <ReactCardCarousel
          autoplay={false}
          autoplay_speed={10000}
          ref={Carousel}
          afterChange={() => setCurrentIndex(Carousel.current.getCurrentIndex())}
        >
          {_.map(data, (value, index) => (
            <div className={index === currentIndex ? '' : styles.inactive} key={index}>
              <div
                style={{
                  background: value.caseCoverUrlList[0]
                    ? `url(${value.caseCoverUrlList[0]}) no-repeat center center`
                    : '#e8e8e8',
                  backgroundSize: 'cover',
                }}
                className={styles.container}
              >
                {index === currentIndex && (
                  <div className={styles.designerWrapper}>
                    <div className={styles.topSection}>
                      <div className={styles.userImageWrapper}>
                        <img
                          src={value.headPicUrl}
                          className={styles.userImage}
                          style={{
                            width: '91px',
                            height: '91px',
                          }}
                        />
                      </div>
                      <div className={styles.right}>
                        <h3 className={styles.titleWrap}>
                          <p className={styles.name}>{value.name}</p>
                          <div className={styles.jobTitle}>{value.position}</div>
                        </h3>
                        <p className={styles.content}>{value.designConcept}</p>
                      </div>
                    </div>
                    <BtnMore
                      text={'查看详情'}
                      solid
                      url={`${domain}/designers/details?uid=${value.uid}`}
                      style={{ justifyContent: 'flex-end', marginTop: '15px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </ReactCardCarousel>
      </div>
      <div className={styles.carouselDotsWrapper}>
        {_.map(data, (value, index) => (
          <div
            key={index}
            className={cx(styles.carouselDot, { [styles.current]: index === currentIndex })}
            onClick={() => Carousel.current.goTo(index)}
          />
        ))}
      </div>
      <BtnMore url={domain + '/designers'} text={'更多设计师'} />
    </div>
  )
}

export default DesignerContent
