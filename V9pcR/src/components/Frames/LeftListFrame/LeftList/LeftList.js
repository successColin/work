import { CInputNumber, CSearch, CSpin } from '@/components/common/BasicWidgets';
import TreeFooter from '@/components/common/TreeFooter/TreeFooter';
import { BTN_ELEMENT_TYPE } from '@/constants/element';
import { BaseContext, SPECIAL_CHARACTERS } from '@/constants/global';
import { Col, Icon, List, Row, Input  } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './LeftList.less';

@connect(state => ({
  activeTabData: state.tabs.activeTabData,
}))
class LeftList extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      hasMore: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.leftList,
    });
  }

  // 上一页下一页
  changePage = type => {
    let { pageSize = 10, total = 0, setFrameState, leftList = [], pageNum } = this.props;
    const totalPage = this.getPageTotal();
    if (type === '+') {
      // this.onLoadMore();
      pageNum += 1;
      if (pageNum > totalPage) return;
      setFrameState(
        {
          pageNum: pageNum,
          isChangePageSize: true,
        },
        () => {
          this.props.getLeftList();
        },
      );
    }
    if (type === '-') {
      pageNum -= 1;
      if (pageNum <= 0) return;
      setFrameState(
        {
          pageNum: pageNum,
          isChangePageSize: true,
        },
        () => {
          this.props.getLeftList();
        },
      );
    }
  };

  // 输入框中的分页
  changePageSize = value => {
    const { pageSize = 10, total = 0, setFrameState, pageNum } = this.props;
    const totalPage = Math.ceil(total / pageSize);
    if (value < 0 || value > totalPage) return;
    setFrameState({
      pageNum: value,
    });
  };

  getPageTotal = () => {
    let { pageSize = 10, total = 0, setFrameState, leftList = [], pageNum } = this.props;
    const totalPage = Math.ceil(total / pageSize);
    return totalPage;
  }

  // 失去焦点的时候获取数据
  onLoadMore = (e) => {
    const v = e.target.value;
    let { pageSize = 10, total = 0, setFrameState, leftList = [], pageNum } = this.props;
    // let newPageNum = ++pageNum;
    const totalPage = this.getPageTotal();
    if (v <= 0 || v > totalPage) return;
    setFrameState(
      {
        pageNum: pageNum,
      },
      () => {
        this.props.getLeftList();
      },
    );
  };
  // 渲染列中的数据
  renderRow = (item, currentEle, data, color, priorityColor, iconName) => {
    return currentEle.map((items, index) => {
      let value = items.relationColumnName ? JSON.parse(data[items.id]) : {};
      const { basetype } = items;
      let typeColor = basetype === 20 ? color : basetype === 21 ? priorityColor : '';
      let displayName = items.canDisplayName ? items.displayName + ':' : null;
      let icon =
        index === 0 && !iconName ? (
          <span className={`iconfont icon-list-first ${styles.firstIcon}`} />
        ) : null;
      return items.visiabled ? (
        <Col key={index} title={value.name} span={items.columnSpan}>
          {icon}
          {displayName}{' '}
          {!!typeColor && <span style={{ background: typeColor }} className={styles.stateName} />}{' '}
          {value.name || ''}
        </Col>
      ) : null;
    });
  };

  // 选中背景色
  setBackGround = (item, index) => {
    const { data } = this.state;
    this.props.updateSelectList(data[index]);
  };

  // 渲染整个列
  renderList = (item, current) => {
    const { elementMap, listTab, leftStatusList, activeTreeNode } = this.props;
    const { langLib } = this.context;
    let currentEle = elementMap[listTab[0].id].filter(
      item => !BTN_ELEMENT_TYPE.includes(item.basetype),
    );
    let highlight = '';
    if (listTab[0].highlightenabled === 1 && listTab[0].highlight) {
      const highlightConfig = listTab[0].highlight.replace('"', '"');
      highlight = JSON.parse(highlightConfig);
    }
    let data = {};
    let idEle = currentEle.find(item => item.relationColumnName === 'id');
    let blowingoutEle = currentEle.find(item => item.relationColumnName === highlight.key);
    // let blowingoutEle = currentEle.find(item => item.relationColumnName === 'blowingout');
    if (!idEle) {
      return;
    }
    currentEle.forEach(items => {
      if (items.visiabled) {
        for (let key in item) {
          if (Number(key).toString() !== 'NaN') {
            // data[obj.relationColumnName] = item[key];
            data[key] = item[key];
          } else {
            let control = currentEle.find(item => item.relationColumnName === key);
            if (control) {
              data[control.id] = item[key];
            }
          }
        }
      }
    });
    let typeEle = currentEle.find(item => item.basetype === 22);
    let iconName = '';
    if (typeEle) {
      iconName = data[typeEle.id] && JSON.parse(data[typeEle.id]).iconname;
    }
    let stateEle = currentEle.find(item => item.basetype === 20);
    let priorityEle = currentEle.find(item => item.basetype === 21);
    let stateColor = (stateEle && data[stateEle.id] && JSON.parse(data[stateEle.id]).color) || '';
    let priorityColor =
      (priorityEle && data[priorityEle.id] && JSON.parse(data[priorityEle.id]).color) || '';
    let activeId =
      activeTreeNode && JSON.stringify(activeTreeNode) !== '{}'
        ? JSON.parse(activeTreeNode[idEle.id]).id
        : '';
    let listId = idEle && JSON.parse(item[idEle.id]).id;
    const curData = blowingoutEle ? JSON.parse(data[blowingoutEle.id]) : {};
    const isHighlight = curData.id === highlight.value;
    const rowCla = classNames({
      active: listId === activeId,
      system__listActive: listId === activeId,
    });
    const itemStyle = {
      backgroundColor: isHighlight && highlight.backgroundColor ? highlight.backgroundColor : '',
      borderLeft: isHighlight && highlight.borderColor ? `3px solid ${highlight.borderColor}` : '',
    };
    return (
      <Row
        className={`${rowCla} system__listHover`}
        style={itemStyle}
        key={item.listId}
        onClick={() => this.setBackGround(item, current)}
      >
        <Col span={iconName ? 5 : 0}>
          <span
            style={{ color: stateColor || priorityColor }}
            className={`iconfont ${
              iconName.indexOf('bundle') > -1 ? 'iconfont-app icon-' + iconName : 'icon-' + iconName
            }`}
          />
        </Col>
        <Col span={iconName ? 19 : 24} className={`${styles.leftList} leftListLine`}>
          {this.renderRow(item, currentEle, data, stateColor, priorityColor, iconName)}
        </Col>
      </Row>
    );
  };
  // 点击新增
  addNew = () => {
    this.props.add();
  };

  render() {
    const { langLib } = this.context;
    const {
      loading,
      treeData,
      activeTreeNode = {},
      showCreate,
      element,
      pageNum,
      pageSize = 10,
      total = 0,
      activeTabData,
    } = this.props;
    const { attributes } = activeTabData.functionData;
    const { data = [] } = this.state;
    const totalPage = Math.ceil(total / pageSize);
    const currentPage = Math.ceil(data.length / pageSize);
    const loadMore = (
      <div className={`${styles.inputWrap} system__moreList`}>
        <button
          onClick={() => this.changePage('-')}
          className={`${styles.buttonRest} system__contentbkgd system__fontColor--must`}
        >
          <span className="iconfont icon-left" />
        </button>
        <span className="system__fontColor--must">
          {total}
          <FormattedMessage id="global.lines" />
          &nbsp;
        </span>
        {/*<InputNumber*/}
        {/*  max={totalPage}*/}
        {/*  className={styles.inputChange}*/}
        {/*  value={pageNum}*/}
        {/*  onBlur={this.onLoadMore}*/}
        {/*  onChange={this.changePageSize}*/}
        {/*/>*/}
        <Input
          // type='number'
          max={totalPage}
          className={styles.inputChange}
          value={pageNum}
          // onBlur={this.onLoadMore}
          // onChange={this.changePageSize}
        ></Input>
        {/*<CInputNumber*/}
        {/*  min={0}*/}
        {/*  max={totalPage}*/}
        {/*  className={styles.inputChange}*/}
        {/*  value={pageNum}*/}
        {/*  onBlur={this.onLoadMore}*/}
        {/*  onChange={this.changePageSize}*/}
        {/*/>*/}
        <span className="system__fontColor--must">&nbsp;/{totalPage}</span>
        <button
          onClick={() => this.changePage('+')}
          className={`${styles.buttonRest} system__contentbkgd system__fontColor--must`}
          disabled={currentPage === totalPage}
        >
          <span className="iconfont icon-right" />
        </button>
      </div>
    );
    return (
      <div className={styles.wrap}>
        <div className={styles.searchWrap}>
          <CSearch
            className={styles.search}
            placeholder={langLib['form.placeholder.keywords']}
            onSearch={() =>
              this.props.setFrameState({ pageNum: 1 }, () => this.props.getLeftList())
            }
            onChange={e => this.props.setFrameState({ keyword: e.target.value.replace(SPECIAL_CHARACTERS, '') })}
          />
          {showCreate && !!attributes.canadd ? (
            <Row className={styles.addNew}>
              <div
                className={`${styles.addNewBtn} globalAddNewBtn system__defaultButton`}
                onClick={() => this.addNew()}
              >
                <Icon className={`${styles.addnewBtnIco} custom-color`} type="plus-square" />
                <span>{element[0].displayName}</span>
              </div>
            </Row>
          ) : null}
        </div>
        <div className={showCreate && !!attributes.canadd ? styles.left : styles.leftNomal}>
          <CSpin spinning={loading}>
            <List
              split={false}
              itemLayout="horizontal"
              // loadMore={loadMore}
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item key={item.keycode}>{this.renderList(item, index)}</List.Item>
              )}
            />
          </CSpin>
        </div>
        {loadMore}
        <TreeFooter />
      </div>
    );
  }
}

export default LeftList;
