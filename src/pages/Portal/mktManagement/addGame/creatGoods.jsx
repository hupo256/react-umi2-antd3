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
import { Button, Input, Table, Checkbox } from 'antd';
import styles from './addGame.less';

const defaultImg =
  'https://test.img.inbase.in-deco.com/crm_saas/dev/20210408/3b600bce739e40e799f24dd6278070eb/img_banner_lake@2x.png';

export default function CreatGoods(props) {
  const { gData } = props;
  const { activityCode, activityTitle, setgoodsDone } = useContext(ctx);
  const [gsList, setgsList] = useState(() => touchgsList());
  const [imgEdtor, setimgEdtor] = useState(false);
  const gsColumns = creatGoodsCol(defaultGoods.length);

  function touchgsList() {
    if (gData?.length > 0) {
      return gData;
    }

    const len = defaultGoods.length;
    return defaultGoods.map((gs, ind) => {
      const isPrize = ind === len - 1 ? 0 : 1;
      return {
        prizeImage: defaultImg,
        prizeName: gs,
        prizeNum: 100,
        probability: '6.67',
        isPrize,
      };
    });
  }

  function toChooseImg(num) {
    setimgEdtor(true);
  }

  // 图片选择
  function handleUploadOk(data) {
    console.log(data[0].path);
    tagList[curInd].imgUrl = data[0].path;
    setpageData(pageData);
    setimgEdtor(false);
  }

  // 计算抽中概率
  function touchPro(list, num) {
    const arr = list.map(li => li.prizeNum);
    const totals = arr.reduce((p, c, ind, ar) => +p + +c);
    return num / totals;
  }

  function checkboxChange(v) {
    console.log(v);
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
        render: (text, record, ind) => <Input value={record.prizeName} />,
      },
      {
        title: '奖项数量',
        dataIndex: 'prizeNum',
        render: (text, record, ind) => <Input value={record.prizeNum} />,
      },
      {
        title: '抽中概率(%)',
        dataIndex: 'probability',
      },
      {
        title: '操作',
        dataIndex: 'isPrize',
        render: (text, record, ind) => (
          <div className={styles.tbOpration}>
            <Checkbox checked={!!record.isPrize} onChange={checkboxChange}>
              奖品
            </Checkbox>
            <div className="abox">
              <a disabled={ind === 0} onClick={() => toMove(ind, -1)}>
                up
              </a>
              <a disabled={ind === len - 1} onClick={() => toMove(ind, 1)}>
                down
              </a>
              <a disabled={len === 1} onClick={() => delImg(ind)}>
                del
              </a>
            </div>
          </div>
        ),
      },
    ];
  }

  function toMove() {
    console.log();
  }

  function delImg() {
    console.log();
  }

  function updateGoods() {
    const params = {
      activityCode,
      activityTitle,
      prizeInfo: gsList,
    };

    mktApi.newPrize(params).then(res => {
      console.log(res);
      const { code } = res;
      if (gData) return;
      if (code === 200) setgoodsDone(true);
    });
  }

  function addNewImgs() {
    // const item = gsList[0]
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
      <p className={styles.addImg} onClick={addNewImgs}>
        <span>+</span>
        <span>添加奖项</span>
      </p>
      <div className={styles.btnBox}>
        <Button type="primary" onClick={() => updateGoods(gData)}>
          {gData ? '保存' : '提交'}
        </Button>
        {!gData && <Button>上一步</Button>}
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
