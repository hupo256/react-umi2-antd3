import React, { Component } from 'react';
import { Icon, Carousel, Modal } from 'antd';
import styles from './CarouselPic.less';

export default class CarouselPic extends Component {
  handlePrev = () => {
    this.refs.prics.prev(); //ref = img
  };
  handleNext = () => {
    this.refs.prics.next();
  };
  render() {
    const { inputData, visible, initialSlide, handleCancel, name } = this.props;
    const Inputs =
      inputData &&
      inputData.map((item, idx) => {
        return (
          <div key={idx.toString(36)} className={styles.slick}>
            <img src={item[name] || item.originalFullUrl || item} alt="example" />
          </div>
        );
      });
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
          <Carousel ref="prics" initialSlide={initialSlide || 0} className={styles.imgPrefiew}>
            {Inputs}
          </Carousel>
          <div className={styles.left} onClick={this.handlePrev}>
            <a>
              <Icon type="left-circle" />
            </a>
          </div>
          <div className={styles.right} onClick={this.handleNext}>
            <a>
              <Icon type="right-circle" />
            </a>
          </div>
        </div>
      </Modal>
    );
  }
}
