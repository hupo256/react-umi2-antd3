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
import RelevanceInp from '@/pages/ChannelManage/components/RelevanceInp';
import styles from './drawerEditor.less';

const maxLen = 5;
const { Item } = Form;

export default function TagsEdit(props) {
  const {
    choiceData,
    setChoiceData,
    navData,
    setNavData,
    pageData,
    setpageData,
    curFlag,
    setlinkEdtor,
    setcurInd,
  } = useContext(ctx);
  console.log(navData);
  const [tagList = [], settagList] = useState(() => pageData?.maps?.[curFlag]?.list);
  const titInp = useRef();
  function addNewNav() {
    const len = navData.length;
    if (len === maxLen) return message.warning(`导航栏添加${maxLen}个效果最佳哦`);
    const newArr = [...navData];
    const r = newArr.find(e => e.navModule === '');
    if (r) {
      return message.warning(`您有未选择的导航，请设置后再添加`);
    }
    newArr.push({
      icon: '',
      name: '',
      navModule: `module${len}`,
    });
    setNavData(navData.concat(item));
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
  function selectData(navModule, current) {
    console.log(navModule);
    const newArr = [...navData];
    const r = choiceData.find(e => {
      return navModule === e.navModule;
    });
    newArr.map(i => {
      if (i.navModule === current) {
        i.navModule = r.navModule;
        i.name = r.name;
        i.icon = r.icon;
      }
    });
    setNavData(newArr);
    filterData();
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
            <a className={index === 1 ? pageStyle.disabled : ''} disabled={index === 1} onClick={() => toMove(index, -1)}>
              <Icon type="arrow-up" />
            </a>
            <a className={index === navData.length - 1 ? pageStyle.disabled : ''} disabled={index === navData.length - 1} onClick={() => toMove(index, 1)}>
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
