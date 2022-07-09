<template>
  <section>
    <apiot-dialog
      class="relateConfig"
      v-on="$listeners"
      v-bind="$attrs"
      title="配置关系表1"
      :isShowSure="false"
      cancelBtnName="确认"
    >
      <apiot-button
        class="relateConfig__addRelate"
        v-if="getCurrentTab && getCurrentTab.tableInfo.tableName"
        @click="
          currentRadioObj = null;
          dialogVisible = true;
        "
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '关系表' }) }}
      </apiot-button>
      <ul
        class="relateConfig__ul"
        ref="ulBox"
        v-if="getCurrentTab"
        :class="[{ apiotNoData: !getCurrentTab.relateTableArr.length }]"
      >
        <transition-group name="move-right" tag="div">
          <li
            class="relateConfig__li m-b-10"
            v-for="(relate, i) in getCurrentTab.relateTableArr"
            :key="`${relate.relateName}_${i}`"
          >
            <header class="relateConfig__itemHead">
              <i class="iconfont icon-shujubiao"></i>
              <span
                >{{ relate.relateTable.tableName }}({{
                  relate.relateName
                }})</span
              >
              <div class="relateConfig__btnBox">
                <!-- 条件 业务很少，先去除 -->
                <el-tooltip content="And条件" placement="top" v-if="false">
                  <el-button
                    type="text"
                    class="relateConfig__btn"
                    @click="addCondition(i, 1, relate.conditionArr)"
                    ><i class="iconfont icon-xinzeng m-r-4"></i>条件</el-button
                  ></el-tooltip
                >
                <el-tooltip content="And固定值" placement="top">
                  <el-button
                    type="text"
                    class="relateConfig__btn"
                    @click="addCondition(i, 2, relate.conditionArr)"
                    ><i class="iconfont icon-xinzeng m-r-4"></i
                    >固定值</el-button
                  ></el-tooltip
                >
                <el-tooltip content="删除" placement="top"
                  ><el-button
                    type="text"
                    class="relateConfig__btn"
                    @click="deleteRelate(i)"
                    ><i class="iconfont icon-shanchu m-r-4"></i>删除</el-button
                  ></el-tooltip
                >
              </div>
            </header>
            <div class="relateConfig__item" ref="liBox">
              <div
                class="relateConfig__item--andItem"
                v-for="(andCondition, k) in relate.conditionArr"
                :key="k"
                ref="andBox"
              >
                <header class="relateConfig__item--andHead">
                  <div class="relateConfig__btnBox">
                    <!-- 条件 业务很少，先去除 -->
                    <el-tooltip content="Or条件" placement="top" v-if="false">
                      <el-button
                        type="text"
                        class="relateConfig__btn"
                        @click="
                          addCondition(
                            i,
                            3,
                            andCondition,
                            k,
                            relate.conditionArr
                          )
                        "
                        ><i class="iconfont icon-xinzeng m-r-4"></i
                        >条件</el-button
                      >
                    </el-tooltip>
                    <el-tooltip content="Or固定值" placement="top">
                      <el-button
                        type="text"
                        class="relateConfig__btn"
                        @click="addCondition(i, 4, andCondition, k)"
                        ><i class="iconfont icon-xinzeng m-r-4"></i
                        >固定值</el-button
                      >
                    </el-tooltip>
                  </div>
                </header>
                <div class="relateConfig__item--orBox">
                  <div
                    class="relateConfig__item--orItem"
                    v-for="(orCondition, j) in andCondition"
                    :key="j"
                  >
                    <div class="relateConfig__item--text">
                      {{ orCondition.secondIsValue ? '固定值' : '条件' }}
                    </div>
                    <div class="relateConfig__item--line m-b-10">
                      <div
                        class="relateConfig__item--lineTable"
                        :title="getCurLabel(orCondition.firstLineTable, k, j)"
                      >
                        <el-select
                          placeholder="请选择"
                          value-key="nameAlias"
                          v-model="orCondition.firstLineTable"
                          :disabled="
                            (!(k === 0 && j === 0) ||
                              andCondition.length !== 1 ||
                              relate.conditionArr.length !== 1) &&
                            !orCondition.secondIsValue
                          "
                          @change="
                            tableChange(`main_${i}_${k}_${j}`, orCondition)
                          "
                        >
                          <el-option
                            :label="getCurLabel(item, k, j)"
                            :value="item"
                            v-for="(item, index) in getCurOption(i, k, j)"
                            :key="index"
                          ></el-option>
                        </el-select>
                        <i
                          class="iconfont icon-shujubiao"
                          :class="[
                            {
                              disabled:
                                (!(k === 0 && j === 0) ||
                                  andCondition.length !== 1 ||
                                  relate.conditionArr.length !== 1) &&
                                !orCondition.secondIsValue,
                            },
                          ]"
                        ></i>
                      </div>
                      <filterable-input
                        :ref="`main_${i}_${k}_${j}`"
                        class="relateConfig__item--lineColumn"
                        placeholder="请选择字段"
                        :tableName="orCondition.firstLineTable.tableName"
                        :showInfo="orCondition.firstLineColumn"
                        :dialogType="2"
                        @selectRes="
                          selectColumnRes(
                            $event,
                            orCondition,
                            'firstLineColumn'
                          )
                        "
                      ></filterable-input>
                    </div>
                    <div class="relateConfig__item--line">
                      <div
                        class="relateConfig__item--lineTable"
                        :title="orCondition.secondLineTable.tableName"
                        v-if="!orCondition.secondIsValue"
                      >
                        <el-select
                          placeholder="请选择"
                          value-key="nameAlias"
                          v-model="orCondition.secondLineTable.tableName"
                          :disabled="true"
                          @change="
                            tableChange(`relate_${i}_${k}_${j}`, orCondition)
                          "
                        >
                        </el-select>
                        <i class="iconfont icon-shujubiao disabled"></i>
                      </div>
                      <filterable-input
                        v-if="!orCondition.secondIsValue"
                        :ref="`relate_${i}_${k}_${j}`"
                        class="relateConfig__item--lineColumn"
                        placeholder="请选择字段"
                        :tableName="orCondition.secondLineTable.tableName"
                        :showInfo="orCondition.secondLineColumn"
                        :dialogType="2"
                        @selectRes="
                          selectColumnRes(
                            $event,
                            orCondition,
                            'secondLineColumn'
                          )
                        "
                      ></filterable-input>
                      <apiot-input
                        v-if="orCondition.secondIsValue"
                        v-model="orCondition.secondLineValue"
                        placeholder="请输入固定值"
                      ></apiot-input>
                    </div>
                    <div
                      class="relateConfig__item--close"
                      v-if="!(k === 0 && j === 0)"
                      @click="
                        deleteOrCondition(
                          andCondition,
                          j,
                          relate.conditionArr,
                          k
                        )
                      "
                    >
                      <i class="iconfont icon-guanbi"></i>
                    </div>
                    <div class="relateConfig__item--equal">=</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </transition-group>
      </ul>
    </apiot-dialog>
    <!-- 实体表和字段表: 实体表1，字段表2 -->
    <table-or-field-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :currentRadioObj.sync="currentRadioObj"
      :dialogType="1"
      @sure-click="handleSubmit"
    ></table-or-field-dialog>
  </section>
</template>

<script>
export default {
  props: {
    getCurrentTab: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      currentRadioObj: null
    };
  },
  computed: {
    // 获取当前关系展示label
    getCurLabel() {
      return (item, k, j) => {
        if (k === 0 && j === 0) {
          return `${item.tableName}(${item.relateName})`;
        }
        return item.tableName;
      };
    },
    // 获取当前的配置
    getCurOption() {
      return (i, k, j) => {
        const optionArr = [];
        if (k === 0 && j === 0) {
          this.getCurrentTab.tableInfo.relateName = '主表';
          optionArr.push(this.getCurrentTab.tableInfo);
          this.getCurrentTab.relateTableArr.forEach((relate, index) => {
            if (index < i) {
              relate.relateTable.relateName = relate.relateName;
              optionArr.push(relate.relateTable);
            }
          });
          return optionArr;
        }
        const obj = this.getCurrentTab.relateTableArr[i].conditionArr[0][0];
        optionArr.push(obj.firstLineTable);
        optionArr.push(obj.secondLineTable);
        return optionArr;
      };
    }
  },
  components: {},
  methods: {
    // 添加关联表
    handleSubmit() {
      // console.log(this.currentRadioObj);
      if (!this.currentRadioObj) {
        return this.$message({
          type: 'warning',
          message: '请选择数据'
        });
      }
      this.dialogVisible = false;
      this.getCurrentTab.relateTableIndex += 1;
      const relateObj = {
        relateName: `关系${this.getCurrentTab.relateTableIndex}`,
        relateTable: {
          tableName: this.currentRadioObj.tableName,
          id: this.currentRadioObj.id,
          alias: '',
          nameAlias: this.currentRadioObj.tableName
        },
        conditionArr: [
          [
            {
              firstLineTable: this.getCurrentTab.tableInfo,
              firstLineColumn: {
                columnName: '',
                id: ''
              },
              secondLineTable: {
                tableName: '',
                id: '',
                nameAlias: ''
              },
              secondLineColumn: {
                columnName: '',
                id: ''
              }
            }
          ]
        ]
      };
      // 生成唯一别名
      // 目前别名规则 表前两个字母__时间戳
      if (relateObj.relateTable.tableName === this.getCurrentTab.tableInfo.tableName) {
        relateObj.relateTable.alias = `${relateObj.relateTable.tableName}__${this.getCurrentTab.relateTableIndex}`;
      }
      const index = this.getCurrentTab.relateTableArr.findIndex(
        (item) => item.relateTable.tableName === relateObj.relateTable.tableName
      );
      if (index !== -1) {
        relateObj.relateTable.alias = `${relateObj.relateTable.tableName}__${this.getCurrentTab.relateTableIndex}`;
        relateObj.relateTable.nameAlias = `${relateObj.relateTable.tableName}__${relateObj.relateTable.alias}`;
      }
      relateObj.conditionArr[0][0].secondLineTable = relateObj.relateTable;
      this.getCurrentTab.relateTableArr.push(relateObj);
      this.$nextTick(() => {
        this.$refs.ulBox.scrollTop = this.$refs.ulBox.scrollHeight;
      });
    },
    // 选择字段
    selectColumnRes(table, item, name) {
      item[name] = {
        id: table.id,
        columnName: table.columnName,
        columnTypeDict: table.columnTypeDict
      };
    },
    // 删除关系
    deleteRelate(i) {
      // console.log(this.getCurrentTab.relateTableArr[i]);
      // console.log(this.getCurrentTab);
      const res = this.findComp(
        this.getCurrentTab.relateTableArr[i].relateName,
        this.getCurrentTab.children || this.getCurrentTab.dataSource
      );

      // console.log(res);
      if (!res) {
        const index = this.getCurrentTab.relateTableArr.findIndex((relate) => {
          if (
            relate.conditionArr[0][0].firstLineTable.relateName ===
            this.getCurrentTab.relateTableArr[i].relateName
          ) {
            return true;
          }
          return false;
        });
        if (index === -1) {
          this.getCurrentTab.relateTableArr.splice(i, 1);
        } else {
          this.$message({
            type: 'warning',
            message: '当前有关系关联该关系，请删除或修改该关系'
          });
        }
        // this.getCurrentTab.relateTableArr.splice(i, 1);
      } else {
        this.$message({
          type: 'warning',
          message: '当前有组件使用该关系，请删除或修改该组件的关系'
        });
      }
    },
    findComp(relateName, arr) {
      let state = false;
      if (Object.prototype.toString.call(arr) === '[object Object]') {
        if (arr.relateName && arr.relateName.indexOf(relateName) !== -1) {
          state = true;
        }
        return state;
      }
      return (
        arr &&
        arr.find((child) => {
          if (
            child.dataSource &&
            child.dataSource.relateName &&
            child.dataSource.relateName.indexOf(relateName) !== -1
          ) {
            return true;
          }
          if (child.children && child.children.length) {
            return this.findComp(relateName, child.children);
          }
          return false;
        })
      );
    },
    // 表格更改请求接口并清空字段数据
    tableChange(name, orCondition) {
      if (name.indexOf('main') !== -1) {
        orCondition.firstLineColumn = {
          columnName: '',
          id: ''
        };
      } else {
        orCondition.secondLineColumn = {
          columnName: '',
          id: ''
        };
      }
      // this.$nextTick(() => {
      //   this.$refs[name][0].getList();
      // });
    },
    // 增加and条件 i 为 第几个 li flag 1为and条件 2为and固定值 3 or条件此时有relateArr，进行赋值 4 or固定值 k 为第几个and
    addCondition(i, flag, arr, k, relateArr) {
      if (flag === 1) {
        arr.push([
          {
            firstLineTable: arr[0][0].firstLineTable,
            firstLineColumn: {
              columnName: '',
              id: ''
            },
            secondLineTable: arr[0][0].secondLineTable,
            secondLineColumn: {
              columnName: '',
              id: ''
            }
          }
        ]);
      } else if (flag === 2) {
        arr.push([
          {
            firstLineTable: {
              tableName: '',
              id: ''
            },
            firstLineColumn: {
              columnName: '',
              id: ''
            },
            secondIsValue: true,
            secondLineValue: ''
          }
        ]);
      } else if (flag === 3) {
        arr.push({
          firstLineTable: relateArr[0][0].firstLineTable,
          firstLineColumn: {
            columnName: '',
            id: ''
          },
          secondLineTable: relateArr[0][0].secondLineTable,
          secondLineColumn: {
            columnName: '',
            id: ''
          }
        });
      } else if (flag === 4) {
        arr.push({
          firstLineTable: {
            tableName: '',
            id: ''
          },
          firstLineColumn: {
            columnName: '',
            id: ''
          },
          secondIsValue: true,
          secondLineValue: ''
        });
      }
      this.$nextTick(() => {
        const el = this.$refs.liBox[i];
        if (flag === 1 || flag === 2) {
          el.scrollLeft = el.scrollWidth;
        } else {
          const orEl = this.$refs.andBox[k];
          el.scrollLeft = orEl.offsetLeft + orEl.offsetWidth - 310;
        }
      });
    },
    // 删除or 的条件
    deleteOrCondition(arr, j, relateArr, k) {
      if (arr.length === 1) {
        relateArr.splice(k, 1);
      } else {
        arr.splice(j, 1);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.relateConfig {
  overflow: hidden;
  ::v-deep {
    @media (min-height: 640px) {
      & > .el-dialog {
        height: 640px;
      }
    }
    @media (max-height: 640px) {
      & > .el-dialog {
        position: absolute;
        top: 20px;
        bottom: 20px;
      }
    }
    & > .el-dialog {
      width: 960px;
      & > .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px - 10px);
      }
    }
  }
  &__addRelate {
    width: 110px;
    .iconfont {
      color: $--color-primary;
    }
  }
  &__ul {
    margin-top: 5px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  &__li {
    box-sizing: border-box;
    height: 220px;
    width: 100%;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
  }
  &__itemHead {
    position: relative;
    display: flex;
    align-items: center;
    height: 28px;
    line-height: 28px;
    background: #e5f0ff;
    border-radius: 4px;
    .icon-shujubiao {
      width: 28px;
      height: 28px;
      background: #5a80ed;
      line-height: 28px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      border-radius: 4px 0 0 4px;
      margin-right: 4px;
    }
    span {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      margin-left: 6px;
    }
  }
  &__btnBox {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
  }
  &__btn {
    position: relative;
    display: flex;
    align-items: center;
    color: #333333;
    font-size: 13px;
    margin-right: 10px;
    &:hover {
      color: $--color-primary;
    }
    .iconfont {
      color: $--color-primary;
    }
    &:not(:last-child):after {
      content: '';
      position: absolute;
      right: -10px;
      width: 1px;
      height: 12px;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  &__item {
    height: 192px;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    &--andItem {
      position: relative;
      box-sizing: border-box;
      height: 166px;
      padding: 0px 10px 10px 8px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      width: min-content;
      &:hover {
        background: #f1f3f6;
      }
      &:not(:nth-child(1)) {
        margin-left: 18px;
        &:after {
          content: 'and';
          position: absolute;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #e9e9e9;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          top: 92px;
          left: -26px;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
        }
      }
    }
    &--andHead {
      height: 36px;
      position: relative;
      .relateConfig__btnBox {
        right: auto;
        left: 0;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        padding-left: 10px;
        height: 24px;
        margin-top: 6px;
      }
    }
    &--orBox {
      display: flex;
    }
    &--orItem {
      position: relative;
      width: 400px;
      height: 120px;
      background-color: #fff;
      box-sizing: border-box;
      padding: 36px 10px 0 10px;
      border: 1px solid #e9e9e9;
      &:first-child {
        border-radius: 4px 0px 0px 4px;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
      }
      &:not(:nth-child(1)) {
        margin-left: -1px;
        &:after {
          content: 'or';
          position: absolute;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #e9e9e9;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          top: 56px;
          left: -15px;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
        }
      }
    }
    &--line {
      display: flex;
    }
    &--lineTable {
      position: relative;
      ::v-deep {
        .el-input__inner {
          padding-left: 32px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .iconfont {
        position: absolute;
        left: 8px;
        top: 7px;
        font-size: 18px;
        color: #5a80ed;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
          color: #bbc3cd;
        }
      }
    }
    &--text {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      line-height: 20px;
    }
    &--close {
      position: absolute;
      top: 12px;
      right: 10px;
      cursor: pointer;
      color: #bbc3cd;
      &:hover {
        color: $--color-primary;
      }
      .iconfont {
        font-size: 13px;
      }
    }
    &--equal {
      position: absolute;
      box-sizing: border-box;
      width: 24px;
      height: 24px;
      top: 60px;
      left: 134px;
      line-height: 24px;
      text-align: center;
      background: #fafafa;
      border-radius: 50%;
      border: 1px solid #e9e9e9;
    }
  }
}
</style>
