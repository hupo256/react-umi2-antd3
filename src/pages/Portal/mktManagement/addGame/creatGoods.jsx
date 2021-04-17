/*
 * @Author: tdd 
 * @Date: 2021-04-12 11:09:12 
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-12 14:49:12 
 * 添加、修改商品
 */
import React, { useState, useEffect, useContext } from 'react';
import { ctx } from '../common/context';
import { defaultGoods } from '../tools/data';
import Upload from '@/components/Upload/Upload';
import mktApi from '@/services/mktActivity';
import { Button, Input, Table, Checkbox, Icon, message, InputNumber, Modal } from 'antd';
import styles from './addGame.less';

const maxLen = 8;
const defaultImg =
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/3b600bce739e40e799f24dd6278070eb/img_banner_lake@2x.png';

export default function CreatGoods(props) {
  const { isEdit } = props;
  const { newAct, setnewUrl, setstepNum, curGoods, curActDate, setcurGoods } = useContext(ctx);
  const [imgEdtor, setimgEdtor] = useState(false);
  const [curInd, setcurInd] = useState(-1);
  const actType = newAct?.activityType || 1;
  const gsColumns = creatGoodsCol(curGoods?.length) || [];

  useEffect(() => {
    console.log(curGoods?.length);
    if (curGoods?.length === 0) {
      console.log(23);
      const list = touchgsList();
      calcNumInArr(list);
    }
  }, []);

  // 获取奖品们
  function touchgsList() {
    const len = defaultGoods.length;
    return defaultGoods.map((gs, ind) => {
      const isPrize = ind === len - 1 ? 0 : 1;
      return {
        prizeImage: defaultImg,
        prizeName: gs,
        prizeNum: 100,
        prizeBeNum: 0,
        probability: '6.67',
        prizeSuNum: 100,
        isPrize,
      };
    });
  }

  // 计算 抽中概率 剩余数量 并加工数据
  // prizeNum 总数， prizeBeNum 已抽, prizeSuNum 剩余
  function calcNumInArr(list) {
    const numArr = list.map(li => +(li.prizeNum || 0));
    const totals = numArr.reduce((p, c) => +p + +c); //计算总和
    list.forEach((gs, ind) => {
      // gs.prizeBeNum = 120;
      const { prizeNum = 0, prizeBeNum = 0 } = gs;
      gs['originNum'] = +prizeNum; // 暂存
      gs['probability'] = ((+prizeNum * 100) / totals).toFixed(2); // 抽中概率
      gs['prizeSuNum'] = +prizeNum - +prizeBeNum; // 剩余
    });
    setcurGoods(list.slice());
  }

  // input值变化时更新数据
  function inpChange(e, key, ind) {
    const { target } = e;
    const val = target ? target.value : e;
    curGoods[ind][key] = val;
    setcurGoods(curGoods.slice());
  }

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
      calcNumInArr(curGoods);
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
            <img src={record.prizeImage || defaultImg} alt="" />
          </div>
        ),
      },
      {
        title: '奖项名称',
        dataIndex: 'prizeName',
        width: 160,
        render: (text, record, ind) => (
          <Input
            maxLength={6}
            value={record.prizeName}
            onChange={e => inpChange(e, 'prizeName', ind)}
          />
        ),
      },
      {
        title: '奖项数量',
        dataIndex: 'prizeNum',
        width: 100,
        render: (text, record, ind) => (
          <InputNumber
            max={99999}
            min={1}
            value={record.prizeNum}
            onBlur={e => inpNumBlur(e, record)}
            onChange={e => inpChange(e, 'prizeNum', ind)}
          />
        ),
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
        title: '操作',
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
    setcurGoods(curGoods.slice());
  }

  function showError(arr) {
    Modal.error({
      title: '奖项数量更新提醒',
      content: (
        <>
          <p>您好！部分奖项在保存时已抽数量已发生变化，请更新后再提交。</p>
          <div className={styles.tips}>
            {arr.map((con, ind) => {
              const { prizeName, prizeBeNum } = con;
              const sdf = ``;
              return <p> {`${prizeName}，当前已抽${prizeBeNum}，请调整`}</p>;
            })}
          </div>
        </>
      ),
    });
  }

  // 找出数字不正确的项
  function touchErrNums(list) {
    const errArr = [];
    list.forEach(gs => {
      const { prizeNum, prizeBeNum } = gs;
      console.log(prizeNum, prizeBeNum);
      prizeNum < prizeBeNum && errArr.push(gs);
    });
    return errArr;
  }

  function submitGoods() {
    // 非空校验

    // 数字合格校验
    let errArr = [];
    if (isEdit) {
      const { hash } = location;
      const [, uid] = hash.split('?uid=');
      if (!uid) return;
      mktApi.getActivity({ uid }).then(res => {
        if (!res?.data) return;
        errArr = touchErrNums(res.data?.prizeList);
        if (errArr.length > 0) return showError(errArr);

        // 不然，就提交
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
