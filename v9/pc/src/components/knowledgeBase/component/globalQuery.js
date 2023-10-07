import { Component } from 'react';
import styles from '@/components/knowledgeBase/component/fileDetial.less';
import { CSearch, CTable } from '@/components/common/BasicWidgets';
import { Breadcrumb } from 'antd';
import { getAllFiles, getFilesDetails } from '@/services/knowledgeBase';
import { formatTime } from '@/utils/common';
import cssStyles from '@/components/knowledgeBase/component/index.less';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import query from '@/constants/query';
import moment from 'moment';

const initPath = [{ id: 0, name: '全部' }];
class GlobalQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pathArr: [...initPath], // 路径
      pageSize: 20,
      page: 1,
      total: 0,
      keywords: '',
      loading: false,
    };
  }
  componentDidMount() {
    this.allInit();
  }
  allInit = () => {
    const { pathArr } = this.state;
    if (pathArr.length === 1) {
      this.init();
    } else {
      this.dropInit();
    }
  }
  init = async() => {
    const { page, keywords, pageSize } = this.state;
    try {
      this.setState({ loading: true });
      const res = await getAllFiles({
        name: keywords,
        pageNum: page,
        pageSize: pageSize,
      });
      const { list = [], total = 0 } = res;
      this.setState({
        loading: false,
        dataSource: list,
        total,
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  }
  changePageSize = (page, pageSize) => {
    this.setState({
      page, pageSize,
    }, () => {
      this.allInit();
    });
  };
  formatIcon = (name = '') => {
    if (!name) return {};
    let names = name.split('.');
    let iconname = 'icon-file-zip';
    let color = '#FFAC02';
    name = names.at(-1).toLowerCase();
    if (name === 'jpg' || name === 'jpeg') {
      iconname = 'icon-file-jpg';
      color = '#FFAC02';
    } else if (name === 'png') {
      iconname = 'icon-file-png';
      color = '#FF933D';
    } else if (name === 'doc' || name === 'docx') {
      iconname = 'icon-file-doc';
      color = '#47C69A';
    } else if (name === 'pptx' || name === 'ppt') {
      iconname = 'icon-file-ppt';
      color = '#F15643';
    } else if (name === 'zip' || name === 'rar') {
      iconname = 'icon-file-zip';
      color = '#4E7DD9';
    } else if (name === 'pdf') {
      iconname = 'icon-file-pdf';
      color = '#FFAC02';
    } else if (name === 'xls' || name === 'xlsx') {
      iconname = 'icon-file-xls';
      color = '#FF933D';
    } else if (name === 'txt') {
      iconname = 'icon-file-txt';
      color = '#47C69A';
    } else if (name === 'zip' || name === 'rar') {
      iconname = 'icon-file-zip';
      color = '#F15643';
    }
    return {
      iconname,
      color,
    };
  };
  drop = (record) => {
    const { pathArr } = this.state;
    pathArr.push(record);
    this.setState({ pathArr, keywords: '' }, () => {
      this.dropInit();
    });
  }
  changePath = (path) => {
    const { pathArr } = this.state;
    console.log(path, initPath);
    if (path.id === 0) {
      this.setState({ pathArr: [...initPath], keywords: '' }, () => {
        console.log(this.state.pathArr);
        this.allInit();
      });
    } else {
      const index = pathArr.findIndex((item) => item.id === path.id);
      if (index === -1) return;
      const arr = pathArr.slice(0, index + 1);
      this.setState({ pathArr: arr, keywords: '' }, () => {
        this.allInit();
      });
    }
  }
  dropInit = () => { // 下钻获取
    const { pathArr, keywords } = this.state;
    const current = pathArr.at(-1);
    this.setState({ loading: true });
    getFilesDetails({
      groupId: current.id,
      name: keywords,
    }).then((res = {}) => {
      const { fileList = [], filegroupList = [] } = res;
      const dataSource = [...filegroupList, ...fileList];
      this.setState({
        loading: false,
        dataSource,
        total: dataSource.length,
      });
    }).catch(err => {
      this.setState({ loading: false });
    });
  }
  // 文件图标
  showNameHtml = (name, id) => {
    const fontSize1 = {
      fontSize: '24px',
      cursor: 'default',
      marginRight: '5px',
      color: this.formatIcon(id.displayFileName).color,
    };
    const fontSize2 = {
      fontSize: '18px',
      cursor: 'default',
      marginRight: '5px',
      color: this.formatIcon(name).color,
    };
    const flex = { display: 'flex', alignItems: 'center' };
    if (id.basetype === 2) {
      const iconCls = classNames({
        'iconfont-app': true,
        // 'custom-color': true,
        [this.formatIcon(id.displayFileName).iconname]: true,
      });
      return (
        <div style={{ width: '184px', ...flex }}>
          <span className={iconCls} style={fontSize1} />
          <span title={name} style={{ display: 'inline-block', width: 'calc(184px - 27px)', overflow: 'hidden', 'whiteSpace': 'nowrap', 'text-overflow': 'ellipsis' }}>{id.displayFileName}</span>
        </div>
      );
    } else {
      return (
        <div style={{ width: '184px', ...flex, cursor: 'pointer' }} onClick={() => this.drop(id)}>
          <span style={fontSize2} className='iconfont icon-file-yellow' />
          <span title={name} style={{ display: 'inline-block', width: 'calc(184px - 27px)', overflow: 'hidden', 'whiteSpace': 'nowrap', 'text-overflow': 'ellipsis' }}>{id.name}</span>
        </div>
      );
    }
  };
  // 文件下载
  downloadFile = (e, i) => {
    const { userInfo } = this.props;
    const token = userInfo.token;
    let id = e.id;
    // let url = query.DOWNLOAD_FILE + '?id=' + id + '&token=' + token;
    let url = `${query.DOWNLOAD_FILE}?id=${id}&token=${token}`;
    const aElement = document.createElement('a');
    document.body.appendChild(aElement);
    aElement.style.display = 'none';
    aElement.setAttribute('target', '_blank');
    aElement.setAttribute('download', 'download');
    aElement.href = url;
    aElement.download = e.displayFileName;
    aElement.click();
    document.body.removeChild(aElement);
  };
  searchDetails = name => {
    this.setState({
      keywords: name,
    }, () => {
      this.allInit();
    });
  };

  render() {
    const { dataSource, pageSize, page,  loading, total, keywords, pathArr } = this.state;
    const columns = [
      {
        title: <FormattedMessage id='knowledge.name' />,
        dataIndex: 'name',
        key: 'name',
        width: '300px',
        render: (text, record) => (<div style={{ width: '184px' }}>{this.showNameHtml(text, record)}</div>),
      },
      {
        title: <FormattedMessage id='knowledge.files' />,
        dataIndex: 'fileGroupName',
        key: 'fileGroupName',
        width: '200px',
        render: (text) => <div title={text} style={{ display: 'inline-block', width: 'calc(184px)', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }}>{text}</div>,
      },
      {
        title: <FormattedMessage id='knowledge.updateDate' />,
        dataIndex: 'updateDate',
        key: 'updateDate',
        width: '150px',
        render: (text) => <div title={formatTime(text)} style={{ display: 'inline-block', width: 'calc(84px)', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }}>{formatTime(text)}</div>,
      },
      {
        title: <FormattedMessage id='knowledge.formatFileLength' />,
        dataIndex: 'formatFileLength',
        key: 'fileLength',
        width: '60px',
        render: (text) => <div title={text} style={{ display: 'inline-block', width: 'calc(44px)', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }}>{text}</div>,
      },
      {
        title: <FormattedMessage id='knowledge.createDate' />,
        dataIndex: 'createDate',
        key: 'createDate',
        width: '150px',
        render: (text) => <div title={formatTime(text)} style={{ display: 'inline-block', width: 'calc(84px)', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }}>{formatTime(text)}</div>,
      },
      {
        title: <FormattedMessage id='knowledge.orgName' />,
        dataIndex: 'orgName',
        key: 'orgName',
        width: '150px',
        render: (text) => <div title={text} style={{ display: 'inline-block', width: 'calc(84px)', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }}>{text}</div>,
      }, {
        title: <FormattedMessage id='knowledge.memo' />,
        dataIndex: 'memo',
        key: 'memo',
        render: (text) => <div title={text}>{text}</div>
      },
      {
        title: <FormattedMessage id='knowledge.right' />,
        dataIndex: 'right',
        key: 'right',
        width: '80px',
        render: (text, record) => {
          const dom = record.basetype === 2 ?  <span
            onClick={() => this.downloadFile(record)}
            className='iconfont iconDown custom-color'
          /> : null;
          return dom;
        },
      },
    ];
    const breadcrumbDom = pathArr.map((item) => {
      return  <Breadcrumb.Item key={item.id}><span   style={{ cursor: 'pointer' }}  onClick={() =>  this.changePath(item)}>{item.name}</span></Breadcrumb.Item>;
    });
    return <div className={styles.containerWrap}>
      <div className={styles.headerTitleWrap1}>
        <Breadcrumb separator=">">
          {breadcrumbDom}
        </Breadcrumb>
        <CSearch
          style={{ border: 0, marginRight: '10px' }}
          placeholder='请输入名称'
          className={`${styles.search}`}
          value={keywords}
          onChange={e => this.setState({ keywords: e.target.value })}
          onSearch={e => this.searchDetails(e)}
        />
      </div>
      <div className={cssStyles.tableWrap1}>
        <CTable
          // dataSource={this.handleTableData()}
          dataSource={dataSource}
          pagination={{
            total: total,
            pageSize,
            current: page,
            onChange: (page, pageSize) => this.changePageSize(page, pageSize),
            onShowSizeChange: (current, size) => this.changePageSize(current, size),
          }}
          loading={loading}
          columns={columns}
          rowKey={(record) => record.id}
        >
        </CTable>
      </div>
    </div>;
  }
}

export default GlobalQuery;
