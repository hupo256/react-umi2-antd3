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
import { appletsMenus } from '@/services/channelManage';
import { canEditTags } from '../../tools/data';
import ImgsEdit from './imgsEdit';
import TagsEdit from './tagsEdit';
import styles from './drawerEditor.less';
import ModelsEdit from './modelsEdit';
import AboutUsEdit from './aboutUsEdit';
import NavEdit from './navEdit';
import ChannelManage from '@/pages/ChannelManage';

export default function DrawerEditor(props) {
  const { curFlag, setcurFlag, MdTip, pageData, setpageData, navData, setNavData } = useContext(
    ctx
  );
  const isShow = canEditTags.includes(curFlag);

  function blockPropagation(e) {
    e.stopPropagation();
    // 阻止与原生事件的冒泡
    // e.nativeEvent.stopImmediatePropagation();

    // 如果click到了这里，则认为input失焦
    relInpBlur()
  }

  // 关联页面选择失焦
  function relInpBlur() {
    if (curFlag === 'nav') {
      const arr = navData.map((nav, ind) => {
        const { paths } = nav;
        nav.showSec = false;
        if (ind !== 0 && paths?.length !== 2) {
          nav.linkDisplayName = '';
          nav.icon = '';
        }
        return nav;
      });
      setNavData(arr);
    }
    if(curFlag === 'banner' || curFlag === 'highlights'){
      const newObj = { ...pageData };
      const arr = newObj.maps[curFlag].list?.map(item => {
        const {appletsName, isEnd} = item
        item.showSec = false;
        item.appletsName = isEnd ? appletsName : ''  //没到末节点，则清空
        return item;
      });
      newObj.maps[curFlag].list = arr
      setpageData(newObj);
    }
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
    relInpBlur()
    setcurFlag('editing');
  }

  // 抽屉关闭时获取新的channles
  function drawerClose() {
    const param = {
      pageNum: 1,
      pageSize: 20,
    };
    appletsMenus(param).then(re => {
      console.log(re);
      if (!re?.data) return;
      const newObj = { ...pageData };
      newObj.maps[curFlag].list = re.data?.list;
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
          width={1150}
          headerStyle={{ border: 'none', marginBottom: '-18px' }}
        >
          <ChannelManage isPcPreview={true} />
        </Drawer>
      ) : (
        <div
          className={`${styles.drawerOut} ${isShow ? styles.show : ''}`}
          onClick={dealWithEditAndNav}
        >
          <div className={styles.drawerBox} onClick={blockPropagation}>
            <h3>{`编辑${MdTip}`}</h3>
            {curFlag === 'editModel' && <ModelsEdit />}
            {(curFlag === 'banner' || curFlag === 'advertising') && <ImgsEdit />}
            {curFlag === 'highlights' && <TagsEdit />}
            {curFlag === 'aboutUs' && <AboutUsEdit />}
            {curFlag === 'nav' && <NavEdit />}
          </div>
        </div>
      )}
    </>
  );
}
