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
import { Button, Input, Table, Checkbox, Icon, message, InputNumber } from 'antd';
import styles from './addGame.less';

const maxLen = 8;
const defaultImg =
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/3b600bce739e40e799f24dd6278070eb/img_banner_lake@2x.png';

export default function CreatGoods(props) {
  const { gData } = props;
  const { newAct, setnewUrl, setstepNum } = useContext(ctx);
  const [gsList, setgsList] = useState([]);
  const [imgEdtor, setimgEdtor] = useState(false);
  const [gsColumns, setgsColumns] = useState([]);
  const [curInd, setcurInd] = useState(-1);
  const actType = newAct ? newAct?.activityType : gData?.activityType;

  useEffect(
    () => {
      setgsColumns(creatGoodsCol(gsList.length));
    },
    [gsList]
  );

  useEffect(
    () => {
      const list = touchgsList();
      calcNumInArr(list, -1);
    },
    [gData]
  );

  // 获取奖品们
  function touchgsList() {
    if (gData?.prizeList?.length > 0) {
      return gData.prizeList;
    }

    const len = defaultGoods.length;
    return defaultGoods.map((gs, ind) => {
      const isPrize = ind === len - 1 ? 0 : 1;
      return {
        prizeImage: defaultImg,
        prizeName: gs,
        prizeNum: 100,
        prizeBeNum: 100,
        probability: '6.67',
        prizeSuNum: 0,
        isPrize,
      };
    });
  }

  // 计算 抽中概率 剩余数量 并加工数据
  // prizeNum 总数， prizeBeNum 已抽, prizeSuNum 剩余
  function calcNumInArr(list) {
    const numArr = list.map(li => +li.prizeNum);
    const totals = numArr.reduce((p, c) => +p + +c); //计算总和
    list.forEach((gs, ind) => {
      // gs.prizeBeNum = 40;
      const { prizeNum, prizeBeNum } = gs;
      gs['originNum'] = +prizeNum; // 暂存
      gs['probability'] = ((+prizeNum * 100) / totals).toFixed(2); // 抽中概率
      gs['prizeSuNum'] = +prizeNum - +prizeBeNum; // 剩余
    });
    setgsList(list.slice());
  }

  // input值变化时更新数据
  function inpChange(e, key, rec) {
    const { target } = e;
    const val = target ? target.value : e;
    rec[key] = val;
    // setgsList(gsList.slice());
  }

  function inpNumBlur(e, rec) {
    // const { target } = e;
    const { prizeNum, prizeBeNum, originNum } = rec;
    if (prizeNum < prizeBeNum) {
      console.log(prizeNum, prizeBeNum, originNum);
      message.error('奖项数量不可小于已抽数量，请您重新输入');
      // target.focus();
      rec.prizeNum = originNum; //赋原值
      setgsList(gsList.slice());
    } else {
      calcNumInArr(gsList);
    }
  }

  function checkPrizeNum() {}

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
            defaultValue={record.prizeName}
            onChange={e => inpChange(e, 'prizeName', record)}
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
            defaultValue={record.prizeNum}
            onBlur={e => inpNumBlur(e, record)}
            onChange={e => inpChange(e, 'prizeNum', record)}
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
            <Checkbox checked={!!record.isPrize} onChange={checkboxChange}>
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

  // 打开图片选择器
  function toChooseImg(num) {
    setimgEdtor(true);
    setcurInd(num);
  }

  // 图片选择
  function handleUploadOk(data) {
    gsList[curInd].prizeImage = data[0].path;
    setgsList(gsList.slice());
    setimgEdtor(false);
  }

  function checkboxChange(v) {
    console.log(v);
  }

  function toMove(ind, num) {
    const rec = gsList.splice(ind, 1)[0];
    gsList.splice(ind + num, 0, rec);
    setgsList(gsList.slice());
  }

  function delImg(num) {
    gsList.splice(num, 1);
    setgsList(gsList.slice());
  }

  function submitGoods() {
    console.log(gData);
    if (!gData) {
      const params = {
        ...newAct,
        prizeList: gsList,
      };
      mktApi.newlyActivity(params).then(res => {
        console.log(res);
        if (!res?.data) return;
        setnewUrl(res.data.linkUrl);
        setstepNum(2);
      });
    } else {
      const params = {
        activityCode: gData.activityCode,
        activityTitle: gData.activityTitle,
        prizeList: gsList,
      };

      mktApi.updatePrize(params).then(res => {
        console.log(res);
        res?.data && message.success('保存成功');
      });
    }
  }

  function addNewImgs() {
    if (gsList.length >= maxLen) return message.error(`最多可添加${maxLen}个奖项哦`);
    setgsList([...gsList, {}]);
  }

  return (
    <div className={styles.goodsAddBox}>
      <Table
        size="middle"
        dataSource={gsList}
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
          {gData ? '保存' : '提交'}
        </Button>
        {!gData && <Button onClick={() => setstepNum(0)}>上一步</Button>}
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
