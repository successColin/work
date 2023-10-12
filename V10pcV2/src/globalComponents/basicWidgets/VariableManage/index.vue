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
    <div v-for="(item, i) in tableData" :key="i" class="varBox">
      <div class="flex">
        <div class="propsSetting first">
          <p class="setTitle">变量名{{ i + 1 }}</p>
          <apiot-input
              v-model="item.name"
              ref="input"
              @blur="(v) => check(v.target.value, i)"></apiot-input>
        </div>
        <div class="propsSetting next">
          <p class="setTitle">变量类型</p>
          <el-select v-model="item.valueType" @change="item.value=''">
            <el-option label="固定值" :value="1"></el-option>
            <el-option label="公式" :value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">默认值</p>
        <!--        <apiot-input-->
        <!--            v-if="item.valueType===1"-->
        <!--            v-model="item.value"-->
        <!--            ref="input"-->
        <!--            @blur="(v) => check(v.target.value, i)"></apiot-input>-->
        <apiot-input
            placeholder="请输入默认值"
            class="defaultInput"
            v-if="item.valueType===1"
            v-model="item.value"
            @blur="change"
        ></apiot-input>
        <select-formula
            v-if="item.valueType === 2"
            class="action__term--formula"
            :showType="[1]"
            v-model="item.value"
            @input="change"
        ></select-formula>
      </div>
      <div class="ope"><span class="icon-shanchu iconfont" @click="del(i)"></span></div>
    </div>
    <div class="varManageAdd">
      <apiot-button
          type="primary"
          @click="add"
      >
        <i class="icon-xinzeng iconfont"></i>
        新增变量
      </apiot-button>
    </div>
    <div class="dataListContent">
    </div>
  </div>
</template>

<script>
import SelectFormula from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/SelectFormula';

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    valueNameType: { // 值显示名称类型
      type: Number,
      default() {
        return 1;
      }
    }
  },
  data() {
    return {
      tableData: []
    };
  },

  components: {
    SelectFormula
  },

  computed: {
    getValueName() {
      if (this.valueNameType === 1) return '默认值';
      if (this.valueNameType === 2) return '字段名';
      return '默认值';
    }
  },

  mounted() {
    this.tableData = this.value;
  },
  watch: {},
  methods: {
    add() {
      this.tableData.push({
        name: '',
        value: '',
        valueType: 1
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

  .varManageAdd {
    //margin-top: 10px;

    ::v-deep {
      .el-button--primary {
        width: 100%;
        background: #fff;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        border-color: #E9E9E9;
      }

      .el-button--primary:hover {
        border-color: #4689f5;
        color: #4689f5;
      }

      .icon-xinzeng {
        margin-right: 5px;
        color: #4689f5;
      }
    }
  }

  .varBox .flex .first {
    width: 58%;
  }

  .varBox .flex .next {
    width: 38%;
  }

  .varBox {
    position: relative;
    margin-bottom: 10px;
    border: 1px solid #e9e9e9;
    padding: 10px 15px;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .varBox:hover {
    border-color: #6ba1f7;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }

  .varBox .ope {
    position: absolute;
    right: 15px;
    bottom: 20px;
    width: 32px;
    height: 32px;
    color: #bbc3cd;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;

    &:hover {
      border-color: #4689F5;
    }
    &:hover .icon-shanchu {
      color: #4689F5;
    }

    .icon-shanchu {
      color: #BBC3CD;
    }
  }

  .propsSetting {
    margin-bottom: 10px;

    .alignWrap {
      width: 100%;
      display: flex;

      ::v-deep {
        .el-radio-button {
          width: calc(100% / 3);

          &.is-active {
            .el-radio-button__inner {
              background: #E5F0FF !important;
              border-color: $component-borderFocus-color !important;
              color: #4689f5 !important;
            }

            .iconfont {
              color: #4689f5 !important;
            }
          }

          .el-radio-button__inner {
            width: 100%;
            padding: 5px 15px;
            //border-color: $--hover-iconColor;
            background: $component-background-color;

            .iconfont {
              color: #BBC3CD;
              font-size: 18px;
            }
          }

          .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background: $component-background-color;
          }

          .el-radio-button__inner {
            color: #333;
          }
        }
      }
    }

    .setTitle {
      display: inline-block;
      margin: 0;
      height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 30px;
      color: #333333;
    }

    .wrap {
      display: flex;
      text-align: left;
      align-items: center;
      line-height: 35px;

      & > span {
        margin-right: 10px;
        color: #ffffff;
        font-size: 14px;
      }
    }

    .action__term--formula {
      width: 178px;
    }

    .defaultInput {
      width: 178px;
      display: block;
    }
  }
}
</style>
