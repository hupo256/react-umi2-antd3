/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-10 16:40:09
 * 专题库
 */
import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import router from "umi/router";
import Link from "umi/link";
import _ from "lodash";
import { Card, Button, Icon, Row, Col, Input, message, Menu } from "antd";
import { DraggableArea } from "react-draggable-tags";
import { getQueryUrlVal } from "@/utils/utils";
import ImgComponent from "./TopicComponent/ImgComponent";
import FootComponent from "./TopicComponent/FootComponent";
import ViewFormComponent from "./TopicComponent/ViewFormComponent";
import styles from "./index.less";
import logo from "../../../../assets/whiteLog.png";
import logoImg from "../../../../assets/logoImg.png";
const { SubMenu } = Menu;
let pointX, pointY;
@connect(({ ProjectLibrary, loading }) => ({
  ProjectLibrary,
}))
class ProjectLibrary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      istrue: 0,
      compentList: [],
      tags: [],
    };
    /*定义两个值用来存放鼠标按下的地方距离元素上侧和左侧边界的值*/
    this.disX = 0;
    this.disY = 0;
  }

  componentDidMount() {
    // const activeKey = getQueryUrlVal('uid');
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'ProjectLibrary/specialGetModel',
    //   payload: {
    //     specialUid: activeKey,
    //   },
    // });
    dispatch({
      type: "ProjectLibrary/elementTreeModel",
      payload: {
        businessType: 1,
        terminalType: 1,
      },
    }).then((res) => {
      if (res && res.code === 200) {
        this.setState({
          istrue: 1,
        });
      }
    });
  }
  render() {
    const {
      ProjectLibrary: { elementTree, compentList },
    } = this.props;
    const { collapsed, istrue } = this.state;
    const auth = JSON.parse(localStorage.getItem("auth"));
    const bigLogo = (auth && auth.logoBig) || logo;
    const smallLogo = (auth && auth.logoSmall) || logoImg;
    let newLog = !collapsed ? bigLogo : smallLogo;
    let open = [];
    let arr =
      elementTree &&
      elementTree.map((item, index) => {
        open.push(`${index}`);
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
                  <img
                    src={ite.elementIcon}
                    style={{ width: 38, height: 38 }}
                  />
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
    let foot = "";
    let ViewForm = [];
    compentList &&
      compentList.map((item, index) => {
        switch (item.elementType) {
          case "IMG":
            tags.push({
              id: index,
              content: (
                <ImgComponent
                  data={item}
                  index={index}
                  handleCheck={(data) => this.handleCheck(data)}
                  handleImg={(data, index) => this.handleImg(data, index)}
                  handleDeletePic={(data) => this.handleDeletePic(data)}
                />
              ),
            });
            break;
          case "FORM":
            ViewForm.push({ data: item, idx: index });
            break;
          case "MODAL":
            foot = (
              <FootComponent
                data={item}
                index={index}
                handleDeleteFoot={(data) => this.handleDeleteFoot(data)}
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
          handleCheck={(data) => this.handleCheck(data)}
          fnDown={(e, indx) => {
            this.fnDown(e, indx);
          }}
          handleDeletePic={(data) => this.handleDeletePic(data)}
        />
      );
    });
    return (
      <div className={styles.topicWrap}>
        <div style={{ width: 256 }} className={styles.logoWrap}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={newLog} alt="logo" style={{ width: 171, height: 38 }} />
              <h1 style={{ display: "none" }}>业务后台</h1>
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
              ""
            )}
          </div>
          <div className={styles.fixedWrap}>
            <Button type="primary" style={{ width: "100%", height: 38 }}>
              发布
            </Button>
            <div className="clearfix">
              <span className={styles.logout}>
                <Icon type="logout" />
                退出
              </span>
            </div>
          </div>
        </div>
        <div className={styles.confcont}>
          <div className={styles.phone}>
            <div className={styles.phoneHead}>1234</div>
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
                  render={({ tag, index }) => (
                    <div className={styles.tag}>{tag.content}</div>
                  )}
                  onChange={(index) => console.log(index)}
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
        if (item.elementType === "MODAL" && ite.elementType === "MODAL") {
          ishow = 1;
        } else {
          ishow = 0;
        }
        if (item.elementType === "FORM") {
          left = item.left;
          top = item.top + 220;
        }
      });
    if (ishow === 0) {
      ite.left = left;
      ite.top = top;
      compentList.push(_.cloneDeep(ite));
    }
    dispatch({
      type: "ProjectLibrary/saveDataModel",
      payload: {
        key: "compentList",
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
      type: "ProjectLibrary/saveDataModel",
      payload: {
        key: "compentList",
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
    console.log(compentList);
    dispatch({
      type: "ProjectLibrary/saveDataModel",
      payload: {
        key: "compentList",
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
      type: "ProjectLibrary/saveDataModel",
      payload: {
        key: "compentList",
        value: [...compentList],
      },
    });
  }
  handleDeleteFoot(index) {
    const {
      dispatch,
      ProjectLibrary: { compentList },
    } = this.props;
    compentList.splice(index, 1);
    dispatch({
      type: "ProjectLibrary/saveDataModel",
      payload: {
        key: "compentList",
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
    this.disX = event.clientX - compentList[index].left;
    this.disY = event.clientY - compentList[index].top;
    /*定义鼠标移动事件*/
    document.onmousemove = (e) => this.fnMove(e, index);
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
    if (event.clientY - this.disY < 0) {
      compentList[indx].top = 0;
    } else if (event.clientY - this.disY > height) {
      compentList[indx].top = height;
    } else {
      compentList[indx].top = event.clientY - this.disY;
    }

    dispatch({
      type: "ProjectLibrary/saveDataModel",
      payload: {
        key: "compentList",
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
}

export default ProjectLibrary;
