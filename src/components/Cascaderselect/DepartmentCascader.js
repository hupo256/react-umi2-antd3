/*
 * @Author: pengyc 
 * @Date: 2020-05-11 11:55:35 
 * @Last Modified by: zqm
 * @Last Modified time: 2020-06-15 10:54:14
 * 所属部门 公有选择组件
 */
import React, { Component } from 'react';
import { Cascader, Tag, Tooltip } from 'antd';
import styles from './Cascaderselect.less';
import { connect } from 'dva';

@connect(({ base }) => ({
  base,
}))
export default class DepartmentCascader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CompanyArr: [],
      codesArr: [],
      errors: false,
    };
  }

  componentDidMount() {
    const { initValue, dispatch, query_range } = this.props;
    dispatch({
      type: 'base/getDepartmentListModel',
      payload: { query_range },
    });
    if (!_.isEmpty(initValue)) {
      this.setState({
        CompanyArr: initValue.Department,
        codesArr: initValue.DepartmentCodes,
      });
    }
  }

  componentDidUpdate(prveProps) {
    const { initValue } = this.props;
    if (
      this.props['data-__field'] &&
      !_.isEqual(prveProps['data-__field'], this.props['data-__field'])
    ) {
      if (this.props['data-__field'].errors) {
        this.setState({
          errors: true,
        });
      }
    }
    if (!_.isEqual(prveProps.initValue, initValue)) {
      this.setState({
        CompanyArr: initValue.Department,
        codesArr: initValue.DepartmentCodes,
      });
    }
  }

  render() {
    const { CompanyArr, errors } = this.state;
    const {
      twoStage,
      placeholder,
      fieldNames,
      base: { departmentList },
      changeOnSelect,
    } = this.props;
    const dataRole = twoStage ? this.dataRoleFilter(departmentList) : departmentList;
    return (
      <div className={styles.company}>
        <Cascader
          autoFocus={true}
          options={dataRole}
          fieldNames={fieldNames}
          expandTrigger="hover"
          onChange={this.onCascaderChange}
          changeOnSelect={changeOnSelect}
          popupClassName={styles.CascaderselectHover}
        >
          <div className={styles.companyipt} style={{ borderColor: errors ? '#f5222d' : '' }}>
            {_.isEmpty(CompanyArr) ? (
              <span style={{ color: 'rgb(197, 199, 202)' }}>{placeholder}</span>
            ) : (
              CompanyArr
            )}
          </div>
        </Cascader>
      </div>
    );
  }

  onCascaderChange = (value, selectedOptions) => {
    let arr = this.state.CompanyArr;
    let codes = this.state.codesArr;
    let index = value[value.length - 1];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].code == index) {
        this.handleDelete(index);
        return;
      }
    }
    codes.push(value.join('/'));
    const text = selectedOptions.map(o => o[this.props.fieldNames.label]).join('/');
    arr.push(
      <Tooltip placement="left" key={index} title={<span> {text}</span>}>
        <Tag
          closable
          onClose={e => {
            this.handleDelete(e, index);
          }}
        >
          <div className={styles.companyTagText}>{text}</div>
        </Tag>
      </Tooltip>
    );
    codes = _.uniq(codes);
    arr = _.uniqWith(arr, _.isEqual);
    arr = _.unionBy(arr, 'key');
    this.props.onChange(codes, arr);
    this.setState({
      CompanyArr: arr,
      codesArr: codes,
      errors: false,
    });
  };

  handleDelete(e, index) {
    //阻止冒泡
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    //删除
    let { CompanyArr, codesArr } = this.state;
    CompanyArr.forEach((item, ind) => {
      if (item.key == index) {
        this.setState(
          {
            ...CompanyArr.splice(ind, 1),
            ...codesArr.splice(ind, 1),
          },
          () => {
            this.props.onChange(codesArr, CompanyArr);
          }
        );
      }
    });
  }

  // 所属部门保留两级
  dataRoleFilter = departmentList => {
    return departmentList.map(item => {
      if (item.children) {
        item.children.map(items => {
          items.children = null;
          return items;
        });
      }
      return item;
    });
  };
}
