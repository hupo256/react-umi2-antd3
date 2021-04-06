/*
 * @Author: tdd 
 * @Date: 2021-03-23 13:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12 
 * 编辑模板
 */
import React, { useState, useContext } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Provider, ctx } from '../common/context';
import { Button, Drawer } from 'antd';
import Preview from '../preview';
import TitleGuid from '../common/titleGuid';
import ImgsEdit from './imgsEdit';
import TagsEdit from './tagsEdit';
import styles from './edit.less';

function TempEdit(props) {
  const { fromTag, setfromTag } = useContext(ctx);
  const [visible, setVisible] = useState(false);

  function toEditer(key) {
    setfromTag();
    setVisible(true);
  }

  return (
    <PageHeaderWrapper>
      <TitleGuid title="编辑小程序" isEdit={true} />
      <Drawer
        title="编辑轮播"
        width={376}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        {fromTag === 'tags' ? <TagsEdit /> : <ImgsEdit />}
      </Drawer>

      <div className={`${styles.currTepBox} ${visible ? styles.placeHolder : ''}`}>
        <Preview />

        <div className={styles.btnbox}>
          <Button onClick={() => toEditer('tags')} type="primary">
            温馨提示
          </Button>
        </div>
      </div>
    </PageHeaderWrapper>
  );
}

export default props => (
  <Provider>
    <TempEdit {...props} />
  </Provider>
);
