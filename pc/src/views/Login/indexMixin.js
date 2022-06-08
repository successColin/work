export default {
  data() {
    return {
      // 是否显示表单：true：是；false：显示扫码
      isShowLoginForm: true,
    };
  },
  mounted() {
    // const token = localStorage.getItem('token');
    // // console.log(token !== null);
    // if (token !== null && token !== 'undefined' && token !== '') this.$router.push('/');
    sessionStorage.removeItem('login__forgotpswd');
    sessionStorage.removeItem('login__register');
    // 如果切换用户时，得清除最近访问菜单
    sessionStorage.removeItem('recentlyTabArr');
    // sessionStorage.clear();
  },
  methods: {
    // form 和 扫码切换
    handleSwitchLogin() {
      this.isShowLoginForm = !this.isShowLoginForm;
    },
  },
};
