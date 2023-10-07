import { CMessage } from '@/components/common/BasicWidgets';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import {
  deleteFile,
  deleteFileRelation,
  fileRelationBusiness,
  getFileRelation,
} from '@/services/fileManger';
import { getBase64, getCookie, getFileAcceptType } from '@/utils/common';
import { Button, Modal, Spin, Upload } from 'antd';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from '../VisualMapConfig.less';

class ImgModal extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [],
      visibleGroupID: props.visibleGroupID,
      relationTypeId: props.relationTypeId,
      loading: false,
    };
    this.imgListEvent = null;
  }

  componentDidMount() {
    this.getImgList();
    // 添加图片点击事件
    // setTimeout(() => {
    //   this.addEvent();
    // }, 500);
  }

  componentWillUnmount() {
    this.imgListEvent();
  }

  componentWillReceiveProps(nextProps) {}

  addEvent = () => {
    const imgList = document.querySelector('#visuaUpload .ant-upload-list');
    this.imgListEvent = this.props.ownAddEventListener(
      imgList,
      'click',
      e => {
        if (e.target.className === 'ant-upload-list-item-info') {
          let lastSelect = document.querySelector('.select');
          if (lastSelect)
            lastSelect.setAttribute('class', 'ant-upload-list-item ant-upload-list-item-done');
          e.target.parentNode.setAttribute(
            'class',
            'ant-upload-list-item ant-upload-list-item-done select',
          );
          document.querySelectorAll('.ant-upload-list-item').forEach((item, index) => {
            if (item.className.indexOf('select') !== -1) {
              this.setVisualState({ imgUrl: this.state.fileList[index].url });
            }
          });
        }
      },
      false,
    );
  };

  setVisualState = payload => {
    const { dispatch } = this.context;
    dispatch({
      type: 'visualState/updateState',
      payload: payload,
    });
  };

  getImgList = () => {
    const requset = {
      relationId: this.state.visibleGroupID,
      relationTableName: 'visualmapgroup',
      relationTypeId: this.state.relationTypeId,
    };
    this.setState({ loading: true });
    getFileRelation(requset).then(
      res => {
        const fileList = res.map(item => ({
          ...item,
          uid: item.id,
          status: 'done',
        }));
        this.setState({ fileList, loading: false }, () => {
          this.addEvent();
        });
      },
      err => this.setState({ loading: false }),
    );
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  beforeUploadFile = file => {
    const { size, type, name } = file;
    const max = 100;
    const { langLib } = this.context;
    const isLtMax = true;
    const accept = getFileAcceptType('image');

    const fileNameArr = name.split('.');
    const fileNameType = fileNameArr[fileNameArr.length - 1];
    // 文件过大
    if (!(fileNameType && accept.includes(fileNameType))) {
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

  handleChange = ({ file, fileList }) => {
    const { status } = file;
    const { langLib } = this.context;

    console.log(file);
    console.log(status);

    if (status === 'uploading') {
      this.setState({ fileList });
    } else if (file.status === 'error') {
      CMessage(file.response.msg, 'error');
      this.setState({ fileList });
    } else if (file.status === 'done') {
      if (file.response.success) {
        const { visibleGroupID, relationTypeId } = this.state;
        const request = {
          mainId: file.response.data[0].id,
          relationId: visibleGroupID,
          relationTableName: 'visualmapgroup',
          relationTypeId: relationTypeId,
        };
        const token = { token: getCookie('token') };
        console.log(token);
        fileRelationBusiness({ fileString: JSON.stringify([request]) }).then(res => {
          if (res) this.getImgList();
        });
      } else {
        CMessage(file.response.msg, 'error');
      }
    } else if (file.status === 'removed') {
      let { close } = ModalBox.confirm({
        title: langLib['visual.confirm.deletion'], // lang: '是否确认删除？'
        onOk: () => {
          deleteFileRelation({ id: file.id }).then(res => {
            deleteFile({ filesJson: `[{"id":${file.mainId}}]` }).then(res => {
              this.setState({ fileList });
              close();
            });
          });
        },
        onCancel: () => close(),
      });
    }
  };

  render() {
    const { fileList, previewVisible, previewTitle, previewImage, loading } = this.state;
    const token = { token: getCookie('token') };
    return (
      <div className={`${styles.imgModal} vvvvvvvv`} id="visuaUpload">
        <Spin spinning={loading}>
          <Upload
            action={query.EDITOR_UPLOAD}
            data={{ tableName: 'visualmapgroup' }}
            headers={token}
            listType="picture-card"
            fileList={fileList}
            multiple={true}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            beforeUpload={this.beforeUploadFile}
          >
            <Button className="defaultButtonStyle">
              <i className="iconfont iconUpload custom-color" />
              <span>
                <FormattedMessage id="visual.upload" />
                {/* lang: 上传 */}
              </span>
            </Button>
          </Upload>
        </Spin>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
          width={807}
          getContainer={document.getElementById('main-container')}
        >
          <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImgModal;
