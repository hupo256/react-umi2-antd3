import { BtnDetail, BtnMore } from '../btn'
import _ from 'lodash'
import styles from './Case.less'

const CHN_NUM_CHAR = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

const CaseProjects = ({ data, domain }) => {
  if (_.isEmpty(data)) return null

  const len = data.length

  const caseStyle = {}
  _.forEach(data, (item, index) => {
    data[index]['name'] = `${item.title.length > 6 ? item.title.slice(0, 6) + '...' : item.title}`

    item.bedroom
      ? (data[index]['text'] = `${item.acreage}m² | ${item.bedroom}居室 | ${item.decorationCost}万元`)
      : (data[index]['text'] = `${item.acreage}m² | ${item.decorationCost}万元`)

    caseStyle[`image${index}`] = {
      backgroundImage: `url(${item.coverPicUrl})`,
    }
  })

  const mgBottom = { marginBottom: '18px' }
  const mgRight = { marginRight: '18px' }
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
              <p>{data[0].name}</p>
              <p>{data[0].text}</p>
              <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[0]['uid']}`} />
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
        </div>
        <BtnMore url={domain + '/cases'} />
      </>
    )
  }

  const TwoImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
    }
    caseStyle.caseItem = {
      flex: 1,
      height: '400px',
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div style={{ ...caseStyle.caseItem, ...mgRight }} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[0].name}</p>
              <p>{data[0].text}</p>
              <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[0]['uid']}`} />
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
          <div style={caseStyle.caseItem} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[1].name}</p>
              <p>{data[1].text}</p>
              <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[1]['uid']}`} />
            </div>
            <div style={caseStyle.image1} className={styles.bgBlur} />
          </div>
        </div>
        <BtnMore url={domain + '/cases'} />
      </>
    )
  }

  const ThreeImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      alignItems: 'stretch',

      height: '620px',
    }
    caseStyle.left = {
      flex: 1,
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
          <div style={{ ...caseStyle.left, ...mgRight }} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[0].name}</p>
              <p>{data[0].text}</p>
              <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[0]['uid']}`} />
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
          <div style={caseStyle.right}>
            <div style={{ ...caseStyle.caseItem, ...mgBottom }} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[1].name}</p>
                <p>{data[1].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[1]['uid']}`} />
              </div>
              <div style={caseStyle.image1} className={styles.bgBlur} />
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[2].name}</p>
                <p>{data[2].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[2]['uid']}`} />
              </div>
              <div style={caseStyle.image2} className={styles.bgBlur} />
            </div>
          </div>
        </div>
        <BtnMore url={domain + '/cases'} />
      </>
    )
  }

  const FourImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',

      flexDirection: 'column',
    }
    caseStyle.caseWrapper = {
      height: '280px',
      display: 'flex',
      marginBottom: '18px',
    }
    caseStyle.caseItem = {
      flex: 1,
    }

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div style={caseStyle.caseWrapper}>
            <div style={{ ...caseStyle.caseItem, ...mgRight }} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[0].name}</p>
                <p>{data[0].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[0]['uid']}`} />
              </div>
              <div style={caseStyle.image0} className={styles.bgBlur} />
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[1].name}</p>
                <p>{data[1].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[1]['uid']}`} />
              </div>
              <div style={caseStyle.image1} className={styles.bgBlur} />
            </div>
          </div>
          <div style={caseStyle.caseWrapper}>
            <div style={{ ...caseStyle.caseItem, ...mgRight }} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[2].name}</p>
                <p>{data[2].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[2]['uid']}`} />
              </div>
              <div style={caseStyle.image2} className={styles.bgBlur} />
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[3].name}</p>
                <p>{data[3].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[3]['uid']}`} />
              </div>
              <div style={caseStyle.image3} className={styles.bgBlur} />
            </div>
          </div>
        </div>
        <BtnMore url={domain + '/cases'} />
      </>
    )
  }

  const FiveImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      alignItems: 'stretch',

      height: '620px',
    }
    caseStyle.left = {
      flex: 1,
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
          <div style={{ ...caseStyle.left, ...mgRight }} className={styles.clickableImg}>
            <div className={styles.bgText}>
              <p>{data[0].name}</p>
              <p>{data[0].text}</p>
              <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[0]['uid']}`} />
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
          <div style={{ ...caseStyle.right, ...mgRight }}>
            <div style={{ ...caseStyle.caseItem, ...mgBottom }} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[1].name}</p>
                <p>{data[1].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[1]['uid']}`} />
              </div>
              <div style={caseStyle.image1} className={styles.bgBlur} />
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[2].name}</p>
                <p>{data[2].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[2]['uid']}`} />
              </div>
              <div style={caseStyle.image2} className={styles.bgBlur} />
            </div>
          </div>
          <div style={caseStyle.right}>
            <div style={{ ...caseStyle.caseItem, ...mgBottom }} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[3].name}</p>
                <p>{data[3].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[3]['uid']}`} />
              </div>
              <div style={caseStyle.image3} className={styles.bgBlur} />
            </div>
            <div style={caseStyle.caseItem} className={styles.clickableImg}>
              <div className={styles.bgText}>
                <p>{data[4].name}</p>
                <p>{data[4].text}</p>
                <BtnDetail text={'查看详情'} solid url={`${domain}/cases/details?uid=${data[4]['uid']}`} />
              </div>
              <div style={caseStyle.image4} className={styles.bgBlur} />
            </div>
          </div>
        </div>
        <BtnMore url={domain + '/cases'} />
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
    default:
      return <FiveImageLayout />
  }
}

export default CaseProjects
