<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="saveParams"
    title="文件层级设置"
    :isShowSure="false"
    cancelBtnName="关闭"
  >
    <el-dropdown class="saveParams__drop m-b-10" @command="handleCommand">
      <apiot-button class="saveParams__addBtn" type="primary">
        <i class="iconfont icon-xinzeng m-r-4"></i>
        新增文件层级
      </apiot-button>
      <el-dropdown-menu slot="dropdown" class="saveParams__dropItem">
        <el-dropdown-item command="BIZ">业务类型</el-dropdown-item>
        <el-dropdown-item command="FILE">文件类型</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="saveParams__body">
      <el-collapse accordion v-model="active">
        <draggable
          animation="300"
          handle=".icon-zongxiangtuodong"
          v-on="$listeners"
          v-bind="$attrs"
          v-model="list"
        >
          <transition-group tag="div" class="sidebar__list--ul">
            <el-collapse-item
              v-for="(item, i) in list"
              :key="`${item.type}_${i}`"
              :name="`${i + 1}`"
            >
              <template slot="title">
                <div class="zoomTitle">
                  <div class="leftWrap">
                    <div>
                      <span class="iconfont icon-zongxiangtuodong"></span>
                    </div>
                    <div class="typeWrap">
                      <span
                        class="iconfont"
                        :style="`color: ${
                          item.type === 'BIZ' ? '#5A80ED' : '#EE5E5E'
                        }`"
                        :class="{
                          [item.type === 'FILE'
                            ? 'icon-wenjianleixing'
                            : 'icon-yewuleixing']: true,
                        }"
                      >
                      </span>
                    </div>
                    <div class="titleWrap">
                      层级{{ i + 1 }} ({{
                        item.type === 'BIZ' ? '业务类型' : '文件类型'
                      }})
                    </div>
                  </div>
                  <div class="rightWrap">
                    <span @click.stop="add(item)" v-if="item.type === 'BIZ'">
                      <span class="iconfont icon-xinzeng"></span> 新增</span
                    >
                    <span class="split" v-if="item.type === 'BIZ'">|</span>
                    <span @click.stop="del(i)">
                      <span class="iconfont icon-shanchu"></span> 删除</span
                    >
                    <span class="split">|</span>
                  </div>
                </div>
              </template>
              <div v-if="item.type === 'BIZ'" class="bizWrap">
                <el-table
                  class="summarySettingsWrap"
                  :showSelection="false"
                  :isNeedRowDrop="false"
                  :isNeedColumnDrop="false"
                  :showSort="true"
                  :isAnimate="false"
                  rowKey="index"
                  :data="item.columns"
                  :height="180"
                  style="width: 100%; height: 100%"
                >
                  <el-table-column prop="date1" width="40">
                    <template slot-scope="scope">
                      <span>{{ scope.row.index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="key" label="字段">
                    <template slot-scope="scope">
                      <filterable-input
                        placeholder="请选择字段"
                        :tableName="tableName"
                        columnTypes="3"
                        :dialogType="2"
                        :notShowSys="false"
                        :showInfo="{ columnName: scope.row.name }"
                        :tableArr="filesOption"
                        @selectRes="selectColumnRes($event, scope.row)"
                      ></filterable-input>
                      <!--                      <el-select-->
                      <!--                          v-model="scope.row.name"-->
                      <!--                          filterable-->
                      <!--                          placeholder="请选择字段"-->
                      <!--                      >-->
                      <!--                        <el-option-->
                      <!--                            v-for="item in filesOption"-->
                      <!--                            :key="item.columnName"-->
                      <!--                            :label="`${item.columnName}(${item.memo})`"-->
                      <!--                            :value="item.columnName"-->
                      <!--                        >-->
                      <!--                        </el-option>-->
                      <!--                      </el-select>-->
                    </template>
                  </el-table-column>
                  <el-table-column prop="enumeration" label="枚举">
                    <template slot-scope="scope">
                      <filterable-input
                        class="task__filterableInput"
                        placeholder="请选择字典"
                        :hasPagination="true"
                        :dialogType="3"
                        :showInfo="{ dictName: scope.row.dictName }"
                        @selectRes="change($event, scope.row)"
                      ></filterable-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="时间格式">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.format"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="连接符">
                    <template slot-scope="scope">
                      <apiot-input
                        v-model="scope.row.split"
                        placeholder="请填入连接符"
                      ></apiot-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name1" width="50" label="操作">
                    <template slot-scope="scope">
                      <span
                        @click="delColumns(scope.row.index, item.columns)"
                        class="iconfont icon-shanchu"
                      ></span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-if="item.type === 'FILE'" class="fileWrap">
                <div>
                  <el-radio v-model="item.columns[0].name" label="createTime"
                    >资料上传时间</el-radio
                  >
                  <el-select
                    v-model="item.columns[0].format"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-radio v-model="item.columns[0].name" label="createUser"
                    >资料上传人</el-radio
                  >
                </div>
              </div>
            </el-collapse-item>
          </transition-group>
        </draggable>
      </el-collapse>
    </div>
  </apiot-dialog>
</template>

<script>
export default {
  props: {
    relateObj: {
      type: Object,
    },
    value: {
      type: String,
    },
    showOrHide: {
      type: Boolean,
      default: false,
    },
    filesOption: {
      type: Array,
      defalut() {
        return [];
      },
    },
    tableName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: 0,
      list: [],
      options: [
        {
          label: 'YYYY-MM-DD',
          value: 'YYYY-MM-dd',
        },
        {
          label: 'YYYY-MM',
          value: 'YYYY-MM',
        },
        {
          label: 'YYYY',
          value: 'YYYY',
        },
      ],
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.list = this.value ? JSON.parse(this.value) : [];
  },

  methods: {
    selectColumnRes({ columnName }, row) {
      row.name = columnName;
    },
    // 新增区域
    handleCommand(v) {
      const obj = {
        type: v,
        columns: [],
      };
      const obj1 = {
        type: v,
        columns: [
          { name: 'createTime', format: 'YYYY-MM-dd', dict: '', split: '' },
        ],
      };
      this.list.push(v === 'BIZ' ? obj : obj1);
      this.active = `${this.list.length}`;
    },
    add(item) {
      item.columns.push({
        dict: '',
        format: '',
        name: '',
        split: '',
      });
    },
    del(v) {
      this.list.splice(v, 1);
    },
    delColumns(i, list) {
      list.splice(i, 1);
    },
    change(v, row) {
      const { dictName, dictKey } = v;
      row.dict = dictKey;
      row.dictName = dictName;
    },
  },

  watch: {
    showOrHide: {
      handler(v) {
        // console.log(v);
        if (!v) {
          this.$emit('saveLayeredStrategy', JSON.stringify(this.list));
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.saveParams {
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
        // padding-top: 0;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px);
      }
    }
  }

  &__drop {
    width: min-content;
  }

  &__body {
    height: calc(100% - 40px);
    overflow-x: hidden;
    overflow-y: auto;

    ::v-deep {
      .el-collapse {
        border: none;
      }

      .el-collapse-item {
        margin-bottom: 10px;
        //border: 1px solid #E9E9E9;
        //box-shadow: inset 0px -1px 0px 0px #E9E9E9;
        border-radius: 4px;
      }
      .el-collapse-item__content {
        padding: 0;
      }
      .el-collapse-item__wrap {
        border-top: none;
        border-bottom: 1px solid #e9e9e9;
        border-left: 1px solid #e9e9e9;
        border-right: 1px solid #e9e9e9;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      .el-collapse-item__header {
        width: 100%;
        height: 40px;
        background: #f1f7ff;
        //box-shadow: inset 0px -1px 0px 0px #E9E9E9;
        line-height: 40px;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        box-sizing: border-box;
      }
      .el-collapse-item__header.is-active {
        //border-radius: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .el-table__row .el-table__cell:first-child .cell {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-jiahao {
        bottom: 3px;
      }
    }
  }

  .zoomTitle {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .leftWrap {
      display: flex;
      & > div {
        height: 40px;
        .icon-zongxiangtuodong {
          margin-left: 10px;
          color: #aaaaaa;
          //&:hover{
          //  color: #4689f5;
          //}
        }
      }
    }
    .typeWrap {
      margin-left: 10px;
      .iconfont {
        font-size: 22px;
      }
    }
    .titleWrap {
      margin-left: 10px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .rightWrap {
      //margin-right: 10px;
      height: 40px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      & .iconfont {
        color: #4689f5;
        vertical-align: bottom;
      }
      .split {
        margin: 0 10px;
        color: #e9e9e9;
      }
    }
  }
  .fileWrap {
    display: flex;
    padding: 10px;
    //justify-content: space-between;
    align-items: center;
    & > div:last-child {
      margin-left: 50px;
    }
  }
  .bizWrap {
    padding: 10px;
    height: 180px;
    ::v-deep {
      .filterableInput__result--table {
        top: 0;
      }
    }
  }
  .summarySettingsWrap .icon-shanchu {
    color: #bbc3cd;
    cursor: pointer;
    &:hover {
      color: #4689f5;
    }
  }
}
</style>
