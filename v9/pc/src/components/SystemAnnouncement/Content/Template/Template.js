import { Col, Row } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import Styles from './Template.less';

class Template extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.content !== state.content.toHTML()) {
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
    };
  }

  // 修改内容区域
  change = (value, key) => {
    const { onChange } = this.props;
    onChange && onChange({ [key]: value });
  };

  editContent = editorState => {
    this.setState({ content: editorState });
    this.change(editorState.toHTML(), 'content');
  };

  render() {
    let {
      info: { title = '' },
    } = this.props;
    let { content } = this.state;
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
            onBlur={this.editContent}
            contentStyle={{ height: '300px', overflowY: 'scroll' }}
          />
        </Col>
      </Row>
    );
  }
}

export default Template;
