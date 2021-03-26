/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 小程序UI模板
 */
import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { getAuthInfo } from '@/services/miniProgram';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NotBound from '../../../SystemSetting/MiniProgram/NotBound';
import SwiperBar from '../common/swiperBar';
import TitleGuid from '../common/titleGuid';
import { imgBaseUrl } from '../tools';
import { Card, Button } from 'antd';
import styles from './home.less';

const baseUrlKey = '/portal/minProgram/';

export default function Templates(props) {
  const [authorInf, setauthorInf] = useState(null);

  useEffect(() => {
    const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
    // getAuthInfo({ saasSellerCode: 'C201asdfas1002' }).then(res => {
    getAuthInfo({ saasSellerCode }).then(res => {
      console.log(res);
      const { data } = res;
      data && setauthorInf(data);
    });
  }, []);

  function gotoRoute(key) {
    router.push(`${baseUrlKey}${key}`);
  }

  return (
    <PageHeaderWrapper>
      <TitleGuid />
      {authorInf && (
        <>
          {authorInf.isAuthedWechatMini ? (
            <Card bordered={false}>
              <div className={styles.currTepBox}>
                <img src={`${imgBaseUrl}img_LakeBlue.png`} alt="" />

                <div className={styles.btnbox}>
                  <Button onClick={() => gotoRoute('edit')} type="primary">
                    继续编辑
                  </Button>
                  <Button onClick={() => gotoRoute('templates')}>更换模板</Button>
                </div>
              </div>
            </Card>
          ) : (
            <NotBound jumpUrl={`${baseUrlKey}home`} />
          )}
        </>
      )}
    </PageHeaderWrapper>
  );
}
