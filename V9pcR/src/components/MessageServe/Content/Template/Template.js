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
  // 点击左边添加到右边内容区域
  addRowToContent = rowContent => {
    const {
      info: { content = '' },
      onChange,
    } = this.props;
    let n = content.length;
    let newContent =
      (content && n > 4 ? content.substring(0, n - 4) : '') + '{@@' + rowContent + '}</p>';
    onChange && onChange({ content: newContent });
  };
  // 渲染列表
  renderList = () => {
    const {
      info: { columns = '' },
    } = this.props;
    if (!columns) return null;
    let list = columns.split('|');
    return list.map((item, index) => {
      return (
        <li onClick={() => this.addRowToContent(item)} key={index}>
          {item}
        </li>
      );
    });
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
      <div>
        <Row>
          <Col
            className={`${Styles.row3} ${Styles.row1} system__lineBorder system__fontColor`}
            span={4}
          >
            列名
          </Col>
          <Col className={`${Styles.row1} system__lineBorder system__contentbkgd`} span={20}>
            <input
              placeholder="请输入模板内容标题"
              value={title}
              onChange={e => this.change(e.target.value, 'title')}
              type="text"
              className={`${Styles.input} system__input`}
            />
          </Col>
        </Row>
        <Row>
          <Col
            className={`${Styles.row2} ${Styles.row4} system__lineBorder system__fontColor`}
            span={4}
          >
            {this.renderList()}
          </Col>
          <Col className={`${Styles.row2} system__lineBorder`} span={20}>
            {/*<textarea placeholder="请输入模板正文" value={content} onChange={e => this.change(e.target.value, 'content')}*/}
            {/*          className={Styles.textarea}*/}
            {/*          name="" id=""*/}
            {/*          cols="30" rows="10"></textarea>*/}
            <BraftEditor
              value={content}
              excludeControls={excludeControls}
              onBlur={this.editContent}
              contentStyle={{ height: '300px', overflowY: 'scroll' }}
              stripPastedStyles={true}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Template;
