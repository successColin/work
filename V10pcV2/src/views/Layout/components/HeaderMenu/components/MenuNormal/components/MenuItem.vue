<template>
  <div class="menuItem m-l-5">
    <transition-group :name="transitionName">
      <div
        v-for="(val, i) in arr"
        :key="`${val && val.id}_${i}`"
        :title="val.menuName"
      >
        <div
          v-if="val.menuLevel === 1 && val.children"
          class="menuItem__title font__ellipsis"
        >
          {{ val.menuName }}
        </div>
        <!-- 三级菜单 -->
        <div
          v-if="val.menuLevel !== 1"
          class="menuItem__hover titBox"
          @click="handleClickMenu(val)"
        >
          <div style="flex: 1; line-height: 30px" class="font__ellipsis">
            {{ val.menuName }}
          </div>
          <collect-icon
            :isCollect="val.isCollect"
            @click.stop="handleChangeCollect(val)"
          ></collect-icon>
        </div>
        <menu-item
          v-else
          :arr="val.children"
          :handleClickMenu="handleClickMenu"
          :handleChangeCollect="handleChangeCollect"
          :transitionName="transitionName"
        ></menu-item>
        <!-- <div>
        <div style="flex: 1" class="font__ellipsis">
          {{ val.menuName }}
        </div>
        <collect-icon
          :isCollect="val.isCollect"
          @click.stop="handleChangeCollect(val)"
        ></collect-icon>
      </div> -->
      </div>
    </transition-group>
  </div>
</template>

<script>
import CollectIcon from '../../CollectIcon';

export default {
  name: 'MenuItem',
  props: {
    arr: {
      type: Array
    },
    handleClickMenu: {
      type: Function
    },
    handleChangeCollect: {
      type: Function
    },
    transitionName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  components: {
    CollectIcon
  },
  computed: {},
  watch: {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.menuItem {
  // 标题
  &__title {
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    margin-right: 32px;
    color: #333333;
    padding-left: 10px;
    display: flex;
    cursor: pointer;
    height: 34px;
    display: flex;
    align-items: center;
    flex: 1;
  }
  &__hover {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    margin-right: 32px;
    color: #666666;
    padding-left: 10px;
    display: flex;
    cursor: pointer;
    height: 34px;
    display: flex;
    align-items: center;
  }
}
.titBox {
  position: relative;
  &:after {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: $--color-primary;
    transform: scale(0, 1);
    transform-origin: 0% 50%;
    opacity: 0.1;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }

  &:hover {
    color: $--color-primary;
    transition: all 0.4s;
    i {
      transform: scale(1) !important;
    }
    &:after {
      transition: all 0.4s;
      transform: scale(1, 1);
    }
  }
}
</style>
