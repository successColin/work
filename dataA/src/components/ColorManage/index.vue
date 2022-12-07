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
    <div>
      <CButton type="primary" @click="add"><i class="el-icon-edit"></i> 新增</CButton>
    </div>
    <div class="dataListContent">
      <div class="thead">
        <div style="width: 40px;">序号</div>
        <div style="width: 35%;">占比</div>
        <div style="width: 35%;">颜色</div>
        <div style="flex: 1">操作</div>
      </div>
      <div class="noData" v-if="!tableData.length">
        暂无数据
      </div>
      <div class="listWrap" v-for="(item, i) in tableData" :key="i">
        <div class="sno">{{ i + 1 }}</div>
        <div class="inner">
          <el-input-number
              v-model="item.name"
              :controls="false"
              ref="input"
              @blur="(v) => check(v.target.value, i)"
              :max="1"
              :step="0.01"></el-input-number>
        </div>
        <div class="inner">
          <c-color-picker
              style="margin-top: 4px;"
              size="small"
              v-model="item.value"
              show-alpha
              @change="change"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="ope"><span class="icon-shanchu iconfont" @click="del(i)"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
import {predefineColors} from '@/constants/global'


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
      tableData: [],
      predefineColors
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
      })
    },
    del(i) {
      this.tableData.splice(i, 1);
      this.$emit('change', this.tableData);
    },
    check(v, i) {
      if (!v) {
        this.$message.error('请填写数据!');
        this.$refs.input[i].focus();
        return;
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

  .dataListContent {
    width: 100%;
    min-height: 70px;

    .thead {
      height: 30px;
      display: flex;
      align-items: center;

      & > div {
        width: 25%;
        color: #FFFFFF;
      }
    }

    .listWrap {
      height: 30px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .sno {
        width: 40px;
        color: #FFFFFF;
      }

      .inner {
        width: 35%;
        padding-right: 10px;
        box-sizing: border-box;

        ::v-deep {
          .el-input-number {
            width: 100%;

            .el-input__inner {
              height: 32px;
              padding-left: 5px;
              line-height: 32px;
              text-align: left;
              background-color: #192757;
              border-color: #2F437F;
              color: #ffffff;
            }
          }
        }
      }

      .ope {
        flex: 1;

        .icon-shanchu {
          color: #FFFFFF;
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
