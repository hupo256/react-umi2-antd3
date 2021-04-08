/*
 * @Author: zqm 
 * @Date: 2020-08-13 18:28:52 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-01-21 18:23:32
 * 文件上传
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Upload, message, Icon, Button } from 'antd';
import CarouselPic from '@/components/CarouselPic';

import { previewAll } from '@/utils/utils';
@connect(({ base }) => ({ base }))
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
      code,
      accept,
      txt,
      showUploadList,
      multiple,
    } = this.props;
    const longs = long || 50;
    const showList = showUploadList === 'false' ? false : true;
    const multiples = multiple ? false : true;
    return (
      <div>
        <Upload
          multiple={multiples}
          showUploadList={showList}
          data={this.redata}
          accept={accept || '*'}
          fileList={
            this.state[name].length > longs ? this.state[name].slice(0, longs) : this.state[name]
          }
          action={picData && picData.host}
          onChange={(...arg) => this.uploadsucc(...arg, name)}
          onRemove={(...arg) => this.fileRemove(...arg, name)}
          onPreview={(...arg) => this.handlePreview(...arg, name)}
          beforeUpload={file => this.beforeUpload(file, '', '', '', 's')}
        >
          {this.state[name].length >= (long || 100) ? null : (
            <Button>
              <Icon type="upload" />
              {txt ? txt : '上传文件'}
            </Button>
          )}
        </Upload>
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
    this.props.isloading && this.props.isloading(info.file.status === 'done' ? false : true);
    this.props.isloading && !info.file.status && this.props.isloading(false);
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
      info.file.status === 'done' && this.callback(isUpload ? imgList : info.fileList, name);
      isUpload = false;
    });
  }
  beforeUpload = (file, subType, type, bsId, f) => {
    const isLt2M = file.size / 1024 / 1024 < (this.props.size || 1024);
    if (!isLt2M) {
      message.warning(`文件不能大于${this.props.size ? this.props.size + 'M' : '1G'}!`, 2);
      this.props.isloading && this.props.isloading(false);
      return false;
    } else return isLt2M && this.checkImageWH(file, subType, type, bsId, f);
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
    this.setState(
      {
        [name]: _arr || [],
      },
      () => {
        this.callback(_arr, name);
      }
    );
  }
  // 预览文件
  handlePreview = ({ uid }, name) => {
    //显示
    let _arr = [];
    _arr = this.state[name];
    for (var i = 0; i < _arr.length; i++) {
      if (_arr[i].uid == uid) {
        previewAll(_arr[i]);
      }
    }
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
        if (data && data.code === 200) {
          // if (data.data.success_action_status === '200') {
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
          message.error(data.message, 2);
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
    if (this.props.reset) {
      setTimeout(() => {
        this.setState({ [this.props.name]: [] });
      }, 1000);
    }
  };
}
export default Uploads;
