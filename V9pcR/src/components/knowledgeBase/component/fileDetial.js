/*
 * @Author: tjf
 * @Date:   2019-06-19 08:46:41
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-18 16:26:01
 * @Desc: 知识库
 */
import { CInput, CMessage, CSearch, CTextArea, CTable, CButton } from '@/components/common/BasicWidgets';
import FormItems from '@/components/common/FormItems/FormItems';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import styles from '@/components/knowledgeBase/component/fileDetial.less';
import Crumb from '@/components/knowledgeBase/Crumb/Crumb';
import NormalSearchSelect from '@/components/userManager/component/NormalSearchSelect/NormalSearchSelect';
import { BaseContext, VALID_REQUIRED_MESSAGE } from '@/constants/global';
import query from '@/constants/query';
import secret from '@/constants/secret';
import { deleteFile, deleteFileGroup, getFilesDetails } from '@/services/knowledgeBase';
import { formatTime, getFileAcceptType, ImageCompression } from '@/utils/common';
import { Button, Icon, Modal, Select, Table, Upload, DatePicker } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import CModal from '../../common/CreateModal/CreateModal';
import GlobalQuery from './globalQuery';
import cssStyles from './index.less';


// const { RangePicker } = DatePicker;
// const { Option } = Select;
// const { confirm } = Modal;
// const selectArr = [
//   {
//     name: <FormattedMessage id='role.tab.function' />,
//     value: 1,
//   },
//   {
//     name: <FormattedMessage id='role.tab.data' />,
//     value: 2,
//   },
// ];

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
  userInfo: state.user.userInfo,
}))
class formConfig extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {
      visible1: false,
      tabActive: 'base', // 激活的面板
      treeData: [], // 树数据
      activeTreeNodeDetail: {}, // 当前选中的树节点信息
      activeDetail: {}, // 根据树节点信息获取的该节点具体详情
      actionType: '', // 操作类型
      loadingStatus: {
        // loading状态
        saveBtn: false, // 保存按钮
        getDetail: false, // 点击树节点获取详情
        getTree: false, // 获取树数据
      },
      isEdit: false,
      title: '', // 头部
      page: 1,
      pageSize: 10,
    };
  }

  toggle = (title, type, isFlag) => {
    if (type === 'upload') {
      // this.changeIsNull(title, type, isFlag);
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
  formatSize = length => {
    let size = length + 'K';
    if (length >= 1024) {
      size = parseInt(length / 10.24) / 100 + 'M';
    }
    return size;
  };
  // 新建文件夹
  confirmFunction = e => {
    const {
      addFileGroupFunction,
      form,
      rootId,
      editFileGroupFunction,
      editActiveDetail,
      activeDetail = {},
    } = this.props.tabDefaultConfig;
    // let param = form.getFieldsValue();
    form.validateFields((errs, values) => {
      if (errs) return;
      const { filegroupList = [] } = activeDetail;
      let existList = filegroupList.filter(item => {
        if (!this.state.isEdit) return item.name === values.name && item.orgId === values.orgId;
        return (
          item.id !== editActiveDetail.id &&
          item.name === values.name &&
          item.orgId === values.orgId
        );
      });
      if (existList.length) {
        const { langLib } = this.context;
        CMessage(langLib['file.is.exist'], 'error');
        return;
      }
      if (!this.state.isEdit) {
        values.rootId = rootId;
        addFileGroupFunction(e, values);
      } else {
        values.id = editActiveDetail.id;
        values.rootId = editActiveDetail.rootId;
        editFileGroupFunction(e, values);
      }
      this.setState({
        isEdit: false,
        title: '',
      });
    });
  };
  // 取消新建文件夹
  cancelFunction = e => {
    const { hideModal } = this.props.tabDefaultConfig;
    hideModal();
    this.setState({
      isEdit: false,
      title: '',
    });
  };
  // 删除文件
  deleteFiles = (e, type, d) => {
    const { langLib } = this.context;
    const { undateFileDetails } = this.props.tabDefaultConfig;
    const { groupId, defaultValue } = this.props.tabDefaultConfig;
    let id = e.id;
    let { close } = ModalBox.confirm({
      title: langLib['confirm.del.default'],
      onOk() {
        let param = { filesJson: '[{id:' + id + '}]' };
        // let param = {
        //   'filesJson': [{ id }]
        // };
        deleteFile(param).then(result => {
          let param = {
            groupId: groupId,
            // startDate: moment(defaultValue[0]).format('YYYY-MM-DD'),
            // endDate: moment(defaultValue[1]).format('YYYY-MM-DD'),
          };
          getFilesDetails(param).then(res => {
            CMessage(langLib['message.del.success'], 'success');
            undateFileDetails(res);
            closeModal();
          });
        });
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
  };
  // 删除文件夹
  deleteFileGroup = (e, type, d) => {
    const { langLib } = this.context;
    const { undateFileDetails, groupId, defaultValue, activeTreeNodeDetail, fetchTree } = this.props.tabDefaultConfig;
    let id = e.id;
    let { close } = ModalBox.confirm({
      title: langLib['confirm.del.default'],
      onOk() {
        let param = { id: id };
        deleteFileGroup(param).then(result => {
          let param = {
            groupId: groupId,
            // startDate: moment(defaultValue[0]).format('YYYY-MM-DD'),
            // endDate: moment(defaultValue[1]).format('YYYY-MM-DD'),
          };
          fetchTree('', activeTreeNodeDetail.nodeKey, { rootId: param.groupId });
          getFilesDetails(param).then(res => {
            CMessage(langLib['message.del.success'], 'success');
            undateFileDetails(res);
            closeModal();
          });
        });
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
  };
  // 编辑文件夹
  editFiles = (id, record) => {
    const { showModalEdit } = this.props.tabDefaultConfig;
    showModalEdit(id);
    this.setState({
      isEdit: true,
      title: <FormattedMessage id='global.editFile' />,
    });
  };
  // 选择字段
  handleSetSelectSearchValue = (selected, name, id) => {
    let { activeTreeNodeDetail } = this.props.tabDefaultConfig;
    this.props.tabDefaultConfig.form.setFieldsValue({
      [id]: selected[0].id,
      [name]: selected[0].name,
    });
    this.props.tabDefaultConfig.updateFrameState({
      activeTreeNodeDetail: {
        ...activeTreeNodeDetail,
        [id]: selected[0].id,
        [name]: selected[0].name,
      },
    });
  };

  // 新建文件夹表单选项
  getFormConfigs() {
    const { langLib } = this.context;
    const { editActiveDetail, form } = this.props.tabDefaultConfig;
    const publicProps = { disabled: false };
    // 描述
    const publicBasicConfig = [
      {
        key: 'name',
        colSpan: 12,
        label: <FormattedMessage id='element.name' />,
        config: {
          rules: [
            {
              required: true,
              message: VALID_REQUIRED_MESSAGE,
            },
            {
              pattern: /^[^\s]*$/,
              message: langLib['No.spaces'],
            },
          ],
          initialValue: editActiveDetail.name || '',
        },
        component: <CInput {...publicProps} />,
      },
      {
        key: 'orgName',
        label: <FormattedMessage id='global.org' />,
        config: {
          initialValue: editActiveDetail.orgName || '',
          rules: [
            {
              required: true,
              message: VALID_REQUIRED_MESSAGE,
            },
          ],
        },
        component: (
          <NormalSearchSelect
            form={form}
            type='org'
            treeNodeType={2}
            currentKey={editActiveDetail.orgId + '-ORGANIZATION'}
            currentId={editActiveDetail.orgId}
            setSelected={selecteds =>
              this.handleSetSelectSearchValue(selecteds, 'orgName', 'orgId')
            }
          />
        ),
      },
      {
        // 组织机构
        key: 'orgId',
        colSpan: 12,
        config: {
          initialValue: editActiveDetail.orgId,
        },
        component: <CInput style={{ display: 'none' }} />,
      },
      {
        key: 'memo',
        label: <FormattedMessage id='global.memo' />,
        config: {
          initialValue: editActiveDetail.memo || '',
        },
        colSpan: 24,
        component: <CTextArea />,
      },
    ];

    let dataConfig = [];
    return [...publicBasicConfig, ...dataConfig];
  }

  // 上传前校验
  beforeUpload = file => {
    console.log('=============================================2');
    const { size, type, name, uid } = file;
    const {
      fileType = 'image',
      tabDefaultConfig: { activeDetail = {} },
    } = this.props;
    const { max } = this.state;
    const { langLib } = this.context;
    const isLtMax = size / 1024 / 1024 < 2;
    const { fileList = [] } = activeDetail;
    const accept = getFileAcceptType('file');
    // 文件过大
    // if (!isLtMax) {
    //   CMessage(langLib['file.overSize'](max), 'error');
    //   return false;
    // }
    const fileNameArr = name.split('.');
    const fileNameType = fileNameArr[fileNameArr.length - 1];
    if (this.checkFileType(name) == 'forbid') {
      CMessage(langLib['file.unAcceptType'], 'error');
      return false;
    } else if (!(fileNameType && accept.includes(fileNameType))) {
      // 上传文件类型不支持
      CMessage(langLib['file.unAcceptType'], 'error');
      return false;
    }
    return new Promise((resolve, reject) => {
      if (fileList.find(item => item.name === name)) {
        CMessage(langLib['messge.error.keycode'](name), 'error');
        reject(file);
      } else if (this.checkFileType(name) == 'forbid') {
        reject(file);
      } else {
        // 图片压缩
        // resolve(file);
        if (this.checkFileType(name) == 'img') {
          if (navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1) {
            resolve(file);
          } else {
            ImageCompression({ file, quality: 0.6 }, (imgFile) => {
              imgFile.uid = uid;
              resolve(imgFile);
            });
          }
        } else {
          resolve(file);
        }
      }
    });
  };
  checkFileType = name => {
    let result;
    if (
      name.indexOf('.jsp') !== -1 ||
      name.indexOf('.jspx') !== -1 ||
      name.indexOf('.jspf') !== -1 ||
      name.indexOf('.asp') !== -1 ||
      name.indexOf('.asa') !== -1 ||
      name.indexOf('.cer') !== -1 ||
      name.indexOf('.aspx') !== -1
    ) {
      result = 'forbid';
    } else if (
      name.toLowerCase().indexOf('.jpg') !== -1 ||
      name.toLowerCase().indexOf('.jpeg') !== -1 ||
      name.toLowerCase().indexOf('.png') !== -1 ||
      name.toLowerCase().indexOf('.gif') !== -1 ||
      name.toLowerCase().indexOf('.bmp') !== -1
    ) {
      result = 'img';
    } else {
      result = 'file';
    }
    return result;
  };
  onChange = ({ file, fileList }) => {
    const { status } = file;
    const { langLib } = this.context;
    const { setLoadingStatus } = this.props.tabDefaultConfig;
    // 上传中
    if (status === 'uploading') {
      setLoadingStatus('getDetail', true);
    } else if (status === 'error') {
      // 上传异常
      CMessage(langLib['file.error'], 'error');
      setLoadingStatus('getDetail', false);
    } else if (status === 'done' && file.response) {
      setLoadingStatus('getDetail', false);
      if (!file.response.success) {
        CMessage(file.response.msg, 'error');
        return;
      }
      CMessage(langLib['file.success'], 'success');
      // 文件上传完成
      const { undateFileDetails } = this.props.tabDefaultConfig;
      // fetchTree(activeTreeNodeDetail.nodeKey);
      const { groupId, defaultValue } = this.props.tabDefaultConfig;
      let param = {
        groupId: groupId,
        // startDate: moment(defaultValue[0]).format('YYYY-MM-DD'),
        // endDate: moment(defaultValue[1]).format('YYYY-MM-DD'),
      };
      getFilesDetails(param).then(res => {
        undateFileDetails(res);
      });
      return;
    }
    // this.setState({ fileList: [...fileList] });
  };
  // 文件图标
  showNameHtml = (name, id) => {
    const fontSize1 = {
      fontSize: '24px',
      cursor: 'default',
      marginRight: '5px',
      color: this.formatIcon(name).color,
    };
    const fontSize2 = {
      fontSize: '18px',
      cursor: 'default',
      marginRight: '5px',
      color: this.formatIcon(name).color,
    };
    const flex = { display: 'flex', alignItems: 'center' };

    if (!id.isGroupFile) {
      const iconCls = classNames({
        'iconfont-app': true,
        // 'custom-color': true,
        [this.formatIcon(name).iconname]: true,
      });
      return (
        <div style={{ width: '184px', ...flex }}>
          <span className={iconCls} style={fontSize1} />
          <span title={name} style={{ display: 'inline-block', width: 'calc(184px - 27px)', overflow: 'hidden', 'whiteSpace': 'nowrap', 'text-overflow': 'ellipsis' }}>{name}</span>
        </div>
      );
    } else {
      return (
        <div style={{ width: '184px', ...flex }}>
          <span style={fontSize2} className='iconfont icon-file-yellow' />
          <span title={name} style={{ display: 'inline-block', width: 'calc(184px - 27px)', overflow: 'hidden', 'whiteSpace': 'nowrap', 'text-overflow': 'ellipsis' }}>{name}</span>
        </div>
      );
    }
  };

  formatIcon = (name = '') => {
    if (!name) return {};
    let names = name.split('.');
    let iconname = 'icon-file-zip';
    let color = '#FFAC02';
    name = names[names.length - 1];
    if (name == 'jpg' || name == 'jpeg') {
      iconname = 'icon-file-jpg';
      color = '#FFAC02';
    } else if (name == 'png') {
      iconname = 'icon-file-png';
      color = '#FF933D';
    } else if (name == 'doc' || name == 'docx') {
      iconname = 'icon-file-doc';
      color = '#47C69A';
    } else if (name == 'pptx' || name == 'ppt') {
      iconname = 'icon-file-ppt';
      color = '#F15643';
    } else if (name == 'zip' || name == 'rar') {
      iconname = 'icon-file-zip';
      color = '#4E7DD9';
    } else if (name == 'pdf') {
      iconname = 'icon-file-pdf';
      color = '#FFAC02';
    } else if (name == 'xls' || name == 'xlsx') {
      iconname = 'icon-file-xls';
      color = '#FF933D';
    } else if (name == 'txt') {
      iconname = 'icon-file-txt';
      color = '#47C69A';
    } else if (name == 'zip' || name == 'rar') {
      iconname = 'icon-file-zip';
      color = '#F15643';
    }
    return {
      iconname,
      color,
    };
  };
  // 操作图标
  showIconHtml = (name, record) => {
    let item = record;
    const { functionData } = this.props;
    let icon1 = '',
      icon2 = '';
    if (!record.isGroupFile) {
      if (functionData.attributes.candelete === 1) {
        icon1 = (
          <span
            onClick={this.deleteFiles.bind(this, record, 1)}
            className='iconfont icondelete custom-color'
          />
        );
      }
      if (functionData.attributes.canview === 1) {
        icon2 = (
          <span
            onClick={this.downloadFile.bind(this, record)}
            className='iconfont iconDown custom-color'
          />
        );
      }
      return (
        <div>
          {icon2}
          {icon1}
        </div>
      );
    }
    {
      if (functionData.attributes.candelete === 1) {
        icon1 = (
          <span
            onClick={this.deleteFileGroup.bind(this, record, 2)}
            className='iconfont icondelete custom-color'
          />
        );
      }
      if (functionData.attributes.canmodify === 1) {
        icon2 = (
          <span
            onClick={this.editFiles.bind(this, record, item)}
            className='iconfont iconEdit custom-color'
          />
        );
      }
      return (
        <div>
          {icon2}
          {icon1}
        </div>
      );
    }
  };

  setContent = () => {
    const content = (
      <div className={styles.uploadBtn} onClick={() => this.toggle('上传文件', 'upload', true)}>
        <Icon className={styles.addnewBtnIco} type='plus-square' />
        <FormattedMessage id='global.uploadFile' />
      </div>
    );
    return content;
  };
  // 搜索
  searchDetails = name => {
    const { searchFiles, defaultValue } = this.props.tabDefaultConfig;
    searchFiles({
      name,
      // startDate: moment(defaultValue[0]).format('YYYY-MM-DD'),
      // endDate: moment(defaultValue[1]).format('YYYY-MM-DD'),
    });
  };
  handleTableData = () => {
    const { activeDetail } = this.props.tabDefaultConfig;
    let arr = [];
    let arr1 = activeDetail.filegroupList;
    let arr2 = activeDetail.fileList;
    for (let p in arr1) {
      arr1[p].createDate = arr1[p].createDate ? formatTime(arr1[p].createDate) : '';
      arr1[p].updateDate = arr1[p].updateDate ? formatTime(arr1[p].updateDate) : '';
      arr1[p].isGroupFile = true;
      // arr1[p].formatFileLength = arr1[p].counts ? arr1[p].counts + '项' : '0项';
      arr1[p].formatFileLength = '';
      arr1[p].details = arr1[p];
      arr.push(arr1[p]);
    }
    for (let p in arr2) {
      arr2[p].name = arr2[p].displayFileName;
      arr2[p].formatFileLength = this.formatSize(arr2[p].fileLength);
      arr2[p].createDate = arr2[p].createDate ? formatTime(arr2[p].createDate) : '';
      arr2[p].updateDate = '';
      arr2[p].isGroupFile = false;
      arr2[p].details = arr2[p];
      arr.push(arr2[p]);
    }
    return arr;
  };
  changeDateRange = (date) => {
    this.props.tabDefaultConfig.updateState({ defaultValue: date });
  };
  changePageSize = (page, pageSize) => {
    this.setState({
      page, pageSize,
    });
  };

  render() {
    const {
      loading,
      form,
      groupId,
      activeDetail,
      treeData,
      activeTreeNodeDetail,
    } = this.props.tabDefaultConfig;
    const { userInfo, functionData } = this.props;
    const { title, page, pageSize, visible1 } = this.state;
    const { langLib } = this.context;
    const { Column, ColumnGroup } = Table;
    let visible = this.props.tabDefaultConfig.visible;
    const accept = getFileAcceptType('file');
    const uploadProps = {
      action: query.FILE_UPLOAD,
      listType: 'file-card',
      accept,
      headers: {
        token: userInfo.token,
      },
      data: {
        tableName: secret.encrypt('files'),
        token: userInfo.token,
        groupId: groupId || 1,
        orgId: userInfo.orgId || -1,
      },
      onChange: this.onChange,
      beforeUpload: this.beforeUpload,
    };
    const crumbProps = {
      activeDetail,
      treeData,
      activeTreeNodeDetail,
    };
    let upload = '';
    if (functionData.attributes.canadd === 1) {
      upload = (
        <Upload {...uploadProps} className='upload ant-btn-primary ant-btn'>
          {this.setContent()}
        </Upload>
      );
    }
    const columns = [
      {
        title: <FormattedMessage id='knowledge.name' />,
        dataIndex: 'name',
        key: 'name',
        width: '200px',
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
        width: '100px',
        render: (text) => <div title={text} style={{ display: 'inline-block', width: 'calc(84px)', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }}>{text}</div>,
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
        width: '100px',
        render: (text) => <div title={text} style={{ display: 'inline-block', width: 'calc(84px)', overflow: 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis' }}>{text}</div>,
      },
      {
        title: <FormattedMessage id='knowledge.orgName' />,
        dataIndex: 'orgName',
        key: 'orgName',
        width: '100px',
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
          return <span>{this.showIconHtml(text, record)}</span>;
        },
      },
    ];
    const dataSource = this.handleTableData();
    return (
      <div className={styles.containerWrap}>
        <div className={styles.headerTitleWrap}>
          <Crumb crumbProps={crumbProps} />
          {upload}

          <CSearch
            style={{ border: 0 }}
            placeholder='请输入名称'
            className={`${styles.search}`}
            onSearch={e => this.searchDetails(e)}
          />
          <CButton style={{ float: 'right' }} onClick={() => this.setState({ visible1: true })}>全局查询</CButton>
          {/*<div style={{ float: 'right' }}>*/}
          {/*  <span style={{ marginRight: '5px' }}>文件创建时间：</span>*/}
          {/*  <RangePicker*/}
          {/*    onChange={this.changeDateRange}*/}
          {/*    allowClear={false}*/}
          {/*    defaultValue={this.props.tabDefaultConfig.defaultValue}*/}
          {/*    value={this.props.tabDefaultConfig.defaultValue}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
        <div className={cssStyles.tableWrap}>
          <CTable
            // dataSource={this.handleTableData()}
            dataSource={dataSource}
            pagination={{
              total: dataSource.length,
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
        <CModal
          title="全局查询"
          visible={visible1}
          size="large"
          onCancel={() => this.setState({ visible1: false})}
          footer={null}
        >
          <GlobalQuery userInfo={userInfo}/>
        </CModal>
        <CModal
          title={title || <FormattedMessage id='global.createFile' />}
          visible={visible}
          size='default'
          // onOk={this.confirmFunction.bind(this)}
          onCancel={this.cancelFunction.bind(this)}
          // okText="保存"
          // cancelText="取消"
          centered='true'
          destroyOnClose='true'
          bodyStyle={{ padding: '20px 0' }}
          footer={[
            <Button
              key='cancel'
              loading={loading}
              type='default'
              onClick={() => this.cancelFunction()}
            >
              {langLib['confirm.cancel']}
            </Button>,
            <Button
              key='submit'
              loading={loading}
              type='primary'
              onClick={() => this.confirmFunction()}
            >
              {langLib['confirm.ok']}
            </Button>,
          ]}
        >
          <FormItems formConfigs={this.getFormConfigs()} form={form} loading={loading} />
        </CModal>
      </div>
    );
  }
}

export default formConfig;
