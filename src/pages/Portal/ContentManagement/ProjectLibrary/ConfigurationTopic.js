/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-04-26 12:24:03
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
import TextComponent from './TopicComponent/TextComponent';
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
      Left: -160,
    };
    /*定义两个值用来存放鼠标按下的地方距离元素上侧和左侧边界的值*/
    this.disX = 0;
    this.disY = 0;
  }

  componentDidMount() {
    let activeKey;
    const { dispatch } = this.props;
    if (getQueryUrlVal('copy')) {
      activeKey = getQueryUrlVal('copy');
      dispatch({
        type: 'ProjectLibrary/getCollocationModels',
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
    } else {
      activeKey = getQueryUrlVal('uid');
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
    }

    dispatch({
      type: 'login/setAuthModel',
      payload: {},
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
    const { collapsed, istrue, title, Left } = this.state;
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
                  <img src={ite.elementIcon} style={{ width: 20, height: 20 }} />
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
    let text = [];
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
          // case 'TEXT':
          //   tags.push({
          //     id: index,
          //     content: (
          //       <TextComponent
          //         data={item}
          //         index={index}
          //         handleCheck={data => this.handleCheck(data)}
          //         handleDeletePic={data => this.handleDeletePic(data)}
          //       />
          //     ),
          //   });
          //   break;
          case 'FORM':
            ViewForm.push({ data: item, idx: index });
            break;
          case 'MODAL_TEXT':
            text.push({ data: item, idx: index });
            break;
          case 'MODAL':
            foot = (
              <FootComponent
                data={item}
                index={index}
                handleWidth={data => this.handleWidth(data)}
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
          handleWidth={data => this.handleWidth(data)}
          handleCheck={data => this.handleCheck(data)}
          handleColor={(data, index, code) => this.handleColor(data, index, code)}
          fnDown={(e, indx) => {
            this.fnDown(e, indx);
          }}
          handleDeletePic={data => this.handleDeletePic(data)}
        />
      );
    });
    let textCont = text.map((item, index) => {
      return (
        <TextComponent
          key={index}
          data={item.data}
          index={item.idx}
          handleWidth={data => this.handleWidth(data)}
          handleCheck={data => this.handleCheck(data)}
          handleColor={(data, index, code) => this.handleColor(data, index, code)}
          // fnDown={(e, indx) => {
          //   this.fnDown(e, indx);
          // }}
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
          {/*<div className={styles.fixedWrap}>
            {permissionsBtn.permissions.includes('BTN210326000048') ? (
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
            {permissionsBtn.permissions.includes('BTN210326000049') ? (
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
            ) : null}
                </div>*/}
        </div>
        <div className={styles.confcont}>
          <div className={styles.thead}>
            <span className={styles.fontHead}>编辑专题</span>
            <div className={styles.bth}>
              {permissionsBtn.permissions.includes('BTN210326000048') ? (
                <Button
                  style={{ height: 38, marginRight: 10 }}
                  onClick={() => {
                    this.logoutSave();
                  }}
                >
                  退出
                </Button>
              ) : null}
              {permissionsBtn.permissions.includes('BTN210326000048') ? (
                <Button
                  type="primary"
                  style={{ height: 38 }}
                  onClick={() => {
                    this.addConfiguration();
                  }}
                >
                  发布
                </Button>
              ) : null}
            </div>
          </div>
          <div className={styles.phone} style={{ marginLeft: Left }}>
            <div className={styles.phoneHead}>{title}</div>
            <div className={styles.phoneCont}>
              <div
                className={styles.phoneBox}
                ref="submitf"
                id="phoneCont"
                onMouseMove={() => {
                  this.get_canvas(event);
                }}
              >
                <DraggableArea
                  isList
                  tags={tags}
                  render={({ tag, index }) => <div className={styles.tag}>{tag.content}</div>}
                  onChange={index => this.handleDragg(index)}
                />
                <div className={styles.vieT}>{vie}</div>
                <div className={styles.txCont}>{textCont}</div>
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
    let textTop = 0;
    const { tags } = this.state;
    let iscroll = document.getElementById('phoneCont').scrollTop + 285;
    textTop = iscroll;
    compentList &&
      compentList.map((item, index) => {
        if (item.elementType === 'MODAL' && ite.elementType === 'MODAL') {
          ishow = 1;
        }
        if (item.elementType === 'FORM') {
          if (item.elementStyle) {
            let aStyle = JSON.parse(item.elementStyle);
            left = aStyle.left;
            top = aStyle.top + 360;
          }
        }
        // if (item.elementType === 'MODAL_TEXT') {
        //   if (item.elementStyle) {
        //     let aStyle = JSON.parse(item.elementStyle);
        //     textTop = aStyle.top + 43;
        //   }
        // }
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
      } else if (ite.elementType === 'MODAL_TEXT') {
        ite.elementStyle = JSON.stringify({
          top: textTop,
          left: 113,
          fontSize: 14,
          color: '#000',
          lineHeight: 1.5,
          letterSpacing: 1,
          textAlign: 'center',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecorationLine: 'none',
          width: 150,
          height: 43,
        });
      }
      // if (ite.elementType === 'IMG' || ite.elementType === 'TEXT') {
      //   tags.push(_.cloneDeep(ite));
      // }
      compentList.push(_.cloneDeep(ite));
    }
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...compentList],
      },
    });
    this.setState({
      tags,
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
    // if (compentList[indx].elementType === 'MODAL_TEXT') {
    //   compentList[indx].elementStyle = JSON.stringify({
    //     top: aStyle.top,
    //     left: aStyle.left,
    //     fontSize: aStyle.fontSize,
    //     color: aStyle.color,
    //     lineHeight: aStyle.lineHeight,
    //     letterSpacing: aStyle.letterSpacing,
    //     textAlign: aStyle.textAlign,
    //     fontStyle: aStyle.fontStyle,
    //     textDecorationLine: aStyle.textDecorationLine,
    //     width: 150,
    //     height: 43,
    //   });
    // } else {
    //   compentList[indx].elementStyle = JSON.stringify({ top: aStyle.top, left: aStyle.left });
    // }
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
      let isg = 0;
      let arrPic = [];
      let isImg = 0;
      compentList.map((item, index) => {
        if (item.elementType === 'IMG') {
          isTrue = 1;
          arrPic.push(item.paramList[0].defaultValue);
        }
        if (item.elementType === 'MODAL') {
          if (item.formUid) {
            isTrueF = 1;
            formUid = item.formUid;
          }
          isTrueM = 1;
        }
      });
      arrPic.map((item, index) => {
        if (
          item !==
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/22925eb86fff44e5b5ed47aa9dbd575e/imgdefault2x.png'
        ) {
          isImg = 1;
        }
      });
      if (isTrue === 0) {
        return message.error('请添加图片广告组件');
      }
      if (isImg === 0) {
        return message.error('专题中存在未设置图片的图片广告');
      }
      // if (isTrueM === 0) {
      //   return message.error("请添加常驻底部组件");
      // }
      if (isTrueM === 1 && isTrueF === 0) {
        return message.error('请在常驻底部中关联悬浮表单哦');
      }
      if (isTrueM === 1 && isTrueF === 1) {
        isg = 1;
      }
      if (isTrueM === 0 && isTrueF === 0) {
        isg = 1;
      }
      if (isTrue === 1 && isg === 1 && isImg === 1) {
        if (formUid !== '') {
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
  handleDragg(index) {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    let arr = [];
    let other = [];
    index &&
      index.map((item, index) => {
        arr.push(item.content.props.data);
      });
    compentList &&
      compentList.map((item, index) => {
        if (item.elementType !== 'IMG' && item.elementType !== 'TEXT') {
          other.push(item);
        }
      });
    dispatch({
      type: 'ProjectLibrary/saveDataModel',
      payload: {
        key: 'compentList',
        value: [...arr, ...other],
      },
    });
  }
  handleWidth(data) {
    this.setState({
      Left: data,
    });
  }
}

export default ProjectLibrary;
