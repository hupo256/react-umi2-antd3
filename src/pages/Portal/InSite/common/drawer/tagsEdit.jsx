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
import LinkChoose from './linkChoose';
import styles from './drawerEditor.less';

const maxLen = 6;
const { Item } = Form;

export default function TagsEdit(props) {
  const { pageData, setpageData, curFlag, setlinkEdtor, setcurInd } = useContext(ctx);
  const [tagList = [], settagList] = useState(() => pageData?.maps?.[curFlag]?.list);
  const titInp = useRef();

  function addNewImgs() {
    if (tagList.length === maxLen) return message.warning(`最多可添加${maxLen}个亮点`);
    const rec = {};
    settagList([...tagList, rec].slice());
    setTimeout(() => {
      titInp.current.focus();
    });
  }

  function toChooseLink(num) {
    setcurInd(num);
    setlinkEdtor(true);
  }

  function forUpdatePageData() {
    const newObj = { ...pageData };
    newObj.maps[curFlag].list = tagList;
    settagList(tagList.slice());
    setpageData(newObj);
  }

  function delImg(num) {
    tagList.splice(num, 1);
    forUpdatePageData();
  }

  function toMove(ind, num) {
    const rec = tagList.splice(ind, 1)[0];
    tagList.splice(ind + num, 0, rec);
    forUpdatePageData();
  }

  function tagsTexBlur(e, rec) {
    const val = e?.target?.value;
    if (!val) {
      rec.vaStatus = 'error';
      rec.errMsg = '请先输入主标题';
    } else {
      rec.vaStatus = 'success';
      rec.errMsg = '';
    }
    settagList(tagList.slice());
  }

  function discTexBlur(e, rec) {
    const val = e?.target?.value;
    if (val) {
      rec.vaStatus = 'success';
      rec.errMsg = '';
    }
  }

  function tagsTexChange(e, rec) {
    let val = e.target.value;
    if (val) {
      rec.vaStatus = 'success';
      rec.errMsg = '';
    }
    if (val?.length > 6) {
      rec.vaStatus = 'error';
      rec.errMsg = '~最多6个字符';
      val = val.substr(0, 6);
    }
    rec.title = val;
    forUpdatePageData();
  }

  function discTexChange(e, rec) {
    let val = e.target.value;
    if (val?.length > 14) {
      rec.vaStatus = 'error';
      rec.errMsg = '最多14个字符';
      val = val.substr(0, 14);
    }
    rec.desc = val;
    forUpdatePageData();
  }

  return (
    <>
      <ul>
        {tagList?.length > 0 &&
          tagList.map((tag, ind) => {
            const { title, desc, vaStatus = 'success', errMsg = '', text = '' } = tag;
            const len = tagList.length;
            return (
              <li key={ind}>
                <div className={styles.tbOpration}>
                  <a disabled={ind === 0} onClick={() => toMove(ind, -1)}>
                    <Icon type="arrow-up" />
                  </a>
                  <a disabled={ind === len - 1} onClick={() => toMove(ind, 1)}>
                    <Icon type="arrow-down" />
                  </a>
                  <a disabled={len === 1} onClick={() => delImg(ind)}>
                    <Icon type="delete" />
                  </a>
                </div>
                <div className={styles.taginpBox}>
                  <Form layout="inline">
                    <Item validateStatus={vaStatus} help={errMsg}>
                      <Input
                        ref={titInp}
                        style={{ width: '100%' }}
                        value={title}
                        onBlur={e => tagsTexBlur(e, tag)}
                        onChange={e => tagsTexChange(e, tag)}
                        placeholder="请输入主标题"
                      />
                    </Item>
                  </Form>
                  <Input
                    value={desc}
                    onBlur={e => discTexBlur(e, tag)}
                    onChange={e => discTexChange(e, tag)}
                    placeholder="请输入副文本"
                  />
                  <Input
                    value={text}
                    placeholder="请设置跳转链接"
                    onClick={() => toChooseLink(ind)}
                  />
                </div>
              </li>
            );
          })}
      </ul>

      <p className={styles.addImg} onClick={addNewImgs}>
        <span>+</span>
        <span>添加亮点</span>
      </p>

      <LinkChoose dList={tagList} />
    </>
  );
}
