/*
 * @Author: Fus
 * @Date:   2019-08-30 15:48:23
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-19 14:02:12
 * @Desc: 日期选择器
 */
import { DatePicker } from 'antd';
import classNames from 'classnames';
import { Component } from 'react';
// import { DEFAULT_TIME_FORMATE } from '@/constants/element';

const initProps = {
  // format: DEFAULT_TIME_FORMATE,
  showTime: true,
  showToday: true,
};

const className = classNames({
  system__cDatePicker: true,
});

class CDatePicker extends Component {
  render() {
    const props = {
      ...initProps,
      ...this.props,
      className,
    };
    return <DatePicker {...props} />;
  }
}
export default CDatePicker;
