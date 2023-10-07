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
        <p class="setTitle">参数字段</p>
        <div>
          <c-input
              type="text"
              v-model="item.paramsName"
              @Input-Change="(value) => changeStyles(value, item, 'paramsName', i)"/>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">参数值</p>
        <div>
          <c-select
              :options="optionList"
              :value="item.paramsKey"
              @change="(value) => changeStyles(value, item, 'paramsKey', i)"
          ></c-select>
        </div>
      </div>
      <div class="ellipsisWrap flex propsSetting">
        <span class="setTitle">是否必填</span>
        <el-switch
            :value="item.isRequired"
            @change="(value) => changeStyles(value, item, 'isRequired', i)"
            active-color="#4689F5"
            inactive-color="#183472">
        </el-switch>
      </div>
    </div>

    <div class="addWrap">
      <c-button type="primary" @click="handleAdd" icon="icon-xinzeng iconfont">新增参数</c-button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    optionList: { // 图表数据
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      config: []
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
      this.$emit('change', this.config);
    },
    del(i) { // 修改外层的条件状态
      this.config.splice(i, 1);
      this.$emit('change', this.config);
    },
    handleAdd() {
      const key = new Date();
      const obj = {
        key: key.getTime(),
        paramsKey: '',
        paramsName: '',
        isRequired: false
      }
      this.config.push(obj);
      this.$emit('change', this.config);
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
  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;
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
