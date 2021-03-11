/*
 * @Author: pengyc 
 * @Date: 2020-05-11 11:55:35 
 * @Last Modified by: pengyc
 * @Last Modified time: 2020-05-25 16:21:33
 * 所属部门 公有选择组件 修改 新增公用
 */
import React, { Component } from 'react';
import { Cascader, Tag, Tooltip } from 'antd';
import styles from './Cascaderselect.less';
export default class DepartmentCascaderEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CompanyArr: [],
      codesArr: [],
      errors: false,
    };
  }

  componentDidMount() {
    const { initValue } = this.props;
    if (!_.isEmpty(initValue)) {
      this.handleCdmTag(initValue);
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
      this.handleCdmTag(initValue);
    }
  }

  render() {
    const { CompanyArr, errors } = this.state;
    const { placeholder, fieldNames, totalDepartmentList, changeOnSelect } = this.props;
    return (
      <div className={styles.company}>
        <Cascader
          autoFocus={true}
          options={totalDepartmentList}
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

  // 编辑初始化
  handleCdmTag = data => {
    const { codesKey, elemKey, enitType } = this.props.initValue;
    let arr = [];
    let codes = data.DepartmentCodes;
    if (data.dataType == 'edit') {
      data.Department.map((item, index) => {
        let text = item.name;
        arr.push(
          <Tooltip placement="left" key={index} title={<span>{text}</span>}>
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
      });
      this.props.onChange(codes, arr, codesKey, elemKey, enitType);
      this.setState({
        CompanyArr: arr,
        codesArr: codes,
      });
    } else {
      this.setState({
        CompanyArr: data.Department,
        codesArr: codes,
      });
    }
  };

  // 选中
  onCascaderChange = (value, selectedOptions) => {
    const { codesKey, elemKey, enitType } = this.props.initValue;
    let arr = this.state.CompanyArr;
    let codes = this.state.codesArr;
    let index = value[value.length - 1];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].code == index) {
        this.handleDelete(index);
        return;
      }
    }
    codes.push(_.last(value));
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
    this.props.onChange(codes, arr, codesKey, elemKey, enitType);
    this.setState({
      CompanyArr: arr,
      codesArr: codes,
    });
  };

  handleDelete(e, index) {
    const { codesKey, elemKey, enitType } = this.props.initValue;
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
            this.props.onChange(codesArr, CompanyArr, codesKey, elemKey, enitType);
          }
        );
      }
    });
  }
}
