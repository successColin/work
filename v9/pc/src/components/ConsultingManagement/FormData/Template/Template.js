import { CMessage } from '@/components/common/BasicWidgets';
import { BaseContext } from '@/constants/global';
import query from '@/constants/query';
import { getCookie, getFileAcceptType } from '@/utils/common';
import { Button, Col, Icon, Row, Upload } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';
import React, { Component } from 'react';
import Styles from './Template.less';

class Template extends Component {
  static contextType = BaseContext;
  static getDerivedStateFromProps(props, state) {
    if (props.content !== state.content.toHTML()) {
      console.log(
        props.content,
        '111',
        state.content.toHTML(),
        555555555,
        props.content === state.content.toHTML(),
      );
      return {
        content: BraftEditor.createEditorState(props.content),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      content: BraftEditor.createEditorState(''),
      textValue: '',
    };
  }

  // 修改内容区域
  change = (value, key) => {
    const { onChange } = this.props;
    onChange && onChange({ [key]: value });
  };

  editContent = content => {
    this.setState({ content });
    this.change(content.toHTML(), 'html');
    console.log(content.toHTML(), '触发');
  };
  handleEditorChange = content => {
    console.log('数据变化');
    this.setState({ content });
    this.triggerChange(content);
  };
  triggerChange = editorState => {
    const { onChange } = this.props;
    if (onChange) {
      console.log(3333, editorState.toHTML());
      onChange({ html: editorState.toHTML() });
    }
  };

  // 上传前校验
  beforeUpload = file => {
    console.log('=============================================3');
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

  // 图片上传
  handleFileChange = obj => {
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
      const content = ContentUtils.insertMedias(this.state.content, [
        {
          type: 'IMAGE',
          url,
        },
      ]);
      console.log(content.toHTML(), 66666666);
      this.setState({ content });
      // // this.editContent(content);
      this.change(content.toHTML(), 'html');
    }
  };

  // 获取额外的功能入口
  getExtendControls = () => {
    const { langLib } = this.context;
    const acceptType = getFileAcceptType();
    return [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept={acceptType}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            action={query.EDITOR_UPLOAD}
            headers={{ token: getCookie('token') }}
            onChange={file => this.handleFileChange(file)}
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
    ];
  };

  render() {
    let {
      info: { title = '' },
    } = this.props;
    let { content } = this.state;
    console.log(content, content.toHTML(), 2);
    title = title ? title : '';
    const excludeControls = [
      'superscript',
      'subscript',
      'emoji',
      'list-ul',
      'list-ol',
      'blockquote',
      'code',
      'media',
      'separator',
    ];
    return (
      <Row>
        <Col className={`${Styles.row2} system__lineBorder`} span={24}>
          <BraftEditor
            value={content}
            excludeControls={excludeControls}
            // onBlur={this.editContent}
            onChange={this.handleEditorChange}
            extendControls={this.getExtendControls()}
            contentStyle={{ height: '300px', overflowY: 'scroll' }}
          />
        </Col>
      </Row>
    );
  }
}

export default Template;
