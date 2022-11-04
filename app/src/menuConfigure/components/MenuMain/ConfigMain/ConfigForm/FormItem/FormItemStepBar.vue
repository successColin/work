<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-进度条
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span>
        <slot name="elTilte"></slot>
      </view>
      <view class="elementContent">
        <ul class="list">
          <li
            class="list-item animated fadeIn"
            v-for="(item, listindex) in stepsArr"
            :key="listindex"
            :class="[getStatus(item, listindex)]"
          >
            <view class="list-item-icon">
              <view
                class="icon-box"
                :class="[`themeColor__bg-${getThemeIndex}`]"
                v-if="item.userName"
              >
                {{ listindex + 1 }}
              </view>
              <view
                class="circle"
                :class="[
                  `themeColor__border-${getThemeIndex}`,
                  `themeColor__font-${getThemeIndex}`,
                ]"
                v-else
                >{{ listindex + 1 }}</view
              >
              <view
                class="line"
                :class="[`themeColor__bg-${getThemeIndex}`]"
                v-if="listindex < dictValue.length - 1"
              ></view>
            </view>
            <view class="list-item-content">
              <view class="progress-state">
                {{ item.name }}
              </view>
              <view class="progress-fixed"
                ><span>{{ item.userName }}</span></view
              >
              <view class="others">{{ item.createTime }}</view>
            </view>
          </li>
        </ul>
        <!-- <u-steps :current="stepValue" direction="column">
          <u-steps-item v-for="(item, listindex) in stepsArr" :key="listindex"
            :title="item.name"
            :status="getStatus(item, listindex)">
              <view>{{ item.userName }}<br />{{ item.createTime }}</view>
          </u-steps-item>
        </u-steps> -->
      </view>
    </view>
  </u-form-item>
</template>

<script>
import { getStepRecordList } from '@/api/menuConfig';
import elementMixin from './elementMixin';

export default {
  components: {},
  inject: ['sysMenuDesignId'],

  mixins: [elementMixin],

  props: {
    flagComp: {
      type: Object,
      default() {
        return {};
      }
    },
    configForm: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      stepsArr: [],
      stepValue: -1
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    dictValue() {
      return this.element.dataSource.dictObj.dictValue || [];
    },
    getStatus() {
      return (item, i) => {
        if (item.userName) {
          if (i < this.stepValue) {
            return 'success';
          }
          return 'finish';
        }
        return 'wait';
      };
    }
  },

  methods: {
    async getRecordList() {
      try {
        // const arr = this.elementList.find((item) => item.columnName === 'id')
        const params = {
          dataId: this.configForm[this.flagComp.compId],
          sysMenuDesignId: this.sysMenuDesignId(),
          compId: this.element.compId
        };
        const res = await getStepRecordList(params);
        this.getStepArr(res.reverse());
      } catch (e) {
        console.error(e);
      }
    },
    // 获取步骤展示数组
    getStepArr(list) {
      this.dictValue.forEach((item, i) => {
        const index = list.findIndex((v) => +v.recordValue === +item.value);
        if (index !== -1) {
          this.stepsArr.push({
            createTime: list[index].createTime,
            userName: list[index].userName,
            value: item.value,
            name: item.name
          });
        } else {
          this.stepsArr.push({
            value: item.value,
            name: item.name
          });
        }
        if (list.length > 0 && +list[0].recordValue === +item.value) {
          this.stepValue = i + 1;
          // this.parent.form[this.configData.compId] = list[0].recordValue;
        }
      });
      console.log(this.stepsArr);
    }
  },

  mounted() {
    this.getRecordList();
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.list {
  .list-item {
    display: flex;
    padding-bottom: 20rpx;
    position: relative;
    .list-item-icon {
      flex: 0 0 60rpx;
      .line {
        width: 2rpx;
        height: 90%;
        background: rgba(204, 53, 52, 1);
        position: absolute;
        left: 24rpx;
        top: 32rpx;
        z-index: 8;
      }
      .circle {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
        background: #ffffff;
        border: 2rpx solid rgba(204, 53, 52, 1);
        text-align: center;
        line-height: 44rpx;
        font-size: 28rpx;
        color: #666666;
        position: relative;
        z-index: 9;
        box-sizing: border-box;
      }
      .icon-box {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
        background: rgba(204, 53, 52, 1);
        // border: 2rpx solid rgba(204,53,52,1);
        position: relative;
        z-index: 9;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        color: #ffffff;
        font-size: 28rpx;
        .appIcon {
          font-size: 24rpx;
          color: #ffffff;
        }
      }
    }
    .list-item-content {
      flex: 1 1 auto;
      line-height: 50rpx;
      .progress-state {
        font-size: 32rpx;
        color: rgba(204, 53, 52, 1);
        font-weight: 400;
      }
      .progress-fixed {
        font-size: 28rpx;
        color: rgba(204, 53, 52, 1);
        span {
          padding-right: 20rpx;
        }
      }
      .others {
        font-size: 28rpx;
        color: rgba(204, 53, 52, 1);
      }
    }
  }
  .finish {
    .line {
      background: #c0c4cc !important;
    }
    .circle {
      border: 2rpx solid rgba(204, 53, 52, 1) !important;
    }
    .icon-box {
      background: rgba(204, 53, 52, 1) !important;
    }
    .list-item-content {
      .progress-state {
        color: rgba(204, 53, 52, 1);
      }
      .progress-fixed {
        font-size: 28rpx;
        color: rgba(204, 53, 52, 1);
      }
      .others {
        color: rgba(204, 53, 52, 1);
      }
    }
  }
  .success {
    .line {
      background: #67c23a !important;
    }
    .circle {
      border: 2rpx solid #67c23a !important;
    }
    .icon-box {
      background: #67c23a !important;
    }
    .list-item-content {
      .progress-state {
        color: #67c23a;
      }
      .progress-fixed {
        color: #67c23a;
      }
      .others {
        color: #67c23a;
      }
    }
  }
  .success {
    .line {
      background: #67c23a !important;
    }
    .circle {
      border: 2rpx solid #67c23a !important;
    }
    .icon-box {
      background: #67c23a !important;
    }
    .list-item-content {
      .progress-state {
        color: #67c23a;
      }
      .progress-fixed {
        color: #67c23a;
      }
      .others {
        color: #67c23a;
      }
    }
  }
  .wait {
    .line {
      background: #c0c4cc !important;
    }
    .circle {
      border: 2rpx solid #c0c4cc !important;
      color: #c0c4cc !important;
    }
    .icon-box {
      background: #c0c4cc !important;
    }
    .list-item-content {
      .progress-state {
        color: #c0c4cc;
      }
      .progress-fixed {
        color: #c0c4cc;
      }
      .others {
        color: #c0c4cc;
      }
    }
  }
}
</style>
