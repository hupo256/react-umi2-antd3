import { Modal, List, Avatar, Icon, message } from 'antd';
import SearchTree from './SearchTree';
import { connect } from 'dva';

@connect(({ userManagement, loading, login }) => ({
  userManagement, //
  login,
  Loading: loading.effects['userManagement/getRoleUserModel'],
}))
class relateNodeModal extends React.Component {
  state = {
    targetKeys: [],
    ModalText: 'Content of the modal',
  };
  handleOk = () => {
    this.handleSubmitTree();

    // this.setState({
    //   ModalText: 'The modal will be closed after two seconds',
    //   confirmLoading: true,
    // });

    // setTimeout(() => {
    //   this.setState({
    //     visible: true,
    //     confirmLoading: false,
    //   });
    // }, 2000);
  };

  handleSubmitTree() {
    const { dispatch, curSysCode, activeLeft, callBackCancel } = this.props;
    const treeSel =
      sessionStorage.getItem('selectRightTree') &&
      JSON.parse(sessionStorage.getItem('selectRightTree'));
    console.log(treeSel, 'treeSel');
    if (treeSel && treeSel.length > 0) {
      dispatch({
        type: 'userManagement/addUserRoleTreeModel',
        payload: {
          roleCode: activeLeft,
          systemCode: curSysCode,
          userCodes: [...new Set(treeSel)],
        },
      }).then((res) => {
        if (res && res.code === 200) {
          message.success('用户添加成功');
          sessionStorage.setItem('selectRightTree', []);
          callBackCancel(false);
        } else {
          // sessionStorage.setItem('selectRightTree', []);
          // message.error(res.message);
          // callBackCancel(false);
        }
      });
    } else {
      message.error('请先添加用户,再点确定！');
    }
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    const { handleCancel } = this.props;
    if (sessionStorage.getItem('selectRightTree')) {
      sessionStorage.removeItem('selectRightTree');
    }
    handleCancel(false);
  };

  render() {
    const {confirmLoading, ModalText, targetKeys } = this.state;
    const {
      visible,
      curSysCode,
      activeLeft,
      projectUid,
      personnelSelectedRows,
      login: { queryOpenSystem },
    } = this.props;
    return (
      <div>
        <Modal
          title="关联工程节点"
          visible={visible}
          onOk={this.handleOk}
          maskClosable={false}
          confirmLoading={confirmLoading}
          width={830}
          onCancel={this.handleCancel}
        >
          <section style={{ height: '400px' }}>
            {<SearchTree curSysCode={curSysCode} activeLeft={activeLeft} projectUid={projectUid}/>}
          </section>
        </Modal>
      </div>
    );
  }
}

export default relateNodeModal;
