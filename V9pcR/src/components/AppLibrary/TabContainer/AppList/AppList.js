/*
 * @Author: Fus
 * @Date:   2019-09-09 14:34:29
 * @Desc: APP列表
 */
import AppHomeConfig from '@/components/AppHomeConfig/AppHomeConfig';
import { CMessage, CSpin } from '@/components/common/BasicWidgets';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import { deleteAPP } from '@/services/appLibrary';
import { getDefaultConfirmProps } from '@/utils/common';
import { Col, Row } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './AppList.less';

class AppList extends Component {
  static contextType = BaseContext;
  state = {
    visibleAppConfig: false, // APP配置弹框
    activeAppData: {}, // 当前APP数据
  };
  // 删除APP
  handleDelete = record => {
    const { langLib } = this.context;
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      onOk: () => {
        const { id } = record;
        deleteAPP({ id }).then(res => {
          CMessage(langLib['message.del.success']);
          this.props.fetchAppList();
          closeModal();
        });
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
    // Modal.confirm({
    //   ...getDefaultConfirmProps(langLib),
    //   onOk: () => {
    //     const { id } = record;
    //     return deleteAPP({ id }).then(res => {
    //       CMessage(langLib['message.del.success']);
    //       this.props.fetchAppList();
    //     });
    //   },
    //   className: 'customConfirmColor',
    // });
  };
  handleCloseModal = () => {
    this.setState({ visibleAppConfig: false });
    this.context.dispatch({
      type: 'appHomeConfig/clearState',
    });
  };

  render() {
    const { handleOpenAdd, appList, loading, functionData } = this.props;
    const { canmodify, canadd, candelete } = functionData.attributes;
    const { visibleAppConfig, activeAppData } = this.state;
    const settingIconCls = classNames({
      [styles.icon]: true,
      iconfont: true,
      'icon-app-setting': true,
    });
    const downIconCls = classNames({
      [styles.icon]: true,
      iconfont: true,
      iconDown: true,
    });
    const delIconCls = classNames({
      [styles.icon]: true,
      iconfont: true,
      'icon-del': true,
    });
    const editIconCls = classNames({
      [styles.editIcon]: true,
      iconfont: true,
      iconEdit: true,
    });
    const cardCls = classNames({
      [styles.card]: true,
      'app-card': true,
      system__lineBorder: true,
      system__appListHover: true,
      system__inputbkgd: true,
    });
    const editIconWrapCls = classNames({
      [styles.editIconWrap]: true,
      editWrap: true,
      system__editIconWrap: true,
      system__appList: true,
      system__appEditIconWrap: true,
    });
    const renderApp =
      appList &&
      appList.map(item => (
        <Col span={8} key={`app_${item.id}`}>
          <div className={`${cardCls} system__template`}>
            <div className={styles.info}>
              <i className="iconfont icon-app" />
              <div className={styles.desc}>
                <p className={`${styles.title} system__fontColor--must`}>{item.name}</p>
                <p className="system__fontColor--must">
                  <FormattedMessage id="appLibrary.version" />：{item.version}
                </p>
                <p className="system__fontColor--must">
                  <FormattedMessage id="appLibrary.downLoadCount" />：{item.downloadNum || 0}
                </p>
                <p className="system__fontColor--must">
                  <FormattedMessage id="appLibrary.expireTime" />：
                  {item.overdueDate ? moment(item.overdueDate).format('YYYY-MM-DD') : ''}
                </p>
              </div>
            </div>
            <div className={`${styles.operator} system__lineBorder--top`}>
              <i className={settingIconCls} onClick={() => handleOpenAdd(true, item)} />
              {/* <Popover placement="bottom" title={null} content="图片"> */}
              {/* <i className={downIconCls}/> */}
              {/* </Popover> */}
              {candelete ? (
                <i className={delIconCls} onClick={() => this.handleDelete(item)} />
              ) : null}
              {canmodify ? (
                <span
                  className={editIconWrapCls}
                  onClick={() => this.setState({ visibleAppConfig: true, activeAppData: item })}
                >
                  <span className={editIconCls} />
                </span>
              ) : null}
            </div>
          </div>
        </Col>
      ));
    return (
      <div className={`${styles.cardWrap}`}>
        {appList && appList.length ? (
          <CSpin spinning={loading}>
            <Row gutter={16}>{renderApp}</Row>
          </CSpin>
        ) : (
          <span>
            <FormattedMessage id="global.noData" />
          </span>
        )}
        <CreateModal
          visible={visibleAppConfig}
          className={styles.modal}
          title={<FormattedMessage id="appHomeConfig.modal.title" />}
          onCancel={this.handleCloseModal}
          size="large"
          footer={null}
        >
          <AppHomeConfig appData={activeAppData} />
        </CreateModal>
      </div>
    );
  }
}

export default AppList;
