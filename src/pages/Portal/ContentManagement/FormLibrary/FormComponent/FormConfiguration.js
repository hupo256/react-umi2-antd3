/*
 * @Author: zqm 
 * @Date: 2021-02-15 15:51:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-11 20:01:49
 * 专题库
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Input, message, Radio } from 'antd';
import img from '@/assets/img_top.png';
import styles from './index.less';

@connect(({ FormLibrary }) => ({
  FormLibrary,
}))
@Form.create()
class FormConfiguration extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkList: [
        {
          paramTips: '1112',
        },
      ],
      imgUrl: img,
    };
  }

  componentDidMount() {}
  render() {
    const { checkList, imgUrl } = this.state;
    let formShow =
      checkList &&
      checkList.map((item, index) => {
        return (
          <div className={styles.ViewDiv} key={index}>
            <Input style={{ width: 200 }} maxLength={16} placeholder={item.paramTips} />
          </div>
        );
      });
    return (
      <div>
        <div className={styles.bg} />
        <div className={styles.ConWrap}>
          <div className={styles.Context}>
            <div>
              <img src={imgUrl} alt="logo" style={{ width: '100%' }} />
            </div>
            <div
              className={styles.ViewDivForm}
              onClick={() => {
                this.handleChangeFrom();
              }}
            >
              {formShow}
            </div>
          </div>
          <div className={styles.btnWrap}>
            <Button type="primary">保存</Button>
            <Button
              style={{ marginLeft: 20 }}
              onClick={() => {
                this.handleCancel();
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default FormConfiguration;
