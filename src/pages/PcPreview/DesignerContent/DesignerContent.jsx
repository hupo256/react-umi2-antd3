import React, { useState, useRef } from 'react'
import ReactCardCarousel from 'react-card-carousel'
import _ from 'lodash'
import styles from './DesignerContent.less'
import { BtnMore, BtnDetail } from '../btn'
import cx from 'classnames'

const DesignerContent = ({ data, domain }) => {
  if (_.isEmpty(data)) return null

  const [currentIndex, setCurrentIndex] = useState(0)
  const Carousel = useRef()
  const toCasePage = (e, uid) => {
    if (/designer-content-container/.test(e.target.classList[0])) {
      window.open(`${domain}/cases/details?uid=${uid}`, '页面预览')
    }
  }

  return (
    <div className={styles.carouselContainer}>
      <div style={{ height: '500px', marginTop: '60px' }}>
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
                  background: _.get(value, 'caseList.list.0.coverPicUrl', null)
                    ? `url('${value['caseList']['list'][0].coverPicUrl}') no-repeat center center`
                    : `url(/img/designer/designer-placeholder.png) no-repeat center center`,
                  backgroundSize: 'cover',
                  cursor: 'pointer',
                }}
                className={styles.container}
                onClick={e => index === currentIndex && toCasePage(e, value['caseList']['list'][0].uid)}
              >
                {index === currentIndex && (
                  <div className={styles.designerWrapper}>
                    <div className={styles.topSection}>
                      <div className={styles.userImageWrapper}>
                        <img
                          src={value.headPicUrl}
                          className={styles.userImage}
                          style={{ width: '91px', height: '91px' }}
                        />
                      </div>
                      <div className={styles.right}>
                        <h3 className={styles.titleWrap}>
                          <p className={styles.name}>{value.name}</p>
                          <div className={styles.jobTitle}>{value.position}</div>
                        </h3>
                        <p className={styles.content}>
                          {value.designConcept
                            ? value.designConcept.length > 36
                              ? `${value.designConcept.slice(0, 36)}...`
                              : value.designConcept
                            : null}
                        </p>
                      </div>
                    </div>
                    <BtnDetail
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
