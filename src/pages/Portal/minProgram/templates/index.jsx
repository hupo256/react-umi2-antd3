/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect, useContext } from 'react';
import { queryTemplate } from '@/services/miniProgram';
import { ctx } from '../common/context';
import { imgBaseUrl } from '../tools';
import styles from './templates.less';

export default function Templates(props) {
  const { isChange, setisChange } = useContext(ctx);
  const [tepList, settepList] = useState([]);

  useEffect(() => {
    queryTemplate().then(res => {
      const { data } = res;
      if (!data) return;

      if (!isChange) {
        const moreObj = {
          code: '',
          isDefault: false,
          name: '',
          showPicUrl: `${imgBaseUrl}img_more.png`,
          moreTag: true,
        };
        data.push(moreObj);
      }
      settepList(data);
    });
  }, []);

  return (
    <ul className={styles.tembox}>
      {tepList.length > 0 &&
        tepList.map((tem, ind) => {
          const { isDefault, name, showPicUrl, moreTag } = tem;
          return (
            <li key={ind}>
              <div className={styles.itemBox}>
                {isDefault && (
                  <img className={styles.defaultTag} src={`${imgBaseUrl}img_tag.png`} alt="" />
                )}
                <div className={styles.imgbox}>
                  <img src={showPicUrl} alt="" />
                  {!moreTag && (
                    <span>
                      <button>{isChange ? '换成它' : '开始编辑'}</button>
                    </span>
                  )}
                </div>
              </div>
              <p>{name}</p>
            </li>
          );
        })}
    </ul>
  );
}
