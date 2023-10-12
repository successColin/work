import { CButton, CInput, CMessage } from '@/components/common/BasicWidgets';
import FormItems from '@/components/common/FormItems/FormItems';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import { getCookie } from '@/utils/common';
import { Select, Upload } from 'antd';
import { Component } from 'react';
import styles from './FormData.less';
import Template from './Template/Template';

const { Option } = Select;

class FormData extends Component {
  static contextType = BaseContext;
  state = {
    keywordArr: [],
    isShowAddKeyword: false,
    keyword: '',
  };

  handleChange = value => {
    console.log(`selectedObj ${value}`);
  };

  // 点击添加
  handleAdd = () => {
    this.setState({
      isShowAddKeyword: true,
    });
  };

  // 点击取消
  handleClose = () => {
    this.setState({
      isShowAddKeyword: false,
    });
  };

  // 点击保存
  handleSave = () => {
    const { keyword } = this.state;
    const { selectedObj = {}, handleSetState } = this.props;
    const keywordArr = (selectedObj.keyword && selectedObj.keyword.split(',')) || [];
    const aa = [...keywordArr, keyword];
    this.setState({
      isShowAddKeyword: false,
    });
    handleSetState({
      selectedObj: {
        ...selectedObj,
        keyword: aa.join(','),
      },
    });
  };

  handleDelete = v => {
    const { selectedObj = {}, handleSetState } = this.props;
    const keywordArr = (selectedObj.keyword && selectedObj.keyword.split(',')) || [];
    keywordArr.splice(v, 1);
    handleSetState({
      selectedObj: {
        ...selectedObj,
        keyword: keywordArr.join(','),
      },
    });
  };

  updateTemplate = obj => {
    const { selectedObj = {}, handleSetState } = this.props;
    handleSetState({
      selectedObj: {
        ...selectedObj,
        ...obj,
      },
    });
  };

  onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  // 上传前校验
  beforeUpload = file => {
    console.log('=============================================4');
    const { size, type, name } = file;
    const { langLib } = this.context;
    const isLtMax = size / 1024 / 1024 < 2;

    let isTrueType = true;
    if (name) {
      const nameArr = name.split('.');
      const nameType = nameArr[nameArr.length - 1];
      isTrueType = 'jpg,png,jpeg'.indexOf(nameType) === -1;
      if (isTrueType) {
        CMessage('请上传图片jpg,png,jpeg格式', 'error');
      }
    }

    // 文件过大
    if (!isLtMax) {
      CMessage(langLib['file.overSize'](2), 'error');
    }
    return new Promise((resolve, reject) => {
      if (!isLtMax || isTrueType) {
        reject(file);
      } else {
        resolve(file);
      }
    });
  };

  handleChangeImg = ({ file, fileList }, name) => {
    const { status } = file;
    const { langLib } = this.context;
    const { selectedObj = {}, handleSetState } = this.props;
    // 上传中
    if (status === 'uploading') {
      console.log(1111111);
    } else if (status === 'error') {
      // 上传异常
      CMessage(langLib['file.error'], 'error');
      return;
    } else if (status === 'done' && file.response) {
      if (!file.response.success) {
        CMessage(langLib['file.error'], 'error');
        return;
      }
      const imgarr = [];
      fileList.forEach(item => {
        let url = '';
        if (item.response) {
          url = item.response && item.response.data[0].url;
        } else {
          url = item.url;
        }
        url = url.split('?')[0];
        imgarr.push({
          uid: item.uid,
          name: item.name,
          status: item.status,
          url: url,
        });
      });
      handleSetState({
        selectedObj: {
          ...selectedObj,
          coverurljson: JSON.stringify(imgarr),
        },
      });
    }
  };

  deleteFun = file => {
    const { selectedObj = {}, handleSetState } = this.props;
    let { coverurljson } = selectedObj;
    let arr = coverurljson && JSON.parse(coverurljson);
    const index = arr.findIndex(item => {
      return item.uid === file.uid;
    });
    arr.splice(index, 1);
    handleSetState({
      selectedObj: {
        ...selectedObj,
        coverurljson: JSON.stringify(arr),
      },
    });
  };

  getFormConfigs = () => {
    const { selectedObj } = this.props;
    const keywordArr = (selectedObj.keyword && selectedObj.keyword.split(',')) || [];
    const { isShowAddKeyword } = this.state;
    let arr = (selectedObj.coverurljson && JSON.parse(selectedObj.coverurljson)) || [];
    let fileList = [];
    arr.forEach(item => {
      fileList.push({
        ...item,
        url: `${item.url}?token=${localStorage.getItem('token')}`,
      });
    });
    const publicConfig = [
      {
        key: 'title',
        colon: false,
        colSpan: 12,
        label: '标题',
        config: {
          requre: false,
          initialValue: selectedObj.title || '',
        },
        component: <CInput />,
      },
      {
        key: 'style',
        colon: false,
        colSpan: 12,
        label: '展示风格',
        config: {
          requre: false,
          initialValue: selectedObj.style || 1,
        },
        component: (
          <Select onChange={this.handleChange}>
            <Option value={1}>大图展示</Option>
            <Option value={2}>右侧图片</Option>
            <Option value={3}>三张图展示</Option>
          </Select>
        ),
      },
      {
        key: 'keyword',
        colon: false,
        colSpan: 24,
        label: '关键字',
        config: {
          requre: false,
        },
        component: (
          <div className={styles.keywordClass}>
            <CButton type="dashed" onClick={() => this.handleAdd()} style={{ marginRight: '5px' }}>
              <i className="iconfont icon-add-border custom-color" style={{ marginRight: '5px' }} />
              添加
            </CButton>
            <div style={{ flex: 1 }}>
              {keywordArr &&
                keywordArr.map((val, i) => {
                  return (
                    <span className={styles.keywordClass__content} key={i}>
                      {val}
                      <div className={styles.close} onClick={() => this.handleDelete(i)}>
                        <span className="iconfont icon-close" />
                      </div>
                    </span>
                  );
                })}
            </div>
            {isShowAddKeyword && (
              <section className={styles.add}>
                <CInput
                  className={styles.inputClass}
                  placeholder="请输入关键字"
                  onChange={e =>
                    this.setState({
                      keyword: e.target.value,
                    })
                  }
                />
                <footer>
                  <CButton
                    size="small"
                    onClick={() => this.handleClose()}
                    className={styles.cancelButton}
                  >
                    取消
                  </CButton>
                  <CButton type="primary" size="small" onClick={() => this.handleSave()}>
                    保存
                  </CButton>
                </footer>
              </section>
            )}
          </div>
        ),
      },
      {
        key: 'coverurljson',
        colon: false,
        colSpan: 24,
        label: '封面图片',
        config: {
          requre: false,
        },
        component: (
          <div className={styles.uploadBox}>
            <Upload
              multiple={false}
              action={query.FILE_UPLOAD}
              beforeUpload={this.beforeUpload}
              headers={{ token: getCookie('token') }}
              accept="image/*"
              listType="picture-card"
              defaultFileList={fileList}
              onPreview={e => {
                this.onPreview(e);
              }}
              onChange={e => {
                this.handleChangeImg(e);
              }}
              onRemove={e => {
                this.deleteFun(e);
              }}
            >
              {fileList.length < 3 && '+ 上传'}
            </Upload>
          </div>
        ),
      },
      {
        key: 'html',
        colon: false,
        colSpan: 24,
        label: '资讯正文',
        config: {
          requre: false,
        },
        component: <Template content={selectedObj.html} info="" onChange={this.updateTemplate} />,
      },
    ];
    return publicConfig;
  };

  render() {
    const { form } = this.props;
    return <FormItems formConfigs={this.getFormConfigs()} form={form} loading={false} />;
  }
}

export default FormData;
