import React, { Component } from 'react';
import { Cascader, Tag, Tooltip } from 'antd';
import styles from './Cascaderselect.less';

export default class Cascaderselecthover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CompanyArr: [],
      codesArr: [],
      errors: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    for (let v in nextProps) {
      if (v == 'data-__field' && nextProps[v].errors) {
        this.setState({
          errors: true,
        });
      }
    }
    if (nextProps.initvalue) {
      this.setState({
        CompanyArr: nextProps.initvalue.sourcetag,
        codesArr: nextProps.initvalue.codes,
      });
    }
  }

  delog(e, index) {
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
            this.props.onChange(codesArr, CompanyArr, this.props.id);
          }
        );
      }
    });
  }
  onCascaderChange = (value, selectedOptions) => {
    if (this.props.multiple) {
      this.props.onChange(value, selectedOptions);
    } else {
      let arr = this.state.CompanyArr;
      let codes = this.state.codesArr;
      let index = value[value.length - 1];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].key == index) {
          this.delog(index);
          return;
        }
      }
      codes.push(value.join('/'));
      const text = (
        <span> {selectedOptions.map(o => o[this.props.fieldNames.label]).join('/')}</span>
      );
      arr.push(
        <Tooltip placement="left" title={text} key={index}>
          <Tag
            closable
            onClose={e => {
              this.delog(e, index);
            }}
          >
            <div className={styles.companyTagText}>
              {selectedOptions.map(o => o[this.props.fieldNames.label]).join('/')}
            </div>
          </Tag>
        </Tooltip>
      );
      this.setState(
        {
          CompanyArr: arr,
          codesArr: codes,
          errors: false,
        },
        () => {
          this.props.onChange(this.state.codesArr, this.state.CompanyArr, this.props.id);
        }
      );
    }
  };

  render() {
    const { CompanyArr, errors,codesArr } = this.state;
    const { options, fieldNames, placeholder, multiple } = this.props;
    return (
      <div className={styles.company}>
        {multiple ? (
          <Cascader
            value={codesArr}
            autoFocus={true}
            options={options}
            fieldNames={fieldNames}
            expandTrigger="hover"
            onChange={this.onCascaderChange}
            changeOnSelect
            popupClassName={styles.CascaderselectHover}
            style={{ width: '100%' }}
          />
        ) : (
          <Cascader
            autoFocus={true}
            options={options}
            fieldNames={fieldNames}
            expandTrigger="hover"
            onChange={this.onCascaderChange}
            changeOnSelect
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
        )}
      </div>
    );
  }
}
