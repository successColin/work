<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="task"
    title="配置任务字段"
    :isBigDialog="true"
    :isShowSure="false"
    cancelBtnName="确认"
  >
    <apiot-button type="primary" class="task__addBtn" @click="addtask">
      <i class="iconfont icon-xinzeng m-r-4"></i>
      添加任务字段
    </apiot-button>
    <section class="task__list">
      <div class="task__head task__item">
        <span class="task__item--index"></span>
        <span class="task__item--move"></span>
        <span class="task__item--column">字段</span>
        <span class="task__item--title">标题</span>
        <span class="task__item--compType">控件类型</span>
        <span class="task__item--state">状态</span>
        <span class="task__item--taskState">任务状态</span>
        <span class="task__item--dict">字典</span>
        <span class="task__item--delete"></span>
      </div>
      <div class="task__body">
        <div class="task__scroll">
          <draggable
            v-model="columnArr"
            group="task"
            animation="300"
            handle=".icon-zongxiangtuodong"
          >
            <div
              class="task__item"
              v-for="(item, index) in columnArr"
              :key="item.id"
            >
              <span class="task__item--index">{{ index + 1 }}</span>
              <span class="task__item--move">
                <i class="iconfont icon-zongxiangtuodong"></i>
              </span>
              <span class="task__item--column">
                <filterable-input
                  class="task__filterableInput"
                  placeholder="请选择字段"
                  tableName="ct_inspection_task"
                  :showInfo="item.columnObj"
                  :tableArr="arr"
                  :dialogType="2"
                  @selectRes="selectColumnRes($event, item)"
                ></filterable-input>
              </span>
              <span class="task__item--title"
                ><apiot-input v-model="item.columnTitle"></apiot-input
              ></span>
              <span class="task__item--compType">
                <el-select class="offlineCheck--select" v-model="item.compType">
                  <el-option
                    :value="item.value"
                    :label="item.content"
                    v-for="item in compTypeArr"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </span>
              <span class="task__item--state">
                <el-select
                  class="offlineCheck--select"
                  v-model="item.showStatus"
                >
                  <el-option :value="1" label="普通"></el-option>
                  <el-option :value="2" label="隐藏"></el-option>
                </el-select>
              </span>
              <span class="task__item--taskState">
                <el-select
                  class="offlineCheck--select"
                  multiple
                  collapse-tags
                  v-model="item.taskState"
                >
                  <el-option
                    :value="item.value"
                    :label="item.name"
                    v-for="item in $store.state.dictManage['DICT-00321']"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </span>
              <span class="task__item--dict">
                <filterable-input
                  v-if="item.compType === 6 || item.compType === 7"
                  class="task__filterableInput"
                  placeholder="请选择字典"
                  :showInfo="item.dictObj"
                  :hasPagination="true"
                  :dialogType="3"
                  @selectRes="selectDict($event, item)"
                ></filterable-input>
              </span>
              <span class="task__item--delete" @click="deletetask(index)">
                <i class="iconfont icon-shanchu"></i>
              </span></div
          ></draggable>
        </div>
      </div>
    </section>
  </apiot-dialog>
</template>

<script>
import { createUnique } from '@/utils/utils';

export default {
  props: {
    columnArr: {
      type: Array
    },
    showColumnDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      compTypeArr: [
        {
          value: 1,
          content: '单行文本'
        },
        {
          value: 2,
          content: '多行文本'
        },
        {
          value: 3,
          content: '时间'
        },
        {
          value: 4,
          content: '图片'
        },
        {
          value: 5,
          content: '测量'
        },
        {
          value: 6,
          content: '下拉框'
        },
        {
          value: 7,
          content: '按钮'
        }
      ],
      arr: [
        {
          columnName: 'deviceCode',
          memo: '巡检设备编码',
          columnTypeDict: 2
        },
        {
          columnName: 'deviceId',
          memo: '巡检设备ID',
          columnTypeDict: 1
        },
        {
          columnName: 'deviceName',
          memo: '巡检设备名称',
          columnTypeDict: 2
        },
        {
          columnName: 'devicePosition',
          memo: '巡检设备位置',
          columnTypeDict: 2
        },
        {
          columnName: 'inspectMethod',
          memo: '巡检方法描述',
          columnTypeDict: 2
        },
        {
          columnName: 'inspectionPointId',
          memo: '巡检点Id',
          columnTypeDict: 1
        },
        {
          columnName: 'inspectionRouteId',
          memo: '巡检路线ID',
          columnTypeDict: 1
        },
        {
          columnName: 'inspectionTaskId',
          memo: '巡检任务ID',
          columnTypeDict: 1
        },
        {
          columnName: 'pointCode',
          memo: '巡检点编码',
          columnTypeDict: 2
        },
        {
          columnName: 'pointName',
          memo: '巡检点名称',
          columnTypeDict: 2
        },
        {
          columnName: 'qrCode',
          memo: '解锁二维码',
          columnTypeDict: 2
        },
        {
          columnName: 'rfidCode',
          memo: '解锁RFID码',
          columnTypeDict: 2
        },
        {
          columnName: 'routeCode',
          memo: '巡检路线编码',
          columnTypeDict: 2
        },
        {
          columnName: 'routeName',
          memo: '巡检路线名称',
          columnTypeDict: 2
        },
        {
          columnName: 'standardCondition',
          memo: '判定基准',
          columnTypeDict: 2
        },
        {
          columnName: 'standardMeasureLower',
          memo: '测量基准下限',
          columnTypeDict: 4
        },
        {
          columnName: 'standardMeasureUpper',
          memo: '测量基准上限',
          columnTypeDict: 4
        },
        {
          columnName: 'standardOilQty',
          memo: '润滑油量基准',
          columnTypeDict: 4
        },
        {
          columnName: 'taskCode',
          memo: '巡检任务编码',
          columnTypeDict: 2
        },
        {
          columnName: 'taskMemo',
          memo: '任务备注',
          columnTypeDict: 2
        },
        {
          columnName: 'taskName',
          memo: '巡检任务名称',
          columnTypeDict: 2
        },
        {
          columnName: 'taskStartTime',
          memo: '任务的可执行开始时间',
          columnTypeDict: 2
        },
        {
          columnName: 'taskStatus',
          memo: '任务状态',
          columnTypeDict: 2
        },
        {
          columnName: 'inspectOilQty',
          memo: '实际润滑油量',
          columnTypeDict: 1
        },
        {
          columnName: 'inspectUserDesc',
          memo: '检查人描述',
          columnTypeDict: 2
        },
        {
          columnName: 'inspectMeasureValue',
          memo: '实际测量值',
          columnTypeDict: 4
        },
        {
          columnName: 'inspectTime',
          memo: '实际检查时间',
          columnTypeDict: 2
        },
        {
          columnName: 'inspectCondition',
          memo: '任务点检结果',
          columnTypeDict: 1
        },
        {
          columnName: 'imageIds',
          memo: '检查图片ID列表',
          columnTypeDict: 1
        },
        {
          columnName: 'inspectMeasureValue1',
          memo: 'X轴实际测量值',
          columnTypeDict: 4
        },
        {
          columnName: 'inspectMeasureValue2',
          memo: 'Y轴实际测量值',
          columnTypeDict: 4
        },
        {
          columnName: 'inspectMeasureValue3',
          memo: '温度实际测量值',
          columnTypeDict: 4
        },
        {
          columnName: 'exvarchar1',
          memo: '扩展字符1',
          columnTypeDict: 2
        },
        {
          columnName: 'exvarchar2',
          memo: '扩展字符2',
          columnTypeDict: 2
        },
        {
          columnName: 'exvarchar3',
          memo: '扩展字符3',
          columnTypeDict: 2
        },
        {
          columnName: 'exint1',
          memo: '扩展整数1',
          columnTypeDict: 1
        },
        {
          columnName: 'exint2',
          memo: '扩展整数2',
          columnTypeDict: 1
        },
        {
          columnName: 'exint3',
          memo: '扩展整数3',
          columnTypeDict: 1
        },
        {
          columnName: 'exdate1',
          memo: '扩展时间1',
          columnTypeDict: 3
        },
        {
          columnName: 'exdate2',
          memo: '扩展时间2',
          columnTypeDict: 3
        },
        {
          columnName: 'exdate3',
          memo: '扩展时间3',
          columnTypeDict: 3
        },
        {
          columnName: 'exdecimal1',
          memo: '扩展数字1',
          columnTypeDict: 4
        },
        {
          columnName: 'exdecimal2',
          memo: '扩展数字2',
          columnTypeDict: 4
        },
        {
          columnName: 'exdecimal3',
          memo: '扩展数字3',
          columnTypeDict: 4
        }
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    addtask() {
      this.columnArr.push({
        id: createUnique(),
        columnObj: {
          id: '',
          columnName: '',
          columnTypeDict: ''
        },
        columnTitle: '',
        compType: 1,
        showStatus: 1,
        taskState: [1],
        dictObj: {}
      });
    },
    async deletetask(index) {
      try {
        await this.$confirm('将删除任务字段，是否继续', {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        });
        this.columnArr.splice(index, 1);
      } catch (error) {
        // console.log(error);
      }
    },
    selectColumnRes(table, item) {
      item.columnObj.id = table.id;
      item.columnObj.columnName = table.columnName;
      item.columnObj.columnTypeDict = table.columnTypeDict;
    },
    // 字典选择结果
    async selectDict(dict, item) {
      item.dictObj = dict;
    }
  },

  watch: {
    showColumnDialog(v) {
      if (!v) {
        const { length } = this.columnArr;
        for (let i = length - 1; i >= 0; i -= 1) {
          if (!this.columnArr[i].columnObj.columnName) {
            this.columnArr.splice(i, 1);
          }
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.task {
  ::v-deep {
    .el-dialog {
      width: 1100px;
    }
  }
  &__addBtn {
    width: 120px;
    margin-bottom: 6px;
  }
  &__list {
    flex: 1;
  }
  &__item {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    &--index {
      box-sizing: border-box;
      text-align: center;
      width: 40px;
      flex: 0 0 40px;
    }
    &--move {
      box-sizing: border-box;
      text-align: center;
      width: 40px;
      flex: 0 0 40px;
      cursor: move;
    }
    &--column {
      box-sizing: border-box;
      padding-left: 10px;
      border-right: 1px solid #e9e9e9;
      flex: 0 0 180px;
    }
    &--title {
      box-sizing: border-box;
      padding-left: 10px;
      border-right: 1px solid #e9e9e9;
      flex: 0 0 140px;
    }
    &--compType {
      box-sizing: border-box;
      padding-left: 10px;
      border-right: 1px solid #e9e9e9;
      flex: 0 0 140px;
    }
    &--state {
      box-sizing: border-box;
      padding-left: 10px;
      border-right: 1px solid #e9e9e9;
      flex: 0 0 140px;
    }
    &--taskState {
      box-sizing: border-box;
      padding-left: 10px;
      border-right: 1px solid #e9e9e9;
      flex: 0 0 200px;
    }
    &--dict {
      box-sizing: border-box;
      padding-left: 10px;
      flex: 0 0 140px;
      margin-right: 20px;
    }
    &--delete {
      text-align: center;
      width: 50px;
      cursor: pointer;
    }
    &--move,
    &--delete {
      color: #bbc3cd;
      &:hover {
        .iconfont {
          color: $--color-primary;
        }
      }
    }
  }
  &__head {
    background: #f6f7fb;
    box-shadow: 0px 1px 0px 0px #e9e9e9, 0px -1px 0px 0px #e9e9e9;
    .task__item--taskContent {
      border-right: 1px solid #e9e9e9;
    }
  }
  &__body {
    position: relative;
    height: calc(100% - 40px);
    .task__item {
      width: 890px;
      border-bottom: 1px solid #e9e9e9;
      &:hover {
        background-color: #f1f7ff;
      }
      & > span {
        border-right: 0 none;
      }
      &--index,
      &--move {
        border-right: 1px solid #e9e9e9 !important;
      }
    }
  }
  &__scroll {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: -30px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  &__filterableInput {
    ::v-deep {
      .el-select {
        height: 100%;
      }
      .filterableInput__con {
        .icon-jiahao {
          bottom: 5px;
        }
      }
      .filterableInput__result--table {
        bottom: 7px;
        top: 0px;
      }
    }
  }
}
</style>
