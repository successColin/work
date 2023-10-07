import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import FormItems from '@/components/common/FormItems/FormItems';
import {
  CMessage,
  CButton,
  CTextArea,
} from '@/components/common/BasicWidgets';
import HelpUpload from '@/components/common/TabConfig/ElementList/HelpConfig/HelpUpload/HelpUpload';
import { getElementHelpConfig, updateOrInsertHelpConfig } from '@/services/pageConfig';
import { BaseContext } from '@/constants/global';

class HelpConfig extends Component {
  static contextType = BaseContext;

  state = {
    visibleHelpConfig: false, // 默认弹框隐藏
    elementHelpConfig: [], // 帮助配置
    elementObj: {}, // 当前控件信息
    loading: false,
  };


  // 获取配置
  setModalShow = (detial) => {
    const { id } = detial;
    getElementHelpConfig({ id }).then(res => {
      this.setState({ visibleHelpConfig: true, elementHelpConfig: res, elementObj: detial });
    });
  };

  handleOk = () => {
    const { elementHelpConfig = [], elementObj } = this.state;
    const { id: elementId } = elementObj;
    this.setState({ loading: true });
    const { langLib } = this.context;
    updateOrInsertHelpConfig({ elementId, helpConfigPramDtoList: elementHelpConfig }).then(res => {
      CMessage(langLib['message.save.success']);
      this.setState({ visibleHelpConfig: false, loading: false });
    });
  };
  // 修改描述信息
  setRowData = ({ basetype, value: memo }) => {
    const { elementHelpConfig = [], elementObj } = this.state;
    const { id: elementId } = elementObj;
    let infoList = [...elementHelpConfig];
    let index = infoList.findIndex(item => item.basetype === 1);
    if (index !== -1) {
      infoList[index].memo = memo;
    } else {
      infoList.push({
        elementId,
        filePath: '',
        memo,
        basetype: 1,
      });
    }
    this.setState({ elementHelpConfig: infoList });
  };

  // 上传文件
  uploadImage = (file) => {
    const { elementHelpConfig = [], elementObj } = this.state;
    const { id: elementId } = elementObj;
    let infoList = [...elementHelpConfig];
    const { url, uploadType, fileId, name } = file;
    let basetype = 2;
    if (uploadType === 'image') {
      basetype = 3;
    } else if (uploadType === 'file') {
      basetype = 4;
    }
    let data = { elementId, fileId, filePath: url, memo: '', basetype, sno: '', name };
    infoList.push(data);
    this.setState({ elementHelpConfig: infoList });
  };
  // 移除文件
  onRemove = (id) => {
    const { elementHelpConfig = [], elementObj } = this.state;
    let infoList = [...elementHelpConfig];
    this.setState({ elementHelpConfig: infoList.filter(item => item.fileId !== id) });
  };

  // 控件信息
  getFormConfigs = () => {
    const { elementHelpConfig = [] } = this.state;
    const reducerList = (basetype) => {
      return elementHelpConfig.filter(item => item.basetype === basetype).map(item => {
        return {
          ...item,
          uid: item.fileId,
          url: item.filePath,
          status: 'done',
        };
      });
    };
    let memoObj = elementHelpConfig.find(item => item.basetype === 1) || {}; // 文字描述
    let vedioList = reducerList(2); // 视频集合
    let imgList = reducerList(3) || []; // 图片集合
    let fileList = reducerList(4); // 文件集合
    return [{
      key: 'memo',
      label: <FormattedMessage id="settingForm.help.textHelp"/>,
      colSpan: 24,
      config: {
        initialValue: memoObj.memo || '',
      },
      component: (
        <CTextArea
          onBlur={e => this.setRowData({
            baseType: 1,
            value: e.target.value,
          })}
        />
      ),
    },
      { // 上传视频
        key: 'vedio',
        label: <FormattedMessage id="settingForm.help.vedio"/>,
        colSpan: 24,
        config: {
          initialValue: '',
        },
        component: (
          <HelpUpload
            uploadType='vedio'
            max={200}
            onRemoveFile={this.onRemove}
            uploadImage={this.uploadImage}
            list={vedioList}
          />
        ),
      },
      { // 上传图片
        key: 'upload',
        label: <FormattedMessage id="global.upload"/>,
        colSpan: 24,
        config: {
          initialValue: '',
        },
        component: (
          <HelpUpload
            uploadType='image'
            max={2}
            list={imgList}
            onRemoveFile={this.onRemove}
            uploadImage={this.uploadImage}
          />
        ),
      },
      { // 上传文件
        key: 'uploadFile',
        label: <FormattedMessage id="global.uploadFile"/>,
        colSpan: 12,
        config: {
          initialValue: '',
        },
        component: (
          <HelpUpload
            list={fileList}
            onRemoveFile={this.onRemove}
            uploadImage={this.uploadImage}
            uploadType='file' max={20}
          />
        ),
      },
    ];
  };

  render() {
    const { visibleHelpConfig, elementHelpConfig, loading } = this.state;
    const { form } = this.props;
    const boxWrap = {
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
      paddingTop: '20px',
    };
    return <CreateModal // 帮助信息设置
      visible={visibleHelpConfig}
      destroyOnClose={true}
      onCancel={() => this.setState({ visibleHelpConfig: false })}
      footer={[
        <CButton key="cancel" type="default"
                 onClick={() => this.setState({ visibleHelpConfig: false })}>
          <FormattedMessage id="global.cancel"/>
        </CButton>, <CButton key="submit" loading={loading} type="primary" onClick={() => this.handleOk()}>
          <FormattedMessage id="global.ok"/>
        </CButton>]}
      title={<FormattedMessage id="settingForm.help.configSetting"/>}
    >
      <div style={boxWrap}>
        <FormItems
          formConfigs={this.getFormConfigs()}
          form={form}
          loading={false}
        />
      </div>
    </CreateModal>;
  }
}

export default HelpConfig;
