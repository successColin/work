import { set_MD } from '@/utils/ddUtils';
import { setWxConfig } from '@/utils/wxUtils';
import { mapState } from 'vuex';
export default {
  onShow() {
    this.zzdmd_start();
  },
  onLoad: function () {
    setWxConfig();
  },
  computed: {
    ...mapState(['username', 'userId', 'userInfo']),
  },
  methods: {
    zzdmd_start() {
      // #ifdef H5
      const ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('saas') > -1) {
        this.$nextTick(() => {
          if (this.userId) {
            const name =
              document.getElementsByClassName('bar-title')[0] &&
              document.getElementsByClassName('bar-title')[0].innerHTML;
            const meta = {
              name,
              pagePath: this.$route.path,
            };
            const dingUser = {
              nickName: this.username,
              userId: this.userId,
            };
            set_MD(meta, dingUser);
          }
        });
      }
      // #endif
    },
  },
};
