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
import { highlightsBgImgs } from '../../tools/data';
import AddMore from './addMore';
import Cascader from './cascader';
import styles from './drawerEditor.less';

const maxLen = 8;
const { Item } = Form;

export default function TagsEdit(props) {
  const { pageData, setpageData, curFlag } = useContext(ctx);
  const [tagList = [], settagList] = useState(() => touchTagList());
  const titInp = useRef();

  function touchTagList() {
    const arr = pageData?.maps?.[curFlag]?.list;
    return arr?.map(item => ({ ...item, showSec: false }));
  }

  function addNewTag() {
    const len = tagList.length;
    if (len === maxLen) return message.warning(`最多可添加${maxLen}个亮点`);
    const newTag = { imgUrl: highlightsBgImgs[len] };
    tagList.push(newTag);
    forUpdatePageData();

    setTimeout(() => {
      titInp.current.focus();
    });
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

  function tagsTexChange(e, rec) {
    let val = e.target.value;
    if (val?.length > 6) {
      rec.vaStatus = 'error';
      rec.errMsg = '最多6个字符';
    } else {
      rec.vaStatus = 'success';
      rec.errMsg = '';
    }
    rec.title = val;
    forUpdatePageData();
  }

  function discTexChange(e, rec) {
    let val = e.target.value;
    if (val?.length > 14) {
      rec.desStatus = 'error';
      rec.desMsg = '最多14个字符';
    } else {
      rec.desStatus = 'success';
      rec.desMsg = '';
    }
    rec.desc = val;
    forUpdatePageData();
  }

  return (
    <>
      <ul>
        {tagList?.length > 0 &&
          tagList.map((tag, ind) => {
            const {
              title,
              desc,
              vaStatus = 'success',
              errMsg = '',
              desStatus = 'success',
              desMsg = '',
            } = tag;
            const len = tagList.length;
            return (
              <li key={ind}>
                <div className={styles.titBox}>
                  <span>主标题</span>
                  <span>副标题</span>
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
                </div>
                <div className={styles.taginpBox}>
                  <Form layout="inline">
                    <Item validateStatus={vaStatus} help={errMsg}>
                      <Input
                        ref={titInp}
                        style={{ width: '100%' }}
                        value={title}
                        maxLength={6}
                        onBlur={e => tagsTexChange(e, tag)}
                        onChange={e => tagsTexChange(e, tag)}
                        placeholder="请输入主标题"
                      />
                    </Item>

                    <Item validateStatus={desStatus} help={desMsg}>
                      <Input
                        value={desc}
                        maxLength={14}
                        onBlur={e => discTexChange(e, tag)}
                        onChange={e => discTexChange(e, tag)}
                        placeholder="请输入副标题"
                      />
                    </Item>
                  </Form>

                  <p>关联页面</p>
                  <Cascader itemInd={ind} tagList={tagList} forUpdatePageData={forUpdatePageData} />
                </div>
              </li>
            );
          })}
      </ul>

      <AddMore clickHandle={addNewTag} />
    </>
  );
}
