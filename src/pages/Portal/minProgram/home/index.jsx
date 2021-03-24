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
import { Card, Button } from 'antd';
import pholder from '../tools/bg.png';
import styles from './home.less';

const baseRrlKey = '/portal/minProgram/';

export default function Templates(props) {
  const [isAuthed, setisAuthed] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem('auth');
    const saasSellerCode = JSON.parse(code).companyCode;
    getAuthInfo({ saasSellerCode: 'C201asdfas1002' }).then(res => {
      // getAuthInfo({ saasSellerCode }).then(res => {
      console.log(res);
      const { data } = res;
      data && setisAuthed(data.isAuthedWechatMini);
    });
  }, []);

  function gotoRoute(key) {
    router.push(`${baseRrlKey}${key}`);
  }

  return (
    <div>
      <PageHeaderWrapper>
        {isAuthed ? (
          <Card className={styles.currTepOut} bordered={false}>
            <h3>当前使用的模板名</h3>

            <div className={styles.swiperOut}>
              <SwiperBar />
            </div>

            <div className={styles.currTepBox}>
              <img src={pholder} alt="" />

              <div className={styles.btnbox}>
                <Button onClick={() => gotoRoute('edit')} type="primary">
                  继续编辑
                </Button>
                <Button onClick={() => gotoRoute('templates')}>更换模板</Button>
              </div>
            </div>
          </Card>
        ) : (
          <NotBound jumpUrl={`${baseRrlKey}home`} />
        )}
      </PageHeaderWrapper>
    </div>
  );
}
