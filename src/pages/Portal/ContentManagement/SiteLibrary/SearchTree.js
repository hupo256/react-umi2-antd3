import { Tree, Input, Icon, Checkbox, List, Avatar, Button, Modal, message } from 'antd';
import iconImg from '../../../../assets/insite-banner-02-small.jpg';
import { connect } from 'dva';
import styles from './RoleManagement.less';
import { arrReduce } from '@/utils/utils';
const { TreeNode } = Tree;
const { Search } = Input;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.uid === key)) {
        parentKey = node.uid;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
@connect(({ SiteLibrary, loading }) => ({
  SiteLibrary, //
  Loading: loading.effects['SiteLibrary/getRoleUserModel'],
}))
class SearchTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    treeData: [],
    selectTreeList: [],
    checkedKeySel: [],
    treeInitData: [],
    selectedKeys: [],
    allDataListFlat: [], //搜索
    expandTrees: [],
    SearchShow: false, //搜索model
    filterData: [], //过滤数据
    searchVal: '', //搜索输入值
    CheckboxChecked: false, //是否全选
    checkSelect: false, //是否选择全选
    disabledNodes: [],
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  componentDidMount() {
    const {
      selectedNodes,
      dispatch,
      projectUid,
      SiteLibrary: { engineeringMapData },
      dicCode,
    } = this.props;
    const { active } = this.state;
    dispatch({
      type: 'SiteLibrary/engineeringTaskModel',
      payload: {
        projectUid,
      },
    }).then(res => {
      if (res && res.code === 200) {
        const disabledNodes = [];
        engineeringMapData.map(e => {
          if (e.dicCode !== dicCode) {
            disabledNodes.push(...e.taskNodes);
          }
        });
        this.setState({ treeInitData: res.data, disabledNodes }, () => {
          this.treeDataFlat();
          const expandTrees = this.expandTree(res.data, []);
          const data = arrReduce(expandTrees, 'code');
          const checkedKeySel = [];
          selectedNodes.map(e => {
            checkedKeySel.push(e.uid);
          });
          dispatch({
            type: 'SiteLibrary/setSelectedTreeNodesModel',
            payload: { dataList: selectedNodes },
          });
          // 设置默认选中的值
          this.setState({ expandTrees: data, checkedKeySel, selectTreeList: selectedNodes });
        });
      }
    });
  }
  onChange = e => {
    let { value } = e.target;
    value = _.trim(value.substring(0, 30));
    const { activeLeft, dispatch, projectUid } = this.props;
    dispatch({
      type: 'SiteLibrary/engineeringTaskModel',
      payload: {
        projectUid,
      },
    }).then(res => {
      if (res && res.code === 200) {
        this.setState(
          {
            treeInitData: res.data,
          },
          () => {
            this.treeDataFlat();
            const { allDataListFlat, treeInitData } = this.state;
            console.log(allDataListFlat, 'allDataListFlat');
            const expandedKeys = allDataListFlat
              .map(item => {
                if (
                  item.name.indexOf(value) > -1 ||
                  (item.mobile && item.mobile.indexOf(value) > -1)
                ) {
                  return getParentKey(item.uid, treeInitData);
                }
                return null;
              })
              .filter((item, i, self) => item && self.indexOf(item) === i);
            this.setState(
              {
                searchValue: value,
                autoExpandParent: true,
              },
              () => {
                //console.log(expandedKeys, 'expandedKeys');
              }
            );
          }
        );
      }
    });
  };

  onCheck(checkedKeys, e) {
    let selectData = [];
    const { dispatch } = this.props;
    console.log('checkedKeys', checkedKeys);
    this.setState({ checkedKeySel: checkedKeys });
    const { treeData } = this.state;
    console.log(checkedKeys, 'checkedKeys选中的uid');
    console.log(treeData, 'treeData所有左侧type==2的数据');

    const getRightTreeData = data => {
      for (let i = 0; i < data.length; i++) {
        const dataTree = treeData.filter(item => {
          return data[i] == item.uid;
        });
        if (dataTree && dataTree[0]) {
          selectData.push(dataTree[0]);
        }
      }
      console.log(selectData, 'selectData根据左侧动态过滤的数据');
    };
    getRightTreeData(checkedKeys);

    if (selectData.length) {
      this.setState(
        {
          selectTreeList: selectData,
        },
        () => {
          const { selectTreeList } = this.state;
          const finishSelectTree = [];
          selectTreeList.forEach((item, index) => {
            finishSelectTree.push(item);
          });
          sessionStorage.setItem('selectRightTree', JSON.stringify(finishSelectTree));
          console.log('finishSelectTree', finishSelectTree);
          dispatch({
            type: 'SiteLibrary/setSelectedTreeNodesModel',
            payload: { dataList: finishSelectTree },
          });
        }
      );
    } else {
      //当左侧都取消时至空
      this.setState(
        {
          selectTreeList: [],
        },
        () => {
          sessionStorage.setItem('selectRightTree', JSON.stringify([]));
          dispatch({
            type: 'SiteLibrary/setSelectedTreeNodesModel',
            payload: { dataList: [] },
          });
        }
      );
    }
  }
  handleDelRightTree(item) {
    const {
      treeInitData,
      checkedKeySel,
      selectedKeys,
      selectTreeList,
      allDataListFlat,
    } = this.state;
    const { dispatch } = this.props;
    let newSelectTreeNode = [];

    let getDeldataParentUid = data => {
      let parentCode = [];
      let delParentCode = data.filter((s, k) => {
        return s.uid == item.uid;
      });
      let delParentUid;
      if (delParentCode) {
        delParentUid = data.filter((t, n) => {
          return t.code === delParentCode[0].parentCode;
        });
      }
      return delParentUid;
    };

    // 获取删除uid的父级
    const ParUid = getDeldataParentUid(allDataListFlat);
    checkedKeySel.forEach((t, index) => {
      if (t !== item.uid && t !== ParUid[0].uid) {
        newSelectTreeNode.push(t);
      }
    });

    this.setState({ checkedKeySel: newSelectTreeNode }, () => {
      console.log(newSelectTreeNode, 'newSelectTreeNode');
      const newselTre = selectTreeList.filter(n => {
        return n.uid !== item.uid;
      });
      this.setState({ selectTreeList: newselTre }, () => {
        const { selectTreeList } = this.state;
        // 点击删除时右侧剩下的code
        const RightCodedel = [];
        selectTreeList.forEach((item, index) => {
          RightCodedel.push(item.code);
        });
        // 右侧点击每行删除时剩下的code
        sessionStorage.setItem('selectRightTree', JSON.stringify(RightCodedel));
        dispatch({
          type: 'SiteLibrary/setSelectedTreeNodesModel',
          payload: { dataList: RightCodedel },
        });
      });
    });
  }

  delTreeUser(item) {
    //删除用户
    const { dispatch } = this.props;
    this.handleDelRightTree(item);

    const data = this.state.filterData.filter(items => items.code == item.code);
    if (data.length > 0) {
      this.setState({ checkSelect: false });
    }
  }

  delRightTree() {
    // 清空按钮
    const { selectTreeList } = this.state;
    const { dispatch } = this.props;
    this.setState({ selectTreeList: [], checkedKeySel: [], checkSelect: false }, () => {
      sessionStorage.setItem('selectRightTree', JSON.stringify([]));
      dispatch({
        type: 'SiteLibrary/setSelectedTreeNodesModel',
        payload: { dataList: [] },
      });
    });
  }
  treeDataFlat() {
    // const {
    //   SiteLibrary: { relateNodeTreeList },
    // } = this.props;
    const { treeInitData } = this.state;
    const dataList = [];
    const allDataListFlat = [];
    const generateList = data => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { code } = node;
        // 为搜索提供数据
        allDataListFlat.push({
          code,
          taskName: node.taskName,
          uid: node.uid,
          parentCode: node.parentCode,
        });
        if (!node.children.length) {
          dataList.push({
            code,
            taskName: node.taskName,
            uid: node.uid,
            parentCode: node.parentCode,
          });
        }
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(treeInitData);
    console.log('dataList', dataList);
    console.log('allDataListFlat', allDataListFlat);
    // 扁平数据存储
    this.setState({
      treeData: dataList,
      allDataListFlat,
    });
  }
  renderName = (name, search) => {
    if (search.length && name.indexOf(search) > -1 && search !== name) {
      const temp = name.split(search);
      const dom = [];
      for (let i = 0; i < temp.length - 0.5; i += 0.5) {
        if (Math.floor(i) !== i) {
          dom.push(
            <span key={i} style={{ color: '#f50' }}>
              {search}
            </span>
          );
        } else if (temp[i].length) {
          dom.push(<span key={i}>{temp[i]}</span>);
        }
      }
      return dom;
    } else {
      return <span style={{ color: search === name ? '#f50' : null }}>{name}</span>;
    }
  };
  render() {
    const {
      searchValue,
      expandedKeys,
      autoExpandParent,
      selectTreeList,
      checkedKeys,
      selectedKeys,
      checkedKeySel,
      SearchShow,
      searchVal,
      filterData,
      CheckboxChecked,
      checkSelect,
      disabledNodes,
    } = this.state;
    const {
      SiteLibrary: { relateNodeTreeList },
    } = this.props;
    console.log(relateNodeTreeList, '左侧返回的数据');

    const loop = data =>
      data.map(item => {
        let tle = item.taskName;
        const title = this.renderName(tle, searchValue);

        if (item.children) {
          return (
            <TreeNode key={item.uid} title={title} disabled={item.flag}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.uid}
            title={title}
            disabled={item.flag}
            icon={<img src={iconImg} width="20" height="20" style={{ borderRadius: '20px' }} />}
          />
        );
      });
    return (
      <div>
        <div className={`${styles.treeLeft} ${styles.treeSearch}`}>
          <div className={styles.treeInput}>
            <Input
              className={styles.treeInputs}
              placeholder="搜索工程节点"
              onClick={this.handleSearchShow}
              value={searchVal}
              onChange={e => {
                this.handleSearch(e.target.value);
              }}
            />
            <Icon type="search" className={styles.treeInputSearch} />
            {SearchShow && (
              <Icon
                type="close-circle"
                className={styles.treeSearchClose}
                onClick={this.handleCloseModel}
              />
            )}
          </div>
          {SearchShow && (
            <div className={styles.leftMask}>
              {filterData.length > 0 && (
                <Checkbox checked={checkSelect} onChange={this.handleCheckedAll}>
                  {CheckboxChecked ? '取消全选' : '全选'}
                </Checkbox>
              )}
              {filterData &&
                filterData.map((item, index) => {
                  return (
                    <div key={index} className={styles.filterItem}>
                      <Checkbox
                        className={styles.checkWrap}
                        checked={checkedKeySel.includes(item.uid)}
                        disabled={disabledNodes.find(i => i.uid === item.uid)}
                        onChange={e => this.handleChoice(item, e)}
                      >
                        <div className={styles.checkboxs}>
                          <p>{item.taskName}</p>
                        </div>
                      </Checkbox>
                    </div>
                  );
                })}
            </div>
          )}
          {relateNodeTreeList && relateNodeTreeList.length > 0 ? (
            <Tree
              defaultExpandAll={true}
              autoExpandParent={autoExpandParent}
              checkedKeys={checkedKeySel}
              onCheck={this.onCheck.bind(this)}
              checkable
              showIcon
              style={{
                height: '350px',
                overflowY: 'auto',
                scrollbarTrackColor: '#f2f2f2',
                opacity: SearchShow ? 0 : 1,
              }}
            >
              {loop(relateNodeTreeList)}
            </Tree>
          ) : null}
        </div>
        <div className={styles.treeRight}>
          <p style={{ borderBottom: '1px solid #f2f2f2', paddingLeft: '20px' }}>
            <span>
              已选：
              {selectTreeList.length}
            </span>

            <Button
              style={{ marginLeft: '200px', cursor: 'pointer', border: 'none' }}
              onClick={() => {
                const that = this;
                (function confirm() {
                  Modal.confirm({
                    title: `确认要清空已选工程节点吗？`,
                    content: `清空后，可重新添加工程节点`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                      that.delRightTree();
                    },
                  });
                })();
              }}
            >
              清空
              <Icon type="delete" />
            </Button>
          </p>
          <List
            itemLayout="horizontal"
            dataSource={selectTreeList}
            renderItem={item => (
              <List.Item
                actions={[<Icon type="delete" onClick={this.delTreeUser.bind(this, item)} />]}
              >
                <p style={{ margin: 0 }} className="clearfix">
                  <span className={styles.contSpan}>
                    <span style={{ fontWeight: 550 }}>{item.taskName}</span>
                  </span>
                </p>
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }

  // 展开tree
  expandTree = (treedata, arr) => {
    const { disabledNodes } = this.state;
    treedata.forEach(item => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        this.expandTree(item.children, arr);
        const matchedList = [];
        item.children.map(e => {
          const every = disabledNodes?.find(i => i.uid === e.uid);
          if (every) {
            matchedList.push(every);
          }
        });
        if (matchedList.length === item.children.length) {
          item.flag = true;
        }
        console.log();
      } else {
        console.log('disabledNodes', disabledNodes);
        if (disabledNodes?.find(e => e.uid === item.uid)) {
          item.flag = true;
        }
        arr.push(item);
      }
    });
    return arr;
  };
  // 搜索框显示
  handleSearchShow = () => {
    this.setState({ SearchShow: true });
  };
  // 搜索框关闭
  handleCloseModel = () => {
    this.setState({
      filterData: [], //过滤数据
      searchVal: '',
      SearchShow: false,
      CheckboxChecked: false, //是否全选
      checkSelect: false,
    });
  };
  // 搜索
  handleSearch = v => {
    const { expandTrees } = this.state;
    this.setState({ searchVal: v }, () => {
      const data = this.fuzzyQuery(v, expandTrees);
      this.setState({
        filterData: data,
        CheckboxChecked: false,
        checkSelect: false,
      });
    });
  };
  // 模糊查询
  fuzzyQuery = (v, data) => {
    let filterArr = [];
    if (v) {
      const filterData = (v, data) => {
        data.forEach(item => {
          if (item.taskName?.indexOf(v) !== -1) {
            filterArr.push(item);
          }
        });
      };
      filterData(v, data);
    } else {
      filterArr = [];
    }
    return filterArr;
  };
  // 查询全选
  handleCheckedAll = e => {
    const { checkedKeySel, selectTreeList, filterData, disabledNodes } = this.state;
    // // 左侧添加数据
    // // 右侧添加数据
    if (e.target.checked) {
      // 去重
      const data = filterData.filter(
        item =>
          !checkedKeySel.includes(item.uid) && !disabledNodes.find(every => every.uid === item.uid)
      );
      console.log(data);
      const datauid = data.map(item => item.uid);
      this.setState(
        {
          checkedKeySel: [...checkedKeySel, ...datauid],
          selectTreeList: [...selectTreeList, ...data],
          checkSelect: true,
        },
        () => {
          this.onCheck([...checkedKeySel, ...datauid], null);
        }
      );
    } else {
      // 移除操作
    }
  };
  // 查询选择
  handleChoice = (item, e) => {
    const { checkedKeySel, selectTreeList, filterData } = this.state;
    // 左侧添加数据
    // 右侧添加数据
    if (checkedKeySel.includes(item.uid)) {
      message.info('请勿重复选择');
    } else {
      this.setState(
        {
          checkedKeySel: [...checkedKeySel, item.uid],
          selectTreeList: [...selectTreeList, { ...item, checked: null }],
          filterData,
        },
        () => {
          this.onCheck([...checkedKeySel, item.uid], null);
        }
      );
    }
  };
}

export default SearchTree;
