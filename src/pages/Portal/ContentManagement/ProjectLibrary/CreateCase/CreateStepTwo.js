/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-06-07 18:55:57
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Modal, Button, Input, Pagination, Spin, Radio } from 'antd';
import { getQueryUrlVal } from '@/utils/utils';
import img from '@/assets/bgimg.png';
import img1 from '@/assets/bannerleft.png';
import img2 from '@/assets/bannerright.png';
import img3 from '@/assets/tj.png';
import styles from '../index.less';
const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
@connect(({ ProjectLibrary, loading }) => ({
  ProjectLibrary,
  loading: loading.effects['ProjectLibrary/pageListModels'],
}))
class CreateStepTwo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibles: false,
      searchWord: '',
      dataPre: '',
      terminalType: 0,
    };
  }

  componentDidMount() {}
  render() {
    const {
      ProjectLibrary: { specialUid, siteLists },
      loading,
    } = this.props;
    const activeKey = getQueryUrlVal('uid') || specialUid;
    const { visible, visibles, dataPre, terminalType } = this.state;
    let arr =
      siteLists &&
      siteLists.list &&
      siteLists.list.map((item, index) => {
        return (
          <div className={styles.tingw} key={item.specialUid}>
            <img
              src={
                item.specialCapture ||
                'https://test.img.inbase.in-deco.com/crm_saas/dev/20210409/7178b96d368c444a93c444a10e438a2a/imgAefault.png'
              }
              className={styles.timgv}
            />
            <div className={styles.tity}>{item.specialTitle}</div>
            <div className={styles.timbg} />
            <div className={styles.tibcont}>
              <img
                src={
                  item.specialQr ||
                  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210409/7178b96d368c444a93c444a10e438a2a/imgAefault.png'
                }
                className={styles.qr}
              />
              <div>
                <Button
                  type="primary"
                  className={styles.abtnr}
                  onClick={() => {
                    this.handleModels(item);
                  }}
                >
                  预览
                </Button>
                <Button
                  type="primary"
                  className={styles.abtng}
                  onClick={() => {
                    localStorage.setItem('terminalType', 0);
                    router.push(
                      `/portal/contentmanagement/ProjectLibrary/ConfigurationTopic?uid=${activeKey}&copy=${
                        item.specialUid
                      }`
                    );
                  }}
                >
                  使用
                </Button>
              </div>
            </div>
          </div>
        );
      });
    return (
      <div>
        <div className={styles.twrap}>
          <div className={styles.tconet}>
            <div className="clearfix">
              <div className={styles.tleft} style={{ marginRight: 96 }}>
                <div>
                  <img src={img1} className={styles.timg} />
                </div>
                <div className={styles.titcont}>
                  公有专题库
                  <img src={img3} className={styles.timgs} />
                </div>
                <div className={styles.tpo}>海量素材库，直接使用</div>
                <Button
                  type="primary"
                  style={{ width: 264, height: 48, fontSize: 18 }}
                  onClick={() => {
                    this.handleModel();
                  }}
                >
                  直接使用
                </Button>
              </div>
              <div className={styles.tleft}>
                <div>
                  <img src={img2} className={styles.timg} />
                </div>
                <div className={styles.titcont}>自定义专题库</div>
                <div className={styles.tpo}>喜欢自己配置，高度自定</div>
                <Button
                  type="primary"
                  style={{
                    width: 264,
                    height: 48,
                    background: '#454545',
                    borderColor: '#454545',
                    fontSize: 18,
                  }}
                  onClick={() => {
                    localStorage.setItem('terminalType', 0);
                    router.push(
                      `/portal/contentmanagement/ProjectLibrary/ConfigurationTopic?&uid=${activeKey}`
                    );
                  }}
                >
                  手动配置
                </Button>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              //router.push(`/portal/contentmanagement/ProjectLibrary/edit?uid=${specialUid}`);
              this.props.handleOk();
            }}
          >
            上一步
          </Button>
        </div>
        {visible ? (
          <Modal
            title={'公有专题库'}
            visible={visible}
            maskClosable={false}
            footer={null}
            width={900}
            onCancel={() => {
              this.handleModelCancel();
            }}
          >
            <Spin spinning={loading}>
              <div className={styles.carwrap}>
                <Search
                  onSearch={() => this.thSearch()}
                  placeholder={'请输入专题名称进行搜索'}
                  className={styles.sers}
                  onChange={e =>
                    this.setState({ searchWord: e.target.value }, () => {
                      this.thSearch();
                    })
                  }
                  onPressEnter={() => {
                    this.thSearch();
                  }}
                />
                <div className={styles.timw}>
                  <div className="clearfix" style={{ width: 900, height: 496 }}>
                    {arr}
                  </div>
                </div>
                {siteLists && siteLists.recordTotal > 10 ? (
                  <div className={styles.pagWrap}>
                    <Pagination
                      total={siteLists && siteLists.recordTotal}
                      current={siteLists && siteLists.curPage}
                      onChange={this.handleTableChange}
                      pageSize={10}
                    />
                  </div>
                ) : (
                  false
                )}
              </div>
            </Spin>
          </Modal>
        ) : null}
        {visibles ? (
          <Modal
            title={'预览'}
            visible={visibles}
            maskClosable={false}
            footer={null}
            width={848}
            onCancel={() => {
              this.handleModelCancels();
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <RadioGroup value={terminalType} onChange={this.handleSizeChange}>
                <RadioButton value={0} style={{ width: 80 }}>
                  小程序
                </RadioButton>
                <RadioButton value={1} style={{ width: 80 }}>
                  网站
                </RadioButton>
              </RadioGroup>
            </div>
            {terminalType === 0 ? (
              <div className={styles.iboder}>
                <div className="clearfix">
                  <div className={styles.iframe}>
                    <iframe
                      src={dataPre && dataPre.specialUrl}
                      width="375"
                      height="600"
                      frameborder="no"
                      border="0"
                    />
                  </div>
                  <div className={styles.modeqr}>
                    <img src={dataPre && dataPre.specialQr} className={styles.qrs} />
                    <p>请使用微信扫一扫查看</p>
                    <Button
                      type="primary"
                      style={{
                        width: 150,
                        height: 48,
                        lineHeight: '48px',
                        marginTop: 18,
                        fontSize: 18,
                      }}
                      onClick={() => {
                        router.push(
                          `/portal/contentmanagement/ProjectLibrary/ConfigurationTopic?uid=${activeKey}&copy=${dataPre &&
                            dataPre.specialUid}`
                        );
                      }}
                    >
                      使用
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.iboder}>
                <div className="clearfix">
                  <div className={styles.iframePcv}>
                    <iframe
                      src={dataPre && dataPre.specialUrlPc}
                      frameborder="no"
                      border="0"
                      width="700"
                      height="400"
                    />
                  </div>
                  <div className={styles.mod}>
                    <Button
                      type="primary"
                      style={{
                        width: 150,
                        height: 48,
                        lineHeight: '48px',
                        marginTop: 18,
                        fontSize: 18,
                      }}
                      onClick={() => {
                        localStorage.setItem('terminalType', terminalType);
                        router.push(
                          `/portal/contentmanagement/ProjectLibrary/ConfigurationTopic?uid=${activeKey}&copy=${dataPre &&
                            dataPre.specialUid}`
                        );
                      }}
                    >
                      使用
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        ) : null}
      </div>
    );
  }
  handleModel() {
    this.setState({
      visible: true,
    });
    this.getList();
  }
  handleModels(item) {
    this.setState({
      visibles: true,
      dataPre: item,
    });
  }
  handleModelCancel() {
    this.setState({
      visible: false,
    });
  }
  handleModelCancels() {
    this.setState({
      visibles: false,
    });
  }
  thSearch() {
    const { dispatch } = this.props;
    const { searchWord } = this.state;
    let searchText = (searchWord && searchWord.substring(0, 30)) || '';
    dispatch({
      type: 'ProjectLibrary/pageListModels',
      payload: { pageNum: 1, pageSize: 10, searchText, specialStatus: 1 },
    });
  }
  handleTableChange = pagination => {
    const { dispatch } = this.props;
    const { searchWord } = this.state;
    let searchText = (searchWord && searchWord.substring(0, 30)) || '';
    dispatch({
      type: 'ProjectLibrary/pageListModels',
      payload: { pageNum: pagination, pageSize: 10, specialStatus: 1, searchText },
    });
  };
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ProjectLibrary/pageListModels',
      payload: { pageNum: 1, pageSize: 10, specialStatus: 1 },
    });
  };
  handleSizeChange = e => {
    this.setState({
      terminalType: e.target.value,
    });
  };
}

export default CreateStepTwo;
