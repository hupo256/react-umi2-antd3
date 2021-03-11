/*
 * @Author: zqm 
 * @Date: 2021-02-17 17:03:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-01 18:24:18
 * 创建工地
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Button, Input, message, Row, Col, Radio } from 'antd';
import { getQueryUrlVal } from '@/utils/utils';
import ImgUploads from '@/components/Upload/ImgUploads';
import styles from '../index.less';
const { TextArea } = Input;

@connect(({ ProjectLibrary }) => ({
  ProjectLibrary,
}))
@Form.create()
class CreateStepOne extends PureComponent {
  state = { specialCoverImg: [], istrue: 1 };

  componentDidMount() {
    const {
      ProjectLibrary: { collocationDetail },
    } = this.props;
    const { specialCoverImg } = this.state;
    if (
      collocationDetail &&
      collocationDetail.specialCoverImg &&
      collocationDetail.specialCoverImg !== ''
    ) {
      specialCoverImg.push({
        uid: -1,
        addr: collocationDetail.specialCoverImg,
        thumbUrl: collocationDetail.specialCoverImg,
      });

      this.setState({
        specialCoverImg,
        istrue: 1,
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const {
      ProjectLibrary: { collocationDetail },
    } = this.props;
    const { specialCoverImg } = this.state;

    return (
      <div style={{ paddingTop: 20 }}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="专题标题">
            {getFieldDecorator('specialTitle', {
              initialValue: collocationDetail && collocationDetail.specialTitle,
              rules: [
                {
                  required: true,
                  message: '请输入专题标题',
                },
                {
                  max: 30,
                  message: '限制1-30字符长度',
                },
              ],
            })(<Input style={{ width: 400 }} placeholder="请输入案例标题" />)}
          </Form.Item>
          <Form.Item label="适用终端">
            {getFieldDecorator('terminalType', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '请选择适用终端',
                },
              ],
            })(
              <Radio.Group>
                <Radio value={0}>是</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="封面图">
            {getFieldDecorator('specialCoverImg', {
              initialValue: specialCoverImg,
              rules: [{ required: false, message: '请上传封面图' }],
            })(
              <ImgUploads
                name="specialCoverImg"
                long={1}
                uploadSuccess={(data, name) => this.uploadSuccess(data, name, 1)}
                previewTitle="封面图"
                type={'edit'}
                accept=".png,.jpg,.jpeg,.gif"
                defauleUrl={specialCoverImg}
              />
            )}
          </Form.Item>
          <Form.Item label="专题说明">
            {getFieldDecorator('specialDescription', {
              initialValue: collocationDetail && collocationDetail.specialDescription,
              rules: [{ required: false, message: '请输入专题说明' }],
            })(<TextArea rows={4} style={{ width: 400 }} placeholder="请输入专题说明" />)}
          </Form.Item>
          <Row>
            <Col span={8} />
            <Col span={16}>
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  // 图片上传成功回调
  uploadSuccess = (list, name, long) => {
    const lists = list.map(item => {
      if (item.response) {
        let arr = item.response.data;
        arr.uid = item.uid;
        arr.thumbUrl = item.response.data.addr;
        return arr;
      } else {
        return item;
      }
    });
    if (list.length > long) {
      message.error(`最多上传${long}个文件`);
      this.setState({ [name]: lists.slice(0, long) });
      this.props.form.setFieldsValue({
        [name]: lists.slice(0, long),
      });
    } else {
      this.setState({ [name]: lists });
      this.props.form.setFieldsValue({
        [name]: lists,
      });
    }
  };
  handleSubmit = e => {
    const activeKey = getQueryUrlVal('uid');
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) throw err;
      const { dispatch } = this.props;
      values.specialCoverImg =
        values.specialCoverImg && values.specialCoverImg[0] ? values.specialCoverImg[0].addr : '';
      values.specialDescription = values.specialDescription ? values.specialDescription : '';
      if (activeKey) {
        values.specialUid = getQueryUrlVal('uid');
        dispatch({
          type: 'ProjectLibrary/specialModifyModel',
          payload: {
            ...values,
          },
        }).then(res => {
          this.props.handleOk();
        });
      } else {
        dispatch({
          type: 'ProjectLibrary/specialCreateModel',
          payload: {
            ...values,
          },
        }).then(res => {
          this.props.handleOk();
        });
      }
    });
  };
}

export default CreateStepOne;
