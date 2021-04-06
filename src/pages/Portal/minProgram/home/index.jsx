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
import NotBound from '../../../SystemSetting/MiniProgram/NotBound';
import TitleGuid from '../common/titleGuid';
import Preview from '../preview';
import Templates from '../templates';
import styles from './home.less';

const baseUrlKey = '/portal/minProgram/';

function Home(props) {
  const { isChange } = useContext(ctx);
  const [authorInf, setauthorInf] = useState(null);
  const [isPublished, setisPublished] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
    // getAuthInfo({ saasSellerCode: 'C201asdfas1002' }).then(res => {
    getAuthInfo({ saasSellerCode }).then(res => {
      const { data } = res;
      if (!data) return;
      setauthorInf(data);

      // 之前有发布过吗
      getHomePagePublishState().then(res => {
        const { data } = res;
        if (!data) return;
        setisPublished(data.isPublished);
      });
    });
  }, []);

  return (
    <PageHeaderWrapper>
      <div className={styles.homeBox}>
        <TitleGuid title="模板名称" disc={!isPublished || isChange} />
        {authorInf && (
          <>
            {authorInf.isAuthedWechatMini ? (
              <>
                {isPublished && !isChange && <Preview />}
                {(!isPublished || isChange) && <Templates />}
              </>
            ) : (
              <NotBound jumpUrl={`${baseUrlKey}home`} />
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
