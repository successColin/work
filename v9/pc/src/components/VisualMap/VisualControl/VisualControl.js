import { BaseContext } from '@/constants/global';
import { getStates, getVisualGroupList } from '@/services/visualMap';
import { Input, message, Select, Tooltip } from 'antd';
import { connect } from 'dva';
import { Component } from 'react';
const { Option } = Select;
const { Search } = Input;

@connect(state => ({
  canvasState: state.visualmap.canvasState,
}))
class VisualControl extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {
      canvasState: props.canvasState,
      drawType: props.drawType,
      fullScreenState: props.fullScreenState,
      visibleGroup: false,
      groupName: '',
      groupId: '',
      stateList: [], // 状态集合
      visualGroupList: [], // 图层分组列表
    };
    this.keydownEvent = null;
    this.keyupEvent = null;
    this.lastCanvasState = 'default';
    this.visualMapGroup = {};
  }

  componentDidMount() {
    this.onKeyDownMove();
    this.getStatesList();
    this.getVisualGroup();
    if (this.props.initVisualMapGroupID) {
      this.saveVisualMapGroupID(this.props.initVisualMapGroupID, 'init');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.canvasState !== this.state.canvasState) {
      this.setState({ canvasState: nextProps.canvasState });
    }
  }

  getVisualGroup = () => {
    getVisualGroupList().then(datalist => {
      this.setState({ visualGroupList: datalist });
    });
  };

  // 获取状态的集合，用于提示
  getStatesList = () => {
    getStates().then(res => {
      this.setState({ stateList: res });
    });
  };
  renderHelpList = () => {
    const { stateList = [] } = this.state;
    return stateList.map((item, index) => {
      return (
        <li key={item.id + index}>
          <span
            style={{
              width: '10px',
              height: '10px',
              display: 'inline-block',
              borderRadius: '50%',
              backgroundColor: item.colorCode,
            }}
          />
          {item.name}
        </li>
      );
    });
  };

  // DOM销毁时
  componentWillUnmount() {
    this.setVisualState({ canvasState: 'default', drawType: '' }); // 退出时重置状态
    this.keydownEvent();
    this.keyupEvent();
  }

  isAllow = () => {
    const { langLib } = this.context;
    if (!this.visualMapGroup.id) {
      message.warning(langLib['visual.select.group']); // lang: '请选择图层分组后再操作'
      return false;
    } else {
      return true;
    }
  };

  setVisualState = payload => {
    const { dispatch } = this.context;
    dispatch({
      type: 'visualmap/updateState',
      payload: payload,
    });
  };

  setFulllScreenState = () => {
    this.setVisualState({ fullScreenState: !this.state.fullScreenState });
    this.setState({ fullScreenState: !this.state.fullScreenState });
  };

  // 按住空格可以拖拽
  onKeyDownMove = () => {
    let isOnkeydown = false;
    this.keydownEvent = this.props.ownAddEventListener(window, 'keydown', e => {
      let keyCode = e.keyCode || e.which || e.charCode;
      if (!isOnkeydown && keyCode === 32) {
        isOnkeydown = true;
        this.lastCanvasState = this.state.canvasState;
        this.setVisualState({
          canvasState: 'move',
          drawType: this.state.drawType,
          controlStatus: 'changeCanvasModel',
        });
      }
    });
    this.keyupEvent = this.props.ownAddEventListener(window, 'keyup', e => {
      let keyCode = e.keyCode || e.which || e.charCode;
      if (keyCode === 32) {
        isOnkeydown = false;
        this.setVisualState({
          canvasState: this.lastCanvasState,
          drawType: this.state.drawType,
          controlStatus: 'changeCanvasModel',
        });
      }
    });
  };

  // 选择图层组ID
  setVisualMapGroupID = visualMapGroup => {
    this.visualMapGroup = { ...visualMapGroup };
  };

  // 确认图层组选择
  saveVisualMapGroupID = (initVisualMapGroupID = {}, type = 'loadCanvasData') => {
    this.setVisualState({
      visualMapGroupID: initVisualMapGroupID.id || this.visualMapGroup.id,
      userDesignerId: initVisualMapGroupID.userDesignerId || this.visualMapGroup.userDesignerId,
      controlStatus: type,
      visualLoading: true,
    });
    this.setVisualMapGroupID({
      id: initVisualMapGroupID.id,
      name: initVisualMapGroupID.name,
      userDesignerId: initVisualMapGroupID.userDesignerId,
    });
    this.setState({
      visibleGroup: false,
      groupName: initVisualMapGroupID.name || this.visualMapGroup.name,
      groupId: initVisualMapGroupID.id || this.visualMapGroup.id,
    });
  };
  // 确认图层组选择
  saveVisualMapGroupIDSelect = (value, option, type = 'loadCanvasData') => {
    this.setVisualState({
      visualMapGroupID: option.props.value || this.visualMapGroup.id,
      userDesignerId: option.props.userDesignerId || this.visualMapGroup.userDesignerId,
      controlStatus: type,
      visualLoading: true,
    });
    this.setVisualMapGroupID({
      id: option.props.value,
      name: option.props.name,
      userDesignerId: option.props.userDesignerId,
    });
    this.setState({
      visibleGroup: false,
      groupName: option.props.name || this.visualMapGroup.name,
      groupId: option.props.value || this.visualMapGroup.id,
    });
  };

  setDrawingMode = (type, drawType) => {
    if (!this.isAllow()) return;
    if (this.state.canvasState === type && this.state.drawType === drawType) {
      this.setVisualState({ canvasState: 'default', drawType, controlStatus: 'changeCanvasModel' });
      this.setState({ canvasState: 'default', drawType });
    } else {
      this.setVisualState({ canvasState: type, drawType, controlStatus: 'changeCanvasModel' });
      this.setState({ canvasState: type, drawType });
    }
  };
  visualMapGroupOpation = () => {
    const { visualGroupList } = this.state;
    const opation = visualGroupList.map(item => {
      return (
        <Option value={item.id} key={item.id} name={item.name} userDesignerId={item.userDesignerId}>
          {item.name}
        </Option>
      );
    });
    return opation;
  };

  render() {
    const { langLib } = this.context;
    const {
      canvasState,
      fullScreenState,
      visibleGroup,
      groupName,
      visualGroupList,
      groupId,
    } = this.state;
    const { updateFloatType, updateSpeakStatus, speakStatus } = this.props;
    return (
      <div className="visualControl system__contentbkgd system__lineBorder">
        <Select value={groupId} onChange={this.saveVisualMapGroupIDSelect} style={{ width: 140 }}>
          {this.visualMapGroupOpation()}
        </Select>
        {/* <Search
          value={groupName}
          readOnly
          placeholder={langLib['visual.select.layer'] }
          onSearch={() => this.setState({ visibleGroup: true })}
          style={{ width: 140 }}
        /> */}
        <span className="line">|</span>
        <Tooltip placement="bottom" title={langLib['visual.full.screen'] /* lang: "全屏"*/}>
          <span
            className={`iconfont ${
              fullScreenState ? 'icon-layer-exit-full-screen' : 'icon-layer-full-screen'
            } controlItem dataConfig`}
            onClick={() => this.setFulllScreenState()}
          />
        </Tooltip>
        <Tooltip placement="bottom" title={langLib['visual.control.mobile'] /* lang: "移动" */}>
          <span
            className={`iconfont icon-layer-move controlItem dataConfig ${
              canvasState === 'move' ? 'custom-color' : ''
            }`}
            onClick={() => this.setDrawingMode('move')}
          />
        </Tooltip>
        {/* <Popover
          placement="bottom"
          getPopupContainer={() => document.getElementById('main-container')}
          content={
            <ul className={hostPotPopover}>
              {this.renderHelpList()}
            </ul>
          }
          trigger="hover"
        > */}
        <Tooltip placement="bottom" title={langLib['visual.control.switch'] /* lang: "切换" */}>
          <span
            className="iconfont icon-qiehuan controlItem dataConfig"
            onClick={() => updateFloatType()}
          />
        </Tooltip>
        <Tooltip
          placement="bottom"
          title={
            speakStatus
              ? langLib['visual.control.noplay']
              : langLib['visual.control.play'] /* lang: "切换" */
          }
        >
          {speakStatus && (
            <span
              className="iconfont icon-bobao controlItem dataConfig"
              onClick={() => updateSpeakStatus()}
            />
          )}
          {!speakStatus && (
            <span
              className="iconfont icon-guanbibobao controlItem dataConfig"
              onClick={() => updateSpeakStatus()}
            />
          )}
        </Tooltip>
        {/* </Popover> */}
        {/* lang: "选择图层分组" */}
        {/* <CreateModal
          visible={visibleGroup}
          title={langLib['visual.control.layer.group']}
          onCancel={() => this.setState({ visibleGroup: false })}
          onOk={this.saveVisualMapGroupID}
        >
          <VisualGroup setVisualMapGroupID={this.setVisualMapGroupID} showType="grouplist"
                       selectedRowKeys={this.visualMapGroup.id}></VisualGroup>
        </CreateModal> */}
      </div>
    );
  }
}

export default VisualControl;
