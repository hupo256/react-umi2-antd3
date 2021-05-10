import React, { useState, useRef } from 'react'
import ReactCardCarousel from 'react-card-carousel'
import _ from 'lodash'
import styles from './DesignerContent.module.css'
import { BtnMore } from '../btn'
import cx from 'classnames'

const DesignerContent = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const Carousel = useRef()

  return (
    <div className={styles.carouselContainer}>
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
                background: `url(${value.imgUrl}) no-repeat center center`,
              }}
              className={styles.container}
            >
              {index === currentIndex && (
                <div className={styles.designerWrapper}>
                  <div className={styles.topSection}>
                    <div className={styles.userImageWrapper}>
                      <img src={value.imgUserUrl} className={styles.userImage}></img>
                    </div>
                    <div className={styles.right}>
                      <h3 className={styles.titleWrap}>
                        <p className={styles.name}>{value.designer.name}</p>
                        <div className={styles.jobTitle}>{value.designer.title}</div>
                      </h3>
                      <p className={styles.content}>{value.designer.content}</p>
                    </div>
                  </div>
                  <BtnMore text={'查看详情'} solid style={{ justifyContent: 'flex-end', marginTop: '15px' }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </ReactCardCarousel>
      <div className={styles.carouselDotsWrapper}>
        {_.map(data, (value, index) => (
          <div
            key={index}
            className={cx(styles.carouselDot, { [styles.current]: index === currentIndex })}
            onClick={() => Carousel.current.goTo(index)}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default DesignerContent
