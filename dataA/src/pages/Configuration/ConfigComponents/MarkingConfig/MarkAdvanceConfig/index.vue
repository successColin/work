/**
* @name: index
* @author: DELL
* @date: 2021/12/29 11:18
* @description：index
* @update: 2021/12/29 11:18
*/
<!-- 页面 -->
<template>
  <div class="conditionWrap">
    <div
        class="conditionContent"
        v-for="(item,i) in config"
        :key="item.key"
    >
      <span class="icon-shanchu1 iconfont" @click="del(i)"></span>
      <div class="propsSetting">
        <p class="setTitle">标线标题</p>
        <div>
          <c-input
              type="text"
              v-model="item.markLabel"
              @Input-Change="(value) => changeStyles(value, item, 'markLabel', i)"/>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">标线数据关联</p>
        <div>
          <c-select
              :options="chartDataOptions"
              :value="item.dataRelation"
              @change="(value) => changeStyles(value, item, 'dataRelation', i)"
          ></c-select>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">标线标注类型</p>
        <div>
          <c-select
              :options="dimensionType"
              :value="item.dimensionType"
              @change="(value) => changeStyles(value, item, 'dimensionType', i)"
          ></c-select>
        </div>
      </div>
      <div class="propsSetting" v-if="['x', 'y'].includes(item.dimensionType)">
        <p class="setTitle">数值</p>
        <c-input
            type="number"
            :numberValue="item.num"
            @Input-Change="(value) => changeStyles(Number(value), item, 'num', i)"/>
      </div>
      <div class="propsSetting">
        <p class="setTitle">标线颜色</p>
        <div>
          <c-color-picker
              size="small"
              :value="item.meanColor"
              show-alpha
              @change="(value) => changeStyles(value, item, 'meanColor', i)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">线型</p>
        <div>
          <c-select
              :options="solidOptions"
              :value="item.meanType"
              @change="(value) => changeStyles(value, item, 'meanType', i)"
          ></c-select>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">线宽</p>
        <c-input
            type="number"
            :numberValue="item.meanWidth"
            @Input-Change="(value) => changeStyles(Number(value), item, 'meanWidth', i)"/>
      </div>
      <div class="propsSetting">
        <p class="setTitle">标签颜色</p>
        <div>
          <c-color-picker
              size="small"
              :value="item.labelColor"
              show-alpha
              @change="(value) => changeStyles(value, item, 'labelColor', i)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">位置</p>
        <div>
          <c-select
              :options="meanOptions"
              :value="item.labelPosition"
              @change="(value) => changeStyles(value, item, 'labelPosition', i)"
          ></c-select>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">字号</p>
        <c-input
            type="number"
            :numberValue="item.labelSize"
            @Input-Change="(value) => changeStyles(Number(value), item, 'labelSize', i)"/>
      </div>
    </div>

    <div class="addWrap">
      <c-button type="primary" @click="handleAdd" icon="icon-xinzeng iconfont">新增标线</c-button>
    </div>
  </div>
</template>

<script>
import {predefineColors, Line_TYPE, MARK_LINE_LABEL_POS } from '@/constants/global'

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    chartDataOptions: { // 图表数据
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      config: [],
      predefineColors,
      dimensionType: [
        {
          value: 'none',
          label: '隐藏'
        },
        {
          value: 'min',
          label: '最小值'
        },
        {
          value: 'max',
          label: '最大值'
        },
        {
          value: 'average',
          label: '平均值'
        },
        {
          value: 'median',
          label: '中位数'
        },
        {
          value: 'x',
          label: 'X轴固定值'
        },
        {
          value: 'y',
          label: 'Y轴固定值'
        }
      ],
      meanOptions: MARK_LINE_LABEL_POS,
      solidOptions: Line_TYPE
    };
  },
  watch: {
    value: {
      deep: true,
      handler(v) {
        this.config = JSON.parse(JSON.stringify(v));
      }
    }
  },
  components: {},

  computed: {},

  mounted() {
    this.config = JSON.parse(JSON.stringify(this.value));
  },

  methods: {
    changeStyles(value, item, key, i) {
      this.$set(this.config, i , {...item, [key]: value});
      this.$emit('changeConfig', this.config);
    },
    del(i) { // 修改外层的条件状态
      this.config.splice(i, 1);
      this.$emit('changeConfig', this.config);
    },
    handleAdd() {
      const key = new Date();
      const obj = {
        key: key.getTime(),
        markLabel: '',
        dataRelation: '',
        dimensionType: 'none',
        meanColor: '',
        labelSize: 16,
        labelPosition: 'end',
        labelColor: '#fff',
        meanWidth: 1,
        meanType: 'solid'
      }
      this.config.push(obj);
      this.$emit('changeConfig', this.config);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.conditionWrap {
  width: 100%;
  .conditionContent {
    position: relative;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #2F437F;
    .icon-shanchu1{
      position: absolute;
      right: 10px;
      top: 10px;
      color: #FFFFFF;
      cursor: pointer;
      z-index: 2;
    }
    .icon-shanchu1:hover {
      color: #4689F5;
    }
  }
  .propsSetting {
    margin-bottom: 10px;
    .setTitle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;
      text-align: left;
      opacity: .7;
    }
  }

  .addWrap {
    margin-top: 10px;
    width: 100%;

    ::v-deep {
      .el-button--primary {
        width: 100%;
      }
      .icon-xinzeng {
        vertical-align: bottom;
      }
    }
  }
}
</style>
