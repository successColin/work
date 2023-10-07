import audioUrl from '@/assets/audio/message.mp3';
import { CSpin } from '@/components/common/BasicWidgets';
import CreateDrawer from '@/components/common/CreateDrawer/CreateDrawer';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import { doUpdateMessageStatus, getMessageCount, getMessageList } from '@/services/global';
import { getCookie, getDefaultConfirmProps } from '@/utils/common';
import Socket from '@/utils/socket';
import { Badge, Checkbox, Col, List, message, Row } from 'antd';
import { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import styles from '../BasicHeader.less';

const timeOut = 15000;
let userInfo = null;

class Message extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      mouseEnterKey: null,
      selectedKeys: [], // 选中的数据
      loading: false,
      hasMore: false,
      delIds: [],
      count: 0, // 数量
      pageSize: 10,
      pageNum: 1,
    };
    this.ws = null;
    this.isCompatibility = false; // 是否兼容websocket
  }

  componentDidMount() {
    const eam_info = getCookie('eaminfo');
    userInfo = eam_info ? JSON.parse(decodeURIComponent(unescape(eam_info))) : {};
    if (!!window.WebSocket && window.WebSocket.prototype.send) {
      console.log('兼容websoket');
      this.isCompatibility = true;
      this.fetchCount({ userInfo, type: 'websocket' });
      this.websocketInit();
    } else {
      this.fetchCount({ userInfo, type: 'polling' });
      console.log('不兼容websoket');
    }
  }

  componentWillUnmount() {
    if (this.isCompatibility) {
      console.log(this.ws);
      !!this.ws && this.ws.closeSocket();
      this.ws = null;
    } else {
      !!this.ws && clearTimeout(this.ws);
      this.ws = null;
    }
  }

  // 播放铃声
  play = () => {
    let dmo = document.getElementById('audioRef');
    dmo && dmo.play();
  };

  // 获取数据
  fetchCount = ({ userInfo, type }) => {
    const { id } = userInfo;
    getMessageCount({ userId: id })
      .then(res => {
        if (res.num > this.state.count && this.state.visible) {
          this.refreshList();
        }
        if (res.num > this.state.count) {
          this.play();
        }
        this.setState({ count: res.num });
        if (type === 'polling') {
          !!this.ws && clearTimeout(this.ws);
          this.ws = setTimeout(() => {
            this.fetchCount({ userInfo, type });
          }, timeOut);
        }
      })
      .catch(res => {
        if (this.isCompatibility) {
          !!this.ws && this.ws.closeSocket();
          this.ws = null;
        }
      });
  };

  // 获取所有的消息
  fetchAll = () => {
    const { id } = userInfo;
    const { pageSize, pageNum } = this.state;
    this.setState({ loading: true });
    getMessageList({ pageSize, pageNum, userId: id }).then(res => {
      const { list, total } = res;
      this.setState({
        visible: true,
        data: list || [],
        hasMore: total > list.length,
        loading: false,
      });
    });
  };

  // websocket初始化
  websocketInit = () => {
    const eam_info = getCookie('eaminfo');
    const userInfo = eam_info ? JSON.parse(decodeURIComponent(unescape(eam_info))) : {};
    let hosts = 'v9.mingcloud.top';
    // let url = `ws://121.196.97.165/eam/socketServer/${userInfo.id}`;
    let url = `${query.hosts}${query.WEBSOKET_USERID}${userInfo.id}`;
    this.ws = new Socket({
      socketUrl: url,
      timeout: 5000,
      socketMessage: receive => {
        console.log(receive); // 后端返回的数据，渲染页面
        this.fetchCount({ userInfo, type: 'websocket' });
      },
      socketClose: msg => {
        console.log(msg, '关闭');
      },
      socketError: () => {
        console.log(this.state.taskStage + '连接建立失败');
      },
      socketOpen: () => {
        console.log('连接建立成功');
        // 心跳机制 定时向后端发数据
        this.taskRemindInterval = setInterval(() => {
          this.ws.sendMessage({ msgType: 0 });
        }, 30000);
      },
    });
    // 重试创建socket连接
    try {
      this.ws.connection();
    } catch (e) {
      // 捕获异常，防止js error
      // donothing
    }
  };
  // 去掉文案中的标签
  matchReg = str => {
    if (!str) return '';
    let reg = /<[^>]+>/g;
    return str.replace(reg, '');
  };

  // 设置已读
  changeStatus = item => {
    const { id: msgIds } = item;
    const { id } = userInfo;
    let params = {
      userId: id,
      msgIds, // 消息id列表  1,2,3,4
      isDelete: 0, // 是否删除 1: 删除 0: 设置为已读
      isAllMsg: 0, // 是否针对用户下的所有  1: 是 0: 否
    };
    doUpdateMessageStatus(params).then(res => {
      this.refreshList();
      const { count } = this.state;
      this.setState({ count: count - 1 });
    });
  };
  // 下拉加载更多
  handleInfiniteOnLoad = (a, b) => {
    const { id } = userInfo;
    const { pageSize, pageNum, data } = this.state;
    this.setState({ loading: true, pageNum: pageNum + 1 }, () => {
      getMessageList({ pageSize, pageNum: pageNum + 1, userId: id }).then(res => {
        const { list, total } = res;
        let newData = data.concat(list);
        this.setState({ data: newData || [], hasMore: total > newData.length, loading: false });
      });
    });
  };
  // 重新刷新数据
  refreshList = () => {
    const { pageSize, pageNum } = this.state;
    this.setState({ loading: true });
    const { id } = userInfo;
    getMessageList({ pageSize: pageSize * pageNum, pageNum: 1, userId: id }).then(res => {
      const { list, total } = res;
      this.setState({ data: list || [], hasMore: total > list.length, loading: false });
    });
  };
  // 全部标志已读
  readAll = () => {
    const { id } = userInfo;
    let params = {
      userId: id,
      msgIds: '', // 消息id列表  1,2,3,4
      isDelete: 0, // 是否删除 1: 删除 0: 设置为已读
      isAllMsg: 1, // 是否针对用户下的所有  1: 是 0: 否
    };
    doUpdateMessageStatus(params).then(res => {
      this.refreshList();
      this.setState({ count: 0 });
    });
  };
  emptyAll = () => {
    const { id } = userInfo;
    let params = {
      userId: id,
      msgIds: '', // 消息id列表  1,2,3,4
      isDelete: 1, // 是否删除 1: 删除 0: 设置为已读
      isAllMsg: 1, // 是否针对用户下的所有  1: 是 0: 否
    };
    doUpdateMessageStatus(params).then(res => {
      this.refreshList();
      this.setState({ count: 0 });
    });
  };
  // 复选框操作
  select = key => {
    const { selectedKeys } = this.state;
    let newSelectedKeys = [...selectedKeys];
    let index = selectedKeys.findIndex(item => item === key);
    if (index === -1) {
      newSelectedKeys.push(key);
    } else {
      newSelectedKeys.splice(index, 1);
    }
    this.setState({ selectedKeys: newSelectedKeys });
  };

  // 批量删除消息
  handleDel = type => {
    const { langLib } = this.context;
    const that = this;
    const title = type === 'read' ? '确定都已读吗？' : '确定要删除吗？';
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      content: '',
      title,
      onOk() {
        const { id } = userInfo;
        const { selectedKeys, data } = that.state;
        let params = {
          userId: id,
          msgIds: selectedKeys.join(','), // 消息id列表  1,2,3,4
          isDelete: type === 'read' ? 0 : 1, // 是否删除 1: 删除 0: 设置为已读
          isAllMsg: 0, // 是否针对用户下的所有  1: 是 0: 否
        };
        let unreadArr =
          data.filter(item => selectedKeys.includes(item.id) && !!!item.stateid) || []; // 找到未读的数据
        let n = unreadArr.length;
        doUpdateMessageStatus(params).then(
          res => {
            that.refreshList();
            const { count } = that.state;
            that.setState({ selectedKeys: [], count: count - n });
            message.success(langLib['message.check.success']);
            closeModal();
          },
          err => {
            closeModal();
          },
        );
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
  };

  // 渲染整个列
  renderList = (item, current) => {
    const { selectedKeys, mouseEnterKey } = this.state;
    const { id: listId, stateid } = item;

    const isChecked = !!selectedKeys.find(item => item === listId);
    let icon = (
      <span className={`iconfont icon-mail-notice ${styles.listIcon} system__fontColor--must`} />
    );
    return (
      <Row
        key={listId}
        className={`${styles.rowWrap} system__lineBorder--bottomDashed system__listHover`}
        onMouseEnter={() => {
          this.setState({ mouseEnterKey: listId });
        }}
        onMouseLeave={() => {
          this.setState({ mouseEnterKey: null });
        }}
      >
        {(mouseEnterKey === listId || isChecked) && (
          <Checkbox
            onChange={() => {
              this.select(listId);
            }}
            className={styles.checkboxWrap}
            checked={isChecked}
          />
        )}
        <Col span={3}>{icon}</Col>
        <Col
          span={21}
          className={styles.messageContent}
          onClick={
            stateid
              ? null
              : () => {
                  this.changeStatus(item);
                }
          }
        >
          <Row>
            <Col
              span={24}
              className={`${
                !stateid ? styles.messageTit : styles.messageText
              } system__fontColor--must`}
            >
              {!stateid ? <span className={styles.status} /> : ''}
              {item.title}
            </Col>
            <Col span={24} className={`${styles.contentText}`}>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </Col>
            <Col span={24} className={`${styles.contentContent} system__fontColor--must`}>
              {item.createDate || '2020-02-21 12:22:30'}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  render() {
    const { visible, hasMore, loading, count, data, selectedKeys } = this.state;
    let len = selectedKeys.length;
    const footer = len ? (
      <Row className={styles.operation}>
        <Col
          span={8}
          style={{ borderRight: '1px solid #f0f0f0' }}
          onClick={() => {
            this.handleDel('read');
          }}
          className="system__fontColor--must system__lineBorder--right"
        >
          批量已读({len})
        </Col>
        <Col
          span={8}
          style={{ borderRight: '1px solid #f0f0f0' }}
          onClick={() => {
            this.handleDel('del');
          }}
          className="system__fontColor--must system__lineBorder--right"
        >
          批量删除({len})
        </Col>
        <Col
          span={8}
          onClick={() => this.setState({ selectedKeys: [] })}
          className="system__fontColor--must"
        >
          取消
        </Col>
      </Row>
    ) : (
      <>
        <div className={`${styles.read} system__fontColor--must`} onClick={() => this.readAll()}>
          <span className={'iconfont icon-reader-only'} style={{ fontSize: '14px' }} />
          标志所有信息已读
        </div>
        <div className={`${styles.read} system__fontColor--must`} onClick={() => this.emptyAll()}>
          <span className={'iconfont icon-reader-only'} style={{ fontSize: '14px' }} />
          一键清空所有信息
        </div>
      </>
    );
    return (
      <>
        <Badge
          count={count}
          // dot={true}
          overflowCount={99}
          className={'custom-header-badge'}
        >
          <span
            onClick={() => {
              this.fetchAll();
            }}
            className="iconfont icon-notice"
            style={{ fontSize: '23px' }}
          />
        </Badge>
        <audio id="audioRef" src={audioUrl} />
        <CreateDrawer
          visible={visible}
          title={'通知消息'}
          width={376}
          zIndex={11111}
          destroyOnClose={true}
          footer={null}
          className={styles.messageWrap}
          bodyStyle={{ width: '376px', overflow: 'hidden' }}
          onClose={() =>
            this.setState({
              visible: false,
              selectedKeys: [],
              pageSize: 10,
              pageNum: 1,
            })
          }
        >
          <CSpin spinning={loading}>
            <div className={styles.drawBody}>
              <div className={`${styles.scrollBody} demo-infinite-container`}>
                <InfiniteScroll
                  className={styles.drawScroll}
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!loading && hasMore}
                  useWindow={false}
                >
                  <List
                    split={false}
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                      <List.Item key={item.keycode}>{this.renderList(item, index)}</List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
              <div className={`${styles.footer} system__lineBorder--top`}>{footer}</div>
            </div>
          </CSpin>
        </CreateDrawer>
      </>
    );
  }
}

export default Message;
