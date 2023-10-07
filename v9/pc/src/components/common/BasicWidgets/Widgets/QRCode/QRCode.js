/*
 * @Author: jwk
 * @Date:   2020-11-10 11:45:17
 * @Desc: 二维码组件
 */
import { Popover } from 'antd';
import JsBarcode from 'jsbarcode';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './QRCode.less';

const QRcode = require('qrcode.react');

class QRCode extends Component {
  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props.valueObj) !== JSON.stringify(state.value)) {
      return { value: props.valueObj };
    }
    return null;
  }

  state = {
    isOver: false, // 默认移除
    value: '',
  };

  componentDidMount() {
    console.log('did');
  }

  // 设置颜色
  setIsOverState = () => {
    this.setState({ isOver: !this.state.isOver });
  };
  // 渲染二维码还是条形码
  renderDom = () => {
    const { eleObj = {} } = this.props;
    const { elementFormat = 1, valueFieldType = 1 } = eleObj;
    const { value = {} } = this.state;
    let val = valueFieldType === 2 ? value.id : value.name;
    const jsbar = <svg id="QRcodeSvg" />;
    return elementFormat === 2 ? jsbar : <QRcode value={`${val}`} />;
  };
  // 显示隐藏的回调
  onVisibleChange = visible => {
    const { eleObj = {} } = this.props;
    const { elementFormat = 1, valueFieldType = 1 } = eleObj;
    const { value = {} } = this.state;
    let val = valueFieldType === 2 ? value.id : value.name;
    elementFormat === 2 && document.getElementById('QRcodeSvg') && JsBarcode('#QRcodeSvg', val);
  };

  render() {
    const { isOver } = this.state;
    const dom = this.renderDom();
    console.log(this.props);
    return (
      <div className={`${styles.QRCodeWrap} system__contentbkgd system__lineBorder`}>
        <Popover
          overlayClassName={styles.popoverWrap}
          placement="bottom"
          onMouseEnter={() => this.setIsOverState()}
          onMouseLeave={() => this.setIsOverState()}
          content={dom}
          onVisibleChange={() => this.onVisibleChange()}
        >
          <div className={styles.qrWrap}>
            <i className={`iconfont icon-app-qb ${isOver ? styles.colorBg : ''}`} />
          </div>
        </Popover>
        <div className={styles.title}>
          <FormattedMessage id="code.qr.viewtheQRcode" />
        </div>
      </div>
    );
  }
}

export default QRCode;
