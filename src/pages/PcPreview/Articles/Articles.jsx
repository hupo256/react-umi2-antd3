import React from 'react';
import { BtnMore } from '../btn';
import _ from 'lodash';
import styles from './Articles.module.less';
import cx from 'classnames';
import { domain } from '../constants.js';

const Articles = ({ data }) => {
  if (_.isEmpty(data)) return null;

  return (
    <>
      <div className={styles.mainWrapper}>
        {_.map(data, (item, index) => {
          return (
            <div className={styles.container} key={`${item.code}-${index}`}>
              <div
                className={cx(styles.title, {
                  [styles.before]: index === 0,
                  [styles.wip]: index === 1,
                  [styles.after]: index === 2,
                })}
              >
                {item.name}
              </div>
              <div className={styles.wrapper}>
                {_.map(item.articleList, (article, index) => {
                  return (
                    <a
                      key={`${article.articleDicCode}-${index}`}
                      href={`/articles/details?articleUid=${article.articleUid}`}
                      className={styles.articleLine}
                    >
                      {article.articleTitle}
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <BtnMore text={'更多攻略'} url={domain + '/articles'} />
    </>
  );
};

export default Articles;
