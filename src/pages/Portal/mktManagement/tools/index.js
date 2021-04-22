export function createUuid() {
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';
  let uuid = s.join('');
  return uuid;
}

export function urlParamHash(url) {
  let params = {};
  let h;
  let hash = url.slice(url.indexOf('?') + 1).split('&');
  for (let i = 0; i < hash.length; i++) {
    h = hash[i].split('='); //
    params[h[0]] = h[1];
  }
  return params;
}

// 计算 抽中概率 剩余数量 并加工数据
// prizeNum 总数， prizeBeNum 已抽, prizeSuNum 剩余
export function calcNumInArr(arr) {
  const numArr = arr.map(li => +(li.prizeNum || 0));
  if (numArr.length === 0) return [];
  const totals = numArr.reduce((p, c) => +p + +c); //计算总和
  arr.forEach(gs => {
    // gs.prizeBeNum = 120;
    const { prizeNum = 0, prizeBeNum = 0 } = gs;
    !!prizeBeNum || (gs['prizeBeNum'] = 0); // 新增时重置为0
    gs['originNum'] = +prizeNum; // 暂存一下总数
    gs['prizeSuNum'] = +prizeNum - +prizeBeNum; // 剩余数
    gs['probability'] = ((+prizeNum * 100) / totals).toFixed(2); // 抽中概率
  });
  return arr;
}
