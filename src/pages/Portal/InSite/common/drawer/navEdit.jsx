/*
 * @Author: tdd
 * @Date: 2021-06-02 13:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-06-02 15:49:12
 * 编辑亮点
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { Input, Icon, message, Form } from 'antd';
import AddMore from './addMore';
import { getRelatedPage } from '@/services/channelManage';
import CascadeSelect from '@/pages/ChannelManage/components/CascadeSelect';
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
      setrelatedPageOption(res?.data);
    });
  }, []);

  function addNewTag(e) {
    e.stopPropagation();
    const len = navData.length;
    const empty = navData.find(nav => !nav.paths);
    if (len === maxLen) return message.warning(`导航栏添加${maxLen}个效果最佳哦`);
    if (empty) return message.warning(`请先编辑完成上一个`);
    const item = {
      // 给一个默认的对象
      icon: 'iconic_site_new',
      linkDisplayName: '',
      name: '',
      navModule: `module${len}`,
    };
    setNavData([...navData, item])
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

  function touchRelece(arr, num) {
    const len = arr.length;
    const paths = arr.map(p => p.code);
    const nav = navData[num];
    nav.icon = arr[len - 1]?.icon;
    nav.navModule = arr[len - 1]?.appletsLink;
    nav.linkKey = arr[len - 1]?.linkKey;
    nav.paths = paths;
    nav.linkDisplayName = arr.map(p => p.text).join('/');
    if (paths.length === 2) nav.showSec = false;
    updateNavData();
  }

  // 点击
  function relevClick(num) {
    const arr = ['fd8d01f1a35111eb999e00505694ddf5']; // 首页
    const navs = navData.map((nav, ind) => {
      const { paths = [], showSec } = nav;
      const id = paths?.[1];
      ind !== num && !!id && arr.push(id); // 把自己也排除，取末级的uid,去重时也从末级开始
      nav.showSec = ind === num;
      return nav;
    });

    setcurNavs(arr);
    setNavData(navs);
  }

  function inputBlur(num) {
    return
    setTimeout(() => {
      if (!isSecWork) {
        const len = navData[num].paths.length;
        if (len !== 2) {
          navData[num].desStatus = 'error';
          navData[num].desMsg = '最多4个字符';
        } else {
          navData[num].showSec = false;
        }
        updateNavData();
      } else {
        console.log(23);
      }
    }, 400)
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
              showSec,
              desStatus = 'success',
              desMsg = '',
            } = tag;
            icon = 'icon-' + icon?.split('icon')[1]; // 兼容iconfont在生成时加的前辍
            const isHome = navModule === 'index';
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

                    <Item>
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

                  <p>关联页面</p>
                  <div onClick={e => {e.stopPropagation()}}>   
                    <Form style={{ width: '100%' }}>
                      <Item validateStatus={desStatus} help={desMsg}>
                        <Input
                          value={linkDisplayName}
                          readOnly
                          disabled={isHome}
                          placeholder="请选择关联页面"
                          onBlur={() => inputBlur(ind)}
                          onFocus={() => relevClick(ind)}
                          onClick={() => relevClick(ind)}
                          suffix={<Icon type="down" className={styles.inpSuffix} />}
                        />
                      </Item>
                    </Form>

                    {showSec &&
                      relatedPageOption?.length > 0 && (
                        <CascadeSelect
                          callFun={arr => touchRelece(arr, ind)} // 对外暴露的回调，用来把数据传出去
                          optsArr={relatedPageOption} // 渲染组件需要的数据
                          curNavs={curNavs} // 当前已经有的nav -- 禁用重复选择
                        />
                      )}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>

      <AddMore clickHandle={addNewTag} />
    </>
  );
}
