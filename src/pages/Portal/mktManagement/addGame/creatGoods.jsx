/*
 * @Author: tdd 
 * @Date: 2021-04-12 11:09:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-12 14:49:12 
 * 添加、修改商品
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import { defaultGoods, prizeImg, tipsTable } from '../tools/data';
import { calcNumInArr, urlParamHash } from '../tools';
import Upload from '@/components/Upload/Upload';
import mktApi from '@/services/mktActivity';
import {
  Button,
  Input,
  Table,
  Checkbox,
  Icon,
  Tooltip,
  message,
  InputNumber,
  Modal,
  Form,
} from 'antd';
import styles from './addGame.less';

const maxLen = 8;
const { Item } = Form;

export default function CreatGoods(props) {
  const { isEdit } = props;
  const { newAct, setnewUrl, setstepNum, curGoods, curActDate, setcurGoods } = useContext(ctx);
  const [imgEdtor, setimgEdtor] = useState(false);
  const [curInd, setcurInd] = useState(-1);
  const actType = newAct?.activityType || 1;
  const gsColumns = creatGoodsCol(curGoods?.length) || [];

  useEffect(() => {
    !isEdit && touchgsList();
  }, []);

  // 获取奖品们
  function touchgsList() {
    const len = defaultGoods.length;
    const dArr = defaultGoods.map((gs, ind) => {
      let isPrize = 1;
      let prizeNum = 100;
      if (ind === len - 1) {
        isPrize = 0;
        prizeNum = 1000;
      }
      // prizeNum 总数， prizeBeNum 已抽, prizeSuNum 剩余
      return {
        prizeImage: `${prizeImg}${ind + 1}@2x.png`,
        prizeName: gs,
        prizeBeNum: 0,
        probability: 0,
        prizeSuNum: 100,
        prizeNum,
        isPrize,
      };
    });

    const arr = calcNumInArr(dArr);
    setcurGoods(arr.slice());
  }

  // input值变化时更新数据
  function inpChange(e, key, rec) {
    const val = e?.target ? e.target?.value : e;
    const statusKey = `${key}Status`;
    const errKey = `${key}ErrMsg`;
    if (!val) {
      rec[statusKey] = 'error';
      rec[errKey] = '请先输入主标题';
    } else {
      rec[statusKey] = 'success';
      rec[errKey] = '';
    }
    rec[key] = val;
    setcurGoods(curGoods.slice());
  }

  // 失去焦点时计算抽中率
  function inpNumBlur(e, rec) {
    const { target } = e;
    const { prizeNum, prizeBeNum, originNum } = rec;
    if (prizeNum < prizeBeNum) {
      console.log(prizeNum, prizeBeNum, originNum);
      message.error('奖项数量不可小于已抽数量，请您重新输入');
      target.focus();
      rec.prizeNum = originNum; //赋原值
      setcurGoods(curGoods.slice());
    } else {
      const arr = calcNumInArr(curGoods);
      setcurGoods(arr.slice());
    }
  }

  // 创建奖品columns
  function creatGoodsCol(len) {
    return [
      {
        title: '奖项图片',
        dataIndex: 'prizeImage',
        render: (text, record, ind) => (
          <div className={styles.minImgBox} onClick={() => toChooseImg(ind)}>
            <img src={record.prizeImage || `${prizeImg}1@2x.png`} alt="" />
          </div>
        ),
      },
      {
        title: () => (
          <>
            <span style={{ color: 'red' }}>*</span> 奖项名称
          </>
        ),
        dataIndex: 'prizeName',
        width: 160,
        render: (text, record, ind) => {
          const { prizeNameStatus = 'success', prizeNameErrMsg = '', prizeName } = record;
          return (
            <Form layout="inline">
              <Item validateStatus={prizeNameStatus} help={prizeNameErrMsg}>
                <Input
                  maxLength={6}
                  value={prizeName}
                  onChange={e => inpChange(e, 'prizeName', record)}
                />
              </Item>
            </Form>
          );
        },
      },
      {
        title: () => (
          <>
            <span style={{ color: 'red' }}>*</span> 奖项数量
          </>
        ),
        dataIndex: 'prizeNum',
        width: 100,
        render: (text, record, ind) => {
          const { prizeNumStatus = 'success', prizeNumErrMsg = '', prizeNum } = record;
          return (
            <Form layout="inline">
              <Item validateStatus={prizeNumStatus} help={prizeNumErrMsg}>
                <InputNumber
                  precision={0}
                  max={99999}
                  min={1}
                  value={prizeNum}
                  onBlur={e => inpNumBlur(e, record)}
                  onChange={e => inpChange(e, 'prizeNum', record)}
                  style={{ width: 110 }}
                />
              </Item>
            </Form>
          );
        },
      },
      {
        title: '抽中概率(%)',
        dataIndex: 'probability',
      },
      {
        title: '当前已抽数据',
        dataIndex: 'prizeBeNum',
      },
      {
        title: '当前剩余数量',
        dataIndex: 'prizeSuNum',
      },
      {
        title: () => {
          return (
            <>
              <Tooltip title={tipsTable}>
                操作 <Icon type="question-circle" style={{ color: '#16a' }} />
              </Tooltip>
            </>
          );
        },
        dataIndex: 'isPrize',
        width: 150,
        render: (text, record, ind) => (
          <div className={styles.tbOpration}>
            <Checkbox checked={!!record.isPrize} onChange={e => checkboxChange(e, ind)}>
              奖品
            </Checkbox>
            <div className={styles.abox}>
              <a disabled={ind === 0} onClick={() => toMove(ind, -1)}>
                <Icon type="arrow-up" />
              </a>
              <a disabled={ind === len - 1} onClick={() => toMove(ind, 1)}>
                <Icon type="arrow-down" />
              </a>
              <a disabled={ind < 4 || actType === 3} onClick={() => delImg(ind)}>
                <Icon type="delete" />
              </a>
            </div>
          </div>
        ),
      },
    ];
  }

  // 点击复选
  function checkboxChange(e, ind) {
    console.log(e);
    const { target } = e;
    curGoods[ind].isPrize = +target.checked;
    console.log(curGoods);
    setcurGoods(curGoods.slice());
  }

  // 打开图片选择器
  function toChooseImg(num) {
    setimgEdtor(true);
    setcurInd(num);
  }

  // 图片选择
  function handleUploadOk(data) {
    curGoods[curInd].prizeImage = data[0].path;
    setcurGoods(curGoods.slice());
    setimgEdtor(false);
  }

  function toMove(ind, num) {
    const rec = curGoods.splice(ind, 1)[0];
    curGoods.splice(ind + num, 0, rec);
    setcurGoods(curGoods.slice());
  }

  function delImg(num) {
    curGoods.splice(num, 1);
    const arr = calcNumInArr(curGoods);
    setcurGoods(arr.slice());
  }

  // 奖项数量更新提醒
  function showError(arr) {
    Modal.error({
      title: '奖项数量更新提醒',
      content: (
        <>
          <p>您好！部分奖项在保存时已抽数量已发生变化，请更新后再提交。</p>
          <div className={styles.tips}>
            {arr.map(con => {
              const { prizeName, prizeBeNum } = con;
              return <p key={prizeName}> {`${prizeName}，当前已抽${prizeBeNum}，请调整`}</p>;
            })}
          </div>
        </>
      ),
    });
  }

  // 找出数量不正确的项
  function touchErrNums(list) {
    const errArr = [];
    list.forEach(gs => {
      const { prizeNum, prizeBeNum, prizeSuNum } = gs;
      prizeNum < prizeBeNum + prizeSuNum && errArr.push(gs);
    });
    return errArr;
  }

  // 将最新的数据合成进来
  // 用uid作为key，寻找已经更新过的 prizeBeNum，赋值给目标
  function updateCurArr(latestArr) {
    const arr = curGoods.map(gs => {
      const { uid, prizeBeNum } = gs;
      for (let i = 0, k = latestArr.length; i < k; i++) {
        const item = latestArr[i];
        // 找到相同uid下的已抽数据，如果不相等，则认为数据已变
        if (uid === item.uid && prizeBeNum !== item.prizeBeNum) {
          gs.prizeBeNum = item.prizeBeNum;
          break;
        }
      }
      return gs;
    });

    return touchErrNums(arr);
  }

  // 指定字段为空，则视为未填
  function isValEmpty() {
    const isEmpty = [];
    const arr = curGoods.map(gs => {
      const { prizeName = '', prizeNum = 0 } = gs;
      if (!prizeName.replace(/(^\s*)|(\s*$)/g, '')) {
        gs.prizeNameStatus = 'error';
        gs.prizeNameErrMsg = '请填写奖项名称';
        isEmpty.push(prizeName);
      }
      if (!prizeNum) {
        gs.prizeNumStatus = 'error';
        gs.prizeNumErrMsg = '请填写奖项数量';
        isEmpty.push(prizeNum);
      }
      return gs;
    });
    setcurGoods(arr.slice());
    // console.log
    return isEmpty.length > 0;
  }

  // 提交奖项
  function submitGoods() {
    // 非空校验
    if (isValEmpty()) return;

    // 数字合格校验
    if (isEdit) {
      const { uid } = urlParamHash(location.href);
      mktApi.getActivity({ uid }).then(res => {
        console.log(res);
        if (!res?.data) return message.error(res.message);
        const errArr = updateCurArr(res.data?.prizeList);
        if (errArr.length > 0) return showError(errArr);

        // 校验通过后再提交
        const params = {
          activityCode: curActDate.activityCode,
          activityTitle: curActDate.activityTitle,
          prizeList: curGoods,
        };

        mktApi.updatePrize(params).then(res => {
          console.log(res);
          res?.data && message.success('保存成功');
        });
      });
    } else {
      const errArr = touchErrNums(curGoods);
      if (errArr.length > 0) return showError(errArr);
      const params = {
        ...newAct,
        prizeList: curGoods,
      };
      mktApi.newlyActivity(params).then(res => {
        console.log(res);
        if (!res?.data) return;
        setnewUrl(res.data.linkUrl);
        setstepNum(2);
      });
    }
  }

  function addNewImgs() {
    if (curGoods.length >= maxLen) return message.error(`最多可添加${maxLen}个奖项哦`);
    setcurGoods([...curGoods, {}]);
  }

  return (
    <div className={styles.goodsAddBox}>
      <Table
        size="middle"
        dataSource={curGoods}
        columns={gsColumns}
        pagination={false}
        rowKey={(r, i) => i}
      />
      {actType !== 3 && (
        <p className={styles.addImg} onClick={addNewImgs}>
          <span>+</span>
          <span>添加奖项</span>
        </p>
      )}
      <div className={styles.btnBox}>
        <Button type="primary" onClick={submitGoods}>
          {isEdit ? '保存' : '提交'}
        </Button>
        {!isEdit && <Button onClick={() => setstepNum(0)}>上一步</Button>}
      </div>
      <Upload
        visible={imgEdtor}
        selectNum={1}
        destroy={true}
        handleOk={data => handleUploadOk(data)}
        handleCancel={() => setimgEdtor(false)}
      />
    </div>
  );
}
