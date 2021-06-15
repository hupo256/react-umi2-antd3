// 注：此文件与marketing版有大量不同，整合的时候需特别注意
import _ from 'lodash'
import styles from './Menu.less'
import { useState, useEffect } from 'react'
import cx from 'classnames'
import { message } from 'antd'

const MAX_CHUNK_SIZE = 25
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
  if (/articles\?uid=$/.test(url)) {
    return _.find(menuList, { linkKey: 'articleList' })
  }
  if (/articles/.test(url)) {
    return _.find(menuList, { linkUrl: '/articles?uid=' })
  }
  if (/material/.test(url)) {
    return _.find(menuList, { linkKey: 'material' })
  }
  if (/trim/.test(url)) {
    return _.find(menuList, { linkKey: 'decorate' })
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
      if (location.pathname === '/') {
        setCurrent(_.find(menuList, { linkKey: 'home' }))
        return
      }

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

      const res = findParent(menuList, location.href)
      if (res) {
        setCurrent(res)
        return
      }

      setCurrent(null)
    },
    [menuList],
  )
  const clickMenuItem = ({ linkUrl, uid, linkKey }) => {
    if (!uid) return
    if (linkKey === 'games') {
      message.destroy()
      message.warning('网站端暂不支持打开小游戏，请在小程序中打开！')
      return
    }
    window.open(`${dynamicDomain}${linkUrl}`, '页面预览')
  }

  return (
    <div className={cx(styles.menuWrapper, styles.editMode)}>
      <div className={extraCharCount[chunkIndex] > MIN_CHUNK_SIZE ? styles.menuRoot : styles.menuRootMin}>
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
        <img
          src={'/img/ic_edit@2x.png'}
          style={{ width: '14px', height: '14px', marginRight: '5px', marginTop: '-3px' }}
        />
        编辑频道
      </div>
    </div>
  )
}

export default MenuListComp
