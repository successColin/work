import { AutoComplete, Button, Icon, Input } from 'antd';
import classNames from 'classnames';
import React, { Component } from 'react';
import styles from './CAutoComplete.less';

const { Option } = AutoComplete;

class CAutoComplete extends Component {
  constructor(props) {
    super();
  }

  render() {
    const { handleClick, onSearch, isShow = false, ...restProps } = this.props;
    const className = classNames({
      [styles.AutoCompleteWrap]: true,
      [this.props.className]: !!this.props.className,
    });
    return (
      <AutoComplete className={className} onSearch={null} {...restProps}>
        <Input
          suffix={
            <Button
              className={`${styles.btnDefault} system__textButton`}
              size="small"
              type="default"
              onClick={handleClick}
            >
              <Icon type="search" />
            </Button>
          }
        />
      </AutoComplete>
    );
  }
}

export default CAutoComplete;
