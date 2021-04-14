/*
 * @Author: tdd 
 * @Date: 2021-04-06 10:05:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-07 16:11:12 
 * 内容模块标题
 */
import React, { useContext } from 'react';
import { ctx } from '../../common/context';
import { canEditTags } from '../../tools/data';
import pageStyle from '../preview.less';

export default function MdTitle(props) {
  const { tips = '', flag, children } = props;
  const { curFlag, setcurFlag } = useContext(ctx);
  const canEdit = canEditTags.includes(flag);
  const text = canEdit ? `编辑${tips}` : `系统自动生成，无需编辑`;

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
