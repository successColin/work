// 全局组件注册
import ApiotButton from '@/globalComponents/ApiotButton';
import ApiotButtonFont from '@/globalComponents/ApiotButton/ButtonFont.vue';
import uView from 'uview-ui';
import Vue from 'vue';
import App from './App';
import platformConfig from './config/platformConfig';
import ApiotActionsheet from './globalComponents/ApiotActionsheet';
import ApiotBreadcrumb from './globalComponents/ApiotBreadcrumb';
import ApiotCheckbox from './globalComponents/ApiotCheckbox';
import ApiotCheckboxS from './globalComponents/ApiotCheckboxS';
import ApiotCountdown from './globalComponents/ApiotCountdown';
import ApiotDatepicker from './globalComponents/ApiotDatepicker';
import ApiotInput from './globalComponents/ApiotInput';
import ApiotInputSearch from './globalComponents/ApiotInput/ApiotInputSearch';
import ApiotMenu from './globalComponents/ApiotMenu/TabMain';
import ApiotMessageInput from './globalComponents/ApiotMessageInput';
import ApiotModal from './globalComponents/ApiotModal';
import ApiotNavbar from './globalComponents/ApiotNavbar';
import ApiotPoint from './globalComponents/ApiotPoint';
import ApiotPopup from './globalComponents/ApiotPopup';
import ApiotConfirmModal from './globalComponents/ApiotPrompt/ApiotConfirmModal';
import ApiotPrompt from './globalComponents/ApiotPrompt/ApiotPrompt';
import ApiotTipPrompt from './globalComponents/ApiotPrompt/ApiotTipPrompt';
import ApiotRadio from './globalComponents/ApiotRadio';
import ApiotSelectData from './globalComponents/ApiotSelectData';
import ApiotSelectDown from './globalComponents/ApiotSelectDown';
import ApiotTabbar from './globalComponents/ApiotTabbar';
import ApiotTextarea from './globalComponents/ApiotTextarea';
import ApiotToast from './globalComponents/ApiotToast';
import ApiotUpload from './globalComponents/ApiotUpload';
import ApiotUploadCers from './globalComponents/ApiotUploadCers';
import ApiotUserhead from './globalComponents/ApiotUserhead';
import i18n from './i18n';
import store from './store';
import './utils/globalFunction';

Vue.use(uView);
Vue.config.productionTip = false;
Vue.prototype._i18n = i18n;
Vue.prototype.$store = store;
Vue.prototype.$platformConfig = platformConfig;

Vue.component('ApiotButtonFont', ApiotButtonFont);
Vue.component('ApiotBreadcrumb', ApiotBreadcrumb);
Vue.component('ApiotPopup', ApiotPopup);
Vue.component('ApiotPoint', ApiotPoint);
Vue.component('ApiotInput', ApiotInput);
Vue.component('ApiotDatepicker', ApiotDatepicker);
Vue.component('ApiotCheckbox', ApiotCheckbox);
Vue.component('ApiotButton', ApiotButton);
Vue.component('ApiotNavbar', ApiotNavbar);
Vue.component('ApiotTabbar', ApiotTabbar);
Vue.component('ApiotCountdown', ApiotCountdown);
Vue.component('ApiotMessageInput', ApiotMessageInput);
Vue.component('ApiotRadio', ApiotRadio);
Vue.component('ApiotSelectData', ApiotSelectData);
Vue.component('ApiotSelectDown', ApiotSelectDown);
Vue.component('ApiotUpload', ApiotUpload);
Vue.component('ApiotUserhead', ApiotUserhead);
Vue.component('ApiotInputSearch', ApiotInputSearch);
Vue.component('ApiotMenu', ApiotMenu);
Vue.component('ApiotModal', ApiotModal);
Vue.component('ApiotActionsheet', ApiotActionsheet);
Vue.component('ApiotTextarea', ApiotTextarea);
Vue.component('ApiotUploadCers', ApiotUploadCers);
Vue.component('ApiotCheckboxs', ApiotCheckboxS);
Vue.component('ApiotToast', ApiotToast);
Vue.component('ApiotPrompt', ApiotPrompt);
Vue.component('ApiotConfirmModal', ApiotConfirmModal);
Vue.component('ApiotTipPrompt', ApiotTipPrompt);

App.mpType = 'app';

const app = new Vue({
  i18n,
  store,
  ...App,
});
app.$mount();
