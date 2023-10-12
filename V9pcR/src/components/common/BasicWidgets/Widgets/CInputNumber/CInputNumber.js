/*
 * @Author: Fus
 * @Date:   2019-08-14 10:02:20
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-19 10:42:11
 * @Desc: 数字输入框
 */
import { InputNumber } from 'antd';
import classNames from 'classnames';
import { Component } from 'react';
import styles from '../../index.less';

const initProps = {};
class CInputNumber extends Component {
  render() {
    const className = classNames({
      [styles.cInputNumber]: true,
      [this.props.className]: true,
      system__cInputNumber: true,
    });
    const { disabled } = this.props;
    const inputProps = {
      ...initProps,
      ...this.props,
      className,
    };
    return <InputNumber {...inputProps} />;
  }
}

export default CInputNumber;
