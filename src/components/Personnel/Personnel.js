import React, { Component } from 'react';
import { Button, Modal, Tree, message, Spin, Checkbox, Icon } from 'antd';
import styles from './Personnel.less';
import { connect } from 'dva';
import { arrReduce } from '@/utils/utils';
const { TreeNode } = Tree;
@connect(({ Task }) => ({
  Task,
}))
class PersonnelModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: true,
      targetKeys: [], //右侧已选择
      treeDataRight: [], //右侧数据
      selectTreeDataRight: [], //右侧已选数据
      treeData: [], //树结构数据
      checkedKeys: [], //左侧选择数据
      len: 0, //数据长度
      CheckedRight: false,
      CheckedLeft: false,
    };
  }
  componentDidMount() {
    const { dispatch, targetKeys } = this.props;
    this.setState({
      targetKeys,
    });
    const personnelTreeData = sessionStorage.personnelTreeData;

    // session中存在组织架构数据不用再次请求
    if (personnelTreeData) {
      const personnelTreeDataLength = sessionStorage.personnelTreeDataLength;
      this.setState(
        {
          confirmLoading: false,
          treeData: JSON.parse(personnelTreeData),
          len: personnelTreeDataLength,
        },
        () => {
          // 执行右移操作回显右侧数据
          this.handleToRight();
        }
      );
    } else {
      dispatch({ type: 'Task/ueryDeptAndUser', payload: {} }).then(res => {
        if (res.code === 200) {
          let len = 0;
          let invalidData = [];
          const maps = data => {
            // 初始化数据
            return data.map(item => {
              item.title = item.name;
              item.key = item.zid + '';
              item.code = item.zid + '';
              item.type === 'user' && (len = len + 1);
              // 筛选无效组织
              item.type === 'dept' && !item.children && invalidData.push(item.zid);
              if (item.children && item.children.length > 0) {
                item.children = maps(item.children);
              } else {
                item.children = [];
              }
              return item;
            });
          };
          const treeData = maps(res.data);
          // 过滤无效组织架构（组织下无人员）
          function filter(data, id) {
            var newData = data.filter(x => !id.includes(x.zid));
            newData.forEach(x => x.children && (x.children = filter(x.children, id)));
            return newData;
          }
          this.setState(
            {
              confirmLoading: false,
              treeData: filter(treeData, invalidData),
              len,
            },
            () => {
              const { treeData, len } = this.state;
              sessionStorage.setItem('personnelTreeData', JSON.stringify(treeData));
              sessionStorage.setItem('personnelTreeDataLength', len);
              // 执行右移操作回显右侧数据
              this.handleToRight();
            }
          );
        } else {
          this.setState({
            confirmLoading: false,
          });
          message.error(res.message, 3);
        }
      });
    }
  }
  render() {
    const {
      confirmLoading,
      targetKeys,
      treeData,
      checkedKeys,
      treeDataRight,
      selectTreeDataRight,
      len,
      CheckedLeft,
      CheckedRight,
    } = this.state;
    return (
      <Modal
        title="人员选择"
        width={800}
        visible={this.props.visible}
        className={styles.PersonnelModel}
        onOk={() => {
          this.props.handleOk(targetKeys, treeData);
        }}
        onCancel={() => {
          this.setState(
            {
              treeData: [],
              targetKeys: [],
            },
            () => {
              this.props.handleCancel(targetKeys);
            }
          );
        }}
      >
        <Spin size="large" tip="Loading..." spinning={confirmLoading}>
          <div className={styles.personnelWrop}>
            <div className={styles.treeLeft}>
              <p className={styles.treeBottom}>
                <Checkbox
                  checked={CheckedLeft}
                  disabled={!len > 0}
                  onChange={this.handleCheckedLeft}
                  style={{ marginRight: 10 }}
                />
                {checkedKeys.length}
                <span> / </span>
                {len} 人
              </p>
              {this.props.visible && (
                <Tree
                  showIcon
                  checkable
                  checkedKeys={checkedKeys}
                  onCheck={this.onCheck}
                  onSelect={(
                    _,
                    {
                      node: {
                        props: { eventKey },
                      },
                    }
                  ) => {
                    this.handleOnSelect(_, eventKey);
                  }}
                >
                  {generateTree(treeData, targetKeys)}
                </Tree>
              )}
            </div>
            <div className={styles.treeBtn}>
              <Button
                disabled={!checkedKeys.length > 0}
                type="primary"
                icon="right"
                onClick={this.handleToRight}
                style={{ marginBottom: 10 }}
              />
              <Button
                type="primary"
                disabled={!selectTreeDataRight.length > 0}
                onClick={this.handleToLeft}
                icon="left"
              />
            </div>
            <div className={styles.treeRight}>
              <p className={styles.treeBottom}>
                <Checkbox
                  checked={CheckedRight}
                  disabled={!targetKeys.length > 0}
                  onChange={this.handleCheckedRight}
                  style={{ marginRight: 10 }}
                />
                {selectTreeDataRight.length}
                <span> / </span>
                {targetKeys.length} 人
              </p>
              <ul className={styles.treeUl}>
                {treeDataRight.map(item => {
                  return (
                    <li key={item.id}>
                      <Checkbox
                        checked={item.checked}
                        onChange={() => {
                          this.handleItemCheck(item.code, treeDataRight);
                        }}
                      >
                        {item.name}
                      </Checkbox>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
  onChange = targetKeys => {
    this.setState({ targetKeys });
  };

  // 左侧复选框选择
  onCheck = checkedKeys => {
    const { treeData } = this.state;
    let newData = [];
    const filterData = treeData => {
      treeData.forEach(item => {
        if (checkedKeys.includes(item.key)) {
          if (item.type === 'user') {
            newData.push(item.key);
          } else {
            filterData(item.children);
          }
        } else {
          if (item.children.length > 0) {
            filterData(item.children);
          }
        }
      });
      return newData;
    };
    const checkedData = filterData(treeData);
    this.setState({ checkedKeys: checkedData });
  };
  // 左侧文本选择
  handleOnSelect = (selectedKeys, key) => {
    const { checkedKeys, treeData } = this.state;
    // 查找当前选择项子集
    const addData = (arr, data) => {
      data.forEach(item => {
        arr.push(item.key);
        item.children.length > 0 && filterData(arr, item.children);
      });
    };
    // 查找当前选择项
    const filterData = treeData => {
      let selectedKeysArr = [];
      treeData.forEach(item => {
        if ([key].includes(item.key)) {
          selectedKeysArr.push(item.key);
          addData(selectedKeysArr, item.children);
        }
      });
      return selectedKeysArr;
    };
    const newKeys = filterData(treeData);
    if (selectedKeys.length > 0) {
      this.onCheck([...checkedKeys, ...newKeys]);
    } else {
      // 取消选择，移除当前所选项
      const data = checkedKeys.filter(item => !newKeys.includes(item));
      this.onCheck([...data]);
    }
  };

  //右移
  handleToRight = () => {
    const { targetKeys, checkedKeys, treeData } = this.state;
    let checks = [...new Set([...targetKeys, ...checkedKeys])];
    const data = arrReduce(treeDataRight(checks, treeData), 'code');
    this.setState({ treeDataRight: [] }, () => {
      this.setState(
        {
          targetKeys: [...checks],
          treeDataRight: data,
          checkedKeys: [],
          CheckedLeft: false,
        },
        () => {
          datarights = [];
        }
      );
    });
  };
  // 左移
  handleToLeft = () => {
    // 右侧删除选中项
    const { targetKeys, treeDataRight, selectTreeDataRight } = this.state;
    const newtargetKey = targetKeys.filter(item => !selectTreeDataRight.includes(item));
    const newtreeDataRight = treeDataRight.filter(item => !selectTreeDataRight.includes(item.code));
    this.setState({
      targetKeys: newtargetKey,
      treeDataRight: newtreeDataRight,
      selectTreeDataRight: [],
      CheckedRight: newtreeDataRight.length > 0,
    });
  };
  // 右侧选中
  handleItemCheck = (code, data) => {
    const treeDataRight = data.map(item => {
      if (code === item.code) {
        item.checked = !item.checked;
      }
      return item;
    });
    const selectTreeDataRight = data.filter(item => item.checked).map(item => {
      return item.code;
    });
    this.setState({ treeDataRight, selectTreeDataRight });
  };
  // 右侧全选取消全选
  handleCheckedRight = e => {
    const checked = e.target.checked;
    this.setState({ CheckedRight: checked });
    let { treeDataRight } = this.state;
    treeDataRight = treeDataRight.map(item => {
      item.checked = checked;
      return item;
    });
    const selectTreeDataRight = treeDataRight.filter(item => item.checked).map(item => {
      return item.code;
    });
    this.setState({ treeDataRight, selectTreeDataRight });
  };
  // 左侧全选取消全选
  handleCheckedLeft = e => {
    const checked = e.target.checked;
    this.setState({ CheckedLeft: checked });
    const { treeData, targetKeys } = this.state;
    if (checked) {
      let checkedKeys = [];
      const maps = treeData => {
        treeData.forEach(item => {
          if (item.type === 'dept') {
            maps(item.children);
          } else {
            checkedKeys.push(item.code);
          }
        });
        return checkedKeys;
      };
      // 左侧全选数据去重
      const checkedAll = maps(treeData).filter(key => !targetKeys.includes(key));
      this.setState({ checkedKeys: checkedAll, CheckedLeft: checkedAll.length > 0 });
    } else {
      this.setState({ checkedKeys: [] });
    }
  };
}

let datarights = [];
// 过滤重复数据
const treeDataRight = (targetKeys, treeData) => {
  treeData.forEach(item => {
    if (targetKeys.includes(item.key)) {
      if (item.children.length > 0) {
        treeDataRight(targetKeys, item.children);
      } else {
        item.checked = false;
        datarights.push(item);
      }
    } else {
      if (item.children.length > 0) {
        treeDataRight(targetKeys, item.children);
      }
    }
  });
  return datarights;
};
// 渲染树结构
const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(item => (
    <TreeNode
      icon={
        item.type === 'dept' && <Icon type="folder" style={{ color: '#aee4f9' }} theme="filled" />
      }
      title={item.title}
      disabled={checkedKeys.includes(item.key)}
      key={item.key}
      dataRef={item}
    >
      {generateTree(item.children, checkedKeys)}
    </TreeNode>
  ));
};

export default PersonnelModel;
