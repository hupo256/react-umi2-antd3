import { BtnMore } from '../btn'
import _ from 'lodash'
import styles from './LiveShow.less'

const CHN_NUM_CHAR = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

const CaseProjects = ({ data, domain }) => {
  if (_.isEmpty(data)) return null
  const len = data.length

  const caseStyle = {}
  _.forEach(data, (item, index) => {
    const { bedroom, parlor } = JSON.parse(item.houseType)
    data[index]['name'] = `${item.buildingName.length > 6 ? item.buildingName.slice(0, 6) + '...' : item.buildingName}`
    bedroom
      ? (data[index]['text'] = `${item.buildingArea}m² | ${bedroom}居室 | ${item.renovationCosts}万元`)
      : (data[index]['text'] = `${item.buildingArea}m² | ${item.renovationCosts}万元`)

    caseStyle[`image${index}`] = {
      background: `url(${item.coverImg}) no-repeat center center`,
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
      height: '493px',
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div
            style={caseStyle.caseItem}
            className={styles.clickableImg}
            onClick={() => data[0].uid && window.open(`${domain}/sites/details?gongdiUid=${data[0].uid}`, '页面预览')}
          >
            <div className={styles.bgText}>
              <p>{data[0].name}</p>
              <p>{data[0].text}</p>
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
        </div>
        <BtnMore text={'更多工地'} url={domain + '/sites'} />
      </>
    )
  }

  const TwoImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
    }
    caseStyle.caseItem = { flex: 1, height: '368px' }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div
            style={{ ...caseStyle.caseItem, marginRight: '18px' }}
            className={styles.clickableImg}
            onClick={() => data[0].uid && window.open(`${domain}/sites/details?gongdiUid=${data[0].uid}`, '页面预览')}
          >
            <div className={styles.bgText}>
              <p>{data[0].name}</p>
              <p>{data[0].text}</p>
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
          <div
            style={caseStyle.caseItem}
            className={styles.clickableImg}
            onClick={() => data[0].uid && window.open(`${domain}/sites/details?gongdiUid=${data[1].uid}`, '页面预览')}
          >
            <div className={styles.bgText}>
              <p>{data[1].name}</p>
              <p>{data[1].text}</p>
            </div>
            <div style={caseStyle.image1} className={styles.bgBlur} />
          </div>
        </div>
        <BtnMore text={'更多工地'} url={domain + '/sites'} />
      </>
    )
  }

  const ThreeImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      alignItems: 'stretch',
      height: '368px',
    }
    caseStyle.left = {
      flex: 1,
      flexBasis: '25%',
      marginRight: '18px',
    }

    caseStyle.right = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }

    caseStyle.caseItem = {
      flex: 1,
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div
            style={caseStyle.left}
            className={styles.clickableImg}
            onClick={() => data[0].uid && window.open(`${domain}/sites/details?gongdiUid=${data[0].uid}`, '页面预览')}
          >
            <div className={styles.bgText}>
              <p>{data[0].name}</p>
              <p>{data[0].text}</p>
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
          <div style={caseStyle.right}>
            <div
              style={{ ...caseStyle.caseItem, marginBottom: '18px' }}
              className={styles.clickableImg}
              onClick={() => data[0].uid && window.open(`${domain}/sites/details?gongdiUid=${data[1].uid}`, '页面预览')}
            >
              <div className={styles.bgText}>
                <p>{data[1].name}</p>
                <p>{data[1].text}</p>
              </div>
              <div style={caseStyle.image1} className={styles.bgBlur} />
            </div>
            <div
              style={caseStyle.caseItem}
              className={styles.clickableImg}
              onClick={() => data[0].uid && window.open(`${domain}/sites/details?gongdiUid=${data[2].uid}`, '页面预览')}
            >
              <div className={styles.bgText}>
                <p>{data[2].name}</p>
                <p>{data[2].text}</p>
              </div>
              <div style={caseStyle.image2} className={styles.bgBlur} />
            </div>
          </div>
        </div>
        <BtnMore text={'更多工地'} url={domain + '/sites'} />
      </>
    )
  }

  switch (len) {
    case 1:
      return <OneImageLayout />
    case 2:
      return <TwoImageLayout />
    default:
      return <ThreeImageLayout />
  }
}

export default CaseProjects
