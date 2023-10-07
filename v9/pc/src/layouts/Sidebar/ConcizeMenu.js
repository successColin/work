/*
 * @Author: Fus
 * @Date:   2020-02-18 13:53:37
 * @Desc: 简约菜单
 */
import { BaseContext } from '@/constants/global';
import { Layout, Menu } from 'antd';
import classNames from 'classnames';
import { Component } from 'react';
import styles from './ConcizeMenu.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

class ConcizeMenu extends Component {
  static contextType = BaseContext;
  state = {
    collapsed: false,
    openKeys: [], // 选中的菜单
  };
  // 菜单列表
  getMenuItem = data => {
    const { collapsed } = this.state;
    const { handleClickMenu } = this.props;
    return data.map((item, index) => {
      let { children, id, name, iconName, frameBaseType, rootpath } = item;
      const level = rootpath.match(/\//gi).length;
      console.log(iconName, '图标名称', name);
      // const functionIconName =
      //   !iconName || iconName.indexOf('_function') === -1 ? 'basic_function' : iconName;
      const functionIconName = !iconName ? `mark-menu-${(index % 10) + 1}` : iconName;
      const iconCls = classNames({
        iconfont: true,
        // 'custom-color': true,
        [`icon-${functionIconName}`]: level === 2,
        [styles.functionBlock]: level > 2,
      });
      const nameCls = classNames({
        [styles.name]: true,
        [styles.rootHideName]: level === 2 && collapsed,
      });
      if (children.length) {
        return (
          <SubMenu
            key={`${id}`}
            title={
              <span
                onClick={() => this.handleSelectMenu({ item, frameBaseType })} // 7 为仅作为父级，点击不打开tab
              >
                <i className={iconCls} />
                <span className={nameCls}>{name}</span>
                {/* {((!collapsed && level === 2) || (collapsed && level !== 2)) && <span>{name}</span>} */}
              </span>
            }
          >
            {this.getMenuItem(children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={`menu_${id}`} onClick={e => handleClickMenu(item)} title={name}>
          {level === 2 && <i className={iconCls} />}
          <span className={nameCls}>{name}</span>
          {/* {((!collapsed && level === 2) || (collapsed && level !== 2)) && <span title={name}>{name}</span>} */}
        </Menu.Item>
      );
    });
  };
  // 只展开一层
  onOpenChange = (openKeys = []) => {
    const { functionList = [] } = this.props;
    const fatherNodes = openKeys.filter(item => functionList.find(obj => obj.id === +item));
    if (fatherNodes.length >= 2) {
      const index = openKeys.findIndex(item => item === fatherNodes[0]);
      openKeys.splice(index, 1);
    }
    this.setState({
      openKeys: [...openKeys],
    });
  };
  // 点击父级菜单做的处理
  handleSelectMenu = ({ frameBaseType, item }) => {
    const { handleClickMenu } = this.props;
    frameBaseType !== 7 && handleClickMenu(item);
  };
  // 展开折叠菜单
  onCollapse = () => {
    const { openKeys, collapsed } = this.state;
    this.setState({ collapsed: !collapsed, openKeys: collapsed ? openKeys : [] });
  };

  render() {
    const { functionList = [] } = this.props;
    const { collapsed } = this.state;
    const wrapCls = classNames({
      [styles.wrap]: true,
      'custom-concize-menu': true,
      [styles.collapsedWrap]: collapsed,
      system__inputbkgd: true,
      system__menuTitle: true,
    });
    const triggerCls = classNames({
      triggerSidebar: true,
      collapsed: collapsed,
    });
    const triggerIconCls = classNames({
      iconfont: true,
      'icon-menu-collapsed': collapsed,
      'icon-menu-uncollapsed': !collapsed,
    });
    return (
      <Sider
        className={wrapCls}
        collapsible
        collapsed={collapsed}
        onCollapse={this.onCollapse}
        trigger={null}
      >
        <div className={triggerCls} onClick={this.onCollapse}>
          <i className={triggerIconCls} />
        </div>
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          className={styles.menu}
          onOpenChange={this.onOpenChange}
          openKeys={this.state.openKeys}
        >
          {this.getMenuItem(functionList)}
        </Menu>
      </Sider>
    );
  }
}

export default ConcizeMenu;
