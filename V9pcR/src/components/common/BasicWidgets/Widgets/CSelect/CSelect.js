/*
 * @Author: Fus
 * @Date:   2019-06-29 14:56:52
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-18 19:44:21
 * @Desc: 基于antd的Select封装
 */
import { Select } from 'antd';
import classNames from 'classnames';
import styles from '../../index.less';

const initProps = {};
const getProps = props => {
  const className = classNames({
    [styles.cInput]: true,
    [props.className]: true,
    cSelect: true,
  });
  return {
    ...initProps,
    ...props,
    className,
  };
};
const CSelect = props => <Select {...getProps(props)} />;
export default CSelect;
