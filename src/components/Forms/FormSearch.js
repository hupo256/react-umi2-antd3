/*
 * @Author: zqm 
 * @Date: 2019-12-11 14:23:25 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-01-14 14:59:41
 */
import React, { Component } from 'react';
import styles from './FormSearch.less';
import { Row, Col, Form, Button, Input, Select, DatePicker, Cascader, Icon } from 'antd';
import Cascaderselect from '@/components/Cascaderselect/Cascaderselecthover';
import DepartmentCascader from '@/components/Cascaderselect/DepartmentCascader';
import NumInput from './NumInput';
import UnitRate from './UnitRate';
import { getauth } from '@/utils/authority';
import { connect } from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(({ systemdata }) => ({ systemdata }))
@Form.create()
class FormSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NumIptreset: false,
      UnitRateset: false,
      sourcetag: [],
      codes: [],
      isUnfold: false,
      systemRadioValue: '',
      Department: [], // 项目所属部门
      DepartmentCodes: [], // 项目所属部门
      DepartmentClues: [], // 线索所属部门
      DepartmentCluesCodes: [], //  线索所属部门
    };
  }
  componentDidUpdate(prevProps) {
    const {
      systemdata: { systemRadioValue },
    } = this.props;
    if (systemRadioValue !== this.state.systemRadioValue) {
      this.handleFormReset();
      this.setState({ systemRadioValue });
    }
    return true;
  }
  render() {
    const { formList, authCode } = this.props;
    const permissionsBtn = getauth();
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            {this.initFormList(formList).map((item, index) => {
              if (index > 8) {
                if (!this.state.isUnfold) {
                  item.props.style.display = 'none';
                } else {
                  item.props.style.display = 'block';
                }
                if (this.initFormList(formList).length - 1 === index) {
                  return this.state.isUnfold ? (
                    <React.Fragment key={index}>
                      {item}
                      <Col md={24} sm={24}>
                        <div onClick={this.handleOff} className={styles.unfoldBtn}>
                          收起搜索
                          <Icon type="double-left" style={{ transform: 'rotate(90deg)' }} />
                        </div>
                      </Col>
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={index}>
                      {item}
                      <Col md={24} sm={24}>
                        <div className={styles.unfoldBtn} onClick={this.handleOpen}>
                          展开搜索
                          <Icon type="double-left" style={{ transform: 'rotate(-90deg)' }} />
                        </div>
                      </Col>
                    </React.Fragment>
                  );
                } else {
                  // return this.state.isUnfold ? item : '';
                  return item;
                }
              } else {
                return item;
              }
            })}
          </Row>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
              查询
            </Button>
            {permissionsBtn[authCode] ? (
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleDownload}>
                导出
              </Button>
            ) : null}
          </div>
        </Form>
      </div>
    );
  }
  initFormList = formList => {
    const { getFieldDecorator } = this.props.form;
    const formItemList = [];
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        if (!item) {
          return;
        }
        let { label, field, type, placeholder, min, inpWidth, max, integer } = item;
        if (type === 'INPUT') {
          const INPUT = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(
                  <Input placeholder={placeholder || ''} style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(INPUT);
        } else if (type === 'INPUTS') {
          const INPUTS = (
            <Col md={inpWidth || 8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(
                  <NumInput
                    min={min}
                    max={max}
                    integer={integer}
                    style={{ width: '100%' }}
                    NumIptreset={this.state.NumIptreset}
                  />
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(INPUTS);
        } else if (type === 'PROJECTDEPARTEMENT') {
          const PROJECTDEPARTEMENT = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(
                  <DepartmentCascader
                    placeholder="选择部门"
                    onChange={this.handleDepartment}
                    fieldNames={{ label: 'name', value: 'code', children: 'children' }}
                    query_range={1}
                    changeOnSelect={true}
                    initValue={{
                      Department: this.state.Department,
                      DepartmentCodes: this.state.DepartmentCodes,
                    }}
                  />
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(PROJECTDEPARTEMENT);
        } else if (type === 'CLUESDEPARTEMENT') {
          const CLUESDEPARTEMENT = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(
                  <DepartmentCascader
                    placeholder="选择部门"
                    onChange={this.handleCluesDepartment}
                    fieldNames={{ label: 'name', value: 'code', children: 'children' }}
                    query_range={1}
                    changeOnSelect={true}
                    initValue={{
                      Department: this.state.DepartmentClues,
                      DepartmentCodes: this.state.DepartmentCluesCodes,
                    }}
                  />
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(CLUESDEPARTEMENT);
        } else if (type === 'SELECT') {
          const SELECT = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(
                  <Select
                    mode={integer ? false : 'multiple'}
                    style={{ width: '100%' }}
                    placeholder={placeholder || ''}
                  >
                    {this.getOptionList(item.list || [])}
                  </Select>
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(SELECT);
        } else if (type === 'TIMES') {
          const TIMES = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(<DatePicker.RangePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          );
          formItemList.push(TIMES);
        } else if (type === 'CASCADE') {
          const CASCADE = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(
                  <Cascader
                    expandTrigger={item.expandTrigger || 'hover'}
                    changeOnSelect={item.changeOnSelect}
                    options={item.list || []}
                    fieldNames={{
                      label: field === 'projectArea' || field === 'cluesArea' ? 'areaName' : 'name',
                      value: field === 'projectArea' || field === 'cluesArea' ? 'areaCode' : 'code',
                      children: 'children',
                    }}
                    placeholder={placeholder}
                  />
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(CASCADE);
        } else if (type === 'MULTISELECT') {
          const { sourcetag, codes } = this.state;
          const MULTISELECT = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(
                  <Cascaderselect
                    options={item.list || []}
                    fieldNames={{ label: 'name', value: 'code', children: 'children' }}
                    placeholder={placeholder}
                    onChange={this.handleCascaderchange}
                    initvalue={{ sourcetag, codes }}
                  />
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(MULTISELECT);
        } else if (type === 'DRAWER') {
          const DRAWER = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, { initialValue: item.valName || '' })(
                  <span
                    onClick={() => {
                      this.props.showDrawerModel(item, this.props.form.getFieldsValue()[field]);
                    }}
                    className={styles.formSelectval}
                    style={{ width: '100%' }}
                  >
                    {item.valName ? (
                      <span>{item.valName}</span>
                    ) : (
                      <span style={{ color: '#bfbfbf' }}>{placeholder}</span>
                    )}
                  </span>
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(DRAWER);
        } else if (type === 'UNITRATE') {
          const UNITRATE = (
            <Col md={8} sm={24} style={{ minHeight: 60 }} key={i}>
              <FormItem label={label}>
                {getFieldDecorator(field, {})(
                  <UnitRate style={{ width: '100%' }} UnitRateset={this.state.UnitRateset} />
                )}
              </FormItem>
            </Col>
          );
          formItemList.push(UNITRATE);
        }
      });
    }
    return formItemList;
  };
  getOptionList = data => {
    if (!data) {
      return [];
    }
    let options = [];
    data.map((item, index) => {
      return options.push(
        <Option value={item.code || item.value} key={index}>
          {item.name || item.label}
        </Option>
      );
    });
    return options;
  };
  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState(
      {
        NumIptreset: true,
        UnitRateset: true,
        sourcetag: [],
        codes: [],
        Department: [], // 项目所属部门
        DepartmentCodes: [], // 项目所属部门
        DepartmentClues: [], // 线索所属部门
        DepartmentCluesCodes: [], //  线索所属部门
      },
      () => {
        this.setState({ NumIptreset: false, UnitRateset: false });
        this.props.formReset();
      }
    );
  };
  // 查詢
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.formSearch(values);
    });
  };
  // 导出
  handleDownload = () => {
    this.props.formDownload();
  };
  //记录来源查询条件
  handleCascaderchange = (codes, arr) => {
    this.setState({
      sourcetag: arr,
      codes,
    });
  };
  //   展开全部
  handleOpen = () => {
    this.setState({ isUnfold: true });
  };
  //   收起全部
  handleOff = () => {
    this.setState({ isUnfold: false });
  };
  // 项目所属部门
  handleDepartment = (codes, htmlarr) => {
    this.setState({
      Department: htmlarr,
      DepartmentCodes: codes,
    });
  };
  // 线索所属部门
  handleCluesDepartment = (codes, htmlarr) => {
    this.setState({
      DepartmentClues: htmlarr,
      DepartmentCluesCodes: codes,
    });
  };
}
FormSearch.propTypes = {};
export default FormSearch;
