import React, { Component } from 'react';
import { Icon, Carousel, Modal } from 'antd';
import styles from './CarouselPic.less';

export default class CarouselPic extends Component {
  state = { num: 0 };
  componentDidMount() {
    this.setState({
      num: this.props.initialSlide,
    });
  }
  handlePrev = () => {
    if (this.state.num === 0) {
      this.setState({ num: this.props.inputData.length - 1 });
    } else {
      this.setState({ num: this.state.num - 1 });
    }
    this.refs.prics.prev(); //ref = img
  };
  handleNext = () => {
    if (this.state.num === this.props.inputData.length - 1) {
      this.setState({ num: 0 });
    } else {
      this.setState({ num: this.state.num + 1 });
    }

    this.refs.prics.next();
  };
  render() {
    const { inputData, visible, initialSlide, handleCancel } = this.props;
    const Inputs =
      inputData &&
      inputData.map((item, idx) => {
        return (
          <div key={idx.toString(36)} className={styles.slick}>
            <img src={item.originalFullUrl || item} alt="example" />
          </div>
        );
      });
    const Title = (inputData[this.state.num] && inputData[this.state.num].title) || '图例展示';
    return (
      <Modal
        width={800}
        title={Title}
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        zIndex={1300}
      >
        <div className={styles.picWrap}>
          <Carousel
            ref="prics"
            className={styles.picCarousel}
            initialSlide={initialSlide || 0}
            dotPosition={false}
          >
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
          <p style={{ textAlign: 'center', marginTop: 12 }}>
            当前第
            {this.state.num + 1}
            张，共
            {inputData.length}张
          </p>
        </div>
      </Modal>
    );
  }
}
