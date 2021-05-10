import React, { useState, useRef } from 'react'
import _ from 'lodash'
import styles from './Articles.module.scss'
import cx from 'classnames'

//todo... 根据实际数据决定如何绑定
const Articles = () => {
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        <div className={cx(styles.title, styles.before)}>装修前</div>
        <div className={styles.wrapper}>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
        </div>
      </div>
      <div className={styles.container}>
        <div className={cx(styles.title, styles.wip)}>装修中</div>
        <div className={styles.wrapper}>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
        </div>
      </div>
      <div className={styles.container}>
        <div className={cx(styles.title, styles.after)}>装修后</div>
        <div className={styles.wrapper}>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
          <a href="/" className={styles.articleLine}>
            【房产】 吊灯安装方式是什么，吊灯安装的方法
          </a>
        </div>
      </div>
    </div>
  )
}

export default Articles
