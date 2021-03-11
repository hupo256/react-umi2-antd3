/*
 * @Author: zqm 
 * @Date: 2021-02-24 10:45:45 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-03-04 15:03:14
 * 已上传
 */
import React, { Component } from 'react';
import styles from './Upload.less';
import { Checkbox } from 'antd';

class AlreadyUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataPath: [],
      disabled: false,
    };
  }

  componentDidMount() {}

  render() {
    const { data, disabled, dataPath } = this.state;
    const imgList = [
      {
        name: '7.png',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/2d8ab80db5074970aec0888dbcbb56a7/7.png',
      },
      {
        name: 'bg.png',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/7c5b14353dac4a4490f214fbe9837c71/bg.png',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/7c5b14353dac4a4490f214fbe9837c71/bg.png',
      },
      {
        name: 'img1.png',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/a320a445854c42e683f5d2414aedf9b3/img1.png',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/a320a445854c42e683f5d2414aedf9b3/img1.png',
      },
      {
        name: '12.png',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/b9131878ceff4b20932e79164cc3fc59/12.png',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/b9131878ceff4b20932e79164cc3fc59/12.png',
      },
      {
        name: '6.png',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/08351ee0a4674934bf0525cf0aa612e2/6.png',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/08351ee0a4674934bf0525cf0aa612e2/6.png',
      },
      {
        name: 'v2-7df0e47eee1d0f1c7b5a6932fba58edb_720w.jpg',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/a2e690cb46e84a0d8d527b658d221560/v2-7df0e47eee1d0f1c7b5a6932fba58edb_720w.jpg',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/a2e690cb46e84a0d8d527b658d221560/v2-7df0e47eee1d0f1c7b5a6932fba58edb_720w.jpg',
      },
      {
        name: '2.png',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/110115b6fd56492e816ccf9609f3f363/2.png',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/110115b6fd56492e816ccf9609f3f363/2.png',
      },
      {
        name: 'Snipaste_2020-09-03_10-43-58.png',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/edd770a611824bf6a8b1fcb491702802/Snipaste_2020-09-03_10-43-58.png',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/edd770a611824bf6a8b1fcb491702802/Snipaste_2020-09-03_10-43-58.png',
      },
      {
        name: 'v2-5a3af4421d4c6e03ed060705e77d81fb_720w.jpg',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/5001e09f7d2d48e28e177274b726c578/v2-5a3af4421d4c6e03ed060705e77d81fb_720w.jpg',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/5001e09f7d2d48e28e177274b726c578/v2-5a3af4421d4c6e03ed060705e77d81fb_720w.jpg',
      },
      {
        name: '大圣归来.jpg',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/14d2e435ef674cf2a8ea99d9ab8a2260/大圣归来.jpg',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/14d2e435ef674cf2a8ea99d9ab8a2260/大圣归来.jpg',
      },
      {
        name: '微信图片_20200916093234.jpg',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/5d0af923880f443f870828802c8cd794/微信图片_20200916093234.jpg',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/5d0af923880f443f870828802c8cd794/微信图片_20200916093234.jpg',
      },
      {
        name: '微信图片_20200916093312.jpg',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/58d41d2d3f5946538e6e6945be43d8bf/微信图片_20200916093312.jpg',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/58d41d2d3f5946538e6e6945be43d8bf/微信图片_20200916093312.jpg',
      },
      {
        name: '微信图片_202009160933122.jpg',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/e560f64a9b584865b2672dbaededac8b/微信图片_202009160933122.jpg',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/e560f64a9b584865b2672dbaededac8b/微信图片_202009160933122.jpg',
      },
      {
        name: '微信图片_202009160933124.jpg',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/678f478e7de94c1cbb21b232d894dfe1/微信图片_202009160933124.jpg',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/678f478e7de94c1cbb21b232d894dfe1/微信图片_202009160933124.jpg',
      },
      {
        name: '微信图片_202009160933126.jpg',
        addr:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/ea6392d86be44fc1b9fcbada03d46cfe/微信图片_202009160933126.jpg',
        path:
          'https://test.img.inbase.in-deco.com/crm_saas/dev/20210224/ea6392d86be44fc1b9fcbada03d46cfe/微信图片_202009160933126.jpg',
      },
    ];
    return (
      <div style={{ height: 356, overflowY: 'scroll', padding: 20 }}>
        {imgList.map(item => {
          return (
            <div className={styles.previewimg} key={item.path}>
              <img src={item.addr} />
              <Checkbox
                disabled={disabled && !dataPath.includes(item.path)}
                className={styles.checkbox}
                onChange={e => this.onChange(e, item)}
              />
            </div>
          );
        })}
      </div>
    );
  }
  onChange = (e, item) => {
    let { data } = this.state;
    if (e.target.checked) {
      this.setState(
        { data: [...data, item], dataPath: [...data, item].map(ite => ite.path) },
        () => {
          this.disabled();
          this.props.handleOk([...data, item]);
        }
      );
    } else {
      // 移除已选择
      const newdata = data.filter(items => items.path !== item.path);
      const dataPath = newdata.map(ite => ite.path);
      this.setState({ data: newdata, dataPath }, () => {
        this.disabled();
        this.props.handleOk(newdata);
      });
    }
  };
  disabled = () => {
    const { selectNum } = this.props;
    let { data } = this.state;
    if (data.length == selectNum) {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  };
}

export default AlreadyUpload;
