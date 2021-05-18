/*
 * @Author: tdd
 * @Date: 2021-03-23 13:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12
 * 编辑亮点
 */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ctx } from '../context';
import { Input, Icon, message, Form, Table, Select } from 'antd';
import { highlightsBgImgs } from '../../tools/data';
import pageStyle from '../../preview/preview.less';

const maxLen = 4;
const { Item } = Form;

export default function TagsEdit(props) {
  const { choiceData, setChoiceData, navData, setNavData, pageData, setpageData, curFlag, setlinkEdtor, setcurInd } = useContext(ctx);
  console.log(navData)
  const [tagList = [], settagList] = useState(() => pageData?.maps?.[curFlag]?.list);
  const titInp = useRef();
  function addNewNav() {
    const len = navData.length;
    if (len === maxLen) return message.warning(`导航栏添加${maxLen + 1}个效果最佳哦`);
    const newArr = [ ...navData ];
    const r = newArr.find(e => e.navModule === '')
    if (r) {
      return message.warning(`您有未选择的导航，请设置后再添加`);
    }
    newArr.push({icon: "",
      name: "",
      navModule: '',
    })
    setNavData(newArr);
  }
  function delImg(num) {
    const newArr = [ ...navData ];
    const arr = []
    newArr.map(e => {
      if (e.navModule !== num) {
        arr.push(e)
      }
    })
    setNavData(arr);
  }

  function toMove(ind, num) {
    console.log(ind)
    const newArr = [ ...navData ];
    const rec = newArr.splice(ind, 1)[0];
    newArr.splice(ind + num, 0, rec);
    setNavData(newArr);
  }
  function filterData (navModule) {
    const newArr = [ ...choiceData ];
    newArr.map(i => {
      const r = navData.find(e => {
        return i.navModule === e.navModule
      })
      if (r) {
        i.disabled = true
      } else {
        i.disabled = false
      }
    })
    setChoiceData(newArr);
  }
  function selectData (navModule, current) {
    console.log(navModule)
    const newArr = [ ...navData ];
    const r = choiceData.find(e => {
      return navModule === e.navModule
    })
    newArr.map(i => {
      if (i.navModule === current) {
        i.navModule = r.navModule
        i.name = r.name
        i.icon = r.icon
      }
    })
    setNavData(newArr);
    filterData()
  }
  const columns = [
    {
      title: '导航图标',
      dataIndex: 'icon',
      render:(icon, e) => {
        return e.navModule === 'home' ?
          <div className={pageStyle.on}>
            <svg className="icon" aria-hidden="true">
              <use href="#iconic_home_no" />
            </svg>
            <span>首页</span>
          </div>:
          <div className={pageStyle.on}>
            <svg className="icon" aria-hidden="true">
              <use href={`#${e.navModule === 'case' ? 'iconic_case_no' : e.navModule === 'site' ? 'iconic_site_no' : e.navModule === 'design' ? 'iconic_designer_no' :e.navModule === 'article' ? 'iconic_article_no' : ''}`} />
            </svg>
            <span>{e.name}</span>
          </div>
      }
    },
    {
      title: '导航名称',
      dataIndex: 'name',
      render:(navModule, item) => {
        return item.navModule === 'home' ? '首页' : <Select style={{width: 100}} value={item.navModule} onFocus={() => filterData()} onSelect={(e) => {selectData(e, item.navModule)}}>
          {choiceData.map((e, i) => <Select.Option key={i} value={e.navModule} disabled={e.disabled}>{e.name}</Select.Option>)}
        </Select>
      }
    },
    {
      title: '操作',
      dataIndex: 'navModule',
      render:(text, item) => {
        let index = -1
        navData.map((e, i) => {
          if (e.navModule === text){
            index = i
          }
        })
        console.log(index)
        return item.navModule === 'home' ? '' :
       <div className={pageStyle.tbOpration}>
          <a disabled={index === 0} onClick={() => toMove(index, -1)}>
            <Icon type="arrow-up" />
          </a>
          <a disabled={index === navData.length - 1} onClick={() => toMove(index, 1)}>
            <Icon type="arrow-down" />
          </a>
          <a onClick={() => delImg(text)}>
            <Icon type="delete" />
          </a>
        </div>
      }
    },
  ];

  return (
    <div className={pageStyle.navBox}>
      <Table
        columns={columns}
        dataSource={[{icon: "iconic_home_no",
          name: "首页",
          navModule: "home"}, ...navData]
        || []}
        rowKey={'navModule'}
        pagination={false}
      />
      <p className={pageStyle.addImg} onClick={addNewNav}>
        <span>+</span>
        <span>添加导航</span>
      </p>

    </div>
  );
}
