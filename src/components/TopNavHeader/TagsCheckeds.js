import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class TagsCheckeds extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ind: null,
    };
  }

  selectFn = (ind, txt) => {
    this.setState({
      ind,
    });
    this.props.change(txt);
  };

  render() {
    const { data, title } = this.props;
    const { ind } = this.state;

    return (
      <div className={styles.controw}>
        <p style={{ fontWeight: 600 }}>{title}</p>
        <div>
          {data.map((item, index) => {
            return (
              <span
                key={index}
                className={ind == index ? styles.rowadd : ''}
                onClick={() => {
                  this.selectFn(index, item.txt);
                }}
              >
                {item.icon && <Icon type={item.icon} style={{ marginRight: '5px' }} />}
                <b>{item.txt}</b>
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}
