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
    // e.stopPropagation();
    const len = navData.length;
    const empty = navData.find(nav => !nav.paths);
    if (len === maxLen) return message.warning(`最多可添加${maxLen}个导航`);
    const item = {
      // 给一个默认的对象
      icon: 'iconic_site_new',
      linkDisplayName: '',
      name: '',
      navModule: `module${len}`,
    };
    
    setTimeout(() => {
      setNavData([...navData, item])
    })
  }

  function forUpdatePageData() {
    // const newObj = { ...pageData };
    // newObj.maps[curFlag].list = tagList;
    // settagList(tagList.slice());
    // setpageData(newObj);

    setNavData(navData.slice());
  }

  function delImg(num) {
    const newArr = [...navData];
    const arr = [];
    newArr.map(e => {
      if (e.navModule !== num) {
        arr.push(e);
      }
    });
    setNavData(arr);
  }

  function toMove(ind, num) {
    console.log(ind);
    const newArr = [...navData];
    const rec = newArr.splice(ind, 1)[0];
    newArr.splice(ind + num, 0, rec);
    setNavData(newArr);
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

  

  // 点击input
  function relevClick(num) {
    const arr = ['fd8d01f1a35111eb999e00505694ddf5']; // 首页
    const navs = navData.map((nav, ind) => {
      const { paths = [] } = nav;
      const id = paths?.[1];
      ind !== num && !!id && arr.push(id); // 把自己也排除，取末级的uid,去重时也从末级开始
      nav.showSec = ind === num;
      if (ind !== 0 && paths?.length !== 2) {  
        // 如果同时有没选到末点的，就关掉并清空
        nav.linkDisplayName = '';
        nav.icon = '';
      }
      return nav;
    });

    setcurNavs(arr);
    setNavData(navs);
  }
  const columns = [
    {
      title: '导航图标',
      dataIndex: 'icon',
      render: (icon, e) => {
        return <div className={pageStyle.on}>
          <svg className="icon" aria-hidden="true">
            <use
              href={`#${e.icon}`}
            />
          </svg>
          <span>{e.name}</span>
        </div>
      },
    },
    {
      title: '导航名称',
      dataIndex: 'name',
      render: (navModule, item) => {
        return item.navModule === 'home' ? (
          '首页'
        ) : (
          <Select
            style={{ width: 100 }}
            value={item.navModule}
            onFocus={() => filterData()}
            onSelect={e => {
              selectData(e, item.navModule);
            }}
          >
            {choiceData.map((e, i) => (
              <Select.Option key={i} value={e.navModule} disabled={e.disabled}>
                {e.name}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'navModule',
      render: (text, item) => {
        let index = -1;
        navData.map((e, i) => {
          if (e.navModule === text) {
            index = i;
          }
        });
        console.log(index);
        return item.navModule === 'home' ? (
          ''
        ) : (
          <div className={pageStyle.tbOpration}>
            <a disabled={index === 1} onClick={() => toMove(index, -1)}>
              <Icon type="arrow-up" />
            </a>
            <a disabled={index === navData.length - 1} onClick={() => toMove(index, 1)}>
              <Icon type="arrow-down" />
            </a>
            <a onClick={() => delImg(text)}>
              <Icon type="delete" />
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ul>
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
                    <a disabled={ind === 0} onClick={() => toMove(ind, -1)}>
                      <Icon type="arrow-up" />
                    </a>
                    <a disabled={ind === len - 1} onClick={() => toMove(ind, 1)}>
                      <Icon type="arrow-down" />
                    </a>
                    <a disabled={len === 1} onClick={() => delImg(ind)}>
                      <Icon type="delete" />
                    </a>
                  </div>
                </div>
                <div className={styles.taginpBox}>
                  <Form layout="inline">
                    <Item>
                      <svg className={`icon ${styles.navIcon}`}>
                        <use href={`#${icon}`} />
                      </svg>
                    </Item>

                    <Item>
                      <Input
                        value={name}
                        maxLength={4}
                        onBlur={e => discTexChange(e, tag)}
                        onChange={e => discTexChange(e, tag)}
                        placeholder="请输入导航名称"
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
                          onFocus={() => relevClick(ind)}
                          onClick={() => relevClick(ind)}
                          suffix={<Icon type="down" className={styles.inpSuffix} />}
                        />
                      </Item>
                    </Form>

                    {showSec &&
                      relatedPageOption?.length > 0 && (
                        <RelevanceInp
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
