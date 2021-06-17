/*
 * @Author: tdd 
 * @Date: 2020-06-14 14:35:33 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-06-16 15:09:47
 * 广告设置
 */
import React, { useState, useContext, useEffect } from 'react';
import { message, Popover, Button, Input, Switch, Icon } from 'antd';
import { openadvGet, openadvSave } from '@/services/miniProgram';
import { getRelatedPage } from '@/services/channelManage';
import RelevanceInp from '@/pages/ChannelManage/components/RelevanceInp';
import Upload from '@/components/Upload/Upload';
import Prompt from './prompt';
import styles from './index.less';

export default function AdSeter(props) {
  const { showSecTag } = props;
  const [btnLoading, setbtnLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [imgEdtor, setimgEdtor] = useState(false);
  const [showSec, setshowSec] = useState(false);
  const [imgErrer, setimgErrer] = useState(false);
  const [releErrer, setreleErrer] = useState(false);
  const [relatedPageOption, setrelatedPageOption] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [paths, setpaths] = useState([]);
  const [linkType, setlinkType] = useState(-1);
  const [linkDisplayName, setlinkDisplayName] = useState('');
  const [picUrl, setpicUrl] = useState('');

  useEffect(
    () => {
      setshowSec(showSecTag);
    },
    [showSecTag]
  );

  useEffect(() => {
    openadvGet().then(res => {
      console.log(res);
      if (!res?.data) return;
      setadData(res.data);
    });
    getRelatedPage({ sceneType: 3 }).then(res => {
      if (!res?.data) return;
      setrelatedPageOption(res.data);
    });
  }, []);

  function adSwitchClick(val) {
    const newData = { ...adData };
    newData.isOpen = val;
    setadData(newData);
    setisEditing(true);
  }

  // 图片选择
  function handleUploadOk(data) {
    console.log(data[0].path);
    this.setState({ imgEdtor: false, picUrl: data[0].path, isEditing: true });
  }

  // 点击selector
  function releInpClick() {
    const { taggleSecTag } = this.props;
    taggleSecTag();
    this.setState({ showSec: false }, () => {
      this.setState({ showSec: true, linkDisplayName: '', releErrer: false, isEditing: true });
    });
  }

  function touchRelece(arr) {
    const tex = arr.map(p => p.text).join('/');
    const paths = arr.map(p => p.code);
    const linkType = arr[arr.length]?.linkType;
    this.setState({ linkDisplayName: tex, paths, linkType, releErrer: false });
  }

  function saveAdCofig(route) {
    const { picUrl, paths, linkType, isOpen } = this.state;
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
  }

  return (
    <>
      <div className={styles.appleRight}>
        <p style={{ fontWeight: 500, fontSize: 22, color: '#333' }}>广告设置</p>
        <p>
          <span>打开小程序弹屏广告</span>
          <Switch checked={isOpen} onChange={adSwitchClick} />
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
                  onClick={() => setimgEdtor(true)}
                >
                  <Icon type="plus" />
                  <b>点击上传封面图</b>
                  <span className={styles.errMsg}>请正确填写图片广告</span>
                </div>
              ) : (
                <div className={styles.masker} onClick={() => setimgEdtor(true)}>
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
                  onFocus={() => releInpClick(true)}
                  suffix={<Icon type="down" className={styles.inpSuffix} />}
                />
                <span className={styles.errMsg}>请正确填写弹屏广告关联页面</span>
                {showSec &&
                  relatedPageOption.length > 0 && (
                    <RelevanceInp
                      callFun={arr => touchRelece(arr)} // 对外暴露的回调，用来把数据传出去
                      optsArr={relatedPageOption} // 渲染组件需要的数据
                    />
                  )}
              </div>
            </li>
          </ul>
        )}

        <Button type="primary" loading={btnLoading} onClick={() => saveAdCofig()}>
          保存
        </Button>
      </div>

      <Upload
        visible={imgEdtor}
        selectNum={1}
        destroy={true}
        handleOk={data => handleUploadOk(data)}
        handleCancel={() => setState({ imgEdtor: false })}
      />

      <Prompt isEditing={isEditing} submitFun={saveAdCofig} />
    </>
  );
}
