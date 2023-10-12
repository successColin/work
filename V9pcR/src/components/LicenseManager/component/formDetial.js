/*
 * @Author: Fus
 * @Date:   2019-11-09 08:46:41
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-19 17:13:27
 * @Desc: 元素配置
 */
import { CInput, CMessage, SplitLine } from '@/components/common/BasicWidgets';
import CButton from '@/components/common/BasicWidgets/Widgets/CButton/CButton';
import FormItems from '@/components/common/FormItems/FormItems';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import { formatTime } from '@/utils/common';
import { Select, Table, Upload } from 'antd';
import { connect } from 'dva';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Styles from '../LicenseManager.less';

const { Option } = Select;
const selectArr = [
  {
    name: <FormattedMessage id="role.tab.function" />,
    value: 1,
  },
  {
    name: <FormattedMessage id="role.tab.data" />,
    value: 2,
  },
];
const baseTypeOption = selectArr.map(item => (
  <Option value={item.value} key={item.value}>
    {item.name}
  </Option>
));

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
}))
class formConfig extends Component {
  static contextType = BaseContext;
  state = {
    licenserFrameApp: [],
    licenserFramePc: [],
    licName: '',
  };
  // 获取表单项配置
  getFormConfigs = () => {
    const { data } = this.props.tabDefaultConfig;
    const publicProps = { disabled: false };
    let licPramDto = data;
    // 分割线 - 编码规则
    const ruleLine = {
      key: 'basicLine-base2',
      comType: 'statics',
      colSpan: 24,
      component: <SplitLine title={<FormattedMessage id="license.InfoTitle" />} />,
    };

    // 编码s

    let dataConfig = [
      ruleLine,
      {
        key: 'companyKey',
        colSpan: 12,
        label: <FormattedMessage id="license.compony.key" />,
        config: {
          initialValue: licPramDto ? licPramDto.companyKey : '',
        },
        component: <CInput disabled={true} />,
      },
      {
        key: 'companyName',
        colSpan: 12,
        label: <FormattedMessage id="license.compony.name" />,
        config: {
          initialValue: licPramDto ? licPramDto.companyName : '',
        },
        component: <CInput disabled={true} />,
      },
      {
        key: 'pcUserNumber',
        colSpan: 12,
        label: <FormattedMessage id="license.user.volume.pc" />,
        config: {
          initialValue: licPramDto ? licPramDto.pcUserNumber : '',
        },
        component: <CInput disabled={true} />,
      },
      {
        key: 'mobileUserNumber',
        colSpan: 12,
        label: <FormattedMessage id="license.user.volume.app" />,
        config: {
          initialValue: licPramDto ? licPramDto.mobileUserNumber : '',
        },
        component: <CInput disabled={true} />,
      },
      {
        key: 'startDate',
        colSpan: 12,
        label: <FormattedMessage id="license.registration.date" />,
        config: {
          initialValue: licPramDto ? formatTime(licPramDto.startDate) : '',
        },
        component: <CInput disabled={true} />,
      },
      {
        key: 'endDate',
        colSpan: 12,
        label: <FormattedMessage id="license.expire.date" />,
        config: {
          initialValue: licPramDto ? formatTime(licPramDto.endDate) : '',
        },
        component: <CInput disabled={true} />,
      },
    ];
    return [...dataConfig];
  };

  // 文件下载
  downloadLic = (id, e) => {
    const token = localStorage.getItem('token');
    let url = query.DOWNLOAD_LIC_FILE + '?companyId=' + id + '&token=' + token;
    const aElement = document.createElement('a');
    document.body.appendChild(aElement);
    aElement.style.display = 'none';
    // aElement.setAttribute('target','_blank')
    aElement.setAttribute('download', 'download');
    aElement.href = url;
    console.log(url);
    aElement.download = e.displayFileName;
    aElement.click();
    document.body.removeChild(aElement);
  };
  // 获取表单项配置
  getFormTitle = () => {
    // 分割线 - 编码规则
    const ruleLine = {
      key: 'basicLine-base2',
      comType: 'statics',
      colSpan: 24,
      component: <SplitLine title={<FormattedMessage id="license.uploadTitle" />} />,
    };

    // 编码s

    let dataConfig = [ruleLine];
    return [...dataConfig];
  };
  // 获取上传项配置
  getFormUpload = () => {
    const token = localStorage.getItem('token');
    const {
      loading,
      form,
      licName,
      data,
      record,
      flag,
      licLinePramDtos,
    } = this.props.tabDefaultConfig;
    const { langLib } = this.context;
    const { functionData } = this.props;
    const { canmodify } = functionData.attributes;
    const uploadProps = {
      action: query.DOWNLOAD_LIC_FILE,
      listType: 'file-card',
      data: { companyId: record.id || '' },
    };
    let licState = {
      key: 'state',
      colSpan: 8,
      component: <div />,
    };
    let downloadIcon = {
      key: 'download',
      colSpan: 4,
      component: <div />,
    };
    if (data && licLinePramDtos.length > 0) {
      if (flag) {
        licState = {
          key: 'state',
          colSpan: 8,
          component: (
            <div style={{ 'line-height': '30px' }} className="system__fontColor--must">
              <FormattedMessage id="license.flag.true" />
            </div>
          ),
        };
      } else {
        licState = {
          key: 'state',
          colSpan: 8,
          component: (
            <div className={Styles.licStateFalse} style={{ 'line-height': '30px' }}>
              <FormattedMessage id="license.flag.false" />
            </div>
          ),
        };
      }
      downloadIcon = {
        key: 'download',
        colSpan: 4,
        component: (
          <div
            className="downloadBtn ant-btn-primary ant-btn"
            style={{ float: 'right' }}
            onClick={this.downloadLic.bind(this, record.id)}
          >
            {langLib['license.download']}
          </div>
        ),
      };
    }
    let dataConfig = [
      {
        key: 'upload',
        colSpan: 12,
        label: <FormattedMessage id="license.upload" />,
        component: (
          <Upload
            showUploadList={false}
            className={Styles.import}
            accept=".lic"
            disabled={!!!canmodify}
            beforeUpload={this.beforeUploadLic}
            onChange={e => this.onChange(e)}
            action={query.UPLOAD_LIC_FILE}
            data={{ token: token, companyId: record.id }}
          >
            <CButton className={Styles.import}>
              {licName}
              <span className="custom-color iconUpload iconfont system__lineBorder--left" />
            </CButton>
          </Upload>
        ),
      },
      licState,
      downloadIcon,
    ];
    return [...dataConfig];
  };
  // 获取框架列表数据

  handleTableData = () => {
    const { licLinePramDtos } = this.props.tabDefaultConfig;
    let arr = [],
      arr1 = [],
      arr2 = [];
    licLinePramDtos.map((item, index) => {
      if (item.terminalType === 1) {
        arr1.push(item);
      } else if (item.terminalType === 2) {
        arr2.push(item);
      }
    });
    arr.push(arr1);
    arr.push(arr2);
    return arr;
  };

  beforeUploadLic = file => {
    const { size, type, name } = file;
    const { langLib } = this.context;
    const isLtMax = true;

    const fileNameArr = name.split('.');
    const fileNameType = fileNameArr[fileNameArr.length - 1];
    console.log(fileNameType.toLowerCase());
    // 文件过大
    if (!(fileNameType && fileNameType.toLowerCase() === 'lic')) {
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

  onChange = ({ file, fileList }) => {
    const { status, name } = file;
    const { langLib } = this.context;
    const { getListDetial, record, updateLicName } = this.props.tabDefaultConfig;
    // 上传中

    if (status === 'uploading') {
      this.setState({ loading: true });
    } else if (status === 'error') {
      // 上传异常
      CMessage(langLib['file.error'], 'error');
      this.setState({ loading: false });
    } else if (status === 'done' && file.response) {
      if (!file.response) {
        CMessage(langLib['file.error'], 'error');
        return;
      }
      if (file.response.success) {
        updateLicName(name);
        CMessage(langLib['file.success'], 'success');
        getListDetial(record, 1);
      } else {
        CMessage(file.response.msg, 'error');
      }
      return;
      // 文件上传完成
    }
    // this.setState({ fileList: [...fileList] });
  };

  render() {
    const { loading, form } = this.props.tabDefaultConfig;
    const { Column } = Table;

    const uploadProps = {
      action: query.UPLOAD_LIC_FILE,
      listType: 'file-card',
    };
    this.handleTableData();
    return (
      <div>
        <FormItems formConfigs={this.getFormTitle()} form={form} loading={loading} />
        <FormItems formConfigs={this.getFormUpload()} form={form} loading={loading} />
        <FormItems formConfigs={this.getFormConfigs()} form={form} loading={loading} />
        <div style={{ 'margin-top': '20px' }}>
          <div className={Styles.halfTable}>
            <div className={`${Styles.border} system__lineBorder`}>
              <h2 className="system__fontColor">
                <FormattedMessage id="license.pc" />
              </h2>
              <Table dataSource={this.handleTableData()[0]} pagination={false}>
                <Column
                  title={<FormattedMessage id="authorization.type" />}
                  dataIndex="frameName"
                  key="frameName"
                />
                <Column
                  title={<FormattedMessage id="authorization.number" />}
                  dataIndex="licenserNumber"
                  key="licenserNumber"
                />
              </Table>
            </div>
          </div>
          <div className={Styles.halfTable}>
            <div className={`${Styles.border} system__lineBorder`}>
              <h2 className="system__fontColor">
                <FormattedMessage id="license.app" />
              </h2>
              <Table dataSource={this.handleTableData()[1]} pagination={false}>
                <Column
                  title={<FormattedMessage id="authorization.type" />}
                  dataIndex="frameName"
                  key="frameName"
                />
                <Column
                  title={<FormattedMessage id="authorization.number" />}
                  dataIndex="licenserNumber"
                  key="licenserNumber"
                />
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default formConfig;
