// 注：此文件与marketing版有大量不同，整合的时候需特别注意
import _ from 'lodash'
import styles from './Menu.less'
import { useState, useEffect } from 'react'
import cx from 'classnames'

const MAX_CHUNK_SIZE = 40
const MIN_CHUNK_SIZE = 20

const isCurrentMenu = (item, current) => {
  if (!current || !item) return false
  return item.uid === current.uid
}

const findParent = (menuList, url) => {
  if (/cases/.test(url)) {
    return _.find(menuList, { linkUrl: '/cases' })
  }
  if (/sites/.test(url)) {
    return _.find(menuList, { linkUrl: '/sites' })
  }
  if (/designers/.test(url)) {
    return _.find(menuList, { linkUrl: '/designers' })
  }
  if (/articles/.test(url)) {
    return _.find(menuList, { linkUrl: '/articles' })
  }
  return null
}

const MenuListComp = ({ menuList, setShowHeaderDrawer, dynamicDomain = '' }) => {
  const [menuChunkList, setMenuChunkList] = useState([])
  const [chunkIndex, setChunkIndex] = useState(0)
  const [extraCharCount, setExtraCharCount] = useState([])
  const [current, setCurrent] = useState(0)

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
          const webViewName = _.get(menuListClone, `${index}.webViewName`, '')
          if (webViewName) {
            charCount += webViewName.length
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

      if (current) {
        _.forEach(menuChunkList, (chunk, index) => {
          _.forEach(chunk, (item, i) => {
            if (item.uid === current.uid) {
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
  useEffect(
    () => {
      if (_.isEmpty(menuList)) return

      const url = new URL(location.href)
      const [uid] = url.searchParams.values()

      if (uid) {
        // 详情页

        const res = _.find(menuList, value => {
          const urlObj = new URL(location.origin + value.linkUrl)
          const [urlCompare] = urlObj.searchParams.values()

          return urlCompare === uid
        })

        if (!res) {
          // 去除当前状态
          const parentMenu = findParent(menuList, location.href)
          setCurrent(parentMenu)
          return
        }
        // 设置此为当前
        setCurrent(res)
        return
      }

      const res = _.find(menuList, { linkUrl: location.pathname })
      if (res) {
        setCurrent(res)
        return
      }

      setCurrent(null)
    },
    [menuList],
  )
  const clickMenuItem = ({ linkUrl }) => {
    window.open(`${dynamicDomain}${linkUrl}`, '页面预览')
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
                className={isCurrentMenu(item, current) ? styles.active : undefined}
                onClick={e => clickMenuItem(item)}
              >
                {item.webViewName}
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
