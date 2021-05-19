/*
 * @Author: tdd
 * @Date: 2021-03-23 13:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12
 * 小程序UI模板
 */
import React, { useState, useEffect, useContext } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Provider, ctx } from '../common/context';
import router from 'umi/router';
import { baseRouteKey } from '../tools/data';
import { updateHomePageEditData } from '@/services/miniProgram';
import TitleGuid from '../common/titleGuid';
import { queryTemplate } from '@/services/miniProgram';
import { imgBaseUrl } from '../tools';
import styles from './templates.less';
import { message } from 'antd';
import { saveNavEditData } from '../../../../services/miniProgram';

function Templates(props) {
  const { pageData, touchPageData, settemplateName, navData } = useContext(ctx);
  const [isChange, setisChange] = useState(false);
  const [tepList, settepList] = useState([]);

  useEffect(() => {
    touchList();
    isToChange();
  }, []);

  function isToChange() {
    const { hash } = location;
    setisChange(hash.includes('?tochange'));
  }

  function touchList() {
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
      touchPageData(); // 拿到最新的data以备用
    });
  }

  function routerOut(code, name) {
    settemplateName(name);
    pageData.templateName = name;
    const parmas = {
      editTemplateCode: code,
      editTemplateJson: pageData,
    };
    updateHomePageEditData(parmas).then(res => {
      if (res.code === 200) {
        saveNavEditData(navData)
          .then(r => {
            if (r.code === 200) {
              const key = `edit?templateCode=${code}`;
              router.push(`${baseRouteKey}${key}`);
            }
          })

      }
    });
  }

  return (
    <PageHeaderWrapper>
      <TitleGuid title="选择一个模板开始" disc={true} />
      <ul className={styles.tembox}>
        {tepList?.map((tem, ind) => {
          const { isDefault, name, showPicUrl, code, moreTag } = tem;
          return (
            <li key={ind}>
              <div className={styles.itemBox}>
                {isDefault &&
                  !isChange && (
                    <img className={styles.defaultTag} src={`${imgBaseUrl}img_tag.png`} alt="" />
                  )}
                <div className={styles.imgbox}>
                  <img src={showPicUrl} alt="" />
                  {!moreTag && (
                    <span>
                      <button onClick={() => routerOut(code, name)}>
                        {isChange ? '换成它' : '开始编辑'}
                      </button>
                    </span>
                  )}
                </div>
              </div>
              <p>{name}</p>
            </li>
          );
        })}
      </ul>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <Templates {...props} />
  </Provider>
);
