/**
* @name: index
* @author: DELL
* @date: 2021/12/30 17:19
* @description：index
* @update: 2021/12/30 17:19
*/
<!-- 页面 -->
<template>
  <div class="varManage">
    <div class="varManageAdd">
      <apiot-button
          type="primary"
          @click="add"
      >
        <i class="icon-xinzeng iconfont"></i>
        新增
      </apiot-button>
    </div>
    <div class="dataListContent">
      <div class="thead">
        <div style="width: 40px;">序号</div>
        <div style="width: 35%;">变量名</div>
        <div style="width: 35%;">默认值</div>
        <div style="flex: 1">操作</div>
      </div>
      <div class="noData" v-if="!tableData.length">
        暂无数据
      </div>
      <div class="listWrap" v-for="(item, i) in tableData" :key="i">
        <div class="sno">{{ i + 1 }}</div>
        <div class="inner">
          <apiot-input
              v-model="item.name"
              ref="input"
              @blur="(v) => check(v.target.value, i)"></apiot-input>
        </div>
        <div class="inner">
          <apiot-input v-model="item.value" @blur="change"></apiot-input>
        </div>
        <div class="ope"><span class="icon-shanchu iconfont" @click="del(i)"></span></div>
      </div>
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
    }
  },
  data() {
    return {
      tableData: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.tableData = this.value;
  },
  watch: {},
  methods: {
    add() {
      this.tableData.push({
        name: '',
        value: ''
      });
    },
    del(i) {
      this.tableData.splice(i, 1);
      this.$emit('change', this.tableData);
    },
    check(v, i) {
      const arr = this.tableData.filter((item) => item.name === v);
      if (arr.length > 1) {
        this.$message.error(`已经存在${v}变量，请重新填写!`);
        this.tableData[i].name = '';
        this.$refs.input[i].focus();
      }
      this.$emit('change', this.tableData);
    },
    change() {
      this.$emit('change', this.tableData);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.varManage {
  width: 100%;
  height: auto;
  .varManageAdd{
    ::v-deep{
      .el-button--primary {
        width: 100%;
        background: #fff;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        border-color: #E9E9E9;
      }
      .el-button--primary:hover{
        border-color: #4689f5;
        color: #4689f5;
      }
      .icon-xinzeng{
        margin-right: 5px;
        color: #4689f5;
      }
    }
  }
  .dataListContent {
    width: 100%;
    min-height: 70px;

    .thead {
      height: 30px;
      display: flex;
      align-items: center;

      & > div {
        width: 25%;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
    }

    .listWrap {
      height: 30px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .sno {
        width: 40px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }

      .inner {
        width: 35%;
        padding-right: 10px;
        box-sizing: border-box;
      }

      .ope {
        flex: 1;

        .icon-shanchu {
          color: #BBC3CD;
          cursor: pointer;

          &:hover {
            color: #4689F5;
          }
        }
      }
    }

    .noData {
      color: #FFFFFF;
      text-align: center;
    }
  }
}
</style>
