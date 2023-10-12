/*
 * @Author: Fus
 * @Date:   2019-08-06 10:33:41
 * @Last Modified by: ytx
 * @Last Modified time: 2022-04-24 13:46:55
 * @Desc: 表格组件 基于antd的表格
 */
import { BaseContext } from '@/constants/global';
import { Table } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { Component } from 'react';
import Sortable from 'sortablejs';
import styles from './CTable.less';

const initPageSizeOptions = ['10', '20', '50', '100', '200', '500', '1000'];
@connect(state => ({
  langLib: state.global.langLib, // 本地语言包内容
}))
class CTable extends Component {
  static contextType = BaseContext;

  state = {
    columns: [],
    sortable: {},
    children: [],
    rowSelection: {},
  };

  static getDerivedStateFromProps(props, state) {
    if (state.columns !== props.columns || state.children !== props.children) {
      return {
        columns: props.columns,
        children: props.children,
        rowSelection: props.rowSelection,
      };
    }
    return null;
  }

  componentWillUnmount() {
    this.setState({
      sortable: {},
    });
  }

  // 在dom渲染后执行初始化
  componentDidMount() {
    this.draftSort();
  }

  // 拖拽初始化及逻辑
  draftSort = () => {
    let self = this; // 可忽略
    if (self.props.showHeader) {
      let el = document.querySelector(
        `${
          self.props.className ? '.' + self.props.className : ''
        } .ant-table-content .ant-table-thead tr`,
      );
      let sortable = Sortable.create(el, {
        animation: 300, // 动画参数
        delay: 0,
        onEnd: function({ oldIndex, newIndex }) {
          const { columns, children, rowSelection } = self.state;
          if (rowSelection && rowSelection.type) {
            oldIndex = oldIndex - 1;
            newIndex = newIndex - 1;
          }
          if (columns) {
            const oldItem = columns.splice(oldIndex, 1);
            columns.splice(newIndex, 0, ...oldItem);
            console.log(columns);
            self.setState({
              columns,
            });
          } else if (children) {
            const arr = [...children];
            const oldItem1 = arr.splice(oldIndex, 1);
            arr.splice(newIndex, 0, ...oldItem1);
            console.log(children);
            self.setState({
              children: arr,
            });
          }
        },
      });
      this.setState({
        sortable,
      });
    }
  };

  render() {
    const {
      pagination = {},
      onClickRow,
      langLib,
      pageSizeOptionsConfig,
      ...restProps
    } = this.props;
    const { columns, children } = this.state;
    const {
      total = 0,
      current = 1,
      pageSize = 10,
      onChange,
      pageSizeOptions = pageSizeOptionsConfig ? pageSizeOptionsConfig : initPageSizeOptions,
    } = pagination;
    const className = classNames({
      [styles.table]: true,
      [this.props.className]: true,
    });
    const initProps = {
      // bordered: true,
      size: 'small',
      scroll: { x: '', y: 100 }, // 'max-content'
      pagination: pagination
        ? {
            showLessItems: true,
            showQuickJumper: true,
            showTotal: total => langLib['table.total'](total),
            showSizeChanger: true,
            total,
            current,
            pageSize,
            pageSizeOptions,
            onChange: (current, pageSize) => onChange && onChange(current, pageSize),
            onShowSizeChange: (current, pageSize) => onChange && onChange(current, pageSize),
            ...pagination,
          }
        : false,
      onRow: record => ({
        onClick: event => onClickRow && onClickRow(record),
      }),
      // rowClassName: (record, index) => {
      //   let className = 'custom-table-light-row';
      //   if (index % 2 === 1) className = 'custom-table-dark-row';
      //   return className;
      // },
    };
    const tableProps = {
      ...initProps,
      ...restProps,
      className,
      columns,
      children,
    };
    return <Table {...tableProps} />;
  }
}
export default CTable;