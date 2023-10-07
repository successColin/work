/*
 * @Author: Fus
 * @Date:   2020-03-16 13:55:44
 * @Desc: 富文本编辑器
 */
import { CMessage } from '@/components/common/BasicWidgets';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import { uploadImg } from '@/services/global';
import { getCookie, getFileAcceptType } from '@/utils/common';
import { Button, Icon, Upload } from 'antd';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import classNames from 'classnames';
import { Component } from 'react';
import styles from '../../index.less';
import ExportButton from './ExportButton';

class CBraftEditor extends Component {
  static contextType = BaseContext;

  componentDidMount() {
    document.addEventListener('paste', this.handlePasteMonitor);
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.handlePasteMonitor);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.textValue !== state.textValue) {
      return {
        editorState: BraftEditor.createEditorState(props.textValue),
        textValue: props.textValue,
      };
    }
    return null;
  }

  state = {
    editorState: null,
    textValue: '',
    max: 2,
  };
  // 清空内容(于外部调用)
  clearContent = () => {
    const { editorState } = this.state;
    if (!editorState) return;
    this.setState({
      editorState: ContentUtils.clear(editorState),
    });
  };
  handleEditorChange = editorState => {
    this.setState({ editorState });
    this.triggerChange({ editorState });
  };
  triggerChange = editorState => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, editorState));
    }
  };
  // 上传前校验__图片
  beforeUpload = file => {
    console.log('=============================================10');
    const { size, type } = file;
    const { fileType = 'image' } = this.props;
    const { max } = this.state;
    const { langLib } = this.context;
    const isLtMax = size / 1024 / 1024 < 2;
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
        // 图片压缩
        resolve(file);
        // ImageCompression({ file, quality: 0.6 }, (imgFile) => {
        //   resolve(imgFile);
        // });
      }
    });
  };
  // 上传前校验__视频
  beforeUploadVideo = file => {
    console.log(file);
    const { size, type } = file;
    const { langLib } = this.context;
    const isLtMax = size / 1024 / 1024 < 200;
    // 文件过大
    if (!isLtMax) {
      CMessage(langLib['file.overSize'](200), 'error');
      return false;
    } else if (type.indexOf('video') === -1) {
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
  // 复制黏贴__上传图片
  handlePasteMonitor = e => {
    /** 获取剪切板的数据clipboardData */
    var clipboardData = e.clipboardData,
      items,
      item;

    if (clipboardData) {
      items = clipboardData.items;
      if (!items) {
        return;
      }
      item = items[0];
      const file = item.getAsFile();
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        uploadImg(formData).then(res => {
          console.log(res);
          const url = res[0].url;
          const editorState = ContentUtils.insertMedias(this.state.editorState, [
            {
              type: 'IMAGE',
              url,
            },
          ]);
          this.setState({ editorState });
        });
      }
    }
  };

  // 图片上传
  handleFileChange = (obj, type = 'img') => {
    const { file } = obj;
    const { status } = file;
    const { langLib } = this.context;
    if (status === 'error') {
      // 上传异常
      CMessage(langLib['file.error'], 'error');
      return;
    } else if (status === 'done' && file.response) {
      if (!file.response) {
        CMessage(langLib['file.error'], 'error');
        return;
      }
      const url = file.response.data[0].url;
      const editorState = ContentUtils.insertMedias(this.state.editorState, [
        {
          type: type === 'img' ? 'IMAGE' : 'VIDEO',
          url,
        },
      ]);
      this.setState({ editorState });
    }
  };
  // 获取额外的功能入口
  getExtendControls = () => {
    const { id: eleId, elementFormat } = this.props.eleObj;
    console.log(this.props.eleObj);
    const { langLib } = this.context;
    const acceptType = getFileAcceptType();
    const vedioType = getFileAcceptType('vedio');
    // const menu = (
    //   <Menu>
    //     <Menu.Item>
    //       {/* <Component name="underline" /> */}
    //       <Icon type="underline" key="underline" />
    //     </Menu.Item>
    //     <Menu.Item>
    //       <Icon type="strikethrough" />
    //     </Menu.Item>
    //   </Menu>
    // );
    // 上传视频
    const videoComponent =
      +elementFormat === 2
        ? ''
        : {
            key: 'antd-uploader-video',
            type: 'component',
            component: (
              <Upload
                accept={vedioType}
                showUploadList={false}
                beforeUpload={this.beforeUploadVideo}
                action={query.EDITOR_UPLOAD}
                headers={{ token: getCookie('token') }}
                onChange={file => this.handleFileChange(file, 'video')}
              >
                <Button className="control-item button upload-button" data-title="插入视频">
                  <Icon type="video-camera" theme="filled" />
                </Button>
              </Upload>
            ),
          };
    return [
      // 'underline',
      // 'strike-through',
      // 'superscript',
      // 'subscript',
      // 'remove-styles',
      // 'text-indent',
      // 'list-ul',
      // 'list-ol',
      // 'blockquote',
      // 'code',
      // 'link',
      // 'separator',
      // 上传图片
      {
        key: 'antd-uploader-img',
        type: 'component',
        component: (
          <Upload
            accept={acceptType}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            action={query.EDITOR_UPLOAD}
            headers={{ token: getCookie('token') }}
            onChange={file => this.handleFileChange(file, 'img')}
          >
            <Button
              className="control-item button upload-button"
              data-title={langLib['textEditor.img']}
            >
              <Icon type="picture" theme="filled" />
            </Button>
          </Upload>
        ),
      },
      videoComponent,
      // // 更多
      // {
      //   key: 'antd-More',
      //   type: 'component',
      //   component: (
      //     <Dropdown overlay={menu}>
      //       <div className="control-item button upload-button">
      //         更多 <Icon type="down" />
      //       </div>
      //     </Dropdown>
      //   ),
      // },
    ];
  };

  render() {
    const { editorState, textValue } = this.state;
    const { disabled, eleObj } = this.props;
    const { placeholderText, elementFormat } = eleObj;
    const extendControls = this.getExtendControls();
    const className = classNames({
      [styles.cBraftEditor]: true,
      'custom-braft-editor': true,
    });
    const controlsArr = [
      'undo',
      'redo',
      'separator',
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'text-color',
      'bold',
      'italic',
      'text-align',
      'separator',
      'hr',
      'fullscreen',
    ];
    const controlsArrAll = [
      'undo',
      'redo',
      'separator',
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'text-color',
      'bold',
      'italic',
      'underline',
      'strike-through',
      'separator',
      'superscript',
      'subscript',
      'remove-styles',
      'separator',
      'text-indent',
      'text-align',
      'separator',
      'list-ul',
      'list-ol',
      'blockquote',
      'code',
      'separator',
      'link',
      'hr',
      'separator',
      'fullscreen',
    ];
    // 去掉的功能
    // const excludeControls = ['clear', 'headings', 'emoji', 'media'];
    console.log(elementFormat);
    const controls = +elementFormat === 2 ? controlsArr : controlsArrAll;
    const editorProps = {
      readOnly: disabled,
      placeholder: placeholderText,
      extendControls,
      // excludeControls,
      controls,
      value: editorState,
      className,
      style: { border: '1px solid #EBEBEB' },
      onChange: this.handleEditorChange,
    };
    return disabled ? (
      <div style={{ position: 'relative' }}>
        <div
          id="export"
          className={`${styles.cBraftEditorSection}`}
          dangerouslySetInnerHTML={{ __html: textValue }}
          style={{ minHeight: '50px', maxHeight: '300px', overflow: 'auto' }}
        />
        <ExportButton eleObj={this.props.eleObj}></ExportButton>
      </div>
    ) : (
      <BraftEditor {...editorProps} />
    );
  }
}

export default CBraftEditor;
