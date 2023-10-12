/**
* @name: index
* @author: DELL
* @date: 2023/6/29 11:18
* @description：index
* @update: 2023/6/29 11:18
*/
<!-- 页面 -->
<template>
  <div class="avatarBox" :style="avatarBoxStyles">
    <div
        v-for="(userInfo, i) in arr"
        class="user__circle"
        :key="i"
        :style="getStyles(userInfo, i)"
    >
      {{ firstLetter(userInfo) }}
    </div>
    <el-popover
        placement="top-start"
        width="220"
        trigger="hover"
        popper-class="flowChat"
    >
      <div>
        <div :class="{domMain: i+1 !== value.length, domMain2: i+1 === value.length}"
             v-for="(item, i) in value"
             :key="i"
        >
          <div class="operatorList">
            <UserHeadname :userInfo="{triggerUserName: item.userName }" prop="triggerUserName"/>
            <span class="actionTime m-l-10" v-if="item.actionTime">
            {{ item.actionTime.substring(0, 16) }}
          </span>
          </div>
          <div class="operatorStr" v-if="item.actionType">{{ operatorMap[item.actionType] }}</div>
          <el-divider class="divider" v-if="(i + 1) !== value.length"></el-divider>
        </div>
      </div>

      <div
          v-if="isNeedMore"
          slot="reference"
          class="user__circle more"
          :style="{left: `${arr.length * 16}px`, zIndex: 5}"
      >
        <span class="iconfont icon-gengduocaozuo"></span>
      </div>
    </el-popover>

  </div>
</template>

<script>
import { fontChange } from '_u/utils';

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
    splitLen: { // 截取數組的長度
      type: Number,
      default: 3
    },
    isNeedMore: { // 是否需要更多按鈕
      type: Boolean,
      default() {
        return true;
      }
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

  components: {},

  computed: {
    avatarBoxStyles() {
      const n = this.arr.length;
      return {
        width: `${16 * (n - 1) + 24}px`
      };
    },
    getStyles() {
      return function (userInfo, i) {
        return {
          background: `${this.colorIndex(userInfo)}`,
          left: `${i * 16}px`,
          zIndex: i
        };
      };
    },
    arr() {
      return this.value.slice(0, this.splitLen);
    },
    firstLetter() {
      return function (row) {
        const userName = row[this.nameKey];
        return fontChange(userName);
      };
    },
    colorIndex() {
      return function (row) {
        const colors = ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'];
        // 如果根据colorId没有获取到对应的值，则根据首字母
        const firstLetterUnicode = this.firstLetter(row)
            .charCodeAt(0); // 获取首字母的unicode码
        const index = firstLetterUnicode - 65; // 确定字母在26个字母中第几位，65代表A
        const colorIndex = index % 5;
        return colors[colorIndex] || '';
      };
    }
  },

  mounted() {
  },

  methods: {},
  name: 'index',
};
</script>

<style lang='scss' scoped>
.avatarBox {
  position: relative;
  height: 24px;
}

.domMain {
  padding: 0 0 10px 0;

  ::v-deep {
    .el-divider {
      margin: 5px 0 0 0;
      background: unset;
      border-bottom: 1px dashed #e9e9e9;
    }
  }
}

.domMain2 {
  padding: 0;

  ::v-deep {
    .el-divider {
      margin: 5px 0 0 0;
      background: unset;
      border-bottom: 1px dashed #e9e9e9;
    }
  }
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
  border: 1px solid #FFFFFF;
  font-size: 10px;
  color: #ffffff;
  overflow: hidden;
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
