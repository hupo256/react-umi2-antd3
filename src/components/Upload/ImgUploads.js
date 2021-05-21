/*
 * @Author: zqm 
 * @Date: 2020-07-10 15:03:59 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-23 16:40:26
 * 图片上传
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Upload, message, Icon, Button } from 'antd';
import CarouselPic from '@/components/CarouselPic';

@connect(({ base }) => ({
  base,
}))
class Uploads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [this.props.name]: [],
      inputData: [],
      visible: false,
      initialSlide: '',
    };
  }

  componentDidMount() {
    const { name, type, defauleUrl } = this.props;
    if (type === 'edit') {
      this.setState({
        [name]: defauleUrl,
      });
    }
  }
  render() {
    const {
      base: { picData },
      name,
      long,
      txt,
      code,
      subCode,
      accept,
    } = this.props;
    const longs = long || 50;
    return (
      <div style={{ marginRight: 12 }}>
        <Upload
          multiple={true}
          listType="picture-card"
          accept={accept || 'image/gif, image/jpeg, image/png'}
          showUploadList={true}
          data={this.redata}
          fileList={
            this.state[name].length > longs ? this.state[name].slice(0, longs) : this.state[name]
          }
          action={picData && picData.host}
          onChange={(...arg) => this.uploadsucc(...arg, name)}
          onRemove={(...arg) => this.fileRemove(...arg, name)}
          onPreview={(...arg) => this.handlePreview(...arg, name)}
          beforeUpload={file => this.beforeUpload(file, '', '', '', 's')}
        >
          {this.state[name].length >= (longs || 100) ? null : (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">{txt || '点击上传'}</div>
            </div>
          )}
        </Upload>
        {this.state.imgvisible && (
          <CarouselPic
            ref="CarouselPic"
            inputData={this.state.imageList || []}
            visible={this.state.imgvisible}
            handleCancel={this.handleImgCancel}
            initialSlide={this.state.initialSlide}
            previewTitle={this.props.previewTitle}
            name="addr"
          />
        )}
      </div>
    );
  }

  redata = () => {
    const {
      base: { picData },
    } = this.props;
    return picData;
  };
  uploadsucc(info, name) {
    let imgList = [];
    let isUpload = false;
    if (info.file.status === 'done') {
      let res = info.file.response;
      if (res && res.code != 200) {
        message.error('上传失败！');
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    } else if (!info.file.status) {
      imgList = info.fileList
        .map(item => {
          if (item.url || (item.response && item.response.code === 200)) {
            return item;
          } else {
            isUpload = true;
            return 'false';
          }
        })
        .filter(item => item !== 'false');
    }
    this.setState({ [name]: isUpload ? imgList : info.fileList }, () => {
      this.callback(isUpload ? imgList : info.fileList, name);
      isUpload = false;
    });
  }
  beforeUpload = (file, subType, type, bsId, f) => {
    const isLt2M = file.size / 1048576 < (this.props.size || 5);
    const isType = !/\.(png|jpg|gif|jpeg|webp|PNG|JPG|GIF|JPEG|WEBP)$/.test(file.name);
    if (!isLt2M) {
      message.warning(`图片不能大于${this.props.size || 5}M!`, 2);
      return false;
    } else if (isType) {
      message.warning('图片格式不正确!', 2);
      return false;
    }
    return isLt2M && !isType && this.checkImageWH(file, subType, type, bsId, f);
  };
  fileRemove(file, name) {
    let _arr = [];
    _arr = this.state[name];
    for (var i = 0; i < _arr.length; i++) {
      if (_arr[i].uid == file.uid) {
        _arr.splice(i, 1);
        break;
      }
    }
    console.log(_arr);
    this.setState(
      {
        [name]: _arr || [],
      },
      () => {
        this.callback(_arr, name);
      }
    );
  }
  handlePreview = ({ uid }, name) => {
    //显示
    let _arr = [];
    let arr = [];
    let index = '';
    _arr = this.state[name];
    console.log(_arr);
    for (var i = 0; i < _arr.length; i++) {
      if (_arr[i].uid == uid) index = i;
      if (_arr[i].url) {
        arr.push({
          originalFullUrl: _arr[i].url,
        });
      } else if (_arr[i].response) {
        arr.push({
          originalFullUrl: _arr[i].response.data.addr,
        });
      } else {
        arr.push({
          originalFullUrl: _arr[i].addr,
        });
      }
    }

    this.setState(
      {
        imgvisible: true,
        imageList: arr,
        initialSlide: index,
      },
      () => {
        if (this.refs.CarouselPic.refs.prics) {
          this.refs.CarouselPic.refs.prics.innerSlider.slickGoTo(index);
        }
      }
    );
  };

  checkImageWH(file, subType, type, bsId, f) {
    const that = this;
    const { dispatch } = this.props;
    return new Promise(function(resolve, reject) {
      let filenames = file.name;
      let index1 = filenames.lastIndexOf('.');
      let index2 = filenames.length;
      let fiename = filenames.substring(index1 + 1, index2);
      console.log(file);
      dispatch({
        type: 'base/photoxImg',
        payload: subType,
      }).then(data => {
        console.log('1',data)
        if (data && data.code === 200) {
          if (data.data.fileName !== '') {
            filenames = `${data.data.fileName}.${fiename}`;
          }
          that.setState({
            link: `${data.data.host}/${data.data.dir}${filenames}`,
          });
          dispatch({
            type: 'base/picData',
            payload: {
              OSSAccessKeyId: data.data.accessKeyId,
              callback: data.data.callBack,
              policy: data.data.policy,
              signature: data.data.signature,
              host: data.data.host,
              key: `${data.data.dir}${filenames}`,
              success_action_status: data.data.successActionStatus,
              'x:subType': subType,
              'x:type': type,
              'x:bsId': bsId,
              'x:f': f, //视频传v
              'x:token': localStorage.getItem('crmtoken'),
            },
          }).then(() => {
            resolve(true);
          });
          // }
        } else {
          message.error(data && data.message, 2);
          return reject();
        }
      });
    });
  }
  handleImgCancel = () => {
    this.setState({
      imgvisible: false,
      imageList: [],
      initialSlide: '',
    });
  };

  callback = (data, name) => {
    this.props.uploadSuccess(data, name);
  };
}

export default Uploads;
