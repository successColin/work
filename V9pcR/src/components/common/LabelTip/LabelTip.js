import CTooltip from '@/components/common/BasicWidgets/Widgets/CTooltip/CTooltip';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import { getElementHelpConfig } from '@/services/pageConfig';
import { Col, Row } from 'antd';
import React, { Component } from 'react';
import Zmage from 'react-zmage';
import Styles from './LabelTip.less';

class LabelTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      zoomVisible: false,
      elementHelpConfig: [],
    };
  }

  // 获取帮助配置
  setHelpShwo = () => {
    const {
      eleObj: { id },
    } = this.props;
    getElementHelpConfig({ id }).then(res => {
      this.setState({ visible: true, elementHelpConfig: res });
    });
    this.setState({ visible: true });
  };
  // 预览
  show = (baseType, url) => {
    this.setState({
      zoomVisible: true,
      baseType,
      url,
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
  getShowContent = () => {
    const { elementHelpConfig } = this.state;
    const getUrl = path => {
      return (
        '/' +
        path
          .split('/')
          .slice(3)
          .join('/')
      );
    };
    const preViewType = ['gif', 'jpg', 'png', 'pdf'];
    const memoObj = elementHelpConfig.find(item => item.basetype === 1);
    const vedio = elementHelpConfig.find(item => item.basetype === 2);
    const imageList = elementHelpConfig.filter(item => item.basetype === 3) || [];
    const fileList = elementHelpConfig.filter(item => item.basetype === 4) || [];
    return (
      <div className={Styles.wrap}>
        {!!memoObj && (
          <Row className={Styles.rowWrap}>
            {/* <Col className={Styles.ColWrap} span={3}><FormattedMessage id='help.text.message' /></Col> */}
            <Col span={20} offset={1} onClick={e => e.stopPropagation()}>
              <div
                dangerouslySetInnerHTML={{
                  __html: memoObj.memo && memoObj.memo.replace(/\n/g, '<br/>'),
                }}
              />
            </Col>
          </Row>
        )}
        {!!vedio && (
          <Row className={Styles.rowWrap}>
            {/* <Col className={Styles.ColWrap} span={3}><FormattedMessage id='help.video.message' /></Col> */}
            <Col span={20} offset={1}>
              <span className={Styles.position} onClick={() => this.show(2, vedio.filePath)}>
                <video className={Styles.borderBox} src={vedio.filePath} />
                <a className={`${Styles.down}`} href={getUrl(vedio.filePath)} download={vedio.name}>
                  <i className="iconfont iconDown" />
                </a>
              </span>
            </Col>{' '}
          </Row>
        )}
        {!!imageList.length && (
          <Row className={Styles.rowWrap}>
            {/* <Col className={Styles.ColWrap} span={3}><FormattedMessage id='help.image.message' /></Col> */}
            <Col span={20} offset={1}>
              {imageList.map(item => {
                return (
                  <span
                    key={item.id}
                    onClick={() => this.show(3, item.filePath)}
                    className={`${Styles.position}`}
                  >
                    <img className={Styles.borderBox} src={item.filePath} alt="" />
                    <a
                      className={`${Styles.down}`}
                      href={getUrl(item.filePath)}
                      download={item.name}
                    >
                      <i className="iconfont iconDown" />
                    </a>
                  </span>
                );
              })}
            </Col>
          </Row>
        )}
        {!!fileList.length && (
          <Row className={Styles.rowWrap}>
            {/* <Col className={Styles.ColWrap} span={3}><FormattedMessage id='help.flie.message' /></Col> */}
            <Col span={20} offset={1}>
              {
                <ul>
                  {fileList.map((item, index) => {
                    const { name = '', filePath } = item;
                    const formTypeArr = name ? name.split('.') : [];
                    const type = formTypeArr[formTypeArr.length - 1];
                    const config = this.getFileTypeClassName(type);
                    const newurl = filePath ? getUrl(filePath) : '';
                    const relUrl = preViewType.includes(type) ? filePath : newurl;
                    return (
                      <li className={Styles.fileWrap} key={index}>
                        <a href={relUrl} download={name} target="_blank">
                          <i
                            className={`iconfont ${Styles.iconWrap} ${config.name}`}
                            style={{ color: config.color }}
                          />

                          <p className={Styles.fileName} title={name}>
                            {name}
                          </p>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              }
            </Col>
          </Row>
        )}
      </div>
    );
  };

  render() {
    const { eleObj, iconType = 'end' } = this.props;
    const { visible, zoomVisible, baseType, url } = this.state;
    const { helpConfig, tooltipText, displayName } = eleObj;
    const helpIconStyle = {
      marginRight: '3px',
      cursor: 'pointer',
      verticalAlign: 'bottom',
    };
    const label = tooltipText ? (
      <CTooltip title={tooltipText}>{displayName}</CTooltip>
    ) : (
      displayName
    );
    return (
      <>
        {helpConfig === 1 && iconType === 'start' && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              this.setHelpShwo();
            }}
            style={helpIconStyle}
            className="custom-color iconfont icon-help-bold"
          />
        )}
        <span>{label}</span>
        {helpConfig === 1 && iconType === 'end' && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              this.setHelpShwo();
            }}
            style={helpIconStyle}
            className="custom-color iconfont icon-help-bold"
          />
        )}
        <span onClick={(e) => e.stopPropagation()}>
          <CreateModal
            visible={visible}
            footer={null}
            title={'帮助说明'}
            onCancel={() => this.setState({ visible: false })}
          >
            {this.getShowContent()}
          </CreateModal>
          <CreateModal
            visible={zoomVisible}
            footer={null}
            onCancel={() => this.setState({ zoomVisible: false })}
          >
            {baseType === 2 && (
              <video style={{ width: '100%', height: '100%' }} src={url} controls="controls">
                your browser does not support the video tag
              </video>
            )}
            {baseType === 3 && (
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
                src={url}
              />
            )}
          </CreateModal>
        </span>
      </>
    );
  }
}

export default LabelTip;
