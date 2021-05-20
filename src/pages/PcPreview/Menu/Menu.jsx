// 注：此文件与marketing版有大量不同，整合的时候需特别注意
import _ from 'lodash'
import styles from './Menu.less'
import { useState, useEffect } from 'react'
import cx from 'classnames'

const MAX_CHUNK_SIZE = 40
const MIN_CHUNK_SIZE = 20

const isCurrentMenu = ({ uid, linkKey }) => {
  const currentMenuUid = localStorage.getItem('currentMenu')
  if (currentMenuUid) {
    return currentMenuUid === uid
  }

  return linkKey === 'home'
}

const MenuListComp = ({ menuList, setShowHeaderDrawer }) => {
  const [menuChunkList, setMenuChunkList] = useState([])
  const [chunkIndex, setChunkIndex] = useState(0)
  const [extraCharCount, setExtraCharCount] = useState([])

  const hasPrevious = () => {
    return !Boolean(chunkIndex - 1 < 0)
  }

  const hasNext = () => {
    return Boolean(chunkIndex + 1 < menuChunkList.length)
  }

  useEffect(
    () => {
      if (_.isEmpty(menuList)) return

      const menuListClone = menuList.slice() //clone state
      const chunkRes = []
      const extraCharCount = []
      while (menuListClone.length) {
        let charCount = 0
        let index = 0
        let oneChunk = []

        while (charCount <= MAX_CHUNK_SIZE && !_.isNil(menuListClone[index])) {
          oneChunk.push(menuListClone[index])
          const websiteName = _.get(menuListClone, `${index}.websiteName`, '')
          if (websiteName) {
            charCount += websiteName.length
          }
          index++
        }

        menuListClone.splice(0, index)
        chunkRes.push(oneChunk)
        extraCharCount.push(charCount)
      }

      setMenuChunkList(chunkRes)
      setExtraCharCount(extraCharCount)
    },
    [menuList],
  )

  useEffect(
    () => {
      if (_.isEmpty(menuChunkList)) return

      const currentMenu = localStorage.getItem('currentMenu')
      if (currentMenu) {
        _.forEach(menuChunkList, (chunk, index) => {
          _.forEach(chunk, (item, i) => {
            if (item.uid === currentMenu) {
              console.log(index)
              setChunkIndex(index)
              return
            }
          })
        })
      }
    },
    [menuChunkList],
  )

  const clickMenuItem = ({ uid, linkUrl }) => {
    localStorage.setItem('currentMenu', uid)
    window.location.href = linkUrl
  }

  return (
    <div className={cx(styles.menuWrapper, styles.editMode)}>
      <div
        className={styles.menuRoot}
        style={
          extraCharCount[chunkIndex] > MIN_CHUNK_SIZE
            ? { justifyContent: 'space-between' }
            : { justifyContent: 'flex-end', gap: '40px' }
        }
      >
        {_.map(menuChunkList[chunkIndex], (item, index) => {
          if (item.status === 2) return null
          return (
            <div className={styles.menuItemWrapper} key={`menuItemWrapper-${index}`}>
              {index === 0 &&
                hasPrevious() && (
                  <div className={styles.arrowWrapperPrev} onClick={() => setChunkIndex(() => chunkIndex - 1)}>
                    <a className={styles.prevArrow} />
                  </div>
                )}
              <a
                key={index}
                className={isCurrentMenu(item) ? styles.active : undefined}
                onClick={e => clickMenuItem(item)}
              >
                {item.websiteName}
              </a>
              {index + 1 === menuChunkList[chunkIndex].length &&
                hasNext() && (
                  <div className={styles.arrowWrapperNext} onClick={() => setChunkIndex(chunkIndex + 1)}>
                    <a className={styles.nextArrow} />
                  </div>
                )}
            </div>
          )
        })}
      </div>
      <div className={styles.editButton} onClick={() => setShowHeaderDrawer(true)}>
        编辑
      </div>
    </div>
  )
}

export default MenuListComp
