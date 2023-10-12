/*
 * @Author: Fus
 * @Date:   2019-08-10 14:42:49
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-18 13:51:45
 * @Desc: 按钮 基于antd的Button
 */
import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import { Component } from 'react';
import styles from '../../index.less';

const initProps = {
  type: 'default', // 按钮类型 default-默认 primary-主要的 dark-灰色
};
class CButton extends Component {
  static defaultProps = {
    ...initProps,
  };
  render() {
    const { type, background, btnObj = {}, isDefault = false } = this.props;
    const { tooltipText = '' } = btnObj;
    const className = classNames({
      [styles.cButton]: true,
      [styles[`btn-${type}`]]: true,
      [this.props.className]: !!this.props.className,
      defaultButtonStyle: isDefault,
      system__defaultButton: type === 'default',
    });
    const inputProps = {
      ...initProps,
      ...this.props,
      className,
    };
    console.log(type);
    return tooltipText ? (
      <Tooltip placement="top" title={tooltipText}>
        <Button style={background ? { background: background, border: 0 } : null} {...inputProps} />
      </Tooltip>
    ) : (
      <Button style={background ? { background: background, border: 0 } : null} {...inputProps} />
    );
  }
}

export default CButton;
