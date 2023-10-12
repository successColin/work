import { CButton } from '@/components/common/BasicWidgets';
import SeniorFilter from '@/components/Frames/OutlookFrame/ContentContainer/SeniorFilter/SeniorFilter';
import ButtonLine from '@/components/Frames/TreeFrame/ContentContainer/ButtonLine/ButtonLine';
import { Dropdown, Input, Menu } from 'antd';
import { connect } from 'dva';
import { Component } from 'react';
import SearchQuery from '../SearchQuery/SearchQuery';
import LineProgress from './LineProgress/LineProgress';
import Styles from './OutlookState.less';
import States from './States/States';

const { Search } = Input;

@connect(state => {
  console.log(state);
  return {
    tabs: state.tabs,
  };
})
class OutlookState extends Component {
  state = {
    searchValue: { keywords: '' },
    scrollWidth: document.body.scrollWidth,
    fixedWidth: 1900,
  };
  componentDidMount() {}
  // 获取便捷搜索列表
  getQuickQueryEle = () => {
    const { elementList } = this.props;
    const quickQueryEleList = elementList.filter(item => item.quickQuery);
    return quickQueryEleList;
  };
  renderBtnGroup = () => {
    console.log(111);
    const { sqlElementList, allFooterBtnProps, fetchListData, tabInfo, elementList } = this.props;
    const { setContainerState, filterMap, handleClickBtn } = allFooterBtnProps;
    const { scrollWidth, fixedWidth } = this.state;
    if (scrollWidth > fixedWidth) {
      return sqlElementList.map(item => {
        const { basetype } = item;
        if (basetype === 24) {
          return (
            <div key={`${item.id}`} className={Styles.btnDefault}>
              <ButtonLine {...allFooterBtnProps} elementList={[item]} icon="icon-batch-update" />
            </div>
          );
        } else {
          return null;
        }
      });
    } else {
      let menuList = sqlElementList.map(
        item =>
          (item.basetype === 24 && (
            <Menu.Item key={`${item.id}`} onClick={e => handleClickBtn(item)}>
              <div className={Styles.overlayItem}>{item.displayName}</div>
            </Menu.Item>
          )) ||
          '',
      );
      menuList = menuList.filter(Boolean);
      let menuEle = <Menu>{menuList}</Menu>;
      console.log(menuList.filter(Boolean));
      if (menuList.length === 0) {
        return;
      }
      return (
        <div className={Styles.btnDefault}>
          <Dropdown overlay={menuEle} placement="bottomLeft" arrow>
            <CButton className={Styles.ellipsis}>
              <i
                className="iconfont icon-gengduocaozuo custom-color"
                style={{ position: 'relative', left: '-7px' }}
              />
            </CButton>
          </Dropdown>
        </div>
      );
    }
  };
  render() {
    const {
      sqlElementList,
      addBtn,
      allFooterBtnProps,
      fetchListData,
      listQueryParams,
      currentTabDropDownData,
      state,
      seniorFilter,
      elementList,
      tabInfo,
      updataState,
      searchQueryList,
      doRestSearchList,
      tabs,
    } = this.props;
    const { setContainerState, filterMap } = allFooterBtnProps;
    const { scrollWidth, fixedWidth } = this.state;
    console.log(1111111111, tabs);
    // 展望状态
    let stateDate = [];
    let selectElementId = 0;
    if (JSON.stringify(currentTabDropDownData) !== '[]' && JSON.stringify(state) !== '[]') {
      stateDate = currentTabDropDownData[state[0].id];
      selectElementId = state[0].id;
    }
    // 展望时间
    let startToEnd = '';
    if (JSON.stringify(seniorFilter) !== '{}' && seniorFilter !== undefined) {
      for (let key in seniorFilter) {
        if (key === 'plannedstartdate') {
          startToEnd = seniorFilter['plannedstartdate']['static_value'].split(',')[1];
        }
      }
    }
    // 右边按钮
    let exportEle = sqlElementList.find(item => item.basetype === 30 && item.visiabled); // 导出
    let seniorEle = sqlElementList.find(item => item.basetype === 33 && item.visiabled); // 高级删选
    let fuzzySearchEle = sqlElementList.find(item => item.basetype === 14 && item.visiabled); // 模糊搜索
    return (
      <div className={Styles.outlookState_con}>
        <div className={`${Styles.left} system__lineBorder--right`}>
          <div className={`${Styles.time}`}>
            {/* <span className="system__whiteColor">展望截止时间</span>
            <span className="system__fontColor--must">{startToEnd}</span> */}
            <span className="system__whiteColor">
              {tabs.activeTabData && tabs.activeTabData.title}
            </span>
          </div>
          <div className={`${Styles.create} system__button--top`}>
            <ButtonLine {...allFooterBtnProps} elementList={addBtn} />
          </div>
        </div>
        <div className={Styles.right}>
          <div id="sizeState">
            <LineProgress />
            {stateDate && (
              <States
                stateDate={stateDate}
                selectElementId={selectElementId}
                {...allFooterBtnProps}
                listQueryParams={listQueryParams}
                fetchListData={fetchListData}
                seniorFilter={seniorFilter}
                searchQueryList={searchQueryList}
              />
            )}
          </div>
          <div className={Styles.btnCon} id="allButton">
            {this.renderBtnGroup()}
            {// 导出
            exportEle && (
              <div className={`${Styles.btnDefault} system__button--top`}>
                <ButtonLine {...allFooterBtnProps} elementList={[exportEle]} />
              </div>
            )}
            {// 高级删选
            seniorEle && (
              <div className={Styles.btnDefault}>
                <SeniorFilter
                  entryEleObj={seniorEle}
                  elementList={elementList}
                  filterMap={filterMap}
                  fetchListData={fetchListData}
                  setContainerState={setContainerState}
                  restSearchParams={doRestSearchList}
                  tabInfo={tabInfo}
                  seniorFilterParams={seniorFilter}
                />
              </div>
            )}
            {// 模糊搜索
            fuzzySearchEle && (
              <div className={Styles.btnInput}>
                <SearchQuery
                  elementList={elementList}
                  updataState={updataState}
                  fetchListData={fetchListData}
                  setContainerState={setContainerState}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default OutlookState;
