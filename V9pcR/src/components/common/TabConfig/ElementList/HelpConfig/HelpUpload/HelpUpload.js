import { CMessage } from '@/components/common/BasicWidgets';
import styles from '@/components/common/BasicWidgets/index.less';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import { getBase64, getCookie, getDefaultConfirmProps, getFileAcceptType } from '@/utils/common';
import { Button, Icon, Upload } from 'antd';
import classNames from 'classnames';
import { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Zmage from 'react-zmage';

class HelpUpload extends Component {
  static contextType = BaseContext;
  static defaultProps = {
    max: 20, // 文件最大值（M）
    multiple: true, // 多文件上传
    showUploadList: true, // 显示上传列表
  };

  // static getDerivedStateFromProps(props, state) {
  //   const { list } = props;
  //   if (list.length !== state.fileList.length) {
  //     return {
  //       fileList: list,
  //     };
  //   }
  //   return null;
  // }

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    loading: false, // 上传中
  };

  componentDidMount() {
    const { list } = this.props;
    this.setState({
      fileList: list,
    });
  }

  componentDidUpdate(prevProps, prevState) {}

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  // 删除文件
  handleRemove = file => {
    const { mainId, fileId } = file;
    const { fileList } = this.state;
    const { langLib } = this.context;
    const { onRemoveFile } = this.props;

    return new Promise((resolve, reject) => {
      let { close } = ModalBox.confirm({
        ...getDefaultConfirmProps(langLib),
        onOk: () => {
          onRemoveFile(fileId || file.response.data[0].id);
          this.setState({ fileList: fileList.filter(item => item.fileId !== fileId) });
          closeModal();
        },
        onCancel: () => closeModal(),
      });
      const closeModal = () => {
        close();
      };
    });
  };
  // 获取icon
  getFileTypeClassName = format => {
    if (format === 'mp3') {
      return {
        name: 'icon-mp3-style',
        color: '#FF932F',
      };
    } else if (format === 'mp4') {
      return {
        name: 'icon-mp4-style',
        color: '#4E7DD9',
      };
    } else if (format === 'xls' || format === 'xlsx') {
      return {
        name: 'icon-xls-style',
        color: '#FFAC02',
      };
    } else if (format === 'png') {
      return {
        name: 'icon-png-style',
        color: '#4E94D9',
      };
    } else if (format === 'txt') {
      return {
        name: 'icon-txt-style',
        color: '#B9C1CF',
      };
    } else if (format === 'jpg') {
      return {
        name: 'icon-jpg-style',
        color: '#FF8102',
      };
    } else if (format === 'pdf') {
      return {
        name: 'icon-pdf-style',
        color: '#F15643',
      };
    } else if (format === 'doc' || format === 'docx') {
      return {
        name: 'icon-doc-style',
        color: '#FF933D',
      };
    } else if (format === 'ppt' || format === 'pptx') {
      return {
        name: 'icon-ppt-style',
        color: '#47C69A',
      };
    } else if (format === 'zip') {
      return {
        name: 'icon-zip-style',
        color: '#B9C1CF',
      };
    } else {
      return {
        name: 'icon-else-style',
        color: '#B9C1CF',
      };
    }
  };

  onChange = ({ file, fileList, event }) => {
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
      const { uploadImage, uploadType } = this.props;
      uploadImage &&
        uploadImage({
          url: file.response.data[0].url,
          fileId: file.response.data[0].id,
          uploadType,
          name: file.name,
        });
      // 文件上传完成
      this.setState({
        loading: false,
        fileList: fileList.map(item => ({
          ...item,
          fileId: item.id || (item.response ? item.response.data[0].id : ''),
          name: item.name || (item.response ? item.response.data[0].name : ''),
          mainId: item.mainId || (item.response ? item.response.data[0].id : ''),
          url: item.url || (item.response ? item.response.data[0].url : ''),
          thumbUrl: item.thumbUrl || (item.response ? item.response.data[0].url : ''),
        })),
      });
      return;
    }
  };
  beforeUploadFile = file => {
    console.log('=============================================5');
    const { size, type, name } = file;
    const { max, uploadType } = this.props;
    const { langLib } = this.context;
    const isLtMax = size / 1024 / 1024 < max;
    const accept = getFileAcceptType(uploadType);

    const fileNameArr = name.split('.');
    const fileNameType = fileNameArr[fileNameArr.length - 1];
    // 文件过大
    if (!isLtMax) {
      CMessage(langLib['file.overSize'](max), 'error');
      return false;
    } else if (!(fileNameType && accept.includes(fileNameType))) {
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
  // 上传前校验
  beforeUpload = file => {
    console.log('=============================================6');
    const { size, type } = file;
    const { max, uploadType } = this.props;
    const { langLib } = this.context;
    const isLtMax = size / 1024 / 1024 < max;
    // 文件过大
    if (!isLtMax) {
      CMessage(langLib['file.overSize'](max), 'error');
    } else if (uploadType === 'image' && type.indexOf(uploadType) === -1) {
      // 上传文件类型不支持（图片）
      CMessage(langLib['file.unAcceptType'], 'error');
    }
    return new Promise((resolve, reject) => {
      if (!isLtMax) {
        reject(file);
      } else {
        // 图片压缩
        if (uploadType === 'vedio') {
          resolve(file);
          return;
        }
        resolve(file);
        // ImageCompression({ file, quality: 0.6 }, (imgFile) => {
        //   resolve(imgFile);
        // });
      }
    });
  };

  setContent = () => {
    const { uploadType, children } = this.props;
    const { fileList, loading } = this.state;
    // 上传按钮
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">
          <FormattedMessage id="global.upload" />
        </div>
      </div>
    );
    // 上传按钮
    const uploadVedioButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">
          <FormattedMessage id="global.uploadVedio" />
        </div>
      </div>
    );
    // 加载中
    const loadingBtn = (
      <Fragment>
        <Icon type="loading" />
      </Fragment>
    );
    if (uploadType === 'vedio') {
      return fileList.length === 1 ? null : uploadVedioButton;
    }
    const content = loading ? loadingBtn : children || uploadButton;
    return content;
  };
  // 上传参数
  getUploadData = () => {
    let data = {};
    Object.keys(data).forEach(item => {
      if (!data[item]) delete data[item];
    });
    return data;
  };

  renderContent = () => {
    const { previewVisible, previewImage, fileList = [], loading, files } = this.state;
    const { className, uploadType } = this.props;
    const wrapCls = classNames({
      [styles.cUpload]: true,
      [className]: !!className,
    });
    const accept = getFileAcceptType(uploadType);
    const uploadProps = {
      action: query.EDITOR_UPLOAD,
      accept,
      listType: 'picture-card',
      headers: {
        token: getCookie('token'),
      },
      fileList,
      data: this.getUploadData,
      onPreview: this.handlePreview,
      onChange: this.onChange,
      onRemove: this.handleRemove,
      beforeUpload: this.beforeUpload,
    };
    return (
      <div className={wrapCls}>
        <Upload {...uploadProps}>{this.setContent()}</Upload>
        <CreateModal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          {uploadType === 'vedio' && (
            <video style={{ width: '100%', height: '100%' }} src={previewImage} controls="controls">
              your browser does not support the video tag
            </video>
          )}
          {uploadType === 'image' && (
            <Zmage
              controller={{
                // 关闭按钮
                close: true,
                // 缩放按钮
                zoom: false,
                // 旋转按钮
                rotate: true,
              }}
              onZooming={state => {}}
              style={{ width: '100%' }}
              src={previewImage}
            />
          )}
        </CreateModal>
      </div>
    );
  };
  renderFileContent = () => {
    const { fileList } = this.state;
    const preViewType = ['gif', 'jpg', 'png', 'pdf'];
    const {
      children,
      className,
      relationParams,
      fromType,
      uploadType,
      disabled,
      eleObj,
      ...restProps
    } = this.props;
    const accept = getFileAcceptType(uploadType);
    const props = {
      action: query.EDITOR_UPLOAD,
      accept,
      headers: {
        token: getCookie('token'),
      },
      fileList,
      data: this.getUploadData,
      disabled: disabled,
      onChange: this.onChange,
      onRemove: this.handleRemove,
      beforeUpload: this.beforeUploadFile,
      showUploadList: false,
    };
    const classStyles = classNames({
      iconUpload: true,
      iconfont: true,
      'custom-color': true,
      [styles.marginRight]: true,
    });
    return (
      <div className={styles.cUpload}>
        <Upload {...props}>
          <Button>
            <span className={classStyles} />
            <FormattedMessage id="element.type.imageText" />
          </Button>
        </Upload>
        <ul>
          {fileList.map((item, index) => {
            const { name = '', url } = item;
            const formTypeArr = name ? name.split('.') : [];
            const type = formTypeArr[formTypeArr.length - 1];
            const config = this.getFileTypeClassName(type);
            const newurl = url
              ? '/' +
                url
                  .split('/')
                  .slice(3)
                  .join('/')
              : '';
            const relUrl = preViewType.includes(type) ? url : newurl;
            return (
              <li className={styles.fileWrap} key={index}>
                <a href={relUrl} download={name} target="_blank">
                  <i
                    className={`iconfont ${styles.iconWrap} ${config.name}`}
                    style={{ color: config.color }}
                  />

                  <p className={styles.fileName} title={name}>
                    {name}
                  </p>
                </a>
                <i
                  onClick={() => {
                    this.handleRemove(item);
                  }}
                  className={`${styles.del} custom-color icondelete iconfont`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  render() {
    const { uploadType = 'image' } = this.props;
    const uploadTypeArr = ['image', 'vedio'];
    const content = uploadTypeArr.includes(uploadType)
      ? this.renderContent()
      : this.renderFileContent();
    return <div>{content}</div>;
  }
}

export default HelpUpload;
