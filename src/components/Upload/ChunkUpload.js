import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'dva/fetch';
import { Upload, Icon, Button, Progress, Checkbox, Modal, Spin, Radio, message } from 'antd';
import { baseurl } from '../../services/config';

import SparkMD5 from 'spark-md5';
message.config({
  top: 100,
  maxCount: 1,
});
const confirm = Modal.confirm;
const Dragger = Upload.Dragger;

let imgname = '';
class ChunkUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preUploading: false, //预处理
      chunksSize: 0, // 上传文件分块的总个数
      currentChunks: 0, // 当前上传的队列个数 当前还剩下多少个分片没上传
      uploadPercent: -1, // 上传率
      preUploadPercent: -1, // 预处理率
      uploadRequest: false, // 上传请求，即进行第一个过程中
      uploaded: false, // 表示文件是否上传成功
      uploading: false, // 上传中状态
      subloadding: false,
      filelist: [],
    };
  }
  componentDidMount() {
    const { defaultFileList } = this.props;
    this.setState({
      fileList: defaultFileList,
    });
  }
  showConfirm = () => {
    const _this = this;
    confirm({
      title: '是否提交上传?',
      content: '点击确认进行提交',
      onOk() {
        _this.preUpload();
      },
      onCancel() {},
    });
  };

  check(chunk) {
    return new Promise(function(resolve, reject) {
      fetch(`${baseurl}/api/v1/crm/file/check`, {
        headers: {
          token: localStorage.getItem('crmtoken'),
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(chunk),
      })
        .then(response => response.json())
        .then(responseData => {
          resolve(responseData);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  merge(chunk) {
    debugger;
    return new Promise(function(resolve, reject) {
      fetch(`${baseurl}/api/v1/crm/file/merge`, {
        headers: {
          token: localStorage.getItem('crmtoken'),
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(chunk),
      })
        .then(response => response.json())
        .then(responseData => {
          resolve(responseData);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  preUpload = async () => {
    this.setState({
      subloadding: true,
    });
    let chunks = this.state.uploadParams.chunks;
    let file = this.state.uploadParams.file;
    let funarr = [];

    for (var i = 0; i < chunks.length; i++) {
      let ch = chunks[i];
      funarr.push(
        this.check({
          chunk: ch.chunk,
          chunkSize: ch.end - ch.start,
          fileMd5: file.fileMd5,
        })
      );
    }
    var data = await Promise.all(funarr);
    let uploadList = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (element.data) {
        //可以上传
        uploadList.push(chunks[i]);
      }
    }

    // // 从返回结果中获取当前还有多少个分片没传
    let currentChunks = uploadList.length;

    // // 获得上传进度
    let uploadPercent = Number(
      (((this.state.chunksSize - currentChunks) / this.state.chunksSize) * 100).toFixed(2)
    );

    // // 上传之前，先判断文件是否已经上传成功
    if (uploadPercent === 100) {
      message.success('上传成功');
      this.setState({
        uploaded: true, // 让进度条消失
        uploading: false,
      });

      const { params } = this.props;
      let fn = file.fileName;
      this.merge({
        bsId: params.bsId,
        fileExt: fn.substring(fn.lastIndexOf('.') + 1),
        fileMd5: file.fileMd5,
        fileName: fn,
        saveInfo: true,
        type: params.type,
        subType: params.subType,
      }).then(res => {
        if (res && res.code == 200) {
          message.success('文件上传成功', 5);
          this.setState({
            uploaded: true,
            subloadding: false,
          });
        } else {
          message.error('文件上传失败', 5);
        }
      });
    } else {
      this.setState({
        uploaded: false,
        uploading: true,
      });
    }

    this.setState({
      uploadRequest: false, // 上传请求成功
      currentChunks,
      uploadPercent,
    });
    //进行分片上传
    this.handlePartUpload(uploadList, this.state.uploadParams.file);
  };

  handlePartUpload = (uploadList, file) => {
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    const _this = this;
    // const batchSize = 4,    // 采用分治思想，每批上传的片数，越大越卡
    const batchSize = Math.ceil((file.fileSize / 1024) * 1024 * 20),
      total = uploadList.length, //获得分片的总数
      batchCount = total / batchSize; // 需要批量处理多少次
    let batchDone = 0; //已经完成的批处理个数
    doBatchAppend();
    function doBatchAppend() {
      if (batchDone < batchCount) {
        let list = uploadList.slice(batchSize * batchDone, batchSize * (batchDone + 1));
        setTimeout(() => silcePart(list), 200);
      }
    }
    const { params, reloaduploadlist } = this.props;
    function upload(formData) {
      return new Promise(function(resolve, reject) {
        fetch(`${baseurl}/api/v1/crm/file/upload/${params.type}`, {
          headers: {
            token: localStorage.getItem('crmtoken'),
            // 'Content-Type': 'multipart/form-data',
          },
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(responseData => {
            if (responseData.code == '200') {
              let currentChunks = _this.state.currentChunks;
              --currentChunks;
              // 计算上传进度
              let uploadPercent = Number(
                (((_this.state.chunksSize - currentChunks) / _this.state.chunksSize) * 100).toFixed(
                  2
                )
              );
              _this.setState({
                currentChunks, // 同步当前所需上传的chunks
                uploadPercent,
                uploading: true,
              });
            }
            resolve(responseData);
          })
          .catch(err => {
            reject(err);
          });
      });
    }

    function merge(chunk) {
      return new Promise(function(resolve, reject) {
        fetch(`${baseurl}/api/v1/crm/file/merge`, {
          headers: {
            token: localStorage.getItem('crmtoken'),
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
          },
          method: 'POST',
          body: JSON.stringify(chunk),
        })
          .then(response => response.json())
          .then(responseData => {
            resolve(responseData);
          })
          .catch(err => {
            reject(err);
          });
      });
    }

    async function silcePart(list) {
      const { params } = _this.props;
      batchDone += 1;
      doBatchAppend();

      let uploadarr = [];
      for (let i = 0; i < list.length; i++) {
        const value = list[i];
        let { chunkMd5, chunk, start, end } = value;
        let formData = new FormData(),
          blob = new Blob([_this.state.arrayBufferData[chunk - 1].currentBuffer], {
            type: 'application/octet-stream',
          });
        formData.append('file', blob);
        formData.append('fileMd5', file.fileMd5);
        formData.append('chunk', chunk);

        uploadarr.push(upload(formData));
      }
      var data = await Promise.all(uploadarr);
      if (data && data.length > 0) {
        var a = 0;
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (element.code == '200') {
            a++;
          }
        }

        if (a == uploadList.length) {
          let fn = _this.state.uploadParams.file.fileName;
          merge({
            bsId: params.bsId,
            fileExt: fn.substring(fn.lastIndexOf('.') + 1),
            fileMd5: file.fileMd5,
            fileName: fn,
            saveInfo: true,
            type: params.type,
            subType: params.subType,
          }).then(res => {
            if (res && res.code == 200) {
              message.success('文件上传成功', 5);
              _this.setState({
                uploaded: true,
                uploading: false, // 上传中
                subloadding: false,
              });
              reloaduploadlist();
            } else {
              message.error('文件上传失败', 5);
            }
          });
        } else {
          message.error('文件上传失败', 5);
          return;
        }
      }
    }
  };

  render() {
    const {
      preUploading,
      uploadPercent,
      preUploadPercent,
      uploadRequest,
      uploaded,
      uploading,
      fileList,
    } = this.state;
    const _this = this;
    const { content, fileRemove } = this.props;
    const uploadProp = {
      onRemove: file => {
        fileRemove(file);
      },
      beforeUpload: file => {
        // 首先清除一下各种上传的状态
        this.setState({
          uploaded: false, // 上传成功
          uploading: false, // 上传中
          uploadRequest: false, // 上传预处理
        });
        // 兼容性的处理
        let blobSlice =
            File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
          chunkSize = 1024 * 1024 * 20, // 切片每次5M
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0, // 当前上传的chunk
          spark = new SparkMD5.ArrayBuffer(),
          // 对arrayBuffer数据进行md5加密，产生一个md5字符串
          chunkFileReader = new FileReader(), // 用于计算出每个chunkMd5
          totalFileReader = new FileReader(); // 用于计算出总文件的fileMd5

        let params = { chunks: [], file: {} }, // 用于上传所有分片的md5信息
          arrayBufferData = []; // 用于存储每个chunk的arrayBuffer对象,用于分片上传使用
        params.file.fileName = file.name;
        params.file.fileSize = file.size;

        totalFileReader.readAsArrayBuffer(file);
        totalFileReader.onload = function(e) {
          // 对整个totalFile生成md5
          spark.append(e.target.result);
          params.file.fileMd5 = spark.end(); // 计算整个文件的fileMd5
        };
        chunkFileReader.onload = function(e) {
          // 对每一片分片进行md5加密
          spark.append(e.target.result);
          // 每一个分片需要包含的信息
          let obj = {
            chunk: currentChunk + 1,
            start: currentChunk * chunkSize, // 计算分片的起始位置
            end:
              currentChunk * chunkSize + chunkSize >= file.size
                ? file.size
                : currentChunk * chunkSize + chunkSize, // 计算分片的结束位置
            chunkMd5: spark.end(),
            chunks,
          };
          // 每一次分片onload,currentChunk都需要增加，以便来计算分片的次数
          currentChunk++;
          params.chunks.push(obj);

          // 将每一块分片的arrayBuffer存储起来，用来partUpload
          let tmp = {
            chunk: obj.chunk,
            currentBuffer: e.target.result,
          };
          arrayBufferData.push(tmp);

          if (currentChunk < chunks) {
            // 当前切片总数没有达到总数时
            loadNext();

            // 计算预处理进度
            _this.setState({
              preUploading: true,
              preUploadPercent: Number(((currentChunk / chunks) * 100).toFixed(2)),
            });
          } else {
            //记录所有chunks的长度
            params.file.fileChunks = params.chunks.length;
            // 表示预处理结束，将上传的参数，arrayBuffer的数据存储起来
            _this.setState({
              preUploading: false,
              uploadParams: params,
              arrayBufferData,
              chunksSize: chunks,
              preUploadPercent: 100,
            });
          }
        };

        chunkFileReader.onerror = function() {
          console.warn('oops, something went wrong.');
        };

        function loadNext() {
          var start = currentChunk * chunkSize,
            end = start + chunkSize >= file.size ? file.size : start + chunkSize;
          chunkFileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
        // 只允许一份文件上传
        this.setState({
          file: file,
        });
        imgname = file.name;
        return false;
      },
      onChange: ({ fileList }) => this.setState({ fileList }),
      fileList: fileList,
      onChange: info => {
        if (info.file.status === 'error') {
          message.error('上传中断，请刷新续传。');
        }
        this.setState({ fileList: info.fileList });
      },
    };

    return (
      <div className="content-inner">
        <Spin
          tip={
            <div>
              <h3 style={{ margin: '10px auto', color: '#1890ff' }}>文件预处理中...</h3>
              <Progress width={80} percent={preUploadPercent} type="circle" status="active" />
            </div>
          }
          spinning={preUploading}
          style={{ height: 350 }}
        >
          <div>
            <Dragger {...uploadProp}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">{content}</p>
            </Dragger>
            {uploadPercent >= 0 &&
              !!uploading && (
                <div style={{ marginTop: 20, width: '95%' }}>
                  <Progress percent={uploadPercent} status="active" />
                  <h4>文件上传中，请勿关闭窗口</h4>
                </div>
              )}
            {!!uploadRequest && <h4 style={{ color: '#1890ff' }}>上传请求中...</h4>}
            {!!uploaded && (
              <h4 style={{ color: '#52c41a' }}>
                文件
                {imgname}
                上传成功
              </h4>
            )}
            <Button
              type="primary"
              onClick={this.showConfirm}
              disabled={!!(this.state.preUploadPercent < 100)}
              loading={this.state.subloadding}
            >
              <Icon type="upload" />
              提交上传
            </Button>
          </div>
        </Spin>
      </div>
    );
  }
}

ChunkUpload.propTypes = {
  //...
};

export default ChunkUpload;
