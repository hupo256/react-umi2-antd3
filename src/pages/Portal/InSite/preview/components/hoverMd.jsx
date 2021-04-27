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
  const { curFlag, setcurFlag } = useContext(ctx);
  const canEdit = canEditTags.includes(flag);
  const text = touchTipsCon();

  function touchTipsCon() {
    return canEdit ? (
      <>
        <Icon type="edit" />
        <span>{`编辑${tips}`}</span>
      </>
    ) : (
      <>{isEmpty ? emptyMdText[flag] : '系统自动生成，无需编辑'}</>
    );
  }

  return (
    <div className={`${pageStyle.hoverBox} ${flag === curFlag ? pageStyle.curMd : ''}`}>
      <span
        onClick={() => setcurFlag(flag)}
        className={`${pageStyle.hoverHandle} ${!canEdit ? pageStyle.block : ''}`}
      >
        {text}
      </span>
      {children}
    </div>
  );
}
