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
        class="carousel__step"
      >
        <!-- <template v-slot:description
          >{{ item.userName }}<br />{{ item.createTime }}</template
        > -->
        <template v-slot:icon>
          <el-popover placement="top" width="220" trigger="hover">
            <ul v-if="hisObj[item.value] && hisObj[item.value].length">
              <li
                v-for="li in hisObj[item.value]"
                :key="li.id"
                class="avtorBoxLiSteps"
              >
                <div class="avtorBoxSteps">
                  <span class="avtor" :style="getColor(li)">
                    {{ renderAvtor(li) }}
                  </span>
                  {{ li.userName }}
                </div>
                <span style="float: right">{{
                  li.createTime.slice(0, -3)
                }}</span>
                <div class="memoSteps m-t-4" v-if="li.memo">
                  备注：{{ li.memo }}
                </div>
              </li>
            </ul>
            <div v-else style="text-align: center">暂无操作记录</div>
            <div slot="reference">
              <i
                class="isWait"
                v-if="getStatus(item, i) === 'wait' && stepValue !== item.value"
              ></i>
              <i
                class="isFinish"
                v-else-if="
                  getStatus(item, i) === 'finish' && stepValue !== item.value
                "
              ></i>
              <i
                class="isSuccess iconfont icon-wancheng1"
                v-else-if="
                  getStatus(item, i) === 'success' && stepValue !== item.value
                "
              ></i>
              <i
                class="current"
                v-else-if="
                  getStatus(item, i) === 'success' && stepValue === item.value
                "
              ></i>
              <i class="isWait" v-else></i>
            </div>
          </el-popover>

          <!-- <i></i> -->
        </template>
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
import cnchar from 'cnchar';
import { listRecord } from '@/api/menuManage';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
      stepValue: -1,
      stepsArr: [],
      hisObj: {},
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
    },
    renderAvtor() {
      return (obj) => {
        let avtor = obj.userName
          ? cnchar.spell(obj.userName, 'first', 'up')
          : '';
        const len = avtor.length;
        avtor = avtor.substr(len - 2, 2);
        return avtor;
      };
    },
    getColor() {
      return (obj) => {
        const colors = ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'];
        const index = obj.userName.length || 0;
        const color = `background:${colors[index % 5]}`;
        return color;
      };
    },
  },

  mounted() {
    this.$bus.$on('getSteps', this.listRecord);
  },

  methods: {
    // 获取值
    async listRecord(id, tableName, compArr) {
      const relateComp = compArr.find(
        (item) => this.configData.relateDateId === item.compId,
      );
      const params = {
        // compId: this.configData.compId,
        // sysMenuDesignId: this.sysMenuDesignId(),
        dataId: id,
        columnName: relateComp.dataSource.columnName,
        tableName,
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
            name: item.name,
          });
        } else {
          this.stepsArr.push({
            value: item.value,
            name: item.name,
          });
        }
        if (+list[0].recordValue === +item.value) {
          this.stepValue = i + 1;
          this.parent.form[this.configData.compId] = list[0].recordValue;
        }
      });
      this.hisObj = {};
      list.forEach((item) => {
        if (!this.hisObj[item.originalValue]) {
          this.hisObj[item.originalValue] = [];
        }
        this.hisObj[item.originalValue].push(item);
      });
      // console.log(this.stepsArr, this.stepValue, this.hisObj);
    },
  },

  beforeDestroy() {
    this.$bus.$off('getSteps', this.listRecord);
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  padding: 2px 15px 18px 15px;

  &.noHover {
    padding: 0px 15px 18px 20px;
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
  &__step {
    ::v-deep {
      .el-step__line {
        background-color: #ebebeb;
      }
      .el-step__icon.is-text {
        border: 0 none;
        .isWait {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 5px solid #ebebeb;
          box-sizing: border-box;
        }
        .isFinish {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 5px solid #b0ceff;
          box-sizing: border-box;
        }
        .current {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 5px solid #4689f5;
          box-sizing: border-box;
          border-radius: 50%;
        }
      }
      .el-step__title {
        font-size: 13px;
      }
    }
  }
}
</style>
<style lang="scss">
.avtorBoxLiSteps {
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  border-bottom: 1px dashed #e9e9e9;
  padding-bottom: 10px;
  padding-top: 10px;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
    border-bottom: 0 none;
  }
}
.avtorBoxSteps {
  height: 24px;
  line-height: 24px;
  background: #f1f3f6;
  border-radius: 12px;
  padding-right: 6px;
  width: max-content;
  display: inline-block;

  line-height: 14px;
  .avtor {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
.memoSteps {
  line-height: 18px;
}
</style>
