import CButton from '@/components/common/BasicWidgets/Widgets/CButton/CButton';
import CMessage from '@/components/common/BasicWidgets/Widgets/CMessage/CMessage';
import CTable from '@/components/common/BasicWidgets/Widgets/CTable/CTable';
import Cmodal from '@/components/ImportTemplate/component/modalDetial';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import secret from '@/constants/secret';
import { doCheckExce, doExcelToDB, getDoProcess } from '@/services/importTemplate';
import { getBlob, getFileAcceptType, saveAs } from '@/utils/common';
import { Col, Form, Popover, Progress, Row, Tooltip, Upload } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Styles from '../ImportTemplateFiles.less';

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
  userInfo: state.user.userInfo,
}))
class ImportDetial extends Component {
  static contextType = BaseContext;

  constructor() {
    super();
    this.state = {
      excleName: '', // 文件名称
      formdata: [], // 文件流
      isDisabled: true, // 是否允许点击
      isShowError: true, // 是否可以点击错误信息导出
      total: 0, // excel总条数
      successCount: 0, // 成功条数
      errorCount: 0, // 错误条数
      dataSoucre: [], // 错误数据
      loading: false,
      visible: false,
      importName: '', // 是否是导入
      type: 'preview', // 是否是检测或者是导入
      importStart: false, // 开始导入
      title: '', // 弹框名称
      uploadData: {}, // 上传的数据
      errMsg: '', // 后台返回的报错信息
      endRow: '', // 终止行值
    };
  }

  // 下载excel
  downLoadExcel = () => {
    const { activeDetail, userInfo } = this.props;
    const token = userInfo.token;
    if (JSON.stringify(activeDetail) !== '{}') {
      let url = query.DOWNLOAD_EXCEL + '?importmodelId=' + activeDetail.id + '&token=' + token;
      const aElement = document.createElement('a');
      document.body.appendChild(aElement);
      aElement.style.display = 'none';
      aElement.href = url;
      aElement.click();
      document.body.removeChild(aElement);
    }
  };
  beforeUploadFile = file => {
    const { size, type, name } = file;
    const { langLib } = this.context;
    const isLtMax = true;
    const accept = getFileAcceptType('image');

    const fileNameArr = name.split('.');
    const fileNameType = fileNameArr[fileNameArr.length - 1];
    // 文件过大
    if (!(fileNameType && fileNameType.toLowerCase() === 'xls')) {
      // 上传文件类型不支持（图片）
      CMessage(langLib['file.unAcceptType'], 'error');
      return false;
    }
    return new Promise((resolve, reject) => {
      if (!isLtMax) {
        reject(file);
      } else {
        resolve(file);
      }
    });
  };
  upload = ({ file, fileList }) => {
    const { status } = file;
    const { langLib } = this.context;
    if (status === 'done' && file.response) {
      if (!file.response.success) {
        CMessage(file.response.msg, 'error');
        return;
      }
      const { id } = this.props.activeDetail;
      let res = file.response.data[0];
      var arg1 = /\.xls{1}$/;
      if (file.name.match(arg1) === null) {
        CMessage(langLib['message.error.excle'], 'error');
        this.setState({
          isDisabled: true,
          excleName: '',
        });
      } else {
        this.setState({
          excleName: file.name,
          errMsg: '',
          isDisabled: false,
          uploadData: res,
          importName: '',
          importStart: false,
          dataSoucre: [],
          total: 0, // excel总条数
          successCount: 0, // 成功条数
          errorCount: 0, // 错误条数
        });
        this.props.changeNumber(0);
      }
    } else {
      this.setState({
        isDisabled: false,
      });
    }
  };
  getProcess = (params, data) => {
    getDoProcess(params).then(
      res => {
        if (JSON.stringify(res) !== '{}') {
          let list = [];
          const { msg, errorMsg } = res;
          if (!msg) {
            clearInterval(this.interval);
            this.setState({
              loading: false,
            });
            return;
          }
          let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
          Object.keys(msg).forEach((item, index) => {
            list.push({
              name: msg[item],
              planDate: time,
              stutas: 1,
              message: '',
              id: index,
            });
          });
          this.setState({
            errorCount: res.errorCount,
            successCount: res.successCount,
            total: res.total,
            dataSoucre: list,
          });
          let errorCount = Number(res.errorCount);
          let successCount = Number(res.successCount);
          let total = Number(res.total);
          this.props.changeNumber(errorCount);
          if (errorMsg) {
            this.setState({
              errMsg: errorMsg,
              loading: false,
              endRow: '',
            });
            clearInterval(this.interval);
          }
          if (errorCount + successCount >= total) {
            const { type } = this.state;
            if (type === 'preview') {
              if (successCount === total) {
                this.setState({
                  importName: 'import',
                  loading: false,
                  endRow: data.endLen,
                });
              } else {
                this.setState({
                  importName: '',
                  loading: false,
                  endRow: '',
                });
              }
            } else {
              this.setState({
                importName: 'import',
                loading: false,
              });
            }
            clearInterval(this.interval);
          }
          if (errorCount > 0) {
            this.setState({
              isShowError: false,
            });
          } else {
            this.setState({
              isShowError: true,
            });
          }
        } else {
          // this.setState({
          //   loading: false,
          // });
          // clearInterval(this.interval);
        }
      },
      err => {
        this.setState({
          loading: false,
          endRow: '',
        });
        clearInterval(this.interval);
      },
    );
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleExporting = () => {
    const { id } = this.props.activeDetail;
    const { excleName } = this.state;
    const url = `${query.EXPORT_FUN}?importmodelId=${id}`;
    console.log(excleName);
    getBlob(
      {
        url,
        token: localStorage.getItem('token') || '',
        method: 'GET',
        contentType: 'application/vnd.ms-excel; charset=UTF-8',
      },
      blob => {
        console.log(blob);
        saveAs(blob, `${excleName && excleName.split('.')[0]}错误信息.xls`);
        this.loading = false;
      },
    );
  };

  toggle = type => {
    let title;
    if (type === 'preview') {
      title = <FormattedMessage id="import.down.preview" />;
    } else {
      title = <FormattedMessage id="import.down.import" />;
    }
    this.setState({
      visible: !this.state.visible,
      type,
      title,
    });
  };
  // 校验或者导入
  handleOk = () => {
    const { type } = this.state;
    let data = this.props.form.getFieldsValue();
    const { id } = this.props.activeDetail;
    const { uploadData } = this.state;
    let realFilePath = uploadData.realFilePath;
    if (type === 'preview') {
      this.setState({
        total: 0, // excel总条数
        successCount: 0, // 成功条数
        errorCount: 0, // 错误条数
        dataSoucre: [], // 错误数据
        importStart: false, // 开始导入
      });
      let isFlag;
      if (data.code && data.code1) {
        isFlag = 3;
      } else if (data.code && !data.code1) {
        isFlag = 1;
      } else if (!data.code && data.code1) {
        isFlag = 2;
      } else {
        isFlag = 3;
      }
      let params = {
        importmodelId: id,
        filePath: realFilePath,
        fileId: uploadData.id,
        startLen: data.startLen,
        endLen: data.endLen,
        checked: isFlag,
      };
      doCheckExce(params);
      let param = '?importmodelval=check' + id;
      this.interval = setInterval(() => this.getProcess(param, params), 5000);
      this.setState({
        visible: !this.state.visible,
        errMsg: '',
        loading: true,
      });
    } else {
      this.setState({
        total: 0, // excel总条数
        successCount: 0, // 成功条数
        errorCount: 0, // 错误条数
        dataSoucre: [], // 错误数据
        importStart: true, // 开始导入
      });
      this.props.changeNumber(0);
      let params = {
        importmodelId: id,
        filePath: realFilePath,
        fileId: uploadData.id,
        startLen: data.startLen,
        endLen: data.endLen,
        updateOrSkip: data.updateOrSkip,
      };
      doExcelToDB(params);
      let param = '?importmodelval=import' + id;
      this.interval = setInterval(() => this.getProcess(param), 5000);
      this.setState({
        visible: !this.state.visible,
        errMsg: '',
        loading: true,
      });
    }
  };

  render() {
    const {
      excleName,
      isDisabled,
      isShowError,
      successCount,
      errorCount,
      total,
      dataSoucre,
      loading,
      visible,
      type,
      title,
      importName,
      importStart,
      errMsg,
      endRow,
    } = this.state;
    let arr = JSON.parse(JSON.stringify(dataSoucre));
    const { langLib } = this.context;
    const { form, pageNum, pageSize, userInfo, functionData } = this.props;
    const { canmodify } = functionData.attributes;
    let dataList = arr.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    let process = total
      ? (
          (Number(successCount) * 100000 + Number(errorCount) * 100000) /
          Number(total) /
          100000
        ).toFixed(2)
      : 0;
    const token = userInfo.token;
    const columns = [
      {
        title: <FormattedMessage id="import.down.name" />,
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: <FormattedMessage id="import.down.date" />,
        dataIndex: 'planDate',
        key: 'planDate',
        width: 180,
      },
      {
        title: <FormattedMessage id="import.down.stutas" />,
        dataIndex: 'stutas',
        key: 'stutas',
        width: 100,
        render: (text, record, index) => {
          return (
            <span>
              {record.stutas === 1 ? (
                <span>
                  <span className={Styles.errSty} />
                  <FormattedMessage id="global.unnormal" />
                </span>
              ) : (
                <FormattedMessage id="global.normal" />
              )}
            </span>
          );
        },
      },
      {
        title: <FormattedMessage id="import.down.news" />,
        dataIndex: 'message',
        key: 'message',
        width: 100,
      },
    ];
    const modalConfig = {
      visible: visible,
      size: 'default',
      onCancel: this.toggle,
      type: type,
      title,
      form,
      endRow,
      className: Styles.modalSty,
      onOk: this.handleOk,
    };

    let heloDom = (
      <div>
        <p>1.红色为必填信息</p>
        <p>2.各行列顺序不可调整,请严格按照模板信息填写</p>
        <p> 3.如果需导入信息超出模板范围,请联系公司工作人员</p>
      </div>
    );
    return (
      <div className={Styles.boxConten}>
        <Row style={{ height: '32px', margin: '8px 0' }}>
          <CButton
            className={Styles.download}
            onClick={() => {
              this.downLoadExcel();
            }}
            isDefault={true}
          >
            <span
              className="iconDown iconfont custom-color"
              style={{
                verticalAlign: 'text-bottom',
              }}
            />
            <span style={{ verticalAlign: 'super' }}>
              <FormattedMessage id="import.down.mobox" />
            </span>
          </CButton>
          <Tooltip placement="topRight" title={heloDom}>
            <span
              className="iconfont icon-help-bold custom-color"
              style={{
                fontSize: '22px',
                marginLeft: '5px',
                verticalAlign: 'text-bottom',
                cursor: 'pointer',
                position: 'absolute',
                left: '119px',
              }}
            />
          </Tooltip>
          <Upload
            disabled={!!!canmodify}
            showUploadList={false}
            className={Styles.import}
            accept=".xls"
            onChange={this.upload}
            beforeUpload={this.beforeUploadFile}
            action={query.UPLOAD}
            data={{ tableName: secret.encrypt('importmodel'), token: token }}
          >
            <CButton className={Styles.import}>
              <span className="iconUpload iconfont custom-color system__lineBorder--left" />
              {excleName}
            </CButton>
          </Upload>

          <CButton
            className={`${Styles.importDate} importTemplate_import`}
            disabled={importName ? false : true}
            onClick={() => this.toggle('import')}
          >
            <span className={`iconfont iconImport ${importName ? 'importActive' : ''}`} />
            <FormattedMessage id="import.down.import" />
          </CButton>
          <CButton
            className={Styles.preview}
            disabled={isDisabled}
            onClick={() => this.toggle('preview')}
          >
            <span className={`iconfont iconPreview ${excleName ? 'importActive' : ''}`} />
            <FormattedMessage id="import.down.preview" />
          </CButton>
          {/* 错误信息导出 */}
          <CButton
            className={Styles.errorExporting}
            disabled={isShowError}
            onClick={() => this.handleExporting()}
          >
            <span className="iconfont iconExport" />
            错误信息导出
          </CButton>
          <Popover
            overlayStyle={{ width: '50%', minHeight: '300px', padding: '5px' }}
            content={errMsg}
            title={langLib['error.msg']}
            trigger="hover"
          >
            {errMsg ? (
              <span className={`iconfont icon-import-warning ${Styles.warnningLight}`} />
            ) : null}
          </Popover>
        </Row>
        <div className={`${Styles.line} system__lineBorder--top`} />
        <Row className={`${Styles.boxLine} system__lineBorder`}>
          <Col span={6} className={`${Styles.process} system__lineBorder--right`}>
            <p>
              {importStart ? (
                <FormattedMessage id="import.content.importproces" />
              ) : (
                <FormattedMessage id="import.content.process" />
              )}
              <span className={`${Styles.speNumber} system__fontColor`}>
                {' '}
                {(process * 100).toFixed(0)}%
              </span>
            </p>
            <Progress strokeColor="#FAB71C" percent={process * 100} showInfo={false} />
          </Col>
          <Col span={6} className="system__lineBorder--right">
            <p>
              <span className={`${Styles.speNumber} system__fontColor`}>{total} </span>
              <FormattedMessage id="import.down.col" />
            </p>
            <p className={Styles.commonSpe}>
              <FormattedMessage id="import.down.total" />
            </p>
          </Col>
          <Col span={6} className="system__lineBorder--right">
            <p>
              <span className={`${Styles.speNumber} system__fontColor`}>{successCount} </span>
              <FormattedMessage id="import.down.col" />
            </p>
            <p className={Styles.commonSpe}>
              {importStart ? (
                <FormattedMessage id="import.done.import" />
              ) : (
                <FormattedMessage id="import.down.check" />
              )}
            </p>
          </Col>
          <Col span={6} className="system__lineBorder--right">
            <p>
              <span className={Styles.errNumber}>{errorCount} </span>
              <FormattedMessage id="import.down.col" />
            </p>
            <p className={Styles.commonSpe}>
              {importStart ? (
                <FormattedMessage id="import.done.err" />
              ) : (
                <FormattedMessage id="import.down.err" />
              )}
            </p>
          </Col>
        </Row>
        <div className={Styles.ctableClass}>
          <CTable
            columns={columns}
            dataSource={dataList}
            loading={loading}
            pagination={false}
            rowKey={record => record.id}
          />
        </div>
        <Cmodal {...modalConfig} />
      </div>
    );
  }
}

export default Form.create()(ImportDetial);
