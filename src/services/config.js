let url = '';
switch (APP_ENVIRONMENT) {
  case 'prod': // 正式
    console.log = function() {};
    url = 'https://gateway.ingongdi.com';
    break;
  case 'pre1': // 灰度
    console.log = function() {};
    url = 'https://pre1gw.ingongdi.com';
    break;
  case 'pre': // 灰度
    console.log = function() {};
    url = 'https://pregw.ingongdi.com';
    break;
  case 'test1': // 测试
    console.log = function() {};
    url = 'http://test1gw.ingongdi.com';
    break;
  case 'test': // 测试
    console.log = function() {};
    url = 'http://test1gw.ingongdi.com';
    break;
  case 'dev': // 开发环境
    console.warn = function() {};
    url = 'http://devgw.ingongdi.com';
    break;
  case 'local': // 本地开发
    console.warn = function() {};
    //url = 'http://testgw.ingongdi.com';
    url = 'http://devgw.ingongdi.com';
    //url = 'https://pregw.ingongdi.com';
    break;
  default:
    console.log('环境配置出错，请检查！！==', APP_ENVIRONMENT);
    break;
}
export const baseurl = url;
