/*
 * @Author: Fus
 * @Date:   2020-03-11 16:19:34
 * @Desc: 无业务关联图片
 */
import { CMessage } from '@/components/common/BasicWidgets';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import { deleteFile } from '@/services/fileManger';
import { getCookie, getDefaultConfirmProps, getFileAcceptType, ImageCompression } from '@/utils/common';
import { Icon, Upload } from 'antd';
import classNames from 'classnames';
import { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Zmage from 'react-zmage';
import styles from '../../index.less';
import CreateModal from '@/components/common/CreateModal/CreateModal';

// 通过url获取文件信息
const getInfoFromUrl = (urlText = '') => {
  const splitIndex = urlText.indexOf('_');
  const fileId = urlText.substring(0, splitIndex);
  const fileUrl = urlText.substring(splitIndex + 1, urlText.length);
  return {
    fileId,
    fileUrl,
  };
};

class ImgUnRelation extends Component {
  static contextType = BaseContext;
  static defaultProps = {
    urlVal: '', // 传入的文件地址
    isInList: false, // 是否在列表中展示
  };

  static getDerivedStateFromProps(props, state) {
    const diffUrl = props.urlVal !== state.urlVal;
    if (
      (props.urlVal && diffUrl && !state.fileList.length) ||
      (props.urlVal && diffUrl && state.fileList.length)
    ) {
      const { fileId, fileUrl } = getInfoFromUrl(props.urlVal);
      return {
        urlVal: props.urlVal,
        fileList: [
          {
            uid: -1,
            urlText: `${fileId}_${fileUrl}`,
          },
        ],
      };
    } else if (!props.urlVal && diffUrl) {
      return {
        fileList: [],
        urlVal: '',
      };
    }
    return null;
  }

  state = {
    loading: false, // 加载状态
    urlVal: '', // 字段保存的url
    max: 5, // 文件最大值（M）
    fileList: [], // 文件列表
    previewVisible: false,
    previewImage: '',
  };
  // 图片上传
  handleFileChange = ({ file, fileList }) => {
    const { status } = file;
    const { langLib } = this.context;
    // 上传中
    if (status === 'uploading') {
      this.setState({ loading: true, fileList: [...fileList] });
    } else if (status === 'error') {
      // 上传异常
      CMessage(langLib['file.error'], 'error');
      this.setState({ loading: false });
      return;
    } else if (status === 'done' && file.response) {
      if (!file.response) {
        CMessage(langLib['file.error'], 'error');
        return;
      }
      const fileObj = file.response ? file.response.data[0] : {};
      const fileValue = `${fileObj.id}_${fileObj.url}`;
      this.props.setFileUrl(fileValue);
      // 文件上传完成
      this.setState({
        loading: false,
        fileList: fileList.map(item => {
          const fileObj = item.response ? item.response.data[0] : null;
          const urlText = fileObj ? `${fileObj.id}_${fileObj.url}` : '';
          return {
            ...item,
            urlText,
          };
        }),
      });
      return;
    }
  };
  // 上传前校验
  beforeUpload = file => {
    console.log('=============================================8');
    const { size, type } = file;
    const { fileType = 'image' } = this.props;
    const { max } = this.state;
    const { langLib } = this.context;
    const isLtMax = size / 1024 / 1024 < max;
    // 文件过大
    if (!isLtMax) {
      CMessage(langLib['file.overSize'](max), 'error');
      return false;
    } else if (fileType === 'image' && type.indexOf(fileType) === -1) {
      // 上传文件类型不支持（图片）
      CMessage(langLib['file.unAcceptType'], 'error');
      return false;
    }
    return new Promise((resolve, reject) => {
      if (!isLtMax) {
        reject(file);
      } else {
        // ie就正常返回
        if (navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1) {
          resolve(file);
        } else {
          // todo 兼容ie toBlob
          // toBlob 兼容性处理能兼容ie ，但是new File 不兼容ie，处理方式是转成blob 格式上传，但是接口支持file对象，两者有冲突，所以先图片压缩先不处理
          // 图片压缩
          ImageCompression({ file, quality: 0.6 }, (imgFile) => {
            console.log('执行压缩');
            resolve(imgFile);
          });
        }
      }
    });
  };
  setContent = () => {
    const { disabled } = this.props;
    const { fileList, loading, previewVisible } = this.state;
    const urlText = fileList.length ? fileList[0].urlText : '';
    const { fileUrl, fileId } = getInfoFromUrl(urlText);
    // 上传按钮
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>
          <FormattedMessage id='global.upload' />
        </div>
      </div>
    );
    // 加载中
    const loadingBtn = (
      <Fragment>
        <Icon type='loading' className='' />
      </Fragment>
    );
    console.log(fileUrl, 'fileUrl');
    if (loading) return loadingBtn;
    if (fileList.length && !disabled)
      return (
        <Fragment>
          <div className='zmage-wrap'>
            <img onClick={this.handlePreview} src={fileUrl} style={{ width: '100%', height: '100%' }} />
            {/* <Zmage style={{ width: '100%', height: '100%' }} src={fileUrl} />*/}
            <CreateModal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <Zmage
                controller={{
                  // 关闭按钮
                  close: true,
                  // 缩放按钮
                  zoom: false,
                  // 旋转按钮
                  rotate: true,
                }}
                onZooming={state => {
                  console.info('Zooming State: ', state);
                }}
                style={{ width: '100%' }}
                src={fileUrl}
              />
              {/* <img alt="example" style={{ width: '100%' }} src={previewImage}/>*/}
            </CreateModal>
          </div>
          <div className='zmage-del-wrap' onClick={() => this.handleRemove(fileId)}>
            <i className='iconfont icon-del' />
          </div>
        </Fragment>
      );
    if (!fileList.length) return uploadButton;
    return null;
  };
  // 删除文件
  handleRemove = fileId => {
    const { langLib } = this.context;
    const { setFileUrl } = this.props;
    return new Promise((resolve, reject) => {
      let { close } = ModalBox.confirm({
        ...getDefaultConfirmProps(langLib),
        onOk: () => {
          deleteFile({ filesJson: JSON.stringify([{ id: fileId }]) }).then(
            res => {
              CMessage(langLib['message.del.success']);
              setFileUrl('');
              this.setState({
                fileList: [],
                urlVal: '',
              });
              closeModal();
            },
            err => reject(),
          );
        },
        onCancel: () => closeModal(),
      });
      const closeModal = () => {
        close();
      };
    });
  };
  // 预览图片
  handlePreview = async file => {
    this.setState({
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const { disabled, isInList, eleObj } = this.props;
    const { waterMarkId } = eleObj;
    let data = waterMarkId ? { waterMarkId } : {};
    const { fileList } = this.state;
    const accept = getFileAcceptType();
    const uploadProps = {
      accept,
      listType: 'picture-card',
      disabled,
      fileList,
      action: query.EDITOR_UPLOAD,
      headers: {
        token: getCookie('token'),
      },
      data,
      onPreview: this.handlePreview,
      onChange: this.handleFileChange,
      onRemove: this.handleRemove,
      beforeUpload: this.beforeUpload,
      openFileDialogOnClick: !fileList.length,
    };
    const wrapCls = classNames({
      [styles.cUpload]: true,
      [styles.ImgUnRelation]: true,
      [styles.hasImg]: fileList.length,
      [styles.isInList]: isInList,
    });
    return (
      <div className={wrapCls}>
        <Upload {...uploadProps}>{this.setContent()}</Upload>
      </div>
    );
  }
}

export default ImgUnRelation;
