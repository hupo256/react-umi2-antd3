/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect, useContext } from 'react';
import { getAuthInfo, getHomePagePublishState } from '@/services/miniProgram';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Provider, ctx } from '../common/context';
import router from 'umi/router';
import { baseRouteKey } from '../tools/data';
import NotBound from '../../../SystemSetting/MiniProgram/NotBound';
import TitleGuid from '../common/titleGuid';
import Preview from '../preview';
import styles from './home.less';

function Home(props) {
  const { pageData, templateName } = useContext(ctx);
  const [authorInf, setauthorInf] = useState(null);

  useEffect(() => {
    const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
    getAuthInfo({ saasSellerCode }).then(res => {
      if (!res?.data) return;
      const userInfor = res.data;

      // 之前有发布过吗
      getHomePagePublishState().then(res => {
        if (!res?.data) return;
        const { data } = res;
        if (!data.isPublished) {
          return router.push(`${baseRouteKey}templates`);
        }
        setauthorInf(userInfor);
      });
    });
  }, []);

  return (
    <PageHeaderWrapper>
      <div className={styles.homeBox}>
        <TitleGuid
          title={templateName || pageData.templateName || '模板名称'}
          isAuthed={authorInf?.isAuthedWechatMini}
        />
        {authorInf && (
          <>
            {authorInf.isAuthedWechatMini ? (
              <Preview from="home" />
            ) : (
              <NotBound jumpUrl={`${origin}/#${baseRouteKey}home`} />
            )}
          </>
        )}
      </div>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <Home {...props} />
  </Provider>
);
