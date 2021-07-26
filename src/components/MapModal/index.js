import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, AutoComplete, Icon, Input, Tooltip } from 'antd';
import styles from './index.less';
import _ from 'lodash';
const { Option, OptGroup } = AutoComplete;
const { Search } = Input;
@connect(({ global }) => ({
  global,
}))
class MapModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pointData: [],
      addres: '',
      addresCity: '',
      cityData: [],
      cityDataSource: [],
      isSlect: 0,
      lng: '',
      lat: '',
      noLng: 0,
      visibleM: false,
      addressCont: '',
      addressName: '',
      indexZ: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/cityGroupByLetterModel',
      payload: {},
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({
          cityData: res.data,
        });
      }
    });
  }
  render() {
    const {
      dataSource,
      addres,
      cityData,
      cityDataSource,
      addresCity,
      isSlect,
      lng,
      lat,
      noLng,
      visibleM,
      addressCont,
      addressName,
      indexZ,
    } = this.state;
    const { cityName } = this.props;
    let arr = [];
    arr =
      dataSource &&
      dataSource.map((item, index) => {
        let atxt = this.keyArrRender(item.name, addres);
        // if (addres !== '') {
        //   const regexp = new RegExp(addres, 'gi');
        //   console.log('regexp', regexp);
        //   atxt = atxt.replace(regexp, `<span style="color:red">${addres}</span>`);
        // }
        return (
          <Option key={item} value={item.name} extdata={item}>
            <div>
              <span dangerouslySetInnerHTML={{ __html: atxt }} />
              <span className={styles.district}>{item.district}</span>
            </div>
          </Option>
        );
      });
    let arrCity = [];
    arrCity =
      cityDataSource &&
      cityDataSource.map((item, index) => {
        let atxt = item.adName;
        if (addresCity !== '') {
          const regexp = new RegExp(addresCity, 'gi');
          atxt = atxt.replace(regexp, `<span style="color:red">${addresCity}</span>`);
        }
        return (
          <Option key={item.adName} value={item.adName}>
            <span dangerouslySetInnerHTML={{ __html: atxt }} />
          </Option>
        );
      });
    let cityN =
      cityData &&
      cityData.map((item, index) => {
        return (
          <a
            className={`${styles.cityNm} ${index === indexZ ? styles.cityNmZ : ''}`}
            key={item.adNameLetter}
            onClick={() => {
              this.scrollToAnchor(`map${item.adNameLetter}`, index);
            }}
          >
            {item.adNameLetter}
          </a>
        );
      });
    let cityContent =
      cityData &&
      cityData.map((item, index) => {
        let arr =
          item.adInfos &&
          item.adInfos.map((ite, idx) => {
            return (
              <div
                key={ite.adName}
                className={`${styles.cityCeCont} ${
                  cityName === ite.adName ? styles.cityCeSe : null
                }`}
                onClick={() => {
                  this.changeCity(ite);
                }}
              >
                {ite.adName}
              </div>
            );
          });
        return (
          <div className="clearfix" key={index} id={`map${item.adNameLetter}`}>
            <div className={styles.cityCeLeft}>{item.adNameLetter}:</div>
            <div className={`${styles.cityCeWrap} clearfix`}>{arr}</div>
          </div>
        );
      });
    let title = (
      <div className={`${styles.mapTit} clearfix`}>
        <span>标记位置</span>
        <Tooltip placement="top" title={'请在下方地图上点击定位，标记位置'}>
          <img src="http://img.inbase.in-deco.com/crmx/rzkCrm/file/20210618/6d70f6088fd84130822b668a3be83aae/icTipsgrey.png" />
        </Tooltip>
      </div>
    );
    return (
      <Modal
        title="选择地址"
        visible={this.props.visible}
        onCancel={() => this.props.handleCancel()}
        width={720}
        footer={null}
      >
        <div className={styles.wrap}>
          <div className="clearfix">
            <AutoComplete
              allowClear={true}
              dataSource={arr}
              placeholder="可搜索地址"
              //value={addres}
              onSearch={this.handleChange}
              className={styles.comItem}
              onSelect={this.handelSelect}
              optionLabelProp="value"
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
            <span
              className={`${styles.comSpan} clearfix`}
              onClick={() => {
                this.handelIsSelect();
              }}
            >
              <span className={styles.comCity}>{cityName}</span>
              <Icon type="swap" className={styles.comIcon} />
            </span>
            <span
              className={styles.comMap}
              onClick={() => {
                this.addEnvironment();
              }}
            >
              <Icon type="environment" className={styles.comIconMap} />
              去标记
            </span>
          </div>
          {isSlect === 1 ? (
            <div className={styles.cRwrap}>
              <div className={styles.cityWrap}>
                当前城市：
                {cityName}
              </div>
              <div className={styles.citySearchWrap}>
                <AutoComplete
                  allowClear={true}
                  dataSource={arrCity}
                  placeholder="可搜索地址"
                  onSearch={_.debounce(this.handleCityChange, 0)}
                  onSelect={this.handelSelectCity}
                  optionLabelProp="value"
                  maxLength={30}
                >
                  <Input suffix={<Icon type="search" className="certain-category-icon" />} />
                </AutoComplete>
              </div>
              <div className={styles.cityNwrap}>
                <div className="clearfix">{cityN}</div>
              </div>
              <div className={styles.cityContentW}>{cityContent}</div>
            </div>
          ) : null}
          <div className={styles.btnWrap}>
            <Button
              type="primary"
              disabled={lng !== '' && addres !== '' ? false : true}
              onClick={() => {
                this.changePoint(0);
              }}
            >
              使用位置
            </Button>
          </div>
          {noLng === 1 && addres !== '' ? (
            <div className={styles.bWrap}>
              <p>
                没有找到您输入的地址
                <br /> 请在地图上标记下这个位置吧
              </p>
              <Button
                type="primary"
                icon="environment"
                onClick={() => {
                  this.addEnvironment();
                }}
              >
                去标记
              </Button>
            </div>
          ) : null}
          {addres === '' ? (
            <div className={styles.bWrap}>
              <img
                src="https://img.inbase.in-deco.com/crm_saas/release/20210630/dc54be144c984e0b8dc7845780ad5438/img_Search_City.png"
                width="61"
                height="50"
              />
              <p>可输入小区/商圈地址进行搜索</p>
            </div>
          ) : null}
        </div>

        {visibleM ? (
          <Modal
            title={title}
            visible={visibleM}
            onCancel={() => this.handleCancelM()}
            width={720}
            footer={null}
            className={styles.aModelv}
          >
            <div id="container" className={styles.map} />
            <input id="lnglat" type="text" value="" style={{ display: 'none' }} />
            <div className={`${styles.addressWrap} clearfix`}>
              <div className={styles.imgPoint}>
                <img src="http://img.inbase.in-deco.com/crmx/rzkCrm/file/20210618/6912ca1dd9674e3ca6abc11e79bba06c/icsign.png" />
              </div>
              <div className={styles.imgPointAddr}>
                <div className={styles.addressP}> {addressName}</div>
                <div className={styles.addressPw}>{addressCont}</div>
              </div>
            </div>
            <div className={styles.imgPointBtWrap}>
              <Button
                type="primary"
                onClick={() => {
                  this.changePoint(1);
                }}
              >
                使用位置
              </Button>
            </div>
          </Modal>
        ) : null}
      </Modal>
    );
  }
  //输入关键字搜索
  handleChange = value => {
    if (value !== '') {
      this.setState({
        addres: value,
      });
      this.autoInput(value);
    } else {
      this.setState({
        dataSource: [],
        pointData: [],
        addres: '',
        lng: '',
        lat: '',
      });
    }
  };
  // 调用高德API获取地址信息
  autoInput(value) {
    var keywords = (value && value.substring(0, 30)) || '';
    const that = this;
    const { cityName } = this.props;
    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function() {
      var autoOptions = {
        city: cityName,
        citylimit: true,
      };
      var placeSearch = new AMap.Autocomplete(autoOptions);
      placeSearch.search(keywords, function(status, result) {
        // 搜索成功时，result即是对应的匹配数据
        if (result && result.info === 'OK') {
          that.setState({
            dataSource: [...result.tips],
          });
        } else {
          that.setState({
            dataSource: [],
            noLng: 1,
          });
        }
      });
    });
  }
  //选择地址
  handelSelect = (handelSelect, option) => {
    if (option.props.extdata) {
      if (option.props.extdata.location) {
        this.setState({
          lng: option.props.extdata.location.lng,
          lat: option.props.extdata.location.lat,
          noLng: 0,
          addres: `${option.props.extdata.district}${option.props.extdata.address}${handelSelect}`,
        });
      } else {
        this.setState({
          lng: '',
          lat: '',
          noLng: 1,
        });
      }
    }
  };
  // 城市首写字母滚动到指定位置
  scrollToAnchor(anchorName, index) {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
    this.setState({
      indexZ: index,
    });
  }
  //城市选择
  changeCity(ite) {
    this.props.handleCity(ite.adName);
    this.setState({
      isSlect: 0,
      dataSource: [],
      addres: '',
      lng: '',
      lat: '',
      indexZ: '',
    });
  }
  handleCityChange = value => {
    if (value !== '') {
      const { dispatch } = this.props;
      this.setState({
        addresCity: value,
      });
      dispatch({
        type: 'global/cityMatchModel',
        payload: { matchKey: value },
      }).then(res => {
        if (res && res.code === 200) {
          if (res.data.list) {
            this.setState({
              cityDataSource: res.data.list,
            });
          }
        }
      });
    } else {
      this.setState({
        cityDataSource: [],
        addresCity: '',
      });
    }
  };
  handelSelectCity = value => {
    this.props.handleCity(value);
    this.setState({
      isSlect: 0,
    });
  };
  handelIsSelect() {
    const { isSlect } = this.state;
    if (isSlect == 0) {
      this.setState({
        isSlect: 1,
      });
    } else {
      this.setState({
        isSlect: 0,
      });
    }
  }
  //控制标记位置弹层
  addEnvironment() {
    this.setState(
      {
        visibleM: true,
      },
      () => {
        setTimeout(() => {
          const { cityName } = this.props;
          const that = this;
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: cityName,
          });
          geocoder.getLocation(cityName, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              // result中对应详细地理坐标信息
              if (result.geocodes) {
                var map = new AMap.Map('container', {
                  resizeEnable: true,
                  zoom: 15, //级别
                  center: [result.geocodes[0].location.lng, result.geocodes[0].location.lat],
                });
                var marker = new AMap.Marker({
                  icon: new AMap.Icon({
                    image:
                      'https://img.inbase.in-deco.com/crm_saas/release/20210623/bbb4f6a608374c88b435be8fbec8d919/ic_Address_sign.png',
                    size: new AMap.Size(24, 44),
                    imageSize: new AMap.Size(24, 44),
                  }),
                });
                map.add(marker);
                marker.setLabel({
                  direction: 'right',
                  offset: new AMap.Pixel(0, -40), //设置文本标注偏移量
                  content: `<div class='info'>${result.geocodes[0].addressComponent.province}${
                    result.geocodes[0].addressComponent.street
                  }${result.geocodes[0].addressComponent.streetNumber}${
                    result.geocodes[0].addressComponent.township
                  }</div>`, //设置文本标注内容
                });
                let address = result.geocodes[0].formattedAddress;
                let addressCont = `${result.geocodes[0].addressComponent.province}${
                  result.geocodes[0].addressComponent.street
                }${result.geocodes[0].addressComponent.streetNumber}${
                  result.geocodes[0].addressComponent.township
                }`;
                that.setState({
                  addressName: address,
                  addressCont,
                  lng: result.geocodes[0].location.lng,
                  lat: result.geocodes[0].location.lat,
                });
                function regeoCode() {
                  var lnglat = document.getElementById('lnglat').value.split(',');
                  map.add(marker);
                  marker.setPosition(lnglat);

                  geocoder.getAddress(lnglat, function(status, result) {
                    if (status === 'complete' && result.regeocode) {
                      let address = result.regeocode.formattedAddress;
                      let addressCont = `${result.regeocode.addressComponent.province}${
                        result.regeocode.addressComponent.street
                      }${result.regeocode.addressComponent.streetNumber}${
                        result.regeocode.addressComponent.township
                      }`;
                      console.log('result', result);
                      marker.setLabel({
                        direction: 'right',
                        offset: new AMap.Pixel(0, -40), //设置文本标注偏移量
                        content: `<div class='info'>${result.regeocode.addressComponent.building ||
                          address}</div>`, //设置文本标注内容
                      });
                      that.setState({
                        addressName: address,
                        addressCont,
                        lng: lnglat[0],
                        lat: lnglat[1],
                      });
                    } else {
                      log.error('根据经纬度查询地址失败');
                    }
                  });
                }
                map.on('click', function(e) {
                  document.getElementById('lnglat').value = e.lnglat;
                  regeoCode();
                });
              }
            }
          });
        }, 500);
      }
    );
  }
  handleCancelM() {
    this.setState({
      visibleM: false,
    });
  }
  // 选择标记点
  changePoint(code) {
    const { addressCont, lng, lat, addres } = this.state;
    let data;
    if (code === 1) {
      data = { addressCont: addressCont, lng: lng, lat: lat };
    } else {
      data = { addressCont: addres, lng: lng, lat: lat };
    }
    this.props.handleAddPoint(data);
  }
  //关键字高亮显示
  keyArrRender(text, key) {
    const specialCharater = new RegExp(
      "[`~!@#$%^&*()\\-+={}':;,\\[\\].<>/?￥…（）_|【】‘；：”“’。，、？\\s]"
    );
    if (key && text && typeof text === 'string' && typeof key === 'string') {
      const keyArr = key.split(specialCharater).filter(k => k);
      const newText = text.replace(
        new RegExp(keyArr.join('|'), 'ig'),
        str => `<Fragment style="color:red">${str}</Fragment>`
      );
      return newText;
    } else {
      return text;
    }
  }
}

export default MapModal;
