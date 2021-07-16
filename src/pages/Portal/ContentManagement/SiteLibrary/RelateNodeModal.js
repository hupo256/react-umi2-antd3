import { Modal, List, Avatar, Icon, message } from 'antd';
import SearchTree from './SearchTree';
import { connect } from 'dva';

@connect(({ SiteLibrary, loading, login }) => ({
  SiteLibrary, //
  login,
  Loading: loading.effects['userManagement/getRoleUserModel'],
}))
class relateNodeModal extends React.Component {
  state = {
    targetKeys: [],
    ModalText: 'Content of the modal',
  };
  handleOk = () => {
    const {
      SiteLibrary: { selectedTreeNodes, engineeringMapData },
      dispatch,
      dicCode,
      handleOk,
    } = this.props;
    dispatch({
      type: 'SiteLibrary/setEngineeringMapModel',
      payload: {
        selectedTreeNodes,
        dicCode,
        engineeringMapData,
      },
    }).then(r => {
      handleOk(r);
    });
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    const { handleCancel, dispatch } = this.props;
    if (sessionStorage.getItem('selectRightTree')) {
      sessionStorage.removeItem('selectRightTree');
    }
    dispatch({
      type: 'SiteLibrary/setSelectedTreeNodesModel',
      payload: { dataList: [] },
    });
    handleCancel(false);
  };

  render() {
    const { confirmLoading } = this.state;
    const {
      visible,
      curSysCode,
      activeLeft,
      projectUid,
      dicCode,
      selectedNodes,
      SiteLibrary: { selectedTreeNodes, engineeringMapData },
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
            {
              <SearchTree
                dicCode={dicCode}
                selectedNodes={selectedNodes}
                curSysCode={curSysCode}
                activeLeft={activeLeft}
                projectUid={projectUid}
              />
            }
          </section>
        </Modal>
      </div>
    );
  }
}

export default relateNodeModal;
