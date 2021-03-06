/*
 * @Author: tdd
 * @Date: 2021-03-23 13:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12
 * 编辑轮播图
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../context';
import { Input, Radio, InputNumber, Icon, message, Table, Popover, Button } from 'antd';
import example from '../../../../../assets/example.png'

const { Group } = Radio;
const maxLen = 6;

export default function editModel(props) {
  const {
    pageData,
    setpageData,
  } = useContext(ctx);
  function changeModelName (item, event) {
    if (event.target.value.length > 8) {
      message.error('最多可输入8个字符哦')
      return
    }
    const newObj = { ...pageData };
    newObj.jsonData.map((e) => {
      if (e.flag === item.flag) {
        e.afterName = event.target.value
      }
    });
    setpageData(newObj);
  }
  function saveName () {
    const newObj = { ...pageData };
    newObj.jsonData.map((e) => {
      if (e.afterName !== undefined) {
        e.title = e.afterName
      }
    });
    setpageData(newObj);
  }
  const columns = [
    {
      title: '模块',
      dataIndex: 'flag',
      render:(flag) => {
        switch (flag) {
          case 'banner':
            return '图片广告1'
            break;
          case 'highlights':
            return '亮点'
            break;
          case 'case':
            return '案例'
            break;
          case 'site':
            return '参观工地'
            break;
          case 'design':
            return '设计师团队'
            break;
          case 'article':
            return '文章'
            break;
          case 'aboutUs':
            return '关于我们'
            break;
          case 'advertising':
            return '图片广告2'
            break;
          case 'channel':
            return '频道'
            break;
          default:
            return ''
        }
      }
    },
    {
      title: '模块标题',
      dataIndex: 'afterName',
      render:(text, item) => {
        let result = null
        if (item.flag === 'case' || item.flag === 'site' || item.flag === 'design' || item.flag === 'article' || item.flag === 'aboutUs') {
          result = <Input value={text} onChange={(e) => changeModelName(item, e)} onBlur={saveName} />
        }
        return result
      }
    },
  ];
  const content = (
    <div>
      <img src={example} width={150} />
    </div>
  )
  return (
    <>
      <div style={{marginBottom: '1em', fontSize: 12, paddingLeft: 17}}><Icon type="info-circle" style={{color: '#c1c1c1'}} /> 编辑模块后，【模块标题】将按照您编辑后的展示&nbsp;
        <Popover content={content} title={null} placement="top" forceRender>
          <Button type="link" size="small" style={{padding: 0, fontSize: 12}}>示例</Button>
        </Popover>
      </div>
      <Table
        columns={columns}
        dataSource={pageData?.jsonData || []}
        pagination={false}
      />
    </>
  );
}
