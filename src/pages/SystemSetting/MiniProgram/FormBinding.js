/*
 * @Author: zqm 
 * @Date: 2021-03-02 14:35:24 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-03 15:44:11
 * 表单绑定
 */
import React, { Component } from 'react';
import styles from './MiniProgram.less';
import { Icon, message, Select } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
const { Option } = Select;
@connect(({ MiniProgram }) => ({ MiniProgram }))
class FormBinding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show1: false,
      show2: false,
      show3: false,
    };
  }

  componentDidMount() {
    // formlistModel
    const { dispatch } = this.props;
    dispatch({ type: 'MiniProgram/formlistModel', payload: { formStatus: 1 } });
    dispatch({ type: 'MiniProgram/formbindmapModel' });
  }

  render() {
    const { show1, show2, show3 } = this.state;
    const { FormList, FormDetail } = this.props.MiniProgram;
    return (
      <div className={styles.formBinding}>
        <p className={styles.formBindingTitle}>表单绑定</p>
        <div className={styles.formBindingItem}>
          <div className={styles.formBindingItemLeft}>
            <p>绑定案例板块</p>
            <p>绑定后，在小程序的案例列表和案例详情的底部栏点击按钮，均会跳转至绑定表单</p>
          </div>
          <div className={styles.formBindingItemRight}>
            <p>
              {!show1 && (
                <p onClick={() => this.setState({ show1: !this.state.show1 })}>
                  {FormDetail && FormDetail['1'] ? '更换绑定' : '去绑定'}
                  <Icon type="right" />
                </p>
              )}
              {show1 && (
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择表单"
                  optionFilterProp="children"
                  onChange={value => this.handleSelectChange(value, 'show1', '1')}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {FormList.map(item => {
                    return (
                      <Option value={item.formUid} key={item.formUid}>
                        {item.formTitle}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </p>
            {FormDetail &&
              FormDetail['1'] && (
                <p>
                  当前：
                  <span>{FormDetail['1'].formTitle}</span>
                </p>
              )}
          </div>
        </div>

        <div className={styles.formBindingItem}>
          <div className={styles.formBindingItemLeft}>
            <p>绑定工地板块</p>
            <p>绑定后，在小程序的工地列表和工地详情的底部栏点击按钮，均会跳转至绑定表单</p>
          </div>
          <div className={styles.formBindingItemRight}>
            <p>
              {!show2 && (
                <p onClick={() => this.setState({ show2: !this.state.show2 })}>
                  {FormDetail && FormDetail['2'] ? '更换绑定' : '去绑定'}
                  <Icon type="right" />
                </p>
              )}
              {show2 && (
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择表单"
                  optionFilterProp="children"
                  onChange={value => this.handleSelectChange(value, 'show2', '2')}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {FormList.map(item => {
                    return (
                      <Option value={item.formUid} key={item.formUid}>
                        {item.formTitle}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </p>
            {FormDetail &&
              FormDetail['2'] && (
                <p>
                  当前：
                  <span>{FormDetail['2'].formTitle}</span>
                </p>
              )}
          </div>
        </div>

        <div className={styles.formBindingItem}>
          <div className={styles.formBindingItemLeft}>
            <p>绑定设计师板块</p>
            <p>绑定后，在小程序的设计师列表和设计师详情的底部栏点击按钮，均会跳转至绑定表单</p>
          </div>
          <div className={styles.formBindingItemRight}>
            <p>
              {!show3 && (
                <p onClick={() => this.setState({ show3: !this.state.show3 })}>
                  {FormDetail && FormDetail['3'] ? '更换绑定' : '去绑定'}
                  <Icon type="right" />
                </p>
              )}
              {show3 && (
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择表单"
                  optionFilterProp="children"
                  onChange={value => this.handleSelectChange(value, 'show3', '3')}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {FormList.map(item => {
                    return (
                      <Option value={item.formUid} key={item.formUid}>
                        {item.formTitle}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </p>
            {FormDetail &&
              FormDetail['3'] && (
                <p>
                  当前：
                  <span>{FormDetail['3'].formTitle}</span>
                </p>
              )}
          </div>
        </div>
      </div>
    );
  }

  handleSelectChange = (value, name, directType) => {
    // 保存 formcollocateModel
    const { dispatch } = this.props;
    dispatch({
      type: 'MiniProgram/formcollocateModel',
      payload: { directType, formUid: value },
    }).then(res => {
      if (res && res.code === 200) {
        message.success('绑定成功');
        dispatch({ type: 'MiniProgram/formbindmapModel' });
      }
    });
    this.setState({ [name]: false });
  };
}

export default FormBinding;
