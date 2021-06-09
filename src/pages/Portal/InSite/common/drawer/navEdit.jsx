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
      touchCurNavs()
      setrelatedPageOption(res?.data);
    });
  }, []);

  useEffect(() => {
    touchCurNavs()
  }, [navData])

  // 收集已经有的nav
  function touchCurNavs() {
    // const arr = navData.map(nav => nav?.paths?.[0]);
    const arr = ['fd8d01f1a35111eb999e00505694ddf5']  // 首页
    navData.map(nav => {
      const { paths = [] } = nav;
      // const len = paths.length;
      // const num = len === 2 ? 1 : 0;  // 取末级的uid,去重时也从末级开始
      // return paths?.[num];
      const id = paths?.[1]
      !!id && arr.push(id)  // 取末级的uid,去重时也从末级开始
    });
    setcurNavs(arr);
  }

  function addNewTag() {
    const len = navData.length;
    const empty = navData.find(nav => !nav.paths);
    if (len === maxLen) return message.warning(`最多可添加${maxLen}个导航`);
    const item = {
      // 给一个默认的对象
      icon: 'iconic_site_new',
      linkDisplayName: '',
      name: '',
      navModule: '',
    });
    setNavData(newArr);
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
  function filterData(navModule) {
    const newArr = [...choiceData];
    newArr.map(i => {
      const r = navData.find(e => {
        return i.navModule === e.navModule;
      });
      if (r) {
        i.disabled = true;
      } else {
        i.disabled = false;
      }
    });
    setChoiceData(newArr);
  }

  function touchRelece(arr, num) {
    console.log(arr);
    const len = arr.length;
    navData[num].icon = arr[len - 1]?.icon;
    navData[num].navModule = arr[len - 1]?.appletsLink;
    navData[num].linkKey = arr[len - 1]?.linkKey;
    navData[num].paths = arr.map(p => p.code);
    navData[num].linkDisplayName = arr.map(p => p.text).join('/');
    forUpdatePageData();
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
    <div className={pageStyle.navBox}>
      <Table columns={columns} dataSource={navData || []} rowKey={'navModule'} pagination={false} />
      <p className={pageStyle.addImg} onClick={addNewNav}>
        <span>+</span>
        <span>添加导航</span>
      </p>
    </div>
  );
}
