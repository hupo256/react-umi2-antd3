/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-29 19:01:02
 * 专题库
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import _ from 'lodash';
import { Button, Icon, message, Menu } from 'antd';
import { DraggableArea } from 'react-draggable-tags';
import { getQueryUrlVal } from '@/utils/utils';
import { getauth } from '@/utils/authority';
import ImgComponent from './TopicComponent/ImgComponent';
import FootComponent from './TopicComponent/FootComponent';
import ViewFormComponent from './TopicComponent/ViewFormComponent';
import styles from './index.less';
import logo from '../../../../assets/whiteLog.png';
import logoImg from '../../../../assets/logoImg.png';
const { SubMenu } = Menu;
let pointX, pointY;
@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
class ProjectLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      istrue: 0,
      compentList: [],
      tags: [],
      title: '',
    };
    /*定义两个值用来存放鼠标按下的地方距离元素上侧和左侧边界的值*/
    this.disX = 0;
    this.disY = 0;
  }

  componentDidMount() {
    const activeKey = getQueryUrlVal('uid');
    const { dispatch } = this.props;
    dispatch({
      type: 'ProjectLibrary/getCollocationModel',
      payload: {
        specialUid: activeKey,
      },
    }).then(res => {
      if (res && res.code === 200) {
        res.data &&
          res.data.elementList &&
          res.data.elementList.map((item, index) => {
            item.isEdit = true;
          });
        dispatch({
          type: 'ProjectLibrary/saveDataModel',
          payload: {
            key: 'compentList',
            value: res.data.elementList || [],
          },
        });
        this.setState({
          title: res.data.specialTitle,
        });
      }
    });
    dispatch({
      type: 'ProjectLibrary/elementTreeModel',
      payload: {
        businessType: 1,
        terminalType: 1,
      },
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({
          istrue: 1,
        });
      }
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [],
      },
    });
  }
  render() {
    const {
      ProjectLibrary: { elementTree, compentList },
    } = this.props;
    const { collapsed, istrue, title } = this.state;
    const auth = JSON.parse(localStorage.getItem('auth'));
    const bigLogo = (auth && auth.companyLogoBig) || logo;
    const smallLogo = (auth && auth.companyLogoSmall) || logoImg;
    let newLog = !collapsed ? bigLogo : smallLogo;
    let open = [];
    let companyPhone = '';
    let arr =
      elementTree &&
      elementTree.map((item, index) => {
        open.push(`${index}`);
        companyPhone = item.companyPhone;
        let childern =
          item.elementList &&
          item.elementList.map((ite, idx) => {
            return (
              <div
                key={ite.elementUid}
                className={styles.menuWrap}
                onClick={() => {
                  this.addCompent(ite);
                }}
              >
                <div className={styles.icowrap}>
                  <img src={ite.elementIcon} style={{ width: 38, height: 38 }} />
                </div>
                <div className={styles.icotext}>{ite.elementName}</div>
              </div>
            );
          });
        return (
          <SubMenu
            key={index}
            title={
              <span>
                <span>{item.elementGroup}</span>
              </span>
            }
          >
            <div className={styles.iyt}>
              <div className="clearfix">{childern}</div>
            </div>
          </SubMenu>
        );
      });
    let tags = [];
    let foot = '';
    let ViewForm = [];
    compentList &&
      compentList.map((item, index) => {
        switch (item.elementType) {
          case 'IMG':
            tags.push({
              id: index,
              content: (
                <ImgComponent
                  data={item}
                  index={index}
                  handleCheck={data => this.handleCheck(data)}
                  handleImg={(data, index) => this.handleImg(data, index)}
                  handleDeletePic={data => this.handleDeletePic(data)}
                />
              ),
            });
            break;
          case 'FORM':
            ViewForm.push({ data: item, idx: index });
            break;
          case 'MODAL':
            foot = (
              <FootComponent
                data={item}
                index={index}
                handleCheck={data => this.handleCheck(data)}
                companyPhone={companyPhone}
                handleColor={(data, index, code) => this.handleColor(data, index, code)}
                handleDeleteFoot={data => this.handleDeletePic(data)}
              />
            );
            break;
        }
      });
    let vie = ViewForm.map((item, index) => {
      return (
        <ViewFormComponent
          key={index}
          data={item.data}
          index={item.idx}
          handleCheck={data => this.handleCheck(data)}
          handleColor={(data, index, code) => this.handleColor(data, index, code)}
          fnDown={(e, indx) => {
            this.fnDown(e, indx);
          }}
          handleDeletePic={data => this.handleDeletePic(data)}
        />
      );
    });
    const permissionsBtn = getauth();
    return (
      <div className={styles.topicWrap}>
        <div style={{ width: 256 }} className={styles.logoWrap}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={newLog} alt="logo" style={{ width: 171, height: 38 }} />
              <h1 style={{ display: 'none' }}>营销站</h1>
            </Link>
          </div>
          <div className={styles.meg}>
            {istrue === 1 ? (
              <Menu
                defaultOpenKeys={open}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
              >
                {arr}
              </Menu>
            ) : (
              ''
            )}
          </div>
          <div className={styles.fixedWrap}>
            {permissionsBtn.permissions.includes('MU90000001000400010001') ? (
              <Button
                type="primary"
                style={{ width: '100%', height: 38 }}
                onClick={() => {
                  this.addConfiguration();
                }}
              >
                发布
              </Button>
            ) : null}
            <div className="clearfix">
              <span
                className={styles.logout}
                onClick={() => {
                  this.logoutSave();
                }}
              >
                <Icon type="logout" />
                退出
              </span>
            </div>
          </div>
        </div>
        <div className={styles.confcont}>
          <div className={styles.phone}>
            <div className={styles.phoneHead}>{title}</div>
            <div className={styles.phoneCont}>
              <div
                className={styles.phoneBox}
                ref="submitf"
                onMouseMove={() => {
                  this.get_canvas(event);
                }}
              >
                <DraggableArea
                  isList
                  tags={tags}
                  render={({ tag, index }) => <div className={styles.tag}>{tag.content}</div>}
                  onChange={index => console.log(index)}
                />
                <div className={styles.vieT}>{vie}</div>
                {foot}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  addCompent(ite) {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    let ishow = 0;
    let left = 0;
    let top = 0;
    compentList &&
      compentList.map((item, index) => {
        if (item.elementType === 'MODAL' && ite.elementType === 'MODAL') {
          ishow = 1;
        }
        if (item.elementType === 'FORM') {
          if (item.elementStyle) {
            let aStyle = JSON.parse(item.elementStyle);
            left = aStyle.left;
            top = aStyle.top + 220;
          }
        }
      });
    if (ishow === 0) {
      ite.isEdit = false;
      ite.elementStyle = JSON.stringify({ top: top, left: left });
      if (ite.elementType === 'FORM') {
        ite.elementButtonColor = '#fe6a30';
        ite.elementButtonTextColor = '#fff';
        ite.elementButtonText = '立即抢占';
      } else if (ite.elementType === 'MODAL') {
        ite.elementButtonColor = '#fe6a30';
        ite.elementButtonTextColor = '#fff';
        ite.elementButtonText = '立即预约';
      }
      compentList.push(_.cloneDeep(ite));
    }
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
  handleImg(data, index) {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    compentList[index].paramList[0].defaultValue = data[0].addr;
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
  handleDeletePic(index) {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    compentList.splice(index, 1);
    compentList.map((item, idx) => {
      compentList[idx].checked = 0;
    });
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
  handleCheck(index) {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    compentList.map((item, idx) => {
      if (index === idx) {
        compentList[idx].checked = 1;
      } else {
        compentList[idx].checked = 0;
      }
    });
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
  /*定义鼠标下落事件*/
  fnDown(e, index) {
    /*事件兼容*/
    if (e.preventDefault) {
      e.preventDefault();
    }
    let event = e || window.event;

    /*事件源对象兼容*/
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    let aStyle = JSON.parse(compentList[index].elementStyle);

    this.disX = event.clientX - aStyle.left;
    this.disY = event.clientY - aStyle.top;
    /*定义鼠标移动事件*/
    document.onmousemove = e => this.fnMove(e, index);
    /*定义鼠标抬起事件*/
    document.onmouseup = this.fnUp.bind(this);
  }
  /*定义鼠标移动事件*/
  fnMove(e, indx) {
    /*事件兼容*/
    let event = e || window.event;
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    let height = this.refs.submitf.scrollHeight;
    let aStyle = JSON.parse(compentList[indx].elementStyle);

    if (event.clientY - this.disY < 0) {
      aStyle = 0;
    } else if (event.clientY - this.disY > height) {
      aStyle.top = height;
    } else {
      aStyle.top = event.clientY - this.disY;
    }
    compentList[indx].elementStyle = JSON.stringify({ top: aStyle.top, left: aStyle.left });
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
  fnUp() {
    document.onmousemove = null;
    document.onmuseup = null;
  }
  get_canvas(event) {
    let initialNode = this.refs.submitf;
    const clickX = event.clientX - initialNode.getBoundingClientRect().left;
    const clickY = event.clientY - initialNode.getBoundingClientRect().top;
    pointX = Math.round(clickX);
    pointY = Math.round(clickY);
  }
  handleColor(data, index, code) {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    if (code === 1) {
      compentList[index].elementButtonColor = data;
    } else {
      compentList[index].elementButtonTextColor = data;
    }
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
  }
  addConfiguration() {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    if (compentList.length > 0) {
      let isTrue = 0;
      let isTrueM = 0;
      let isTrueF = 0;
      let formUid = '';
      compentList.map((item, index) => {
        if (item.elementType === 'IMG') {
          isTrue = 1;
        }

        if (item.elementType === 'MODAL') {
          if (item.formUid) {
            isTrueF = 1;
            formUid = item.formUid;
          }
          isTrueM = 1;
        }
      });
      if (isTrue === 0) {
        return message.error('请添加图片广告组件');
      }
      if (isTrueM === 0) {
        return message.error('请添加常驻底部组件');
      }
      if (isTrueF === 0) {
        return message.error('请绑定浮窗表单');
      }
      if (isTrue === 1 && isTrueM === 1 && isTrueF === 1) {
        dispatch({
          type: 'ProjectLibrary/formBindModel',
          payload: {
            directType: 4,
            directUid: getQueryUrlVal('uid'),
            formUid: formUid,
          },
        });
        dispatch({
          type: 'ProjectLibrary/specialCollocateModel',
          payload: {
            elementList: compentList,
            specialUid: getQueryUrlVal('uid'),
            saveType: 1,
          },
        }).then(res => {
          if (res && res.code === 200) {
            dispatch({
              type: 'ProjectLibrary/saveDataModel',
              payload: {
                key: 'uspecialUrlData',
                value: res.data,
              },
            });
            dispatch({
              type: 'ProjectLibrary/saveDataModel',
              payload: {
                key: 'status',
                value: 2,
              },
            });
            router.push('/portal/contentmanagement/ProjectLibrary/add');
          }
        });
      }
    } else {
      message.error('请添加组件');
    }
  }
  logoutSave() {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    let formUid = '';
    compentList.map((item, index) => {
      if (item.elementType === 'MODAL') {
        if (item.formUid) {
          formUid = item.formUid;
        }
      }
    });
    if (formUid && formUid !== '') {
      dispatch({
        type: 'ProjectLibrary/formBindModel',
        payload: {
          directType: 4,
          directUid: getQueryUrlVal('uid'),
          formUid: formUid,
        },
      });
    }
    dispatch({
      type: 'ProjectLibrary/specialCollocateModel',
      payload: {
        elementList: compentList,
        specialUid: getQueryUrlVal('uid'),
        saveType: 2,
      },
    }).then(res => {
      if (res && res.code === 200) {
        message.success('保存成功');
        router.push('/portal/contentmanagement/ProjectLibrary');
      }
    });
  }
}

export default ProjectLibrary;
