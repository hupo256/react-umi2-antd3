/*
 * @Author: tdd 
 * @Date: 2021-03-26 14:09:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-26 14:49:12 
 * 添加、修改商品
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import { Form, Input, Select, InputNumber, Upload, Icon, Button } from 'antd';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

function AddNewGoods(props) {
  const {
    form: { validateFields, getFieldDecorator },
  } = props;
  const { goodsList, setgoodsList, goodsModal, setgoodsModal } = useContext(ctx);
  const [imageUrl, setimageUrl] = useState('');
  const [loading, setloading] = useState(false);

  function submitForm() {
    validateFields((err, values) => {
      if (err) return;
      console.log(values);
      const { startTime, endTime } = values;
      const newRec = {
        ...values,
        startTime: moment(startTime).format('YYYY-MM-DD hh:mm:ss'),
        endTime: moment(endTime).format('YYYY-MM-DD hh:mm:ss'),
      };
      console.log(newRec);
      goodsList.push(newRec);
      setgoodsList(goodsList.slice());
      setgoodsModal(false);
    });
  }

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  function handleChange(info) {
    if (info.file.status === 'uploading') {
      setloading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setloading(false);
        setimageUrl(imageUrl);
      });
    }
  }

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Form {...formItemLayout}>
      <Item label="活动列表">
        {getFieldDecorator('actType', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(
          <Select style={{ width: 120 }} placeholder="请选择类型">
            <Option value="大红包">大红包</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled">Disabled</Option>
          </Select>
        )}
      </Item>
      <Item label="奖品名称">
        {getFieldDecorator('prizeName', {
          rules: [
            {
              required: true,
              message: 'Please input your name',
            },
          ],
        })(<Input placeholder="" />)}
      </Item>
      <Item label="奖品标题">
        {getFieldDecorator('goodsTitle', {
          rules: [
            {
              required: true,
              message: 'Please input your name',
            },
          ],
        })(<Input placeholder="" />)}
      </Item>
      <Item label="中奖概率">
        {getFieldDecorator('actCount', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(<InputNumber min={1} step={1} />)}
      </Item>
      <Item label="奖品数量">
        {getFieldDecorator('goodsCount', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(<InputNumber min={1} step={1} />)}
      </Item>
      <Item label="奖品状态">
        {getFieldDecorator('isOpen', {
          rules: [
            {
              required: true,
              message: 'Please input your nickname',
            },
          ],
        })(<Input placeholder="" />)}
      </Item>
      <Item label="商品icon">
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          // beforeUpload={beforeUpload}
          // onChange={this.handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </Item>
      <Item {...formTailLayout}>
        <Button onClick={() => setgoodsModal(false)}>取消</Button>
        <Button type="primary" onClick={submitForm}>
          确定
        </Button>
      </Item>
    </Form>
  );
}

export default Form.create({ name: 'add_new_active' })(AddNewGoods);
