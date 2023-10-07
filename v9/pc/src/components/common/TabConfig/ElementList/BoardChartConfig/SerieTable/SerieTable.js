/*
 * @Author: Fus
 * @Date:   2020-02-25 10:07:48
 * @Desc: 图表控件配置数据表格
 */
import {
  CInput,
  CMessage,
  ColorPicker,
  CSelect,
  CTable,
  CTextArea,
  SearchSelect,
} from '@/components/common/BasicWidgets';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import { CHART_TYPE } from '@/constants/homeChart';
import { deleteChartLine } from '@/services/homeChart';
import { getDefaultConfirmProps } from '@/utils/common';
import { Select } from 'antd';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './SerieTable.less';

const { Option } = Select;
// 图表类型
const chartTypeOption = Object.keys(CHART_TYPE).map(item => (
  <Option key={`chartType${item}`} value={+item}>
    <FormattedMessage id={CHART_TYPE[item].name} />
  </Option>
));

class SerieTable extends Component {
  static contextType = BaseContext;
  // 删除数据
  handleDelete = (id, index) => {
    const { langLib } = this.context;
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      onOk: () => {
        deleteChartLine({ id }).then(res => {
          CMessage(langLib['message.del.success']);
          const { chartList = [] } = this.props.eleObj;
          const newChartList = [...chartList];
          newChartList.splice(index, 1);
          this.props.setChartList(newChartList);
          closeModal();
        });
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
    // Modal.confirm({
    //   className: 'customConfirmColor',
    //   ...getDefaultConfirmProps(langLib),
    //   onOk: () => {
    //     return deleteChartLine({ id }).then(res => {
    //       CMessage(langLib['message.del.success']);
    //       const { chartList = [] } = this.props.eleObj;
    //       const newChartList = [...chartList];
    //       newChartList.splice(index, 1);
    //       this.props.setChartList(newChartList);
    //     });
    //   },
    // });
  };
  // 更新控件的sql数据
  setEleChartList = ({ key, value, chartRow, chartIndex }) => {
    const { eleObj, setChartList } = this.props;
    const { chartList = [] } = eleObj;
    const newChartList = [...chartList];
    newChartList.splice(chartIndex, 1, {
      ...chartRow,
      [key]: value,
    });
    setChartList(newChartList);
  };
  // 获取列名
  getColumns = () => {
    const { setRowData, eleObj, activeRowIndex } = this.props;
    const isChart = eleObj.showType === 3;
    const columns = [
      {
        dataIndex: 'chartType',
        title: <FormattedMessage id="chart.config.type" />,
        width: 100,
        ignore: !isChart,
        render: (text, chartRow, chartIndex) => (
          <CSelect
            defaultValue={text}
            style={{ width: '100%' }}
            onChange={value =>
              this.setEleChartList({
                key: 'chartType',
                value,
                chartRow,
                chartIndex,
              })
            }
          >
            {chartTypeOption}
          </CSelect>
        ),
      },
      {
        dataIndex: 'name',
        title: <FormattedMessage id="global.name" />,
        width: 200,
        render: (text, chartRow, chartIndex) => (
          <CInput
            defaultValue={text}
            onBlur={e =>
              this.setEleChartList({
                key: 'name',
                value: e.target.value,
                chartRow,
                chartIndex,
              })
            }
          />
        ),
      },
      {
        dataIndex: 'asqlWholeCondition',
        title: 'sql',
        render: (text, chartRow, chartIndex) => (
          <CTextArea
            defaultValue={text}
            autosize={{ minRows: 1 }}
            onBlur={e =>
              this.setEleChartList({
                key: 'asqlWholeCondition',
                value: e.target.value,
                chartRow,
                chartIndex,
              })
            }
          />
        ),
      },
      {
        dataIndex: 'axisUnitX',
        title: <FormattedMessage id="chart.config.xUnit" />,
        width: 90,
        ignore: !isChart,
        render: (text, chartRow, chartIndex) => (
          <CInput
            defaultValue={text}
            onBlur={e =>
              this.setEleChartList({
                key: 'axisUnitX',
                value: e.target.value,
                chartRow,
                chartIndex,
              })
            }
          />
        ),
      },
      {
        dataIndex: 'axisUnitY',
        title: <FormattedMessage id="chart.config.yUnit" />,
        width: 90,
        ignore: !isChart,
        render: (text, chartRow, chartIndex) => (
          <CInput
            defaultValue={text}
            onBlur={e =>
              this.setEleChartList({
                key: 'axisUnitY',
                value: e.target.value,
                chartRow,
                chartIndex,
              })
            }
          />
        ),
      },
      {
        dataIndex: 'iconId',
        title: <FormattedMessage id="element.icon" />,
        ignore: eleObj.showType !== 2,
        width: 100,
        render: (text, chartRow, chartIndex) => (
          <SearchSelect
            value={text || ''}
            modalContentType="icon"
            showType="icon"
            setSelected={selectedRows =>
              this.setEleChartList({
                key: 'iconId',
                value: (selectedRows[0] && selectedRows[0].id) || '',
                chartRow,
                chartIndex,
              })
            }
          />
        ),
      },
      {
        dataIndex: 'colorCode',
        title: <FormattedMessage id="settingForm.colorCode" />,
        width: 100,
        render: (text, chartRow, chartIndex) => (
          <ColorPicker
            placement="right"
            color={text || ''}
            handleSaveColor={value =>
              this.setEleChartList({
                key: 'colorCode',
                value,
                chartRow,
                chartIndex,
              })
            }
          >
            <CInput
              value={text || ''}
              onBlur={e =>
                this.setEleChartList({
                  key: 'colorCode',
                  value: e.target.value,
                  chartRow,
                  chartIndex,
                })
              }
            />
          </ColorPicker>
        ),
      },
      {
        dataIndex: 'ignore-operator',
        title: <FormattedMessage id="global.operator" />,
        width: 40,
        render: (text, record, index) => (
          <i
            className="iconfont custom-color icon-minus-border"
            onClick={() => this.handleDelete(record.id, index)}
          />
        ),
      },
    ];
    return columns.filter(item => !item.ignore);
  };

  render() {
    const { eleObj = {} } = this.props;
    const { chartList = [] } = eleObj;
    return (
      <CTable
        className={`${styles.table} system__border--none system__contentbkgd`}
        columns={this.getColumns()}
        dataSource={chartList}
        pagination={false}
        rowKey="id"
      />
    );
  }
}

export default SerieTable;
