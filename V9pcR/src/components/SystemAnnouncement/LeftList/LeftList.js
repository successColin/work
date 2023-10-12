import { CSpin } from '@/components/common/BasicWidgets';
import { BaseContext } from '@/constants/global';
import { Col, Icon, List, Row } from 'antd';
import moment from 'moment';
import { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './LeftList.less';

class LeftList extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 选中背景色
  setBackGround = (item, index) => {
    const { updateState } = this.props;
    updateState({ activeId: item.id, type: '', chooseData: item }, () => {
      this.resetDetailForm();
    });
  };
  // 清空表单
  resetDetailForm = () => {
    this.props.form.resetFields();
  };

  // 渲染整个列
  renderList = (item, current) => {
    const { activeId } = this.props;
    const { id: listId, basetype } = item;
    let icon = <span className={`iconfont icon-list-first ${styles.firstIcon}`} />;
    return (
      <Row
        className={`${listId === activeId ? 'active system__listActive' : ''} system__listHover`}
        key={item.listId}
        onClick={() => this.setBackGround(item, current)}
      >
        <Col span={24} className={`${styles.leftList} leftListLine`}>
          {icon}
          {item.name}
        </Col>
        <Col span={24} className={`${styles.leftList} leftListLine`}>
          状态:{' '}
          {item.enabled === 1 ? (
            <span>
              <span className={styles.spanWrapGreen} />
              启用
            </span>
          ) : (
            <span>
              <span className={styles.spanWrapRed} />
              停用
            </span>
          )}
        </Col>
        <Col span={24} className={`${styles.leftList} leftListLine`}>
          创建时间: {moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}
        </Col>
      </Row>
    );
  };
  // 点击新增
  addNew = () => {
    const { updateState } = this.props;
    updateState({ activeId: '', type: 'add', chooseData: '' }, () => {
      this.props.form.resetFields();
    });
  };
  // 下拉加载更多
  handleInfiniteOnLoad = (a, b) => {
    const { listLoading, fetchMessage, updateState, hasMore, listQueryParams } = this.props;
    hasMore &&
      updateState(
        {
          listLoading: true,
          listQueryParams: {
            ...listQueryParams,
            pageNum: listQueryParams.pageNum + 1,
          },
        },
        () => {
          fetchMessage();
        },
      );
  };

  render() {
    const { langLib } = this.context;
    const { messageList, listLoading, functionData, hasMore } = this.props;
    const { attributes } = functionData;
    return (
      <div className={`${!!attributes.canadd ? styles.wrap : styles.wrap1}`}>
        {!!attributes.canadd ? (
          <Row className={`${styles.addNew}`}>
            <div
              className={`${styles.addNewBtn} globalAddNewBtn system__defaultButton`}
              onClick={() => this.addNew()}
            >
              <Icon className={`${styles.addnewBtnIco} custom-color`} type="plus-square" />
              <span>新增</span>
            </div>
          </Row>
        ) : null}
        <CSpin spinning={listLoading}>
          <div
            className={`demo-infinite-container ${
              !!attributes.canadd ? styles.left : styles.leftNomal
            }`}
          >
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!listLoading && hasMore}
              useWindow={false}
            >
              <List
                split={false}
                itemLayout="horizontal"
                dataSource={messageList}
                renderItem={(item, index) => (
                  <List.Item key={item.keycode}>{this.renderList(item, index)}</List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
        </CSpin>
      </div>
    );
  }
}

export default LeftList;
