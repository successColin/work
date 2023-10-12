<!-- 页面 -->
<template>
  <div class="avatarBox">
    <div
      v-for="(userInfo, i) in arr"
      class="user__circle"
      :key="i"
      :style="getStyles(userInfo, i)"
    >
      {{ firstLetter(userInfo) }}
    </div>
    <lm-popover
      popper-class="flowChat"
      trigger="click"
      :left="arr.length * 16 + 'px'"
    >
      <div slot="content">
        <div
          :class="{
            domMain: i + 1 !== value.length,
            domMain2: i + 1 === value.length,
          }"
          v-for="(item, i) in value"
          :key="i"
        >
          <div class="operatorList">
            <UserHeadname
              :userInfo="{ triggerUserName: item.userName }"
              prop="triggerUserName"
            />
          </div>
          <div class="operatorStr m-t-5" v-if="item.actionTime">
            {{ item.actionTime.substring(0, 16) }}
          </div>
          <div class="operatorStr" v-if="item.actionType">
            {{ operatorMap[item.actionType] }}
          </div>
          <u-divider class="divider" v-if="i + 1 !== value.length"></u-divider>
        </div>
      </div>

      <div
        slot="reference"
        class="user__circle more"
        :style="{ left: `${arr.length * 16}px`, zIndex: 5 }"
      >
        <span class="appIcon appIcon-gengduo"></span>
      </div>
    </lm-popover>
  </div>
</template>

<script>
import { fontChange } from '@/utils/index';
import LmPopover from '../lmPopover/index';
import UserHeadname from '../UserHeadname/index';

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    dom: {
      type: Array
    },
    nameKey: {
      type: String,
      default: 'userName'
    }
  },
  data() {
    return {
      operatorMap: {
        1: '执行同意操作',
        2: '执行撤回操作',
        3: '执行驳回操作',
        4: '执行转审操作',
        5: '执行加签操作',
        6: '执行提交操作'
      }
    };
  },

  components: {
    LmPopover,
    UserHeadname
  },

  computed: {
    getStyles() {
      return function(userInfo, i) {
        return {
          background: `${this.colorIndex(userInfo)}`,
          left: `${i * 16}px`,
          zIndex: i
        };
      };
    },
    arr() {
      return this.value.slice(0, 3);
    },
    firstLetter() {
      return function(row) {
        const userName = row[this.nameKey];
        return fontChange(userName);
      };
    },
    colorIndex() {
      return function(row) {
        const colors = ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'];
        // 如果根据colorId没有获取到对应的值，则根据首字母
        const firstLetterUnicode = this.firstLetter(row).charCodeAt(0); // 获取首字母的unicode码
        const index = firstLetterUnicode - 65; // 确定字母在26个字母中第几位，65代表A
        const colorIndex = index % 5;
        return colors[colorIndex] || '';
      };
    }
  },

  mounted() {},

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.avatarBox {
  position: relative;
  display: flex;
}

.user__circle {
  position: absolute;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 23px;
  border-radius: 50%;
  text-align: center;
  background: #5a80ed;
  border: 1px solid #ffffff;
  font-size: 10px;
  color: #ffffff;
  box-sizing: border-box;

  &.more {
    background: rgba(187, 195, 205, 1);
  }
}
.operatorList {
  display: flex;
  align-items: center;
}
.operatorStr {
  height: 25px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 25px;
}

.actionTime {
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #808080;
}
</style>
