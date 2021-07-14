// 常用的正则规则
// eslint-disable-next-line
export const regExpConfig = {
  IDcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, // 身份证
  IDcardEdit: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0[0-9])|([1][0-2]))(([0|1|2|\*][0-9\*])|[3|\*][0-1\*])([0-9\*]){3}([0-9\*]|X)$/, // 身份证编辑时后六位可以为*
  mobile: /^1([3|4|5|6|7|8|9|])\d{9}$/, // 手机号码
  blank: /(^\s)|(\s$)/,
  phone: /^1([3|4|5|6|7|8|9|])(\d{1})(([0-9\*]){4})(\d{4})$/, // 手机号码
  weixin: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/, //微信
  emails: /^([A-Za-z0-9_\-\.\*])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //邮箱
  wechat: /^([a-zA-Z\*]([-_a-zA-Z0-9\*]{5,19}))|(1([3|4|5|7|8|])([0-9\*]){9})$/, //微信
  qq: /^[1-9][0-9]{4,10}$/, //QQ号 除0开头4-10位数字
  landlinemobile: /^((0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?))$|(^((13[0-9])|(14[0-9])|(15[^4,\D])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8})$/, //手机座机分机
  telephone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, // 固定电话
  num: /^[0-9]*$/, // 数字
  phoneNo: /^((0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?))$|^(((13[0-9])|(14[0-9])|(15[^4,\D])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8})$|(^400-[016789]\d{2}-\d{4}$)|(400[016789]\d{6}$)/, // 电话或者手机
  phoneNoe: /^((0\d{2}-(\d{2})(([0-9\*]){4})(\d{2})(-\d{1,4})?)|(0\d{3}-(\d{2})(([0-9\*]){4})(\d{1,2})(-\d{1,4})?))$|^(((13[0-9])|(14[0-9])|(15[^4,\D])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8})$/, // 电话或者手机
  policeNo: /^[0-9A-Za-z]{4,10}$/, // 账号4-10位数字或字母组成
  pwd: /^[0-9A-Za-z]{6,16}$/, // 密码由6-16位数字或者字母组成
  isNumAlpha: /^[0-9A-Za-z]*$/, // 字母或数字
  isAlpha: /^[a-zA-Z]*$/, // 是否字母
  isNumAlphaCn: /^[0-9a-zA-Z\u4E00-\uFA29]*$/, // 是否数字或字母或汉字
  isPostCode: /^[\d\-]*$/i, // 是否邮编
  isNumAlphaUline: /^[0-9a-zA-Z_]*$/, // 是否数字、字母或下划线
  isNumAndThanZero: /^([1-9]\d*(\.\d+)?|0)$/, // 是否为整数且大于0/^[1-9]\d*(\.\d+)?$/
  isNormalEncode: /^(\w||[\u4e00-\u9fa5]){0,}$/, // 是否为非特殊字符（包括数字字母下划线中文）
  isTableName: /^[a-zA-Z][A-Za-z0-9\#\$\_\-]{0,29}$/, // 表名
  isInt: /^-?\d+$/, // 整数
  isTableOtherName: /^[\u4e00-\u9fa5]{0,20}$/, // 别名
  // isText_30: /^(\W|\w{1,2}){0,15}$/, // 正则
  // isText_20: /^(\W|\w{1,2}){0,10}$/, // 正则
  isText_30: /^(\W|\w{1}){0,30}$/, // 匹配30个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
  isText_50: /^(\W|\w{1}){0,50}$/, // 匹配50个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
  isText_20: /^(\W|\w{1}){0,20}$/, // 匹配20个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
  isText_100: /^(\W|\w{1}){0,100}$/, // 匹配100个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
  isText_250: /^(\W|\w{1}){0,250}$/, // 匹配250个字符，字符可以使字母、数字、下划线、非字母，一个汉字算1个字符
  isNotChina: /^[^\u4e00-\u9fa5]{0,}$/, // 不为中文  IDcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, // 身份证
  IDcardAndAdmin: /^(([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))|(admin))$/, // 身份证或者是admin账号
  IDcardTrim: /^\s*(([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))|(admin))\s*$/, // 身份证
  num1: /^[1-9]*$/, // 数字
  num_number: /^[0-9]*$/, // 数字
  companyNO: /^qqb_[0-9a-zA-Z_]{1,}$/, // 公司人员账号
  imgType: /image\/(png|jpg|jpeg|gif)$/, // 上传图片类型
  isChina: /^[\u4e00-\u9fa5]{2,8}$/,
  isNozeroNumber: /^\+?[1-9]\d*$/, // 大于零的正整数
  float: /^\d+(\.?|(\.\d+)?)$/, // 匹配正整数或者小数 或者0.这个特殊值
  email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //邮箱
  len20: /^\S{1,20}$/, //限定字符长度20
  len100: /^\S{1,100}$/, //限定字符长度100
  num2: /^\d{1,2}$/,
  num3: /^[0-9]{9,}$/,
  num4: /^[0-9]{1,11}$/,
  num5: /^\+?[1-9]\d*$/, //大于0整数
  adminpws: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/, //密码应包含大小写、特殊字符、数字,且8-30位
  account: /^[0-9]*$/, //银行账户
  isAlphaCn: /^[a-zA-Z\u4E00-\uFA29]*$/, // 是否字母或汉字
  url: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/, //url
  numPoint: /^[0-9]+(.[0-9]{0,2})?$/, // 只能输入数字，小数点保留2位
  arithmetic: /^(-?\d+)(\ *[+\-.*/]\ *-?\d+)*$/, // 四则运算
  numNegativePoint: /^(-?)[0-9]+(.[0-9]{0,2})?$/, // 只能输入数字，小数点保留2位
  greaterZero: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, //大于0数可以是小数
  phoneAndLandline: /^((0\d{2,3}-\d{7,8})|(4\d{2}-\d{3}-\d{4})|(1[3|4|5|6|7|8|9|]\d{9}))$/, //座机和手机号验证
  emojiInput: /^[A-Za-z0-9-.]$/,//表情判断
  defalutHostType: /^[A-Za-z0-9-.]{1,20}$/,//域名判断
};
