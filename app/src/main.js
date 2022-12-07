// 全局组件注册
import uView from 'uview-ui';
import Vue from 'vue';
import App from './App';
import platformConfig from './config/platformConfig';
import i18n from './i18n';
import store from './store';
import './utils/globalFunction';

import ApiotActionsheet from '@/globalComponents/ApiotActionsheet';
import ApiotBreadcrumb from '@/globalComponents/ApiotBreadcrumb';
import ApiotButton from '@/globalComponents/ApiotButton';
import ApiotButtonFont from '@/globalComponents/ApiotButton/ButtonFont.vue';
import ApiotChooseUser from '@/globalComponents/ApiotChooseUser';
import ApiotCountdown from '@/globalComponents/ApiotCountdown';
import ApiotListNodata from '@/globalComponents/ApiotListNodata';
import ApiotNavbar from '@/globalComponents/ApiotNavbar';
import ApiotRate from '@/globalComponents/ApiotRate';
import ApiotSwiper from '@/globalComponents/ApiotSwiper';
import ApiotTabbar from '@/globalComponents/ApiotTabbar';
import ApiotTabs from '@/globalComponents/ApiotTabs';
import ApiotUpload from '@/globalComponents/ApiotUpload';
import ApiotUploadCers from '@/globalComponents/ApiotUploadCers';
import ApiotUploadFiles from '@/globalComponents/ApiotUploadFiles';
import ApiotUserhead from '@/globalComponents/ApiotUserhead';
import ApiotModal from '@/globalComponents/Common/ApiotModal';
import ApiotPopup from '@/globalComponents/Common/ApiotPopup';
import ApiotProgressBar from '@/globalComponents/Common/ApiotProgressBar';
import ApiotPrompt from '@/globalComponents/Common/ApiotPrompt/ApiotPrompt';
import ApiotToast from '@/globalComponents/Common/ApiotToast';
import ApiotCheckbox from '@/globalComponents/FormComp/ApiotCheckbox';
import ApiotCheckboxS from '@/globalComponents/FormComp/ApiotCheckboxS';
import ApiotDataPicker from '@/globalComponents/FormComp/ApiotDataPicker';
import ApiotDatepicker from '@/globalComponents/FormComp/ApiotDatepicker';
import ApiotInput from '@/globalComponents/FormComp/ApiotInput';
import ApiotInputSearch from '@/globalComponents/FormComp/ApiotInput/ApiotInputSearch';
import ApiotMessageInput from '@/globalComponents/FormComp/ApiotMessageInput';
import ApiotRadio from '@/globalComponents/FormComp/ApiotRadio';
import ApiotSelectData from '@/globalComponents/FormComp/ApiotSelectData';
import ApiotSelectDown from '@/globalComponents/FormComp/ApiotSelectDown';
import ApiotTextarea from '@/globalComponents/FormComp/ApiotTextarea';

Vue.component('ApiotChooseUser', ApiotChooseUser);
Vue.component('ApiotSwiper', ApiotSwiper);
Vue.component('ApiotDataPicker', ApiotDataPicker);
Vue.component('ApiotListNodata', ApiotListNodata);
Vue.component('ApiotTabs', ApiotTabs);
Vue.component('ApiotButtonFont', ApiotButtonFont);
Vue.component('ApiotBreadcrumb', ApiotBreadcrumb);
Vue.component('ApiotPopup', ApiotPopup);
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
Vue.component('ApiotUploadFiles', ApiotUploadFiles);
Vue.component('ApiotUserhead', ApiotUserhead);
Vue.component('ApiotInputSearch', ApiotInputSearch);
Vue.component('ApiotModal', ApiotModal);
Vue.component('ApiotActionsheet', ApiotActionsheet);
Vue.component('ApiotTextarea', ApiotTextarea);
Vue.component('ApiotUploadCers', ApiotUploadCers);
Vue.component('ApiotCheckboxs', ApiotCheckboxS);
Vue.component('ApiotToast', ApiotToast);
Vue.component('ApiotPrompt', ApiotPrompt);
Vue.component('ApiotProgressBar', ApiotProgressBar);
Vue.component('ApiotRate', ApiotRate);

Vue.use(uView);
Vue.config.productionTip = false;
Vue.prototype._i18n = i18n;
Vue.prototype.$store = store;
Vue.prototype.$platformConfig = platformConfig;

App.mpType = 'app';

const app = new Vue({
  i18n,
  store,
  ...App,
});
app.$mount();
