/*
 * @Description:
 * @Author: tjf
 * @Date: 2020-05-13 10:09:59
 * @LastEditTime: 2020-05-29 14:41:16
 * @LastEditors: tjf
 */
import { fetchGHworkorderList, getListData } from '@/services/board';
import { parseDecimal } from '@/utils/common';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import CTable from './component/CTable/CTable.js';
import styles from './WorkList.less';

const config = require('@/constants/config');
let listContentWidth = 0;
let lastDateTime = 0; // 最后的时间
let tblTop =
  document.getElementsByClassName('ant-table-body') &&
  document.getElementsByClassName('ant-table-body')[0] &&
  document.getElementsByClassName('ant-table-body')[0].clientHeight; // 表格位置
let tabHeight =
  document.getElementsByClassName('ant-table-body') &&
  document.getElementsByClassName('ant-table-body')[0] &&
  document.getElementsByClassName('ant-table-body')[0].clientHeight;

class BoardWorkList extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.isSpeaking !== state.isSpeaking) {
      return {
        isSpeaking: props.isSpeaking,
      };
    }
    return null;
  }

  timer = null; // 语音播报定时器
  state = {
    elementMap: {}, // 控件map
    tabId: null, // 面板id
    listRowData: {}, // 上一个面板的行数据(最后在props中取值)
    formData: {}, // 表单数据
    originFormData: {}, // 原始表单数据（避免触发器影响显示初始状态）
    listDataObj: {}, // 列表数据
    listSelectedRows: [], // 列表选择的行数据
    tabDropDownData: {}, // 当前面板下的下拉数据(内容以{表名: [下拉数据]})形式）
    visiblePopup: false, // 弹出面板的显示状态
    triggerPopupEle: {}, // 触发弹出面板的控件信息
    popupTabInfo: {}, // 弹出面板信息
    popupHasFetched: false,
    relationFileObj: {}, // 文件关联信息
    calendarList: [], // 便捷搜索条件
    handleSetCustomSelectList: null, // 自定义选择框弹出列表中选中行后点击确定
    loadingStatus: {
      data: false, // 获取数据
      mainList: false, // 主列表
    },
    mainListData: [], // 主面板列表数据
    mainListRowData: {}, // 主列表行数据
    currentList: [],
    loading: false,
    data: {},
    pageNum: 1,
    pageSize: 100, // aaa
    // fullPageSize: 50,
    msg: '',
    isSpeaking: false, // 播报状态

    total: 0,
    isOne: true,
    isChange: true,
    pushItem: 10,
  };
  // 获取
  getListContentWidth = () => {
    // let clientWidth = this.refs.tableRef.clientWidth; // document.body
    // listContentWidth = clientWidth - 290 * 2 - 32;
    listContentWidth = this.refs.tableRef.clientWidth;
  };

  async componentDidMount() {
    // 获取列表区域高度，计算单页请求pagesize
    this.getListContentWidth();
    // const height = document.getElementById('workList').offsetHeight;
    // const pageSize = parseInt(height / 35) - 1;
    // const pageSize = parseInt(height / 35) - 2;
    // this.setState({
    //   pageSize: pageSize,
    // });

    // await setTimeout(() => {
    //   this.props.fromType === 'normal' && this.fetchListData();
    // }, 10);
    await (this.props.fromType === 'normal' && this.fetchListData());

    lastDateTime = 0; // 最后的时间
    tblTop = document.getElementsByClassName('ant-table-body')[0].clientHeight; // 表格位置
    this.timerFun();
  }

  componentWillUnmount() {
    this.interve && cancelAnimationFrame(this.interve);
    this.timer && clearTimeout(this.timer);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // 取消播报
      this.handleSpeak();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isSpeaking, data } = this.state;
    if (prevState.isSpeaking !== isSpeaking && config.PROJECT_NAME) {
      if (isSpeaking) {
        this.fetchWorkorderList();
      } else {
        window.speechSynthesis.cancel(); // 取消播报
        this.timer && clearTimeout(this.timer);
      }
    }
  }

  taskIndustryNews = () => {
    const ele = document.getElementById('workList');
    const ele1 = document.querySelector('.workList table tbody');
    if (
      this.refs.newDiv.scrollTop >=
      this.refs.newDivUI.offsetHeight - this.refs.newDiv.clientHeight
    ) {
      this.refs.newDiv.scrollTop = 0;
    } else {
      this.refs.newDiv.scrollTop += 1;
    }
  };

  timerFun = e => {
    // 删除数据定时器
    var nowDate = new Date();
    if (nowDate.getTime() - lastDateTime >= 50) {
      // 当前时间与上一次时间间隔
      lastDateTime = nowDate.getTime();
      const { currentList, pageNum, pageSize, total, isChange, pushItem } = this.state;
      if (currentList.length > 0) {
        // 假如 currentList < total
        if (currentList.length === total) {
          // 然后向上移动
          if (Number(tblTop) === -35 * currentList.length) {
            tblTop = document.getElementsByClassName('ant-table-body')[0].clientHeight;
          } else {
            tblTop = (tblTop - 1).toFixed(0);
          }
        } else {
          if (isChange) {
            this.setState({
              pageNum: 10,
              pageSize: pushItem,
              isChange: false,
            });
          }
          if (Number(tblTop) === -35 * currentList.length) {
            tblTop = document.getElementsByClassName('ant-table-body')[0].clientHeight;
          } else {
            tblTop = (tblTop - 1).toFixed(0);
          }
          if (!isChange) {
            // 如果总条数据少于现有数据，则掉接口
            if (pageNum * pageSize < total && (tblTop < 0 && tblTop % (35 * pushItem) === 0)) {
              currentList.splice(0, pushItem);
              tblTop = 0;
              this.setState(
                {
                  pageNum: pageNum + 1,
                  currentList,
                },
                () => {
                  this.fetchListData();
                },
              );
            }
          }
        }
        const ele1 = document.querySelector('#workList .ant-table-body .ant-table-tbody');
        if (ReactDom.findDOMNode(ele1)) {
          ReactDom.findDOMNode(ele1).style.top = tblTop + 'px';
        }
      }
    }
    this.interve = requestAnimationFrame(this.timerFun);
  };

  relizeFullScreen = () => {
    cancelAnimationFrame(this.interve);
    setTimeout(() => {
      // let { pageNum } = this.state;
      // const height = document.getElementById('workList').offsetHeight;
      // const PageSize = parseInt(height / 35) - 1;
      // const PageSize = parseInt(height / 35) - 2;
      this.setState(
        {
          // fullPageSize: PageSize,
          // pageNum: pageNum === 1 ? pageNum : pageNum < 1 ? 1 : pageNum - 1,
          currentList: [],
          pageNum: 1,
          pageSize: 100, // aaa
          isChange: true,
        },
        () => {
          this.props.fromType === 'normal' && this.fetchListData();
        },
      );
    });
    this.timerFun();
  };

  /**
   * 获取工单列表
   */
  fetchWorkorderList = () => {
    const { globalQueryMap } = this.props;
    let params = {
      tabSource: globalQueryMap['@@GobalTableName'] ? globalQueryMap['@@GobalTableName'].value : '',
      id: globalQueryMap['@@GobalId'] ? globalQueryMap['@@GobalId'].value : '',
    };
    fetchGHworkorderList(params).then((res = []) => {
      if (res.length) {
        const msg = this.renderMes(res);
        this.setState({ msg }, () => {
          this.handleSpeak(msg);
        });
      }
    });
    const time = 5 * 60 * 1000;
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchWorkorderList();
    }, time);
  };
  /**
   * 获取列表数据
   * @param {array} searchQueryList 便捷搜索条件
   * @param {object} targetTabInfo  目标面板信息（如，数据选择框的弹出列表面板、常规列表面板）
   */
  async fetchListData() {
    const {
      elementList,
      tabId,
      tabSource,
      globalMap,
      globalQueryMap,
      boardIsFullScreen,
      jumpTag,
    } = this.props;
    const { pageNum, pageSize, fullPageSize, isSpeaking, currentList, isOne } = this.state;
    const params = {
      elementList,
      tabId,
      tabSource,
      pageNum,
      pageSize: pageSize,
      globalMap,
      globalQueryMap,
      jumpTag,
    };
    if (!elementList.length) return;
    // this.setLoadingStatus('data', true);
    await getListData(params).then(res => {
      let { pageNum, pageSize, total } = res;
      if (pageNum * pageSize >= total) {
        pageNum = 0;
      }
      currentList.push(...res.datalist);
      this.setState({
        currentList,
        data: res,
        pageNum: pageNum,
      });
      if (isOne) {
        this.setState({
          total: res.total,
          isOne: false,
        });
      }
    });
  }
  getWindowVoice = () => {
    // 获取浏览器中语音 (中文 + 本地服务)
    return window.speechSynthesis
      .getVoices()
      .find(item => item.localService && item.lang === 'zh-CN');
  };
  renderMes = datalist => {
    // const nameObj = this.getLabel();
    let msg = '';
    const nodata = '暂无';
    datalist.forEach(item => {
      msg += `工单名称: ${item.workName || nodata}; 设备名称: ${item.deviceName ||
        nodata}; 日期: ${item.dateTime || nodata}; 工单类型: ${item.typeName ||
        nodata}; 位置: ${item.positionName || nodata};`;
      // Object.keys(item).forEach((keys) => {
      //   const name = nameObj[Number(keys)];
      //   if (name) {
      //     const value = JSON.parse(item[keys]).name || '';
      //     msg += `${name}: ${value} `;
      //   }
      // });
    });
    return msg;
  };
  getLabel = () => {
    //
    const { tabList, elementMap, elementList } = this.props;
    const elements =
      elementList.filter(item => item.visiabled === 1 && item.relationColumnName) || [];
    let obj = {};
    elements.forEach(item => {
      const { displayName, elementId } = item;
      obj[elementId] = displayName;
    });
    return obj;
  };

  // 语音播报的函数
  handleSpeak(text = '') {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // 取消播报
      const synth = window.speechSynthesis;
      const msg = new SpeechSynthesisUtterance();
      msg.text = text; // 文字内容
      msg.lang = 'zh-CN'; // 使用的语言:中文
      msg.volume = 1; // 声音音量：1
      msg.rate = 1; // 语速：1
      msg.pitch = 2; // 音高：1
      msg.voice = this.getWindowVoice(); // 使用本地服务合成语音(若是获取不到 请异步获取, 加一个setTimeout)
      synth.speak(msg); // 播放
    }
  }

  // 生成表头
  getTableColumns = () => {
    const { tabList, elementMap, elementList } = this.props;
    const elements =
      elementList.filter(item => item.visiabled === 1 && item.relationColumnName) || [];
    return elements.map((item, index) => {
      const { elementPcStyle } = item;
      let proportion = !elementPcStyle || elementPcStyle < 100 ? 0 : (elementPcStyle - 100) / 100;
      const w = listContentWidth && proportion ? listContentWidth * proportion + 'px' : '120px';
      return {
        title: item.displayName,
        dataIndex: `a${item.elementId}`,
        key: `a${item.elementId}`,
        ellipsis: true,
        width: w,
        render: (text, record) => {
          const {
            relationTabId,
            elementId,
            relationColumnName,
            defaultValue,
            elementFormat,
            basetype,
          } = item;
          const content =
            record[`a${elementId}`] && record[`a${elementId}`].indexOf('1970-01-01') > -1
              ? ''
              : parseDecimal(record[`a${elementId}`]) || '';
          let style = { width: w };
          let style1 = {};
          if (JSON.parse(record[elementId]).color) {
            style1 = { background: JSON.parse(record[elementId]).color, width: 'auto' };
          }
          // const color = JSON.parse(record[elementId]).color || '';
          return (
            <div style={style}>
              <div style={style1} title={content}>
                {content}
              </div>
            </div>
          );
        },
      };
    });
  };
  // 数据处理
  dataProcessing = (arr = []) => {
    let { data, elementList } = this.props;
    let { total, pageNum, pageSize } = this.state.data;
    const { tabList, elementMap } = this.state;
    // let mainTab = tabList.find(item => {
    //   return item.mainTab === 1;
    // }) || {};
    // let id = mainTab.id;
    // let elementList = elementMap[id];
    let newDataSource = [];
    arr.forEach((item, index) => {
      let data = {};
      for (let key in item) {
        if (Number(key).toString() !== 'NaN') {
          // item[obj.relationColumnName] = JSON.parse(item[key]).name;
          data.zindex = (pageNum - 1) * pageSize + index;
          data[`a${key}`] = JSON.parse(item[key]).name;
        } else {
          let obj = elementList.find(value => {
            return value.relationColumnName === key;
          });
          data.zindex = (pageNum - 1) * pageSize + index;
          if (obj) {
            data[`a${obj.id}`] = JSON.parse(item[key]).name;
          }
        }
        if (key === 'id') {
          data.id = JSON.parse(item[key]).name;
        }
      }
      data = {
        ...item,
        ...data,
      };
      newDataSource.push(data);
    });
    return newDataSource;
  };

  render() {
    let columns = this.getTableColumns();
    const { currentList, loading, msg, isSpeaking } = this.state;
    let dataSource = this.dataProcessing(currentList) || [];
    return (
      <div className={styles.wrap}>
        <div id="workList" className={styles.workList} ref="tableRef">
          {/* scroll={{ x: 'max-content', y: 92 }} */}
          <CTable
            columns={columns}
            loading={loading}
            pagination={false}
            dataSource={dataSource}
            rowKey={record => record.zindex}
          />
          {isSpeaking ? (
            <div className={styles.scrollWrap}>
              <img className={styles.voice} src={require('@/assets/voicePlayback.png')} alt="" />
              <div className={styles.textOver}>
                <div className={styles.scrollText}>{msg}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default BoardWorkList;
