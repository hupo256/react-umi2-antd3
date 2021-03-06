import React, { Component } from 'react';
import { Tag, Input, Tooltip, Icon, message } from 'antd';

class TagGroup extends Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    const { tags } = this.props;
    this.setState({ tags: tags || [] });
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags }, () => {
      this.props.handleSave(tags);
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    // if (e.target.value.length > 10) {
    //   message.warning('最多输入10位字符');
    // } else {
    this.setState({ inputValue: e.target.value });
    // }
  };

  handleInputConfirm = e => {
    e.preventDefault();
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && inputValue.trim().length == 0) {
      message.warning('请输入关键词');
      return false;
    }
    if (inputValue && inputValue.length > 10) {
      message.warning('最多输入10位字符');
      return false;
    }
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue.trim()];
    }
    console.log(tags);
    this.setState(
      {
        tags,
        inputVisible: false,
        inputValue: '',
      },
      () => {
        this.props.handleSave(tags);
      }
    );
  };

  saveInputRef = input => (this.input = input);
  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {Array.isArray(tags) &&
          tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable={true}
                onClose={() => this.handleClose(tag)}
                style={{ fontSize: 14 }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 156 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible &&
          tags.length < 10 && (
            <Tag
              onClick={this.showInput}
              style={{ background: '#fff', borderStyle: 'dashed', fontSize: 14 }}
            >
              <Icon type="plus" />
              添加关键词
            </Tag>
          )}
      </div>
    );
  }
}

export default TagGroup;
