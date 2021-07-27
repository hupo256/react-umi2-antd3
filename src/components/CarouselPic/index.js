import React, { Component } from 'react';
import { Icon, Carousel, Modal } from 'antd';
import styles from './CarouselPic.less';

export default class CarouselPic extends Component {
  handlePrev = () => {
    this.refs.prics.prev(); //ref = img
    const videoList = document.querySelectorAll('.videos');
    // console.log({ videoList });
    videoList.forEach(item => item.pause());
  };
  handleNext = () => {
    this.refs.prics.next();
    const videoList = document.querySelectorAll('.videos');
    // console.log({ videoList });
    videoList.forEach(item => item.pause());
  };
  render() {
    const { inputData, visible, initialSlide, handleCancel, name } = this.props;
    console.log(inputData);
    const Inputs =
      inputData &&
      inputData.map((item, idx) => {
        const src = item[name] || item.originalFullUrl || item;
        const type = typeof src === 'string' ? src.split('.')[src.split('.').length - 1] : '';
        return (
          <div key={idx.toString(36)} className={styles.slick}>
            {type === 'mp4' ? (
              <video
                ref={`video-${idx}`}
                src={item[name] || item.originalFullUrl || item}
                controls
                className={'videos'}
                disablePictureInPicture
                controlsList="nodownload noremoteplayback"
              >
                您的浏览器不支持 video 标签。
              </video>
            ) : (
              <img src={item[name] || item.originalFullUrl || item} alt="example" />
            )}
          </div>
        );
      });
    console.log('inputData', inputData);
    return (
      <Modal
        width={800}
        title={this.props.previewTitle || '图例展示'}
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        zIndex={1300}
      >
        <div className={styles.picWrap}>
          <Carousel
            ref="prics"
            dots={false}
            initialSlide={initialSlide || 0}
            className={styles.imgPrefiew}
          >
            {Inputs}
          </Carousel>
          {inputData.length > 1 ? (
            <div className={styles.left} onClick={this.handlePrev}>
              <a>
                <Icon type="left-circle" />
              </a>
            </div>
          ) : null}
          {inputData.length > 1 ? (
            <div className={styles.right} onClick={this.handleNext}>
              <a>
                <Icon type="right-circle" />
              </a>
            </div>
          ) : null}
        </div>
      </Modal>
    );
  }
}
