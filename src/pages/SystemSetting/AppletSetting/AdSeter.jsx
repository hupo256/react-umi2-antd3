/*
 * @Author: tdd 
 * @Date: 2020-06-14 14:35:33 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-06-16 15:09:47
 * 广告设置
 */
import React, { PureComponent } from 'react';
import { message, Popover, Button, Input, Switch, Icon } from 'antd';
import { openadvGet, openadvSave } from '@/services/miniProgram';
import { getRelatedPage } from '@/services/channelManage';
import RelevanceInp from '@/pages/ChannelManage/components/RelevanceInp';
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
    paths: [], // 已选出来的数据
    linkType: -1, // 已选出来的数据
    linkDisplayName: '', // 回显关联页面inut的值
    picUrl: '',
    imgErrer: false,
    releErrer: false,
  };

  componentDidMount() {
    openadvGet().then(res => {
      console.log(res);
      if (!res?.data) return;
      this.setState({ ...res.data });
    });
    getRelatedPage({ sceneType: 3 }).then(res => {
      if (!res?.data) return;
      this.setState({ relatedPageOption: res?.data });
    });
  }

  componentDidUpdate(prevProps) {
    const { showSecTag } = this.props;
    // showSecTag !== prevProps.showSecTag &&
    //   this.setState({ showSec: showSecTag, linkDisplayName: '' });
    
    if(showSecTag !== prevProps.showSecTag){
      const { linkType } = this.state
      const linkDisplayName = linkType === 1 ? linkDisplayName : ''
      this.setState({ showSec: showSecTag, linkDisplayName });
    }
  }

  adSwitchClick = val => {
    this.setState({ isOpen: val, isEditing: true });
  };

  // 图片选择
  handleUploadOk = data => {
    console.log(data[0].path);
    this.setState({ imgEdtor: false, picUrl: data[0].path, isEditing: true });
  };

  // 点击input
  releInpClick = () => {
    const { taggleSecTag } = this.props;
    taggleSecTag();
    this.setState({ showSec: false }, () => {
      this.setState({ showSec: true, linkDisplayName: '', releErrer: false, isEditing: true });
    });
  };

  // 点击selector
  touchRelece = arr => {
    console.log(arr)
    const tex = arr.map(p => p.text).join('/');
    const paths = arr.map(p => p.code);
    const linkType = arr[arr.length - 1]?.linkType;
    console.log(linkType)
    this.setState({ linkDisplayName: tex, paths, linkType, releErrer: false });
  };

  saveAdCofig = route => {
    const { picUrl, paths, linkType, isOpen } = this.state;
    console.log(paths, linkType)
    const len = paths.length;
    const detailUid = len === 3 ? paths[2] : '';

    // 提交前检验
    if (!picUrl) return this.setState({ imgErrer: true });
    if (len !== 0 && linkType !== 1) return this.setState({ releErrer: true });

    this.setState({ btnLoading: true });
    const param = { isOpen, detailUid, paths, picUrl };
    openadvSave(param).then(res => {
      console.log(res);
      this.setState({ btnLoading: false });
      res?.message && message.error(res.message);
      if (res.code === 200) {
        message.success('编辑已保存，已实时生效');
        route && router.push(route); // 如果是从prompt过来的，还需要跳转
      }
    });
  };

  submitClick = e => {
    console.log(e)
    e.stopPropagation()
    this.saveAdCofig()
  }

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
                      <RelevanceInp
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
