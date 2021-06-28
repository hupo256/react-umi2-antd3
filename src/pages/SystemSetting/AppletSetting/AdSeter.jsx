/*
 * @Author: tdd 
 * @Date: 2020-06-14 14:35:33 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-06-16 15:09:47
 * 广告设置
 */
import React, { PureComponent } from 'react';
import { message, Popover, Button, Input, Switch, Icon } from 'antd';
import router from 'umi/router';
import { openadvGet, openadvSave } from '@/services/miniProgram';
import { getRelatedPage } from '@/services/channelManage';
import CascadeSelect from '@/pages/ChannelManage/components/CascadeSelect';
import Upload from '@/components/Upload/Upload';
import Prompt from './prompt';
import styles from './index.less';

export default class AdSeter extends PureComponent {
  state = {
    btnLoading: false,
    isEditing: false,
    isOpen: false,
    imgEdtor: false,
    showSec: false,
    relatedPageOption: [], // 渲染选择器的数据
    curOpt: [], // 已选出来的原始数据
    paths: [], // 已选出来的数据
    isEnd: false, // 是否到末级
    linkDisplayName: '', // 回显关联页面inupt的值
    picUrl: '',
    imgErrer: false,
    releErrer: false,
  };

  componentDidMount() {
    openadvGet().then(res => {
      // console.log(res);
      if (!res?.data) return;
      const { paths } = res.data;
      this.setState({ ...res.data });
    });
    getRelatedPage({ sceneType: 3 }).then(res => {
      if (!res?.data) return;
      this.setState({ relatedPageOption: res?.data });
    });
  }

  componentDidUpdate(prevProps) {
    const { showSecTag } = this.props;
    if (showSecTag !== prevProps.showSecTag) {
      const { isEnd, linkDisplayName, paths } = this.state;
      const linkTex = isEnd ? linkDisplayName : '';
      const arr = isEnd ? paths : [];
      this.setState({ showSec: showSecTag, linkDisplayName: linkTex, paths: arr });
    }
  }

  adSwitchClick = val => {
    this.setState({ isOpen: val, isEditing: true });
  };

  // 图片选择
  handleUploadOk = data => {
    console.log(data[0].path);
    this.setState({ imgEdtor: false, picUrl: data[0].path, isEditing: true, imgErrer: false });
  };

  // 点击input
  releInpClick = () => {
    const { taggleSecTag } = this.props;
    taggleSecTag();
    this.setState({ showSec: false }, () => {
      this.setState({ showSec: true });
    });
  };

  // 点击selector
  touchRelece = arr => {
    console.log(arr);
    const linkDisplayName = arr.map(p => p.text).join('/');
    const isEnd = arr[arr.length - 1]?.isEnd;
    const linkKey = arr[arr.length - 1]?.linkKey;
    const paths = isEnd ? arr.map(p => p.code) : [];
    const curOpt = isEnd ? arr : [];
    this.setState({
      linkDisplayName,
      curOpt,
      paths,
      isEnd,
      linkKey,
      isEditing: true,
      releErrer: false,
    });
  };

  // 关联页面 非必填，一旦填了，就要做校验
  saveAdCofig = route => {
    const { picUrl, paths, isEnd, isOpen, curOpt, linkKey = '' } = this.state;
    const len = curOpt.length;
    let detailUid = '';

    if (!picUrl) return this.setState({ imgErrer: true }); // 图片非空检验
    if (len) {  // 已选择过关联页面，则校验之
      if (!isEnd) return this.setState({ releErrer: true }); 
      linkKey || (detailUid = paths.pop()); // 没有linkKey 表示选择了详情页, 
    }
    const param = { isOpen, paths, picUrl, detailUid };
    this.setState({ btnLoading: true });
    openadvSave(param).then(res => {
      this.setState({ btnLoading: false });
      res?.message && message.error(res.message);
      if (res.code === 200) {
        message.success('编辑已保存，已实时生效');
        this.setState({ isEditing: false });
        setTimeout(() => {
          route && router.push(route); // 如果是从prompt过来的，还需要跳转
        }, 1500);
      }
    });
  };

  submitClick = e => {
    e.stopPropagation();
    this.saveAdCofig();
  };

  render() {
    const {
      btnLoading,
      isOpen,
      imgEdtor,
      showSec,
      relatedPageOption,
      linkDisplayName,
      picUrl,
      imgErrer,
      releErrer,
      isEditing,
    } = this.state;
    return (
      <>
        <div className={styles.appleRight}>
          <p style={{ fontWeight: 500, fontSize: 22, color: '#333' }}>广告设置</p>
          <p>
            <span>打开小程序弹屏广告</span>
            <Switch checked={isOpen} onChange={this.adSwitchClick} />
          </p>

          {isOpen && (
            <ul className={styles.adsetBox}>
              <li>
                <p className={styles.required}>
                  {`弹屏广告  `}
                  <Popover
                    placement="rightTop"
                    className="uploadHint"
                    content="弹层广告封面，用于广告内容显示，建议尺寸600px*840px"
                  >
                    <Icon type="question-circle" />
                  </Popover>
                </p>
                {!picUrl ? (
                  <div
                    className={`${styles.upIconBox} ${imgErrer ? styles.imgErrer : ''}`}
                    onClick={() => this.setState({ imgEdtor: true })}
                  >
                    <Icon type="plus" />
                    <b>点击上传封面图</b>
                    <span className={styles.errMsg}>请正确填写图片广告</span>
                  </div>
                ) : (
                  <div className={styles.masker} onClick={() => this.setState({ imgEdtor: true })}>
                    <img src={picUrl} />
                    <span>
                      <Icon type="edit" />
                    </span>
                  </div>
                )}
              </li>

              <li>
                <p>弹屏广告关联页面 </p>
                <div
                  className={`${releErrer ? styles.releErrer : ''}`}
                  onClick={e => e.stopPropagation()}
                >
                  <Input
                    readOnly
                    value={linkDisplayName}
                    placeholder="请选择关联页面"
                    onFocus={() => this.releInpClick(true)}
                    suffix={<Icon type="down" className={styles.inpSuffix} />}
                  />
                  <span className={styles.errMsg}>请正确填写弹屏广告关联页面</span>
                  {showSec &&
                    relatedPageOption.length > 0 && (
                      <CascadeSelect
                        callFun={arr => this.touchRelece(arr)} // 对外暴露的回调，用来把数据传出去
                        optsArr={relatedPageOption} // 渲染组件需要的数据
                      />
                    )}
                </div>
              </li>
            </ul>
          )}

          <Button type="primary" loading={btnLoading} onClick={this.submitClick}>
            保存
          </Button>
        </div>

        <Upload
          visible={imgEdtor}
          selectNum={1}
          destroy={true}
          handleOk={data => this.handleUploadOk(data)}
          handleCancel={() => this.setState({ imgEdtor: false })}
        />

        <Prompt isEditing={isEditing} submitFun={this.saveAdCofig} />
      </>
    );
  }
}
