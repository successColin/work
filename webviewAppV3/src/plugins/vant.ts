/** 
 *  @author TalkTao
 * @description  按需引入Vant
*/ 
import {
	Button, Cell, CellGroup,
	DropdownItem, DropdownMenu,
	Field, Form, Icon, Image, Lazyload, List, Loading,
	NavBar, Notify, Search, Sticky, Tab, Tabbar,
	TabbarItem, Tabs, Toast
} from 'vant';
const pluginsVant = [
	Button, 
	Tabbar,
	TabbarItem,
	Sticky,
	NavBar,
	Icon,
	Search,
	DropdownMenu,
	DropdownItem,
	Image,
	Lazyload,
	Tabs,
	Tab,
	Toast,
	Field,
	Cell,
	CellGroup,
	Form,
	List,
	Notify,
	Loading, 
]
export const vantPlugins = {
  	install: function(vm) {
    	pluginsVant.forEach((item:any) => {
      	vm.component(item.name, item);
    	});
  	}
};