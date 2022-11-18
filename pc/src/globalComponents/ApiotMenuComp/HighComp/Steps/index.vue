<template>
  <div
    class="carousel"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
    v-if="showInput"
  >
    <el-steps :active="stepValue" v-if="!isConfig" align-center>
      <el-step
        :title="item.name"
        v-for="(item, i) in stepsArr.length ? stepsArr : configData.stepsArr"
        :key="item.value"
        :status="getStatus(item, i)"
      >
        <template v-slot:description
          >{{ item.userName }}<br />{{ item.createTime }}</template
        >
      </el-step>
    </el-steps>
    <div class="carousel__config" v-if="isConfig">步骤条占位</div>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import { listRecord } from '@/api/menuManage';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
      stepValue: -1,
      stepsArr: []
    };
  },
  mixins: [compMixin],
  inject: ['sysMenuDesignId'],
  components: {},

  computed: {
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

  mounted() {
    this.$bus.$on('getSteps', this.listRecord);
  },

  methods: {
    // 获取值
    async listRecord(id) {
      const params = {
        compId: this.configData.compId,
        sysMenuDesignId: this.sysMenuDesignId(),
        dataId: id
      };
      const data = await listRecord(params);
      this.stepsArr = [];
      if (data.length) {
        this.getStepArr(data.reverse());
      }
    },
    // 获取步骤展示数组
    getStepArr(list) {
      this.configData.stepsArr.forEach((item, i) => {
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
        if (+list[0].recordValue === +item.value) {
          this.stepValue = i + 1;
          this.parent.form[this.configData.compId] = list[0].recordValue;
        }
      });
      // console.log(this.stepsArr, this.stepValue);
    }
  },

  beforeDestroy() {
    this.$bus.$off('getSteps', this.listRecord);
  }
};
</script>

<style lang='scss' scoped>
.carousel {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  padding: 2px 15px 18px 15px;

  &.noHover {
    padding: 0px 15px 18px 35px;
    // height: 115px;
  }
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  &__config {
    box-sizing: border-box;
    padding: 8px 12px;
    height: 82px;
    word-break: break-all;
  }
  &__box {
    .imgBox {
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      &.hasRadius {
        border-radius: 4px;
      }
    }
    &.type__1 {
      ::v-deep {
        .el-carousel__indicators {
          .el-carousel__button {
            width: 18px;
            background-color: rgba(0, 0, 0, 0.3);
            &.is-active {
              background-color: rgba(0, 0, 0, 0.6);
            }
          }
          li.is-active {
            .el-carousel__button {
              background-color: rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
    &.type__2 {
      ::v-deep {
        .el-carousel__indicators {
          .el-carousel__button {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.3);
          }
          li.is-active {
            .el-carousel__button {
              width: 14px;
              border-radius: 12px;
              background-color: rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
    &.type__3 {
      ::v-deep {
        .el-carousel__indicators {
          counter-reset: num;
          li .el-carousel__button:before {
            counter-increment: num;
            content: counter(num);
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
            display: flex;
            align-items: center;
            color: #fff;
            justify-content: center;
          }
          .el-carousel__button {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.3);
          }
          li.is-active {
            .el-carousel__button {
              background-color: rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
  }
}
</style>
