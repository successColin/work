<template>
  <ul
    class="sysModule comp"
    @click.stop="selectActive"
    :class="[{ borderLight: config.compId === activeObj.compId }]"
  >
    <li
      class="sysModule__li"
      v-for="(item, index) in moduleArr"
      :key="index"
      v-show="config[item.key]"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<script>
import compMixin from '../comp';

export default {
  mixins: [compMixin],
  data() {
    return {
      moduleArr: [
        { name: '修改密码', key: 'enableChangePas' },
        { name: '关于版本', key: 'enableAboutVersion' },
        { name: '我的二维码', key: 'enableQrCode' },
        { name: '清空缓存', key: 'enableClearCache' },
        { name: '注销登录', key: 'enableLogin' },
        { name: '意见反馈', key: 'enableFeedback' }
        // { name: '多语言切换', key: 'enableChangeLang' }
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../comp.scss';
.sysModule {
  &__li {
    font-size: 13px;
    font-weight: 400;
    color: #333333;
    line-height: 36px;
    padding-left: 12px;
  }
}
</style>
