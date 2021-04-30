/*
 * @Author: zqm 
 * @Date: 2021-04-30 13:39:59 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-04-30 18:17:02
 * 关联页面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Pagination, Icon } from 'antd';
import styles from './index.less';
const { Search } = Input;
@connect(({ AppletSetting, loading }) => ({
  AppletSetting,
  Loading: loading.effects['AppletSetting/formListModel'],
}))
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
      record: null,
    };
  }

  componentDidMount() {
    // formListModel
    const { dispatch } = this.props;
    dispatch({ type: 'AppletSetting/formListModel', payload: { pageNum: 1, formStatus: '1' } });
  }

  render() {
    const { textOne, textTwo, step, searchWord, show, inputVal } = this.state;
    const {
      Loading,
      AppletSetting: { formList },
    } = this.props;
    console.log('====================================');
    console.log(formList);
    console.log('====================================');
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
      { title: '表单标题', dataIndex: 'formTitle' },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: (t, r) => {
          return t.slice(0, 10);
        },
      },
    ];
    const rowSelection = {
      type: 'radio',
      onSelect: (record, selected, selectedRows, nativeEvent) =>
        this.handleSelect(record, selected, selectedRows, nativeEvent),
    };
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
                  onChange={e =>
                    this.setState({ searchWord: e.target.value }, () => {
                      const { searchWord } = this.state;
                      searchWord.length == 0 && this.queryList({ searchText: '', pageNum: 1 });
                    })
                  }
                  onSearch={value => this.handleSrarch()}
                  onPressEnter={() => this.handleSrarch()}
                  style={{ width: '100%', marginBottom: 10 }}
                />
                <Table
                  loading={Loading}
                  className={styles.tablename}
                  dataSource={formList?.list}
                  rowKey={record => record.formUid}
                  onRow={record => {
                    return {
                      onClick: event => {
                        this.handleSelect(record);
                      }, // 点击行
                    };
                  }}
                  scroll={{ y: 182 }}
                  columns={columns}
                  // rowSelection={rowSelection}
                  pagination={false}
                />
                <Pagination
                  size="small"
                  pageSize={10}
                  current={formList?.curPage}
                  total={formList?.recordTotal}
                  style={{ float: 'right', marginTop: 8 }}
                  onChange={(current, size) => this.handleSizeChange(current, size)}
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
    this.queryList({ searchText: (searchWord && searchWord.substring(0, 30)) || '', pageNum: 1 });
  };

  handleClickOne = () => {
    this.setState({ textOne: '一键授权', inputVal: '一键授权', show: false }, () => {
      this.props.handleSelect({
        inputVal: '一键授权',
        type: 1,
      });
    });
  };
  handleClickTwo = () => {
    this.setState({ textOne: '表单', inputVal: '表单', step: 2 }, () => {
      this.props.handleSelect({
        inputVal: '表单',
        type: 3,
      });
    });
  };
  handleInputTogger = () => {
    this.setState({ show: !this.state.show }, () => {
      const { show } = this.state;
      if (!show) {
        this.setState({ step: 1, textTwo: '请选择' });
      }
    });
  };
  handleSelect = record => {
    const { textOne } = this.state;
    this.setState(
      {
        record,
        inputVal: textOne + '/' + record.formTitle,
        show: false,
        // step: 1,
      },
      () => {
        this.props.handleSelect({
          inputVal: '表单',
          record,
          type: 2,
        });
      }
    );
  };

  handleSizeChange = (current, size) => {
    this.queryList({ pageNum: current });
  };
  queryList = obj => {
    const {
      dispatch,
      AppletSetting: { fromListQuery },
    } = this.props;
    dispatch({
      type: 'AppletSetting/formListModel',
      payload: { ...fromListQuery, ...obj },
    });
  };
}

export default Select;
