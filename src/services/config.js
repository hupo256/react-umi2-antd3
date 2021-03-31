let url = '';
switch (APP_ENVIRONMENT) {
  case 'prod': // 正式
    console.log = function() {};
    url = 'https://gateway.ingongdi.com';
    break;
  case 'pre': // 灰度
    console.log = function() {};
    url = 'https://pregw.ingongdi.com';
    //url = 'http://pre.gateway.ingongdi.com:1980';
    break;
  case 'test': // 测试
    console.log = function() {};
    url = 'http://test.gateway.ingongdi.com';
    break;
  case 'dev': // 开发环境
    console.warn = function() {};
    url = 'http://dev.gateway.ingongdi.com';
    break;
  case 'local': // 本地开发
    console.warn = function() {};
    //url = 'http://dev.gateway.ingongdi.com';
    url = 'https://gateway.ingongdi.com';
    //url = 'http://pre.gateway.ingongdi.com';
    break;
  case 'rc': // fix
    console.warn = function() {};
    url = 'http://rc.api.platform.in-deco.com:1980';
    break;
  default:
    console.log('环境配置出错，请检查！！==', APP_ENVIRONMENT);
    break;
}

export const baseurl = url;
