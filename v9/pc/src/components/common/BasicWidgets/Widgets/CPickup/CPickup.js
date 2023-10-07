/*
 * @Author: ytx
 * @Date:   2019-06-29 14:56:52
 * @Last Modified by: ytx
 * @Last Modified time: 2022-03-05 11:29:19
 * @Desc: 基于antd的Select封装，颜色拾取器
 */
import touming from '@/assets/touming.png';
import { CButton, CSelect } from '@/components/common/BasicWidgets';
import { Input, Select } from 'antd';
import { Component } from 'react';
import styles from '../../index.less';

const { Option } = Select;

class CPickup extends Component {
  state = {
    inputValue: '',
    isOpen: false,
  };
  // input 发生变化的时候
  changeInputValue = v => {
    this.setState({ inputValue: v });
  };
  // 点击出来
  handleFocus = e => {
    this.setState({ isOpen: true });
  };
  // 选择颜色
  handleChooseColor = v => {
    this.setState({ inputValue: v });
  };
  // 确定
  handleOk = () => {
    this.setState({ isOpen: false });
    const { getSelectColor, field, activeRow, activeRowIndex } = this.props;
    const { inputValue: value } = this.state;
    //  点击确定把数据回传
    getSelectColor(field, value, activeRow, activeRowIndex);
  };
  // 取消
  handleCancel = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { activeRow, field, selectColorArr = [], fontColor = [] } = this.props;
    console.log('111111111', field);
    const { inputValue, isOpen } = this.state;
    const colorArr = [...selectColorArr, ...fontColor];
    return (
      <div style={{ position: 'relative' }}>
        {/* 颜色值 */}
        <div
          className={styles.selectColor}
          style={{
            background: activeRow[field] === '' ? `url(${touming}) no-repeat` : activeRow[field],
          }}
        />
        <CSelect
          open={isOpen}
          onFocus={e => this.handleFocus(e)}
          onChange={value => {
            this.handleChooseColor(value);
          }}
          dropdownRender={menu => (
            <div>
              {menu}
              <Input
                className={styles.selectColor__input}
                onChange={e => {
                  this.changeInputValue(e.target.value);
                }}
                value={inputValue}
              />

              <footer className={styles.selectColor__footer}>
                <CButton
                  className={styles.selectColor__button}
                  style={{ marginRight: '10px' }}
                  onClick={() => this.handleCancel()}
                >
                  取消
                </CButton>
                <CButton
                  className={styles.selectColor__button}
                  type="primary"
                  onClick={() => this.handleOk()}
                >
                  确定
                </CButton>
              </footer>
            </div>
          )}
        >
          {colorArr.map(item => {
            return (
              <Option key={item} value={item} className={styles.selectColor__option}>
                <div
                  className={styles.selectColor__option__div}
                  style={{
                    height: '18px',
                    background: item === '' ? `url(${touming}) no-repeat` : item,
                  }}
                />
              </Option>
            );
          })}
        </CSelect>
      </div>
    );
  }
}

export default CPickup;
