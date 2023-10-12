/**
* @name: index
* @author: DELL
* @date: 2023/2/1 15:21
* @description：index
* @update: 2023/2/1 15:21
*/
<template>
  <el-table-column
      v-on="$listeners"
      v-bind="$attrs"
      resizable
      show-overflow-tooltip
  >
    <template #header>
      <div>
        <div class="search-header">
          {{ $t('messageTemplate.templateType') }}
        </div>
        <el-popover
            placement="bottom"
            width="260"
            trigger="click"
            popper-class="filter"
            v-model="visible"
        >
          <div class="filterBox"
               slot="reference"
               :class="{ 'needBg': isFlag}"
          >
            <i class="iconfont icon-quanshan"
               @click.stop="clearSearch"
               @touchstart="clearSearch"></i>
            <i class="filter__btn iconfont icon-biaotoushaixuan"
               :class="{active: visible}"
               @click.stop="visible = !visible"></i>
          </div>
          <div>
            <div class="wrap">
              <el-checkbox-group
                  v-model="checkList"
                  class="filter__all filter__check"
              >
                <el-checkbox :label="1">通用类型</el-checkbox>
                <el-checkbox :label="2">流程审批</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="filter__btns">
              <apiot-button @click="cancel">取消</apiot-button>
              <apiot-button type="primary" @click="doOk">
                确定
              </apiot-button>
            </div>
          </div>
        </el-popover>
      </div>
    </template>
    <template slot-scope="scope">
      <section :key="scope.row.id">
        <div
            class="common font-overflow"
            :style="getStyles(getName(scope.row))"
        >{{ getName(scope.row).text }}
        </div>
      </section>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      checkList: [],
      visible: false,
      isFlag: false
    };
  },
  computed: {
    getName() {
      return function ({ templateType = 1 }) {
        const normal = {
          text: '通用类型',
          color: '#4689F5',
          bgColor: '#E5F0FF'
        };
        const flow = {
          text: '流程审批',
          color: '#F6483E',
          bgColor: '#FFEAEB'
        };
        if (templateType === 1) return normal;
        if (templateType === 2) return flow;
        return normal;
      };
    },
    getStyles() {
      return function (obj) {
        return {
          color: obj.color,
          background: obj.bgColor
        };
      };
    }
  },
  methods: {
    cancel() {
      this.visible = false;
    },
    clearSearch() {
      this.isFlag = false;
      this.checkList = [];
      this.$emit('checkList', '');
    },
    doOk() {
      this.isFlag = this.checkList.length;
      this.$emit('checkList', this.checkList.join(','));
      this.visible = false;
    }
  },
};
</script>
<style lang='scss' scoped>
.common {
  padding: 0 12px;
  line-height: 24px;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
  width: -moz-min-content;
  width: min-content;
  border-radius: 4px;
}

.filterBox {
  position: absolute;
  right: -28px;
  top: 4px;
  width: 46px;
  height: 20px;
  line-height: 20px;
  padding-left: 5px;
  box-sizing: border-box;
  transition: all .5s;
  border-radius: 10px;
}

.filter__btn {
  display: inline-block;
  height: 36px;
  width: 20px;
  font-size: 14px;
  color: #bbc3cd;

  &:hover {
    color: #4689f5;
  }
  &.active {
    color: #4689f5;
  }
}

.wrap {
  padding: 0 10px 0;
  border-bottom: 1px solid #e9e9e9;
}

.filter__btns {
  text-align: right;
  margin: 0;
  margin-top: 12px;
  margin-right: 10px;
}

.filter__check {
  display: flex;
  flex-direction: column;
}

.filter__check .el-checkbox {
  height: 36px;
  line-height: 36px;
  padding-left: 4px;
  margin-right: 0;
}

.filter__check .el-checkbox .el-checkbox__label {
  color: #333;
}

.filter__check .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}

.filter__all {
  width: 100% !important;
}

.icon-quanshan {
  display: none;
  font-size: 14px;
  width: 20px;
  color: rgba(0, 0, 0, .16);
}

.needBg {
  right: 0px;
  top: 4px;
  //line-height: 20px;
  background: #e9ebf3;
}

.needBg .icon-quanshan {
  height: 20px;
  line-height: 20px;
  display: inline-block;
}

.needBg .icon-biaotoushaixuan {
  height: 20px;
  line-height: 20px;
  color: #4689f5;
}
.needBg .icon-quanshan:hover {
  color: rgba(0,0,0,.4);
}

</style>
