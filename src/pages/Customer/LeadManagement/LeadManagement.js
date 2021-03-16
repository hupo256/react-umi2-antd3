/*
 * @Author: zqm 
 * @Date: 2021-01-22 11:30:13 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-01-22 15:11:49
 * 线索管理
 */
import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LeadManageSearch from './LeadManageSearch';
import LeadManageTable from './LeadManageTable';
import { Card } from 'antd';

class LeadManagement extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    return (
      <div>
        <PageHeaderWrapper>
          <LeadManageSearch />
          <LeadManageTable />
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default LeadManagement;
