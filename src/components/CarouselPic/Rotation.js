/*
 * @Author: pengyc 
 * @Date: 2020-07-20 12:54:38 
 * @Last Modified by: pengyc
 * @Last Modified time: 2020-11-12 16:13:15
 *  商品库 商品详情  图片展示
 * 
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './CarouselPic.less';
import { Icon } from 'antd';
import RcViewer from 'rc-viewer';
@connect(({}) => ({}))
class Rotation extends Component {
  state = {
    imgList: [],
    nowImage: '',
    clickT: 9999,
    translateX: 0,
    leftBool: false,
    rightBool: true,
    maxWidth: 400,
  };

  componentDidMount() {
    const { imgList } = this.props;
    this.setState({
      imgList: imgList,
      nowImage: imgList[0],
      maxWidth: imgList.length * 60,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { imgList } = this.props;
    if (!_.isEqual(nextProps.imgList, imgList)) {
      this.setState({
        imgList: nextProps.imgList,
        nowImage: nextProps.imgList[0],
        maxWidth: nextProps.imgList.length * 60,
      });
    }
  }

  render() {
    const { imgList } = this.props;
    const { translateX, leftBool, rightBool, nowImage, maxWidth } = this.state;

    return (
      <div className={styles.Rotation}>
        <div style={{ height: 352, textAlign: 'center' }} className={styles.ImgDiv}>
          <RcViewer options={{ title: false }}>
            {<img style={{ height: 352, maxWidth: 400, objectFit: 'scale-down' }} src={nowImage} />}
          </RcViewer>
        </div>
        <div className={styles.bottom} style={{ height: 66 }}>
          <div ref={this.saveRef} className={styles.main}>
            <span
              style={{
                cursor: leftBool ? 'pointer' : 'no-drop',
                color: leftBool ? '#999' : '#333',
              }}
              onClick={this.handleLeft}
              className={styles.spanleft}
            >
              <Icon type="left" />
            </span>
            <span
              style={{
                cursor: rightBool ? 'pointer' : 'no-drop',
                color: rightBool ? '#999' : '#333',
              }}
              onClick={this.handleRight}
              className={styles.spanright}
            >
              <Icon type="right" />
            </span>
            <div
              style={{ width: maxWidth, transform: `translateX(${translateX}px)` }}
              className={styles.ProjectExpectedScol}
            >
              {imgList.map((item, index) => (
                <div
                  onMouseOver={() => this.handleMouseOver(item)}
                  className={
                    item == nowImage ? styles.ProjectExpectedItemActive : styles.ProjectExpectedItem
                  }
                  style={{ backgroundImage: `url(${item})` }}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  imageWidth = () => {
    var myimg, oldwidth, oldheight;
    var maxwidth = 400;
    var maxheight = 352;
    var imgs = document.getElementsByTagName('img');

    for (i = 0; i < imgs.length; i++) {
      myimg = imgs[i];

      if (myimg.width > myimg.height) {
        if (myimg.width > maxwidth) {
          oldwidth = myimg.width;
          myimg.height = myimg.height * (maxwidth / oldwidth);
          myimg.width = maxwidth;
        }
      } else {
        if (myimg.height > maxheight) {
          oldheight = myimg.height;
          myimg.width = myimg.width * (maxheight / oldheight);
          myimg.height = maxheight;
        }
      }
    }
  };

  saveRef = ref => {
    this.refDom = ref;
  };

  // 鼠标移入
  handleMouseOver = nowImage => {
    this.setState({
      nowImage,
    });
  };

  // 向左
  handleLeft = () => {
    let newNum = 300;
    let translateX = this.state.translateX;
    let leftBool = this.state.leftBool;
    if (translateX >= 0) {
      translateX = translateX;
      leftBool = false;
    } else {
      translateX = _.add(translateX, newNum);
      if (translateX > -20) {
        translateX = 0;
      }
      if (translateX >= 0) {
        leftBool = false;
      } else {
        leftBool = true;
      }
    }
    this.setState({ translateX, rightBool: true, leftBool });
  };

  // 向右
  handleRight = () => {
    const { clientWidth } = this.refDom;
    const { maxWidth } = this.state;
    const totalNum = _.subtract(maxWidth, clientWidth);
    let newNum = 300;
    let translateX = this.state.translateX;
    let rightBool = this.state.rightBool;

    if (translateX <= -totalNum) {
      translateX = translateX;
      rightBool = false;
    } else {
      translateX = _.add(translateX, -newNum);
      if (translateX <= -totalNum) {
        rightBool = false;
      } else {
        rightBool = true;
      }
    }

    this.setState({ translateX, rightBool, leftBool: true });
  };
}

export default Rotation;
