/*
 * @Author: Fus
 * @Date:   2019-08-06 10:32:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-11-30 09:11:52
 * @Desc: 列表内容
 *        已配类型：
 *          relateTable  关联表
 */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { CTable } from '@/components/common/BasicWidgets';
import { BaseContext } from '@/constants/global';
import { getUserList } from '@/services/userManager';

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
    this.fetchData();
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
    const reqParams = {
      ...queryParams,
      username: keyWords,
    };
    this.setState({ loading: true });
    getUserList(reqParams).then(res => {
      const { list, total } = res;
      const { pageNum, pageSize } = queryParams;
      this.setState({ listData: list, total, loading: false });
    }, err => this.setState({ loading: false }));
  };
  // 列名
  getColumns = () => {
    return [
      {
        //   title: 'id',
        //   dataIndex: 'id',
        //   width: 40,
        // }, {
        title: <FormattedMessage id="global.keycode"/>,
        dataIndex: 'keycode',
        render: text => <span title={text}>{text}</span>,
      }, {
        title: <FormattedMessage id="global.name"/>,
        dataIndex: 'username',
        render: text => <span title={text}>{text}</span>,
      }, {
        title: <FormattedMessage id="global.group"/>,
        dataIndex: 'groupname',
        render: text => <span title={text}>{text}</span>,
      }, {
        title: <FormattedMessage id="global.root"/>,
        dataIndex: 'rootname',
        render: text => <span title={text}>{text}</span>,
      },
    ];
  };
  // 点击行
  onClickRow = (record) => {
    const { selectedRows, multiple = true } = this.props;
    record.name = record.username;
    let newSelectedRows = [...selectedRows];
    if (multiple) { // 多选
      let index = newSelectedRows.findIndex(item => +item.id === +record.id);
      if (index !== -1) {
        newSelectedRows.splice(index, 1);
      } else {
        newSelectedRows.push({ ...record, name: record.username });
      }
    } else { // 单选
      newSelectedRows = [record];
    }
    this.props.setWrapState({ selectedRows: newSelectedRows, type: multiple ? 'edit' : '' });
  };
  onSelectAll = (selected, selectedRow, changeRows) => {
    const { selectedRows, multiple = true } = this.props;
    let newSelectedRows = [...selectedRows];
    if (multiple && selected) { // 多选
      newSelectedRows = newSelectedRows.concat(changeRows);
    } else if (multiple && !selected) {
      changeRows.forEach(item => {
        let index = newSelectedRows.findIndex(items => +items.id === +item.id);
        if (index !== -1) {
          newSelectedRows.splice(index, 1);
        }
      });
    }
    newSelectedRows = newSelectedRows.map(item => {
        return {
          ...item,
          name: item.username || item.name,
        };
      },
    );
    console.log(newSelectedRows, 'all');
    this.props.setWrapState({ selectedRows: newSelectedRows, type: 'edit' });
  };

  render() {
    const { listData, loading, total, queryParams } = this.state;
    const { selectedRows = [], multiple = true } = this.props;
    const { pageNum, pageSize } = queryParams;
    const selectedRowKeys = selectedRows.map(item => +item.id);
    const rowSelection = {
      type: multiple ? 'checkbox' : 'radio',
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
        this.setState({
          queryParams: {
            ...queryParams,
            pageNum,
            pageSize: newPageSize,
          },
        }, () => this.fetchData());
      },
    };
    return (
      <CTable
        pagination={pagination}
        columns={this.getColumns()}
        dataSource={listData}
        rowSelection={rowSelection}
        onClickRow={this.onClickRow}
        loading={loading}
        rowKey={record => record.id}
      />
    );
  }
}

export default ContentList;
