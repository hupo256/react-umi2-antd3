/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { imgBaseUrl } from '../tools';
import SwiperBar from '../common/swiperBar';
import { Button, icon } from 'antd';
import styles from './preview.less';

const baseUrlKey = '/portal/minProgram/';

function conTitle(props) {
  const { title = '模块名' } = props;
  return (
    <h3>
      <b>{title}</b>
      <span>
        查看更多 <Icon type="right" />
      </span>
    </h3>
  );
}

export default function Preview(props) {
  function gotoRoute(key) {
    router.push(`${baseUrlKey}${key}`);
  }

  return (
    <div className={styles.currTepBox}>
      <div className={styles.phoneBox}>
        <div className={styles.headerBox}>title</div>

        <div className={styles.conBox}>
          <SwiperBar />

          <ul className={styles.tagBox}>
            <li>
              <h3>专属服务</h3>
              <p>1v1服务对接 方便省心</p>
            </li>
            <li>
              <h3>资深设计</h3>
              <p>1v1服务对接 方便省心</p>
            </li>
            <li>
              <h3>优质选材</h3>
              <p>1v1服务对接 方便省心</p>
            </li>
            <li>
              <h3>无忧服务</h3>
              <p>1v1服务对接 方便省心</p>
            </li>
          </ul>

          <div className={styles.conBlock}>
            <conTitle title="精选案例" />

            <div className={styles.caseBox}>
              <div className={styles.hightImg}>
                <img src="" alt="" />
                <p>简约风 | 100m² | 三居室 | 25.6万</p>
              </div>

              <div className={styles.caseList}>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBox}>footer</div>
      </div>

      <div className={styles.btnbox}>
        <Button onClick={() => gotoRoute('edit')} type="primary">
          继续编辑
        </Button>
        <Button onClick={() => gotoRoute('templates')}>更换模板</Button>
      </div>
    </div>
  );
}
