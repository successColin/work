/*
 * @Author: Fus
 * @Date:   2019-08-06 10:32:06
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-18 10:51:21
 * @Desc: 树图标配置
 *          relateTable  关联表
 */
import { CTable } from '@/components/common/BasicWidgets';
import { BaseContext } from '@/constants/global';
import { getSystemTreeIconList } from '@/services/treeIconConfig';
import React, { Component } from 'react';

const initQueryParams = {
  pageNum: 1,
  pageSize: 10,
};

class ContentList extends Component {
  static contextType = BaseContext;
  state = {
    listData: [], // 数据源
    total: 0,
    loading: false,
    queryParams: initQueryParams, // 获取列表的传参
    keyWords: null, // 关键字
    pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
  };

  static getDerivedStateFromProps(props, state) {
    if (props.headerKeywords !== state.keyWords) {
      return {
        keyWords: props.headerKeywords,
        queryParams: {
          ...state.queryParams,
          pageNum: 1,
        },
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyWords !== this.state.keyWords) {
      this.fetchData(true);
    }
  }

  componentDidMount() {
    const height = this.refs.tableWrap.getBoundingClientRect().height;
    const { multiple = false } = this.props;
    const lineHeight = multiple ? 37 : 30;
    const pageSize = Math.floor((height - 37) / lineHeight);
    const { queryParams, pageSizeOptions } = this.state;
    const newPageSizeOptions = [...pageSizeOptions];
    if (!newPageSizeOptions.includes(`${pageSize}`)) {
      newPageSizeOptions.push(`${pageSize}`);
    }
    this.setState(
      {
        queryParams: {
          ...queryParams,
          pageSize,
        },
        pageSizeOptions: newPageSizeOptions,
      },
      () => {
        this.fetchData();
      },
    );
  }

  componentWillUnmount() {
    this.resetData();
  }

  // 重置数据
  resetData = () => {
    this.setState({ listData: [], total: 0, queryParams: initQueryParams, keyWords: null });
  };
  // 获取列表数据
  fetchData = (fromSearch = false) => {
    const { queryParams, keyWords } = this.state;
    const { pageNum } = queryParams;
    const reqParams = {
      ...queryParams,
      keyWords,
    };
    this.setState({ loading: true });
    console.log(reqParams);
    getSystemTreeIconList(reqParams).then(
      res => {
        const { list, total } = res;
        this.setState({ listData: list, total, loading: false });
      },
      err => this.setState({ loading: false }),
    );
  };
  // 列名
  getColumns = () => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        render: text => <span title={text}>{text}</span>,
        width: '25%',
      },
      {
        title: '表名',
        dataIndex: 'tableName',
        width: '25%',
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: '字段',
        dataIndex: 'columnName',
        render: text => <span title={text}>{text}</span>,
      },
    ];
  };
  // 点击行
  onClickRow = record => {
    const { selectedRows, multiple = false } = this.props;
    let newSelectedRows = [...selectedRows];
    if (multiple) {
      // 多选
      let index = newSelectedRows.findIndex(item => +item.id === +record.id);
      if (index !== -1) {
        newSelectedRows.splice(index, 1);
      } else {
        newSelectedRows.push(record);
      }
    } else {
      // 单选
      newSelectedRows = [record];
    }
    this.props.setWrapState({ selectedRows: newSelectedRows, type: multiple ? 'edit' : '' });
  };
  onSelectAll = (selected, selectedRow, changeRows) => {
    const { selectedRows, multiple = false } = this.props;
    let newSelectedRows = [...selectedRows];
    if (multiple && selected) {
      // 多选
      newSelectedRows = newSelectedRows.concat(changeRows);
    } else if (multiple && !selected) {
      changeRows.forEach(item => {
        let index = newSelectedRows.findIndex(items => +items.id === +item.id);
        if (index !== -1) {
          newSelectedRows.splice(index, 1);
        }
      });
    }
    this.props.setWrapState({ selectedRows: newSelectedRows, type: 'edit' });
  };

  render() {
    const { listData, loading, total, queryParams, pageSizeOptions } = this.state;
    const { selectedRows = [], rowKey, multiple = false } = this.props;
    const { pageNum, pageSize } = queryParams;
    const selectedRowKeys = selectedRows.map(item => +item.id);
    const rowSelection = {
      type: multiple ? 'checkbox' : 'radio',
      columnWidth: '35px',
      columnTitle: multiple ? '' : <div style={{ width: '16px' }} />,
      selectedRowKeys,
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.onSelectAll(selected, selectedRows, changeRows);
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        this.onClickRow(record);
      },
      onChange: (record, selected, selectedRows, nativeEvent) => {
        this.onClickRow(record);
      },
    };
    const pagination = {
      total,
      current: pageNum,
      pageSize,
      onChange: (pageNum, newPageSize) => {
        this.setState(
          {
            queryParams: {
              ...queryParams,
              pageNum,
              pageSize: newPageSize,
            },
          },
          () => this.fetchData(),
        );
      },
    };
    return (
      <div style={{ width: '100%', height: '100%' }} ref="tableWrap">
        <CTable
          pagination={pagination}
          pageSizeOptionsConfig={pageSizeOptions}
          columns={this.getColumns()}
          dataSource={listData}
          rowSelection={rowSelection}
          onClickRow={this.onClickRow}
          loading={loading}
          rowKey={rowKey}
        />
      </div>
    );
  }
}

export default ContentList;
