import React, { Component } from 'react';
import { Form } from 'antd';
import TagSelect from '@/components/TagSelect';
import StandardFormRow from '@/components/StandardFormRow';
import { PropTypes } from 'prop-types';

const FormItem = Form.Item;
@Form.create()
export default class CostTagSelect extends Component {
  render() {
    const { TagData, ge, value, hideCheckAll, title, expandable } = this.props;
    const TagContent =
      TagData &&
      TagData.map((item, idx) => {
        return (
          <TagSelect.Option value={item.key} key={item.key}>
            {item.value}
          </TagSelect.Option>
        );
      });
    return (
      <StandardFormRow title={title} block>
        <TagSelect hideCheckAll={hideCheckAll} value={value} onChange={ge} expandable={expandable}>
          {TagContent}
        </TagSelect>
      </StandardFormRow>
    );
  }
}

CostTagSelect.propTypes = {
  TagData: PropTypes.array.isRequired,
};
