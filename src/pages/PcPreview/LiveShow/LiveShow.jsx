import { BtnMore } from '../btn';
import _ from 'lodash';
import styles from './LiveShow.module.less';


const CHN_NUM_CHAR = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

const CaseProjects = ({ data, domain }) => {
  if (_.isEmpty(data)) return null;
  const len = data.length;

  const caseStyle = {};
  _.forEach(data, (item, index) => {
    const { bedroom, parlor } = JSON.parse(item.houseType);
    data[index]['text'] = `${item.buildingName} | ${item.buildingArea}m² | ${CHN_NUM_CHAR[bedroom]
      }室${CHN_NUM_CHAR[parlor]}厅 | ${item.renovationCosts / 10000}万元`;

    caseStyle[`image${index}`] = {
      background: `url(${item.coverImg}) no-repeat center center`,
      backgroundSize: 'cover',
      height: '100%',
    };
  });

  const OneImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
    };
    caseStyle.caseItem = {
      flex: 1,
      height: '493px',
    };

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div
            style={caseStyle.caseItem}
            className={styles.clickableImg}
            onClick={() =>
              (window.location.href = `${domain}/sites/details?gongdiUid=${data[0].uid}`)
            }
          >
            <div className={styles.bgText}>
              <p>{data[0].text}</p>
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
        </div>
        <BtnMore text={'更多工地'} url={domain + '/sites'} />
      </>
    );
  };

  const TwoImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      gap: '18px',
    };
    caseStyle.caseItem = { flex: 1, height: '368px' };

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div
            style={caseStyle.caseItem}
            className={styles.clickableImg}
            onClick={() =>
              (window.location.href = `${domain}/sites/details?gongdiUid=${data[0].uid}`)
            }
          >
            <div className={styles.bgText}>
              <p>{data[0].text}</p>
              {/* <BtnMore text={'查看详情'} solid /> */}
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
          <div
            style={caseStyle.caseItem}
            className={styles.clickableImg}
            onClick={() =>
              (window.location.href = `${domain}/sites/details?gongdiUid=${data[1].uid}`)
            }
          >
            <div className={styles.bgText}>
              <p>{data[1].text}</p>
              {/* <BtnMore text={'查看详情'} solid /> */}
            </div>
            <div style={caseStyle.image1} className={styles.bgBlur} />
          </div>
        </div>
        <BtnMore text={'更多工地'} url={domain + '/sites'} />
      </>
    );
  };

  const ThreeImageLayout = () => {
    caseStyle.projectCasesWrapper = {
      display: 'flex',
      alignItems: 'stretch',
      gap: '18px',
      height: '368px',
    };
    caseStyle.left = {
      flex: 1,
      flexBasis: '25%',
    };

    caseStyle.right = {
      flex: 1,
      display: 'flex',
      gap: '18px',
      flexDirection: 'column',
    };

    caseStyle.caseItem = {
      flex: 1,
    };

    return (
      <>
        <div style={caseStyle.projectCasesWrapper}>
          <div
            style={caseStyle.left}
            className={styles.clickableImg}
            onClick={() =>
              (window.location.href = `${domain}/sites/details?gongdiUid=${data[0].uid}`)
            }
          >
            <div className={styles.bgText}>
              <p>{data[1].text}</p>
            </div>
            <div style={caseStyle.image0} className={styles.bgBlur} />
          </div>
          <div style={caseStyle.right}>
            <div
              style={caseStyle.caseItem}
              className={styles.clickableImg}
              onClick={() =>
                (window.location.href = `${domain}/sites/details?gongdiUid=${data[1].uid}`)
              }
            >
              <div className={styles.bgText}>
                <p>{data[1].text}</p>
              </div>
              <div style={caseStyle.image1} className={styles.bgBlur} />
            </div>
            <div
              style={caseStyle.caseItem}
              className={styles.clickableImg}
              onClick={() =>
                (window.location.href = `${domain}/sites/details?gongdiUid=${data[2].uid}`)
              }
            >
              <div className={styles.bgText}>
                <p>{data[2].text}</p>
              </div>
              <div style={caseStyle.image2} className={styles.bgBlur} />
            </div>
          </div>
        </div>
        <BtnMore text={'更多工地'} url={domain + '/sites'} />
      </>
    );
  };

  switch (len) {
    case 1:
      return <OneImageLayout />;
    case 2:
      return <TwoImageLayout />;
    default:
      return <ThreeImageLayout />;
  }
};

export default CaseProjects;
