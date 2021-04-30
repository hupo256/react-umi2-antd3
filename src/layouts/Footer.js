import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2021 厦门奇心筑力科技有限公司 出品
          <a
            target="_blank"
            href="https://beian.miit.gov.cn/#/Integrated/index"
            style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 5 }}
          >
            闽ICP备2021005880号
          </a>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
