import _ from 'lodash';
import styles from './Menu.module.less';
import { useState, useEffect } from 'react';

const FAKE_ACTIVE_INDEX = 'home';
const MAX_CHUNK_SIZE = 40;
const MIN_CHUNK_SIZE = 20;

const MenuListComp = ({ menuList }) => {
  const [menuChunkList, setMenuChunkList] = useState([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [extraCharCount, setExtraCharCount] = useState([]);

  const hasPrevious = () => {
    return !Boolean(chunkIndex - 1 < 0);
  };

  const hasNext = () => {
    return Boolean(chunkIndex + 1 < menuChunkList.length);
  };

  useEffect(
    () => {
      if (_.isEmpty(menuList)) return;

      const menuListClone = menuList.slice(); //clone state
      const chunkRes = [];
      const extraCharCount = [];
      while (menuListClone.length) {
        let charCount = 0;
        let index = 0;
        let oneChunk = [];

        while (charCount <= MAX_CHUNK_SIZE && !_.isNil(menuListClone[index])) {
          oneChunk.push(menuListClone[index]);
          const websiteName = _.get(menuListClone, `${index}.websiteName`, '');
          if (websiteName) {
            charCount += websiteName.length;
          }
          index++;
        }

        menuListClone.splice(0, index);
        chunkRes.push(oneChunk);
        extraCharCount.push(charCount);
      }

      setMenuChunkList(chunkRes);
      setExtraCharCount(extraCharCount);
    },
    [menuList]
  );

  return (
    <div className={styles.menuWrapper}>
      <div
        className={styles.menuRoot}
        style={
          extraCharCount[chunkIndex] > MIN_CHUNK_SIZE
            ? { justifyContent: 'space-between' }
            : { justifyContent: 'flex-end', gap: '40px' }
        }
      >
        {_.map(menuChunkList[chunkIndex], (item, index) => {
          return (
            <div className={styles.menuItemWrapper} key={`menuItemWrapper-${index}`}>
              {index === 0 &&
                hasPrevious() && (
                  <div
                    className={styles.arrowWrapperPrev}
                    onClick={() => setChunkIndex(() => chunkIndex - 1)}
                  >
                    <a className={styles.prevArrow} />
                  </div>
                )}
              <a
                href={item.linkUrl}
                key={index}
                className={item.linkKey === FAKE_ACTIVE_INDEX ? styles.active : undefined}
              >
                {item.websiteName}
              </a>
              {index + 1 === menuChunkList[chunkIndex].length &&
                hasNext() && (
                  <div
                    className={styles.arrowWrapperNext}
                    onClick={() => setChunkIndex(chunkIndex + 1)}
                  >
                    <a className={styles.nextArrow} />
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuListComp;
