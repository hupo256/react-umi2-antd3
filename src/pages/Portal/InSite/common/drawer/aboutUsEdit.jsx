/*
 * @Author: tdd
 * @Date: 2021-03-23 13:49:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-03-23 13:49:12
 * 编辑亮点
 */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ctx } from '../context';
import { Input, Icon, message, Form } from 'antd';
import { defaultImg, highlightsBgImgs } from '../../tools/data';
import Upload from '@/components/Upload/Upload';
import styles from './drawerEditor.less';
import Select from './Select';

const maxLen = 6;
const { Item } = Form;

export default function TagsEdit(props) {
  const { pageData, setpageData, curFlag, setlinkEdtor, setcurInd, setimgEdtor, imgEdtor } = useContext(ctx);
  // const nameObj = {
  //   vaStatus : 'success',
  //   errMsg : '',
  // }
  // const contentObj = {
  //   vaStatus : 'success',
  //   errMsg : '',
  // }
  const { name, content, url, defvalue = '', type,  nameObj = {  vaStatus : 'success',errMsg : '',}, contentObj = {  vaStatus : 'success',errMsg : '',}  } = pageData?.jsonData?.find(e => e.flag === curFlag);
  console.log(nameObj, content, url);
  const titInp = useRef();
  function delImg(num) {
    tagList.splice(num, 1);
  }

  function tagsTexChange(e, rec) {
    const newObj = { ...pageData };
    const result = newObj?.jsonData?.find(e => e.flag === curFlag);
    let val = e.target.value;
    if (val?.length > 10) {
      message.error('最多可输入10个字符哦')
      // nameObj.vaStatus = 'error';
      // nameObj.errMsg = '最多10个字符';
    } else {
      nameObj.vaStatus = 'success';
      nameObj.errMsg = '';
    }
    result.name = val;
    result.nameObj = nameObj;
    setpageData(newObj);
  }

  function discTexChange(e) {
    const newObj = { ...pageData };
    const result = newObj?.jsonData?.find(e => e.flag === curFlag);
    let val = e.target.value;
    if (val?.length > 30) {
      message.error('最多可输入30个字符哦')
      // contentObj.vaStatus = 'error';
      // contentObj.errMsg = '最多30个字符';
    } else {
      contentObj.vaStatus = 'success';
      contentObj.errMsg = '';
    }
    result.content = val;
    result.contentObj = contentObj;
    setpageData(newObj);
  }
  function toChooseImg() {
    setimgEdtor(true);
  }
  // 图片选择
  function handleUploadOk(data) {
    const newObj = { ...pageData };
    const result = newObj?.jsonData?.find(e => e.flag === curFlag);
    if (data.length) {
      result.url = data[0].path;
      setpageData(newObj);
    }
    setimgEdtor(false);
  }
  function handleSelect(value) {
    console.log(value)
    const newObj = { ...pageData };
    const result = newObj?.jsonData?.find(e => e.flag === curFlag);
    result.defvalue = value.inputVal
    result.uid = value.uid
    result.type = value.type
    setpageData(newObj);
    // const { btnName, isEdit, defvalue } = this.state;
    // this.setState({ saveValue: value });
    if (value.type === 1) {
      // this.setState({ btnName: '立即咨询' });
    } else if (value.type === 3) {
      // btnName: null
    } else {
      // if (!btnName) {
      //   this.setState({ btnName: value.record.buttonText });
      // }
    }
  };
  return (
    <>
      <ul>
        <li style={{borderBottom: 0}}>
          <div className={styles.aboutUsBox}>
            <div className={styles.titBox}>
              <span>主标题</span>
              <span style={{ marginRight: 75 }}>副标题</span>
            </div>
            <div className={styles.taginpBox}>
              <Form layout="inline">
                <Item validateStatus={nameObj?.vaStatus} help={nameObj?.errMsg}>
                  <Input
                    ref={titInp}
                    style={{ width: '100%' }}
                    value={name}
                    // maxLength={10}
                    onBlur={e => tagsTexChange(e)}
                    onChange={e => tagsTexChange(e)}
                    placeholder="请输入主标题"
                  />
                </Item>
                <Item validateStatus={contentObj.vaStatus} help={contentObj.errMsg}>
                  <Input
                    value={content}
                    // maxLength={30}
                    onBlur={e => discTexChange(e)}
                    onChange={e => discTexChange(e)}
                    placeholder="请输入副标题"
                  />
                </Item>
              </Form>
              <div className={styles.imgLinkWrapper}>
                <div
                  className={`${styles.minImgBox} ${url ? '' : styles.deftImg}`}
                  onClick={() => toChooseImg()}
                >
                  <img src={url || `${url}ic_Image.png`} alt="" />
                </div>
                <div className={styles.inpBox}>
                  <div style={{marginBottom: 13, marginTop: 13}}>关联页面</div>
                  <Select pageData={pageData} defvalue={defvalue} type={type} handleSelect={value => handleSelect(value)} />
                </div>
              </div>

            </div>
          </div>
        </li>
      </ul>
      <Upload
        visible={imgEdtor}
        selectNum={1}
        destroy={true}
        handleOk={data => handleUploadOk(data)}
        handleCancel={() => setimgEdtor(false)}
      />
    </>
  );
}
