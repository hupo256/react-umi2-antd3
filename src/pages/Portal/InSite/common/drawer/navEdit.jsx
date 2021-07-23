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
import LinkSelector from '@/components/LinkSelector';
import styles from './drawerEditor.less';

const maxLen = 5;
const { Item } = Form;

export default function NavEdit(props) {
  const { navData, setNavData, relatedPageOption, touchRelatedOpts } = useContext(ctx);
  const [curNavs, setcurNavs] = useState([]);

  useEffect(() => {
    touchRelatedOpts(2);
  }, []);

  function addNewTag() {
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
    setTimeout(() => {
      setNavData([...navData, item]);
    });
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

  // 点击input
  function relevClick(num) {
    const arr = ['fd8d01f1a35111eb999e00505694ddf5']; // 首页
    const navs = navData.map((nav, ind) => {
      const { paths = [], navModule, isEnd = true } = nav;
      const isSpecial = navModule === 'ShowSpecial' || navModule === 'mkt';
      const id = isSpecial ? paths?.[0] : paths?.[1]; // 对没有二级选项的情况作处理
      ind !== num && !!id && arr.push(id); // 把自己也排除，取末级的uid
      nav.showSec = ind === num;
      if (!isEnd) {
        // 同时，有没选到末点的，就关掉并清空
        nav.linkDisplayName = '';
        nav.icon = '';
      }
      return nav;
    });

    setcurNavs(arr);
    setNavData(navs);
  }

  // 点击选择器
  function touchRelece(arr, num) {
    console.log(arr);
    const len = arr.length;
    const nav = navData[num];
    const { isEnd } = arr?.[len - 1];
    const linkDisplayName = arr.map(p => p.text).join('/');
    const { appletsLink, linkType, icon, linkKey } = arr?.[0];
    if (isEnd) {
      const paths = arr.map(p => p.code);
      linkKey || paths.pop(); // 没有linkKey 表示选择了详情页,
      nav.icon = icon;
      nav.linkKey = linkKey;
      nav.paths = paths;
    }
    nav.linkDisplayName = linkDisplayName;
    nav.navModule = appletsLink;
    nav.showSec = !isEnd;
    nav.isEnd = isEnd;

    updateNavData();
  }

  return (
    <>
      <ul className={styles.navEditBox}>
        {navData?.length > 0 &&
          navData.map((tag, ind) => {
            const len = navData.length;
            let { icon, name, navModule } = tag;
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
                  <LinkSelector
                    curItem={tag}
                    cascadeClick={() => relevClick(ind)}
                    callFun={arr => touchRelece(arr, ind)} // 对外暴露的回调，用来把数据传出去
                    optsArr={relatedPageOption} // 渲染组件需要的数据
                    curNavs={curNavs} // 当前已经有的nav -- 禁用重复选择
                    disabled={isHome}
                  />
                </div>
              </li>
            );
          })}
      </ul>

      <AddMore clickHandle={addNewTag} />
    </>
  );
}
