/*
 * @Author: Fus
 * @Date:   2019-08-28 20:06:55
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-14 14:53:28
 * @Desc: 面板中的底部按钮栏
 */
import Styles from '@/components/Frames/FullListFrame/ContentContainer/DetailList/DetailList.less';
import { CButton } from '@/components/common/BasicWidgets';
import { BTN_ELEMENT_TYPE } from '@/constants/element';
import { Icon, Tooltip, Spin } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import React, { Component } from 'react';

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
}))
class FooterButton extends Component {
  // 校验是否有对应类型的权限
  validPermission = btn => {
    const { basetype, visiabled } = btn;
    const { actionType, functionData } = this.props;
    const { canadd, canmodify, candelete, canprint, canexport } = functionData.attributes;
    // 没有对应权限则不显示对应类型按钮
    switch (basetype) {
      case 4:
        return !!canadd && visiabled; // 新增权限
        break;
      case 5:
        return !!canmodify && visiabled; // 修改权限
        break;
      case 6:
        return !!candelete && visiabled; // 删除权限
        break;
      case 7: // 保存按钮与新增权限或修改权限相关
        return !!canmodify && visiabled;
        break;
      case 18:
        return !!canadd && visiabled; // 新增权限
        break;
      case 24:
        return !!canmodify && visiabled; // 修改权限
        break;
      case 26:
        return !!canmodify && visiabled; // 修改权限
      case 30:
        return !!canprint && visiabled; // 导出
      case 51:
        return !!canprint && visiabled; // 导出
      default:
        return false;
    }
  };
  // 生成按钮列表
  // 生成按钮
  renderBtnGroup = () => {
    const { tabInfo, elementMap, handleClickBtn, normalBtnInList } = this.props;
    let elementObj = elementMap[tabInfo.id];
    let btnArr =
      elementObj.filter(item => {
        return BTN_ELEMENT_TYPE.includes(item.basetype) && item.visiabled;
      }) || [];
    const btnSty = classNames({
      [Styles.divFlex]: this.props.checkboxType !== 'radio',
      [Styles.divFlex1]: this.props.checkboxType === 'radio',
    });
    const btnStyOne = classNames({
      [Styles.addNewBtn]: this.props.checkboxType !== 'radio',
      [Styles.addNewBtn1]: this.props.checkboxType === 'radio',
    });
    return btnArr.map(item => {
      const { basetype, labelIconColour, tooltipText = '' } = item;
      if (this.validPermission(item)) {
        switch (basetype) {
          case 4:
            return (
              <Tooltip placement="top" title={tooltipText}>
                <div className={btnSty} key={item.id} onClick={() => handleClickBtn(item)}>
                  <div className={btnStyOne}>
                    <Icon className={`${Styles.addnewBtnIco} custom-color`} type="plus-square" />
                    <span>{item.displayName}</span>
                  </div>
                </div>
              </Tooltip>
            );
          case 5:
            return (
              <Tooltip placement="top" title={tooltipText}>
                <div className={btnSty} key={item.id} onClick={() => handleClickBtn(item)}>
                  <div className={btnStyOne}>
                    <span className={`${Styles.commonIconStyle} custom-color iconEdit iconfont`} />
                    <span>{item.displayName}</span>
                  </div>
                </div>
              </Tooltip>
            );
          case 6:
            return (
              <Tooltip placement="top" title={tooltipText}>
                <div className={btnSty} key={item.id} onClick={() => handleClickBtn(item)}>
                  <div className={btnStyOne}>
                    <span
                      className={`${Styles.commonIconStyle} custom-color icondelete iconfont`}
                    />
                    <span>{item.displayName}</span>
                  </div>
                </div>
              </Tooltip>
            );
          case 18:
            return (
              <Tooltip placement="top" title={tooltipText}>
                <div className={btnSty} key={item.id} onClick={() => handleClickBtn(item)}>
                  <div className={btnStyOne}>
                    <Icon className={`${Styles.addnewBtnIco} custom-color`} type="plus-square" />
                    <span>{item.displayName}</span>
                  </div>
                </div>
              </Tooltip>
            );
          case 24:
            return (
                <div className={btnSty} key={item.id}>
                  <CButton
                    key={item.id}
                    onClick={() => handleClickBtn(item)}
                    loading={item.static_loading}
                    background={item.labelIconColour}
                    btnObj={item}
                    className={btnStyOne}
                    style={
                      labelIconColour
                        ? { background: labelIconColour, border: 0, color: '#fff' }
                        : null
                    }
                  >
                    {item.displayName}
                  </CButton>
                </div>
            );
          case 30:
            return (
              <Tooltip placement="top" title={tooltipText}>
                <div key={item.id} className={Styles.divFlex} onClick={() => handleClickBtn(item)}>
                  <div className={`${Styles.addNewBtn} globalAddNewBtn system__defaultButton`}>
                    <span
                      className={`${Styles.commonIconStyle} custom-color iconExport iconfont`}
                    />
                    <span>{item.displayName}</span>
                  </div>
                </div>
              </Tooltip>
            );
          case 51:
            return (
              <Tooltip placement="top" title={tooltipText}>
                <div key={item.id} className={Styles.divFlex} onClick={() => handleClickBtn(item)}>
                  <div className={`${Styles.addNewBtn} globalAddNewBtn system__defaultButton`}>
                    <span
                      className={`${Styles.commonIconStyle} custom-color iconExport iconfont`}
                    />
                    <span>{item.displayName}</span>
                  </div>
                </div>
              </Tooltip>
            );
          default:
            return null;
        }
      }
    });
  };

  render() {
    const { fromType } = this.props;
    return <div style={{ height: '42px', overflow: 'hidden' }}>{this.renderBtnGroup()}</div>;
  }
}

export default FooterButton;
