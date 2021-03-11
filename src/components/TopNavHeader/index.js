import React, { PureComponent } from "react";
import RightContent from "../GlobalHeader/RightContent";
import { Input, Icon, message, Badge } from "antd";
import styles from "./index.less";
import { connect } from "dva";
import Debounce from "lodash-decorators/debounce";
import messageImg from "../../assets/message.png";
import Link from "umi/link";
import { MyIcon } from "@/utils/utils";
import router from "umi/router";
const { TextArea } = Input;
message.config({ top: 200 });
@connect(
  ({
    base,
    global,
    users,
    loading,
    WorkBench,
    CommodityLibrary,
    CommoditySub,
    TaskDesk,
    ScmOffer,
    ScmPurchaseOffer,
    Message,
  }) => ({
    base,
    global,
    users,
    loading: loading.effects["global/feedbackadd"],
    WorkBench,
    TaskDesk,
    CommodityLibrary,
    CommoditySub,
    ScmOffer,
    ScmPurchaseOffer,
    Message,
  })
)
export default class TopNavHeader extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      maxWidth:
        (props.contentWidth === "Fixed" ? 1200 : window.innerWidth) -
        330 -
        165 -
        4,
      visible: false,
      previewVisible: false,
      previewImage: "",
      fileList: [],
      fileList2: [],
      typetxt: "",
      locatxt: "",
      area: "",
      top: 0,
      messageShow: false,
    };
  }
  componentDidMount() {
    // 是否折叠
    sessionStorage.setItem("collapsed", false);
    // 获取消息统计
  }
  static getDerivedStateFromProps(props) {
    return {
      maxWidth:
        (props.contentWidth === "Fixed" ? 1200 : window.innerWidth) -
        330 -
        165 -
        4,
    };
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  render() {
    const { theme, contentWidth, collapsed } = this.props;

    return (
      <div id="TopNavHeader" className={styles.TopNavHeader}>
        <div
          className={`${styles.head} ${theme === "light" ? styles.light : ""}`}
        >
          <div
            ref={(ref) => {
              this.maim = ref;
            }}
            className={`${styles.main} ${
              contentWidth === "Fixed" ? styles.wide : ""
            }`}
          >
            <Icon
              className={styles.trigger}
              type={collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />

            <div className={styles.feedback} style={{}}>
              <RightContent {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent("HTMLEvents");
    event.initEvent("resize", true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse, dispatch } = this.props;
    sessionStorage.setItem("collapsed", !collapsed);
    onCollapse(!collapsed);
    // 左侧菜单折叠状态
    dispatch({
      type: "base/setCollapsedModel",
      payload: { collapsed: !collapsed },
    });
    this.triggerResizeEvent();
  };
}
