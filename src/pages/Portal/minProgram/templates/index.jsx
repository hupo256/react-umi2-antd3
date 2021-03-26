/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button } from 'antd';
import TitleGuid from '../common/titleGuid';
import { imgBaseUrl } from '../tools';
import styles from './templates.less';

export default function Templates(props) {
  const [tepList, settepList] = useState([]);
  const [isEdit, setisEdit] = useState(true);

  useEffect(() => {
    settepList(touchList());
  }, []);

  function touchList() {
    const temLen = isEdit ? 8 : 7;
    const arr = [];
    for (let i = 0; i < temLen; i++) {
      arr.push({
        img: `${imgBaseUrl}img_LakeBlue.png`,
        tit: '经典黑白风',
      });
    }
    return arr;
  }

  return (
    <PageHeaderWrapper>
      <TitleGuid />
      <Card bordered={false} style={{ marginTop: 20 }}>
        <ul className={styles.tembox}>
          {tepList.length > 0 &&
            tepList.map((tem, ind) => {
              const { img, tit } = tem;
              return (
                <li key={ind}>
                  <div className={styles.itemBox}>
                    {ind === 0 && (
                      <img className={styles.defaultTag} src={`${imgBaseUrl}img_tag.png`} alt="" />
                    )}
                    <div className={styles.imgbox}>
                      <img src={img} alt="" />
                      <span>
                        <button>{isEdit ? '开始编辑' : '换成它'}</button>
                      </span>
                    </div>
                  </div>

                  <p>{tit}</p>
                </li>
              );
            })}
        </ul>
      </Card>
    </PageHeaderWrapper>
  );
}
