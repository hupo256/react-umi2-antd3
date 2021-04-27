/*
 * @Author: tdd 
 * @Date: 2021-04-01 14:49:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-01 18:49:12 
 * 内容模块标题
 */
import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';

export default function MdTitle(props) {
  const { title = '模块名' } = props;
  return (
    <h3>
      <b>{title}</b>
      <span>
        查看更多 <Icon type="right" />
      </span>
    </h3>
  );
}
