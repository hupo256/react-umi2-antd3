/*
 * @Author: tdd
 * @Date: 2021-04-06 10:05:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-07 16:11:12
 * 内容模块标题
 */
import React, { useContext } from 'react';
import { ctx } from '../../common/context';
import { Icon } from 'antd';
import { canEditTags, emptyMdText } from '../../tools/data';
import pageStyle from '../preview.less';

export default function MdTitle(props) {
  const { tips = '', flag, isEmpty, children } = props;
  const { curFlag, setcurFlag, pageData, setMdTip } = useContext(ctx);
  const canEdit = canEditTags.includes(flag);
  const text = touchTipsCon();

  function touchTipsCon() {
    let tip =''
    if (flag === 'article') {
      const article = pageData?.jsonData?.find(e => e.flag === 'article')
      if (!article?.showModule) {
        tip = '请在文章库中添加文章哦'
      }
    }

    return canEdit ? (
      <>
        <Icon type="edit" />
        <span>{`编辑${tips}`}</span>
      </>
    ) : (
      <>{isEmpty ? emptyMdText[flag] : tip || '系统自动生成，无需编辑'}</>
    );
  }

  function hoverBoxClick() {
    setcurFlag(flag);
    setMdTip(tips);
  }

  return (
    <div
      className={`${pageStyle.hoverBox} ${flag === curFlag ? pageStyle.curMd : ''}`}
      style={{ padding: flag === 'nav' ? 0 : 16, height: flag === 'nav' ? '100%' : 'auto' }}
    >
      <span
        onClick={hoverBoxClick}
        className={`${pageStyle.hoverHandle} ${!canEdit ? pageStyle.block : ''}`}
      >
        {text}
      </span>
      {children}
    </div>
  );
}
