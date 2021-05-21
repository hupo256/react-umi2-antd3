/*
 * @Author: tdd
 * @Date: 2021-03-23 09:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-07 13:49:12
 * 编辑模板
 */
import React, { useContext, useEffect } from 'react';
import { ctx } from '../context';
import { Drawer } from 'antd';
import { getList } from '@/services/channelManage';
import { canEditTags } from '../../tools/data';
import ImgsEdit from './imgsEdit';
import TagsEdit from './tagsEdit';
import styles from './drawerEditor.less';
import ModelsEdit from './modelsEdit';
import AboutUsEdit from './aboutUsEdit';
import NavEdit from './navEdit';
import ChannelManage from '@/pages/ChannelManage';

export default function DrawerEditor(props) {
  const { curFlag, setcurFlag, pageData, setpageData, navData, setNavData } = useContext(ctx);
  const isShow = canEditTags.includes(curFlag);

  function blockPropagation(e) {
    e.stopPropagation();
    // 阻止与原生事件的冒泡
    // e.nativeEvent.stopImmediatePropagation();
  }

  function dealWithEditAndNav() {
    if (curFlag === 'editModel') {
      const newObj = { ...pageData };
      newObj.jsonData.map(e => {
        if (e.afterName) {
          e.title = e.afterName;
        }
      });
      setpageData(newObj);
    }
    if (curFlag === 'nav') {
      const newArr = [...navData];
      const arr = [];
      newArr.map(e => {
        if (e.navModule) {
          arr.push(e);
        }
      });
      setNavData(arr);
    }
    setcurFlag('editing');
  }

  // 抽屉关闭时获取新的channles
  function drawerClose() {
    const param = {
      includeDefIndex: false,
      pageNum: 1,
      pageSize: 20,
      status: 1,
    };
    getList(param).then(re => {
      console.log(re);
      if (!re?.data) return;
      const newObj = { ...pageData };
      const { list = [] } = re.data;
      // list.shift();
      newObj.maps[curFlag].list = list;
      setpageData(newObj);
      setTimeout(() => setcurFlag(''));
    });
  }

  return (
    <>
      {curFlag === 'channel' ? (
        <Drawer
          title="编辑频道"
          placement="right"
          closable={true}
          onClose={drawerClose}
          visible={curFlag === 'channel'}
          width={900}
          headerStyle={{ border: 'none', marginBottom: '-18px' }}
        >
          <ChannelManage />
        </Drawer>
      ) : (
        <div
          className={`${styles.drawerOut} ${isShow ? styles.show : ''}`}
          onClick={dealWithEditAndNav}
        >
          <div className={styles.drawerBox} onClick={blockPropagation}>
            <h3>{`编辑${
              curFlag === 'highlights'
                ? '亮点'
                : curFlag === 'editModel'
                  ? '模块'
                  : curFlag === 'aboutUs'
                    ? '关于我们'
                    : curFlag === 'nav'
                      ? '导航'
                      : '图片广告'
            }`}</h3>
            {curFlag === 'editModel' && <ModelsEdit />}
            {curFlag === 'banner' && <ImgsEdit />}
            {curFlag === 'highlights' && <TagsEdit />}
            {curFlag === 'advertising' && <ImgsEdit />}
            {curFlag === 'aboutUs' && <AboutUsEdit />}
            {curFlag === 'nav' && <NavEdit />}
          </div>
        </div>
      )}
    </>
  );
}
