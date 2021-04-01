/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { getAuthInfo, getHomePagePublishState } from '@/services/miniProgram';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NotBound from '../../../SystemSetting/MiniProgram/NotBound';
import TitleGuid from '../common/titleGuid';
import Preview from '../preview';
import Templates from '../templates';
import { Card } from 'antd';
import styles from './home.less';

const baseUrlKey = '/portal/minProgram/';

export default function Home(props) {
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
        <TitleGuid />
        {authorInf && (
          <>
            {authorInf.isAuthedWechatMini ? (
              <Card bordered={false}>{!isPublished ? <Preview /> : <Templates />}</Card>
            ) : (
              <NotBound jumpUrl={`${baseUrlKey}home`} />
            )}
          </>
        )}
      </div>
    </PageHeaderWrapper>
  );
}
