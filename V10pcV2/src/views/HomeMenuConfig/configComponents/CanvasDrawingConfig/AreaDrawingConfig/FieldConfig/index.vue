/**
* @name: index
* @author: DELL
* @date: 2021/11/22 8:53
* @description：index
* @update: 2021/11/22 8:53
*/
<!-- 页面 -->
<template>
  <div class="fieldWrap">
    <div class="addWrap">
      <apiot-button icon="icon-xinzeng iconfont" @click="visible=true">新增字段</apiot-button>
    </div>
    <div class="fieldListWrap">
      <div class="fieldItemBox" v-for="(item, i) in fieldArr" :key="i">
        <div class="fieldItemContent">
          <el-checkbox v-model="item.isShow" @change="changeChecked($event, i)"></el-checkbox>
          <div class="fieldName"> {{ item.name }} （{{ item.businessField }}）</div>
        </div>
        <div class="delWrap" @click="delField(i)"><span class="iconfont icon-shanchu"></span></div>
      </div>
    </div>
    <apiot-dialog
        :visible.sync="visible"
        title="字段配置"
        classStyle="normalDialog"
        :isNeedBtn="true"
        @sure-click="handleOk"
    >
      <div class="tableWrap">
        <div class="formWrap">
          <div class="rowWrap">
            <div class="col-12">
              <div class="label">业务表</div>
<!--              <CDataSelectionBox-->
<!--                  style="width: 170px;"-->
<!--                  @handleSelect="(obj) =>this.handleSelect(obj.tableName, 'businessTable')"-->
<!--                  :value="{tableName: fieldConfig.businessTable}"-->
<!--                  type="tableName"-->
<!--                  class="formItem"/>-->
              <filterable-input
                  placeholder="请选择实体表"
                  class="formItem"
                  title="实体表"
                  :dialogType="1"
                  :showInfo="{tableName: fieldConfig.businessTable}"
                  @selectRes="handleSelect($event.tableName, 'businessTable')"
              ></filterable-input>
            </div>
            <div class="col-12">
              <div class="label">业务字段</div>
<!--              <CDataSelectionBox-->
<!--                  style="width: 170px;"-->
<!--                  @handleSelect="(obj) =>-->
<!--                  this.handleSelect(obj.name, 'businessField', obj.memo,'businessFieldName')"-->
<!--                  class="formItem"-->
<!--                  :otherParams="{tableName: fieldConfig.businessTable}"-->
<!--                  :value="{name:fieldConfig.businessField }"-->
<!--                  type="filedName"-->
<!--              ></CDataSelectionBox>-->
              <filterable-input
                  placeholder="请选择字段"
                  :showInfo="{columnName: fieldConfig.businessField}"
                  :dialogType="2"
                  :tableName="fieldConfig.businessTable"
                  @selectRes="handleSelect($event.columnName, 'businessField',
                   $event.memo, 'businessFieldName')"
              />
            </div>

          </div>
          <div class="rowWrap">
            <div class="col-12">
              <div class="label">条件字段</div>
<!--              <CDataSelectionBox-->
<!--                  style="width: 170px;"-->
<!--                  @handleSelect="(obj) =>this.handleSelect(obj.name, 'entityWhere')"-->
<!--                  class="formItem"-->
<!--                  :otherParams="{tableName: fieldConfig.businessTable}"-->
<!--                  :value="{name:fieldConfig.entityWhere }"-->
<!--                  type="filedName"-->
<!--              ></CDataSelectionBox>-->
              <filterable-input
                  style="flex: 1"
                  placeholder="请选择字段"
                  :showInfo="{columnName: fieldConfig.entityWhere}"
                  :dialogType="2"
                  :tableName="fieldConfig.businessTable"
                  @selectRes="handleSelect($event.columnName, 'entityWhere')"
              />
            </div>
            <div class="col-12">
              <div class="label">排序字段</div>
<!--               -->
              <filterable-input
                  placeholder="请选择字段"
                  :showInfo="{columnName: fieldConfig.entitySort}"
                  :dialogType="2"
                  :tableName="fieldConfig.businessTable"
                  @selectRes="handleSelect($event.columnName, 'entitySort')"
              />
            </div>

          </div>
          <div class="rowWrap">
            <div class="col-12">
              <div class="label">实体表</div>
<!--              <CDataSelectionBox-->
<!--                  style="width: 170px;"-->
<!--                  class="formItem"-->
<!--                  :value="{tableName: fieldConfig.entityTable}"-->
<!--                  type="tableName"-->
<!--                  @handleSelect="(obj) =>this.handleSelect(obj.tableName, 'entityTable')"-->
<!--              ></CDataSelectionBox>-->
              <filterable-input
                  placeholder="请选择实体表"
                  class="formItem"
                  title="实体表"
                  :dialogType="1"
                  :showInfo="{tableName: fieldConfig.entityTable}"
                  @selectRes="handleSelect($event.tableName, 'entityTable')"
              />
            </div>
            <div class="col-12">
              <div class="label">实体字段</div>
<!--              <CDataSelectionBox-->
<!--                  style="width: 170px;"-->
<!--                  :otherParams="{tableName: fieldConfig.entityTable}"-->
<!--                  :value="{name:fieldConfig.entityTableFields }"-->
<!--                  type="filedName"-->
<!--                  @handleSelect="(obj) =>this.handleSelect(obj.name, 'entityTableFields')"-->
<!--                  class="formItem"-->
<!--              ></CDataSelectionBox>-->
              <filterable-input
                  placeholder="请选择字段"
                  :showInfo="{columnName: fieldConfig.entityTableFields}"
                  :dialogType="2"
                  :tableName="fieldConfig.entityTable"
                  @selectRes="handleSelect($event.columnName, 'entityTableFields')"
              />
            </div>
          </div>
          <div class="rowWrap">
            <div class="col-12">
              <div class="label">显示名称</div>
              <apiot-input
                  v-model="fieldConfig.name"
                  style="flex: 1"
              />
            </div>
            <div class="col-12">
              <div class="label">多级实体表</div>
              <div class="formItem">
                <el-radio-group v-model="fieldConfig.isMultiLevelEntity">
                  <apiot-radio :label="1">是</apiot-radio>
                  <apiot-radio :label="0">否</apiot-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
        <div class="varManage" v-if="!!fieldConfig.isMultiLevelEntity">
          <div class="title">多级关联条件配置</div>
          <div class="btnWrap">
            <apiot-button type="primary" @click="doAdd">
              <i class="el-icon-edit"></i> 新增</apiot-button>
          </div>
          <div class="dataListContent">
            <div class="thead">
              <div class="theadWrap right">实体表</div>
              <div class="theadWrap">表字段</div>
              <div style="width: 40px;"></div>
              <div class="theadWrap right">业务表</div>
              <div class="theadWrap">表字段</div>
              <div class="opeWrap">操作</div>
            </div>
            <div class="listBoxWrap">
              <div class="listWrap"
                   v-for="(item, i) in fieldConfig.multiLevelEntityConfig"
                   :key="i">
                <div class="tableNameWrap right">
<!--                  <CDataSelectionBox-->
<!--                      style="width: 121px;"-->
<!--                      @handleSelect="handleSelectConfig($event.tableName,'entityTable', i)"-->
<!--                      class="formItem"-->
<!--                      :value="{tableName: item.entityTable}"-->
<!--                      type="tableName"-->
<!--                  ></CDataSelectionBox>-->
                  <filterable-input
                      placeholder="请选择实体表"
                      class="formItem"
                      title="实体表"
                      :dialogType="1"
                      :showInfo="{tableName: item.entityTable}"
                      @selectRes="handleSelectConfig($event.tableName, 'entityTable', i)"
                  />
                </div>
                <div class="tableNameWrap">
<!--                  <CDataSelectionBox-->
<!--                      style="width: 121px;"-->
<!--                      @handleSelect="handleSelectConfig($event.name, 'entityTableFields', i)"-->
<!--                      :otherParams="{tableName: item.entityTable}"-->
<!--                      :value="{name:item.entityTableFields }"-->
<!--                      type="filedName"-->
<!--                      class="formItem"></CDataSelectionBox>-->
                  <filterable-input
                      style="width: 121px;"
                      placeholder="请选择字段"
                      :showInfo="{columnName: fieldConfig.entityTableFields}"
                      :dialogType="2"
                      :tableName="fieldConfig.entityTable"
                      @selectRes="handleSelect($event.columnName, 'entityTableFields', i)"
                  />
                </div>
                <div style="width: 40px;text-align: center;color: #fff;">=</div>
                <div class="tableNameWrap right">
<!--                  <CDataSelectionBox-->
<!--                      style="width: 121px;"-->
<!--                      @handleSelect="handleSelectConfig($event.tableName,'businessTable', i)"-->
<!--                      class="formItem"-->
<!--                      :value="{tableName: item.businessTable}"-->
<!--                      type="tableName"-->
<!--                  ></CDataSelectionBox>-->
                  <filterable-input
                      style="width: 121px;"
                      placeholder="请选择实体表"
                      class="formItem"
                      title="实体表"
                      :dialogType="1"
                      :showInfo="{tableName: item.businessTable}"
                      @selectRes="handleSelectConfig($event.tableName, 'businessTable', i)"
                  />
                </div>
                <div class="tableNameWrap">
<!--                  <CDataSelectionBox-->
<!--                      style="width: 121px;"-->
<!--                      @handleSelect="handleSelectConfig($event.name, 'businessField', i)"-->
<!--                      :otherParams="{tableName: item.businessTable}"-->
<!--                      :value="{name:item.businessField }"-->
<!--                      type="filedName"-->
<!--                      class="formItem"></CDataSelectionBox>-->
                  <filterable-input
                      style="width: 121px;"
                      placeholder="请选择字段"
                      :showInfo="{columnName: fieldConfig.businessField}"
                      :dialogType="2"
                      :tableName="fieldConfig.businessTable"
                      @selectRes="handleSelect($event.columnName, 'businessField', i)"
                  />
                </div>
                <div class="ope" @click="doDel(i)"><span class="icon-shanchu iconfont"></span></div>
              </div>
              <div class="noData" v-if="!fieldConfig.multiLevelEntityConfig.length">
                暂无数据
              </div>
            </div>

          </div>
        </div>
      </div>
    </apiot-dialog>
  </div>
</template>

<script>

const obj = {
  name: '', // 显示名称
  businessTable: '', // 业务表
  businessFieldName: '', // 业务字段描述
  businessField: '', // 业务表字段
  entityWhere: '', // 条件字段
  entitySort: '', // 排序字段
  entityTable: '', // 实体表
  entityTableFields: '', // 实体表字段
  isMultiLevelEntity: 0, // 是否多级实体
  multiLevelEntityConfig: [] // 多级实体配置
};

export default {
  props: {
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    dataSource: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      visible: false,
      isMulti: false,
      tableData: [],
      fieldArr: [], // 字段列表
      fieldConfig: {
        ...obj,
        businessTable: this.dataSource // 业务表
      }
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.fieldArr = JSON.parse(JSON.stringify(this.value));
  },

  methods: {
    changeChecked() {
      this.$emit('change', this.fieldArr);
    },
    delField(i) {
      this.fieldArr.splice(i, 1);
      this.$emit('change', this.fieldArr);
    },
    doAdd() {
      this.fieldConfig.multiLevelEntityConfig.push({
        businessTable: '', // 业务表
        businessField: '', // 业务表字段
        entityTable: '', // 实体表
        entityTableFields: '' // 实体表字段
      });
    },
    doDel(i) {
      this.fieldConfig.multiLevelEntityConfig.splice(i, 1);
    },
    handleSelectConfig(v, k, i) {
      this.fieldConfig.multiLevelEntityConfig[i][k] = v;
    },
    handleSelect(v, key, v2, key2) {
      console.log(v, key, v2, key2, 'zz');
      this.fieldConfig[key] = v;
      if (v2 && key2) {
        this.fieldConfig[key2] = v2;
      }
    },
    handleOk() {
      if (!this.fieldConfig.businessField) {
        this.$message.error('请选择业务表字段!');
        return;
      }
      if (!this.fieldConfig.businessTable) {
        this.$message.error('请选择业务表!');
        return;
      }
      if (this.fieldConfig.entityWhere) {
        if (!this.fieldConfig.entitySort) {
          this.$message.error('请选择排序字段!');
          return;
        }
      }
      this.fieldArr.push({
        ...this.fieldConfig,
        isShow: true
      });
      this.$emit('change', this.fieldArr);
      this.visible = false;
      this.fieldConfig = {
        ...obj,
        businessTable: this.dataSource
      };
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.fieldWrap {
  width: 100%;

  .addWrap {
    width: 100%;
    ::v-deep {
      .icon-xinzeng{
        color: #4689F5;
      }
      .el-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
          margin-right: 5px;
        }
      }
    }
  }

  .fieldListWrap {
    margin-top: 10px;

    .fieldItemBox {
      padding: 0 12px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      background: #FFFFFF;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;

      .fieldItemContent {
        width: calc(100% - 16px);
        height: 100%;
        display: flex;
        align-items: center;
      }

      .delWrap {
        width: 16px;
      }

      .fieldName {
        width: calc(100% - 14px);
        height: 100%;
        margin-left: 8px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        overflow: hidden;
        line-height: 30px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .icon-shanchu {
        color: #BBC3CD;
        cursor: pointer;

        &:hover {
          color: #4689F5;
        }
      }
    }
  }

  .tableWrap {
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    box-sizing: border-box;

    .formWrap {
      height: 160px;

      .rowWrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .col-12 {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .label {
            width: 85px;
            padding-right: 10px;
            text-align: right;
            color: #333333;
            box-sizing: border-box;
          }

          .formItem {
            flex: 1;
          }
        }

        .col-12:nth-child(odd) {
          margin-right: 20px;
        }
      }
    }

    .varManage {
      width: 100%;
      height: calc(100% - 160px);

      .title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        box-shadow: 0px 1px 0px 0px #e9e9e9;
        box-sizing: border-box;
      }

      .btnWrap {
        height: 40px;
        display: flex;
        align-items: center;
      }

      .dataListContent {
        width: 100%;
        height: calc(100% - 80px);
        min-height: 70px;

        .thead {
          height: 30px;
          display: flex;
          align-items: center;
          box-shadow: 0px 1px 0px 0px #e9e9e9;

          .theadWrap {
            flex: 1;
            color: #333333;

            &.right {
              margin-right: 10px;
            }
          }

          .opeWrap {
            width: 40px;
            color: #333333;
            text-align: center;
          }
        }

        .listBoxWrap {
          height: calc(100% - 30px);
          overflow: auto;

          .listWrap {
            height: 30px;
            display: flex;
            align-items: center;
            margin-top: 10px;

            .tableNameWrap {
              flex: 1;

              &.right {
                margin-right: 10px;
              }
            }

            .sno {
              //width: 40px;
              color: #FFFFFF;
            }

            .inner {
              //width: 35%;
              padding-right: 10px;
              box-sizing: border-box;
            }

            .ope {
              width: 40px;
              text-align: center;

              .icon-shanchu {
                color: #FFFFFF;
                cursor: pointer;

                &:hover {
                  color: #4689F5;
                }
              }
            }
          }
        }
        .noData {
          margin-top: 20px;
          color: #FFFFFF;
          text-align: center;
        }
      }
    }

  }
}
</style>
