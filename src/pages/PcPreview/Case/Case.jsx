import { BtnMore } from '../btn'
import _ from 'lodash'
import styles from './Case.module.scss'

const CaseProjects = ({ data }) => {
  // 初版
  if (_.isEmpty(data)) return null
  const len = data.length

  const caseStyle = {}
  _.forEach(data, (item, index) => {
    caseStyle[`image${index}`] = {
      background: `url(${item.imgUrl}) no-repeat center center`,
      backgroundSize: 'cover',
      height: '100%',
    }
  })

  const OneImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
    }
    caseStyle.caseItem = {
      flex: 1,
      height: '570px',
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div style={caseStyle.caseItem} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[0].text}</p>
              <BtnMore text={'查看详情'} solid />
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur}></div>
          </div>
        </div>
        <BtnMore />
      </>
    )
  }

  const TwoImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      gap: '18px',
    }
    caseStyle.caseItem = {
      flex: 1,
      height: '400px',
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div style={caseStyle.caseItem} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[0].text}</p>
              <BtnMore text={'查看详情'} solid />
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur}></div>
          </div>
          <div style={caseStyle.caseItem} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[1].text}</p>
              <BtnMore text={'查看详情'} solid />
            </div>
            <div style={caseStyle.image1} className={styles.bgBlur}></div>
          </div>
        </div>
        <BtnMore />
      </>
    )
  }

  const ThreeImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      alignItems: 'stretch',
      gap: '18px',
      height: '620px',
    }
    caseStyle.left = {
      flex: 1,
    }

    caseStyle.right = {
      flex: 1,
      display: 'flex',
      gap: '18px',
      flexDirection: 'column',
    }

    caseStyle.caseItem = {
      flex: 1,
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div style={caseStyle.left} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[1].text}</p>
              <BtnMore text={'查看详情'} solid />
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur}></div>
          </div>
          <div style={caseStyle.right}>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[1].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image1} className={styles.bgBlur}></div>
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[2].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image2} className={styles.bgBlur}></div>
            </div>
          </div>
        </div>
        <BtnMore />
      </>
    )
  }

  const FourImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      gap: '18px',
      flexDirection: 'column',
    }
    caseStyle.caseWrapper = {
      height: '280px',
      display: 'flex',
      gap: '18px',
    }
    caseStyle.caseItem = {
      flex: 1,
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div style={caseStyle.caseWrapper}>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[0].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image0} className={styles.bgBlur}></div>
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[1].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image1} className={styles.bgBlur}></div>
            </div>
          </div>
          <div style={caseStyle.caseWrapper}>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[2].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image2} className={styles.bgBlur}></div>
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[3].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image3} className={styles.bgBlur}></div>
            </div>
          </div>
        </div>
        <BtnMore />
      </>
    )
  }

  const FiveImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      alignItems: 'stretch',
      gap: '18px',
      height: '620px',
    }
    caseStyle.left = {
      flex: 1,
    }

    caseStyle.right = {
      flex: 1,
      display: 'flex',
      gap: '18px',
      flexDirection: 'column',
    }

    caseStyle.caseItem = {
      flex: 1,
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div style={caseStyle.left} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[0].text}</p>
              <BtnMore text={'查看详情'} solid />
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur}></div>
          </div>
          <div style={caseStyle.right}>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[1].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image1} className={styles.bgBlur}></div>
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[2].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image2} className={styles.bgBlur}></div>
            </div>
          </div>
          <div style={caseStyle.right}>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[3].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image3} className={styles.bgBlur}></div>
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[4].text}</p>
                <BtnMore text={'查看详情'} solid />
              </div>
              <div style={caseStyle.image4} className={styles.bgBlur}></div>
            </div>
          </div>
        </div>
        <BtnMore />
      </>
    )
  }

  switch (len) {
    case 1:
      return <OneImageLayout />
    case 2:
      return <TwoImageLayout />
    case 3:
      return <ThreeImageLayout />
    case 4:
      return <FourImageLayout />
    case 5:
      return <FiveImageLayout />
  }

  return null
}

export default CaseProjects
