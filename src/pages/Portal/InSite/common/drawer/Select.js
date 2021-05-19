/*
 * @Author: zqm
 * @Date: 2021-04-30 13:39:59
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-07 14:37:03
 * 关联页面
 */
import React, { Component, useContext } from 'react';
import { connect } from 'dva';
import { Table, Input, Pagination, Icon } from 'antd';
import styles from './drawerEditor.less';
import { ctx } from '../context';

const { Search } = Input;
@connect(({ ArticleSpecial, loading }) => ({
  ArticleSpecial,
  Loading: loading.effects['AppletSetting/formListModel'],
}))
class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textOne: '请选择',
      textTwo: '请选择',
      type: '',
      step: 1,
      searchWord: null,
      show: false,
      inputVal: null,
      record: null,
      status: null,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      defvalue,
      type,
    } = this.props;
    if (defvalue) {
      if (defvalue.split('/').length) {
        // 表单
        this.setState({ textOne: defvalue.split('/')[0], step: 2, inputVal: defvalue }, () => {
          dispatch({
            type:
              type === 'special'
                ? 'ArticleSpecial/getSpecialListModel'
                : 'ArticleSpecial/getArticleListModel',
            payload: { pageNum: 1, pageSize: 10 },
          });
        });
      }
    }
  }
  handleSrarchStatus = status => {
    this.setState({ status }, () => {
      this.queryList({ articleDicCode: status});
    });
  };
  render() {
    const { pageData } = this.props
    console.log(pageData)
    const article = pageData?.jsonData?.find(e => e.flag === 'article')
    let nameListData = []
    if (article) {
      nameListData = article.nameListData
    }
    const { textOne, textTwo, step, searchWord, show, inputVal, status } = this.state;
    const {
      Loading,
      ArticleSpecial: { formList },
    } = this.props;

    const columns = [
      { title: textOne + '标题', dataIndex: textOne === '文章' ? 'articleTitle' : 'specialTitle' },
      { title: '发布人', dataIndex: 'creatorName' },
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
          <div className={styles.selectList} style={{height: textOne === '文章' && step === 2 ? 'auto' : 347, paddingBottom: textOne === '文章' && step === 2 ? 5 : 0}}>
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
                {/*<p onClick={() => this.handleClickOne()}>文章</p>*/}
                <p onClick={() => this.handleClickTwo('article')}>文章</p>
                <p onClick={() => this.handleClickTwo('special')}>专题</p>
              </div>
            )}
            {step == 2 && (
              <div className={styles.tab2}>
                <Search
                  placeholder="可输入标题进行搜索"
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
                {textOne === '文章' && <p style={{paddingBottom: 10}}>
                  文章栏目：
                  <span
                    onClick={() => this.handleSrarchStatus(null)}
                    className={`tagstatus ${!status && 'tagstatusCur'}`}
                  >
                全部
                  </span>
                  {nameListData.map(e => <span
                    style={{paddingBottom: 5}}
                    onClick={() => this.handleSrarchStatus(e.code)}
                    className={`tagstatus ${e.code === status && 'tagstatusCur'}`}
                  >
                    {e.name}
                  </span>)}
                </p>}
                <Table
                  loading={Loading}
                  className={styles.tablename}
                  dataSource={formList?.list}
                  rowKey={record => record.formUid}
                  onRow={record => {
                    return {
                      onClick: event => {
                        this.handleSelect({
                          ...record,
                          buttonText:
                            textOne === '文章' ? record.articleTitle : record.specialTitle,
                        });
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
                  style={{ float: 'right', marginTop: 5 }}
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
  handleClickTwo = type => {
    this.props.dispatch({
      type:
        type === 'special'
          ? 'ArticleSpecial/getSpecialListModel'
          : 'ArticleSpecial/getArticleListModel',
      payload: { pageNum: 1, pageSize: 10 },
    });
    this.setState({
      textOne: type === 'special' ? '专题' : '文章',
      inputVal: type === 'special' ? '专题' : '文章',
      step: 2,
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
        inputVal: `${textOne}/${textOne === '文章' ? record.articleTitle : record.specialTitle}`,
        show: false,
        // step: 1,
      },
      () => {
        this.props.handleSelect({
          inputVal: `${textOne}/${textOne === '文章' ? record.articleTitle : record.specialTitle}`,
          record,
          type: textOne === '文章' ? 'article' : 'special',
          uid: textOne === '文章' ? record.articleUid : record.specialUid,
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
      ArticleSpecial: { formListQuery },
      type,
    } = this.props;
    dispatch({
      type:
        type === 'special'
          ? 'ArticleSpecial/getSpecialListModel'
          : 'ArticleSpecial/getArticleListModel',
      payload: { ...formListQuery, ...obj },
    });
  };
}

export default Select;
