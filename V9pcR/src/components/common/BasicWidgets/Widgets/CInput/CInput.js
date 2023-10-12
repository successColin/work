/*
 * @Author: Fus
 * @Date:   2019-06-29 14:56:52
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-18 19:42:00
 * @Desc: 基于antd的Input封装
 */
import { Input } from 'antd';
import classNames from 'classnames';
import { Component } from 'react';
import styles from '../../index.less';

const initProps = {
  // maxLength: 128,
};
class CInput extends Component {
  render() {
    const className = classNames({
      [styles.cInput]: true,
      [this.props.className]: true,
      cInput: true,
    });
    const { disabled } = this.props;
    const inputProps = {
      ...initProps,
      // allowClear: !!!disabled, // 禁止编辑时也不允许清除
      ...this.props,
      className,
    };
    return <Input {...inputProps} />;
  }
}

export default CInput;
