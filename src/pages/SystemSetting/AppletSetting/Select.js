/*
 * @Author: zqm 
 * @Date: 2021-04-30 13:39:59 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-30 15:50:40
 * 关联页面
 */
import React, { Component } from 'react';
import { Table, Input, Pagination, Icon } from 'antd';
import styles from './index.less';
const { Search } = Input;

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textOne: '请选择',
      textTwo: '请选择',
      step: 1,
      searchWord: null,
      show: false,
      inputVal: null,
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    const { textOne, textTwo, step, searchWord, show, inputVal } = this.state;
    const datas = [
      { name: '一键授权', value: '1' },
      {
        name: '表单',
        value: '2',
        children: [{}],
      },
    ];
    const dataSource = [
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
      { name: '立即预约', age: '2021-01-30' },
    ];

    const columns = [
      { title: '表单标题', dataIndex: 'name' },
      { title: '更新时间', dataIndex: 'age' },
    ];

    return (
      <div className={styles.selectWrap}>
        <Input
          placeholder="请选择关联页面"
          value={inputVal}
          onClick={() => this.handleInputTogger()}
          style={{ width: '100%' }}
        />
        <span className={styles.linkIcon} onClick={() => this.handleInputTogger()}>
          <Icon type={show ? 'up' : 'down'} />
        </span>
        {this.state.show && (
          <div className={styles.selectList}>
            <div className={styles.selectListTitle}>
              <span
                className={step == 1 && styles.cur}
                onClick={() => this.setState({ step: 1, textTwo: '请选择' })}
              >
                {step > 0 && textOne}
              </span>
              <span className={step == 2 && styles.cur}>{step > 1 && textTwo}</span>
            </div>
            {step == 1 && (
              <div className={styles.tab1}>
                <p onClick={() => this.handleClickOne()}>一键授权</p>
                <p onClick={() => this.handleClickTwo()}>表单</p>
              </div>
            )}
            {step == 2 && (
              <div className={styles.tab2}>
                <Search
                  placeholder="可输入表单标题进行搜索"
                  value={searchWord}
                  onChange={e => this.setState({ searchWord: e.target.value })}
                  onSearch={value => this.handleSrarch()}
                  onPressEnter={() => this.handleSrarch()}
                  style={{ width: '100%', marginBottom: 10 }}
                />
                <Table
                  className={styles.tablename}
                  pagination={false}
                  dataSource={dataSource}
                  scroll={{ y: 182 }}
                  columns={columns}
                />
                <Pagination
                  size="small"
                  defaultCurrent={1}
                  total={50}
                  style={{ float: 'right', marginTop: 8 }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  handleSrarch = () => {
    const { searchWord } = this.state;
    console.log('====================================');
    console.log(searchWord);
    console.log('====================================');
    // this.getList({ searchWord: (searchWord && searchWord.substring(0, 30)) || '', pageNum: 1 });
  };

  handleClickOne = () => {
    this.setState({ textOne: '一键授权', inputVal: '一键授权', show: false });
  };
  handleClickTwo = () => {
    this.setState({ textOne: '表单', inputVal: '表单', step: 2 });
  };
  handleInputTogger = () => {
    this.setState({ show: !this.state.show }, () => {
      const { show } = this.state;
      if (!show) {
        this.setState({ step: 1, textTwo: '请选择' });
      }
    });
  };
}

export default Select;
