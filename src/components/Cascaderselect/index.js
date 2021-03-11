import React, { Component } from 'react';
import { Cascader, Tag, message, Tooltip } from 'antd';
import styles from './Cascaderselect.less';

export default class Cascaderselect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CompanyArr: [],
      codesArr: [],
      errors: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    for (let v in nextProps) {
      if (v == 'data-__field' && nextProps[v].errors) {
        this.setState({
          errors: true,
        });
      }
    }
    if (nextProps.initvalue) {
      this.setState({
        CompanyArr: nextProps.initvalue.sourcetag,
        codesArr: nextProps.initvalue.codes,
      });
    }
  }
  componentDidMount() {
    if (this.props.forvalues) {
      let arr = [];
      let codes = this.props.forvalues.split(',');

      if (this.props.forvalues == '000000') {
        arr = [
          <Tag
            closable
            onClose={e => {
              this.delog(e, '000000');
            }}
            key={'000000'}
          >
            全国
          </Tag>,
        ];
      } else {
        for (let i = 0; i < codes.length; i++) {
          let str = '';
          let addr = codes[i].slice(codes[i].lastIndexOf('/') + 1);
          this.props.options.map(item => {
            if (item.areaCode.slice(0, 2) == addr.slice(0, 2)) {
              str += item.areaName;
              if (item.children && addr.length >= 4) {
                item.children.map(cityitem => {
                  if (
                    cityitem.areaCode.slice(0, 4) == addr.slice(0, 4) ||
                    cityitem.areaCode.slice(2, 4) == '00'
                  ) {
                    str += '/' + cityitem.areaName;
                    if (cityitem.children && addr.length >= 6) {
                      cityitem.children.map(areaitem => {
                        if (areaitem.areaCode.slice(0, 6) == addr.slice(0, 6)) {
                          str += '/' + areaitem.areaName;
                        }
                      });
                    }
                  }
                });
              }
            }
          });
          arr.push(
            <Tag
              closable
              onClose={e => {
                this.delog(e, addr);
              }}
              key={addr}
            >
              {str}
            </Tag>
          );
        }
      }

      this.props.onChange(codes, arr, this.props.id);
    }
  }
  delog(e, index) {
    //阻止冒泡
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    //删除
    const { CompanyArr, codesArr } = this.state;
    CompanyArr.forEach((item, ind) => {
      if (item.key == index) {
        this.setState(
          {
            ...CompanyArr.splice(ind, 1),
            ...codesArr.splice(ind, 1),
          },
          () => {
            this.props.onChange(codesArr, CompanyArr, this.props.id);
          }
        );
      }
    });
  }
  onCascaderChange = (value, selectedOptions) => {
    let arr = this.state.CompanyArr;
    let codes = this.state.codesArr;
    let index = value[value.length - 1];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].key == index) {
        this.delog(index);
        return;
      }
    }

    if (value.join('') == '000000' || codes.indexOf('000000') != -1) {
      if (codes.indexOf('000000') != -1) {
        message.warning('选全国只可单选');
      }
      codes = ['000000'];
      arr = [
        <Tag
          closable
          onClose={e => {
            this.delog(e, '000000');
          }}
          key={'000000'}
        >
          全国
        </Tag>,
      ];
    } else {
      codes.push(value.join('/'));
      const text = selectedOptions.map(o => o[this.props.fieldNames.label]).join('/');
      arr.push(
        <Tooltip placement="left" key={index} title={<span> {text}</span>}>
          <Tag
            closable
            onClose={e => {
              this.delog(e, index);
            }}
          >
            <div className={styles.companyTagText}>{text}</div>
          </Tag>
        </Tooltip>
      );
    }

    this.setState(
      {
        CompanyArr: arr,
        codesArr: codes,
        errors: false,
      },
      () => {
        this.props.onChange(this.state.codesArr, this.state.CompanyArr, this.props.id);
      }
    );
  };

  render() {
    const { CompanyArr, errors } = this.state;
    const { options, fieldNames, placeholder } = this.props;

    return (
      <div className={styles.company}>
        <Cascader
          autoFocus={true}
          options={options}
          fieldNames={fieldNames}
          onChange={this.onCascaderChange}
          popupClassName={styles.CascaderselectHover}
          expandTrigger="hover"
        >
          <div className={styles.companyipt} style={{ borderColor: errors ? '#f5222d' : '' }}>
            {_.isEmpty(CompanyArr) ? (
              <span style={{ color: 'rgb(197, 199, 202)' }}>{placeholder}</span>
            ) : (
              CompanyArr
            )}
          </div>
        </Cascader>
      </div>
    );
  }
}
