/*
 * @Author: tdd
 * @Date: 2021-06-02 13:49:12
 * @Last Modified by: zqm
 * @Last Modified time: 2021-06-10 14:18:53
 * 编辑亮点
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { Input, Icon, message, Form } from 'antd';
import AddMore from './addMore';
import { getRelatedPage } from '@/services/channelManage';
import RelevanceInp from '@/pages/ChannelManage/components/RelevanceInp';
import styles from './drawerEditor.less';

const maxLen = 5;
const { Item } = Form;

export default function NavEdit(props) {
  const { navData, setNavData } = useContext(ctx);
  const [relatedPageOption, setrelatedPageOption] = useState([]);
  const [curNavs, setcurNavs] = useState([]);

  useEffect(() => {
    getRelatedPage({ sceneType: 2 }).then(res => {
      if (!res?.data) return;
      touchCurNavs();
      setrelatedPageOption(res?.data);
    });
  }, []);

  useEffect(
    () => {
      touchCurNavs();
    },
    [navData]
  );

  function addNewTag() {
    const len = navData.length;
    const empty = navData.find(nav => !nav.paths);
    if (len === maxLen) return message.warning(`最多可添加${maxLen}个导航`);
    if (empty) return message.warning(`请先编辑完成上一个`);
    const item = {
      // 给一个默认的对象
      icon: 'iconic_site_new',
      linkDisplayName: '',
      name: '',
      navModule: `module${len}`,
    };
    setNavData(navData.concat(item));
  }

  function updateNavData() {
    setNavData(navData.slice());
  }

  function delImg(num) {
    navData.splice(num, 1);
    updateNavData();
  }

  function toMove(ind, num) {
    const rec = navData.splice(ind, 1)[0];
    navData.splice(ind + num, 0, rec);
    updateNavData();
  }

  function discTexChange(e, rec) {
    let val = e.target.value;
    if (val?.length > 4) {
      rec.desStatus = 'error';
      rec.desMsg = '最多4个字符';
    } else {
      rec.desStatus = 'success';
      rec.desMsg = '';
    }
    rec.name = val;
    updateNavData();
  }

  // 收集已经有的nav
  function touchCurNavs() {
    const arr = ['fd8d01f1a35111eb999e00505694ddf5']; // 首页
    navData.map(nav => {
      const { paths = [] } = nav;
      const id = paths?.[1];
      !!id && arr.push(id); // 取末级的uid,去重时也从末级开始
    });
    setcurNavs(arr);
  }

  function touchRelece(arr, num) {
    // console.log(arr);
    const len = arr.length;
    navData[num].icon = arr[len - 1]?.icon;
    navData[num].navModule = arr[len - 1]?.appletsLink;
    navData[num].linkKey = arr[len - 1]?.linkKey;
    navData[num].paths = arr.map(p => p.code);
    navData[num].linkDisplayName = arr.map(p => p.text).join('/');
    updateNavData();
  }

  return (
    <>
      <ul className={styles.navEditBox}>
        {navData?.length > 0 &&
          navData.map((tag, ind) => {
            const len = navData.length;
            let {
              linkDisplayName,
              icon,
              name,
              navModule,
              paths,
              desStatus = 'success',
              desMsg = '',
            } = tag;
            const isHome = navModule === 'index';
            icon = 'icon-' + icon?.split('icon')[1]; // 兼容iconfont在生成时加的前辍
            return (
              <li key={ind}>
                <div className={styles.titBox}>
                  <span>导航图标</span>
                  <span>导航名称</span>
                  <div className={styles.tbOpration}>
                    <a disabled={ind === 0 || ind === 1} onClick={() => toMove(ind, -1)}>
                      <Icon type="arrow-up" />
                    </a>
                    <a disabled={ind === len - 1 || isHome} onClick={() => toMove(ind, 1)}>
                      <Icon type="arrow-down" />
                    </a>
                    <a disabled={len === 1 || isHome} onClick={() => delImg(ind)}>
                      <Icon type="delete" />
                    </a>
                  </div>
                </div>
                <div className={styles.taginpBox}>
                  <Form layout="inline">
                    <span className={styles.navIcon}>
                      <svg className="icon">
                        <use href={`#${icon}`} />
                      </svg>
                    </span>

                    <Item validateStatus={desStatus} help={desMsg}>
                      <Input
                        value={name}
                        maxLength={4}
                        onBlur={e => discTexChange(e, tag)}
                        onChange={e => discTexChange(e, tag)}
                        placeholder="请输入导航名称"
                        disabled={isHome}
                      />
                    </Item>
                  </Form>

                  {relatedPageOption?.length > 0 && (
                    <>
                      <p>关联页面</p>
                      <RelevanceInp
                        callFun={arr => touchRelece(arr, ind)} // 对外暴露的回调，用来把数据传出去
                        relatedPageOption={relatedPageOption} // 渲染组件需要的数据
                        relatedPage={linkDisplayName} // input用来回显的值
                        curNavs={curNavs} // 当前已经有的nav -- 禁用重复选择
                        inpDisabled={isHome}
                        curUid={paths?.[1] || ''}
                      />
                    </>
                  )}
                </div>
              </li>
            );
          })}
      </ul>

      <AddMore clickHandle={addNewTag} />
    </>
  );
}
