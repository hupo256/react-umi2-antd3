/*
 * @Author: tdd
 * @Date: 2021-07-07 10:09:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-07-07 13:09:12
 * banner 与 highlights共用的关联页面选择器
 */
import React, { useEffect, useContext } from 'react';
import { ctx } from '../context';
import CascadeSelect from '@/pages/ChannelManage/components/CascadeSelect';

export default function Cascader(props) {
  const { itemInd, tagList, forUpdatePageData } = props;
  const { relatedPageOption, touchRelatedOpts } = useContext(ctx);

  useEffect(() => {
    touchRelatedOpts(5);
  }, []);

  // 点击input
  function relevClick(num) {
    for (let i = 0, k = tagList.length; i < k; i++) {
      const tag = tagList[i];
      const { paths = [], isEnd } = tag;
      tag.showSec = i === num;
      if (paths?.length !== 2 || !isEnd) {
        tag.linkDisplayName = ''; // 如果弟兄input没选到末点，就清空
      }
    }
    forUpdatePageData();
  }

  function touchRelece(arr, num) {
    console.log(arr);
    const len = arr.length;
    const { isEnd, linkKey } = arr?.[len - 1];
    const appletsName = arr.map(p => p.text).join('/');
    if (isEnd) {
      const ind = len - 2 < 0 ? 0 : len - 2;
      const { appletsLink, linkType } = arr?.[ind];
      const paths = arr.map(p => p.code);
      const uid = linkKey ? '' : paths.pop(); // 没有linkKey 表示选择了详情页,
      tagList[num] = {
        ...tagList[num],
        paths,
        appletsName,
        isEnd,
        uid,
        linkType,
        detailUid: uid,
        appletsLinkUrl: appletsLink,
        showSec: false, // 选到的末级则自动关闭
      };
    } else {
      tagList[num] = {
        ...tagList[num],
        appletsName,
        isEnd,
      };
    }

    forUpdatePageData();
  }

  return (
    <CascadeSelect
      curItem={tagList[itemInd]}
      cascadeClick={() => relevClick(itemInd)}
      callFun={arr => touchRelece(arr, itemInd)} // 对外暴露的回调，用来把数据传出去
      optsArr={relatedPageOption} // 渲染组件需要的数据
    />
  );
}
