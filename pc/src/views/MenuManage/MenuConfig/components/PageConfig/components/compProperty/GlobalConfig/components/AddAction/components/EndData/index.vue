<template>
  <section>
    <ActionTerm
      :configData="configData"
      :triggerCompMap="triggerCompMap"
      v-model="termObj"
      :lambdaArr="lambdaArr"
      :triggerComp="triggerComp"
    ></ActionTerm>
    <section class="action__endData">
      <el-form label-position="top" label-width="80px" @submit.native.prevent>
        <el-form-item label="影响类型">
          <apiot-button type="text" class="addBody" @click.stop="addComp"
            ><i class="iconfont icon-xinzeng m-r-4"></i
            ><span>添加影响类型</span></apiot-button
          >
          <apiot-table
            class="filterableInput__table"
            :tableData="actionTriggerObj.backendList"
            :showSort="true"
          >
            <el-table-column prop="operationType" label="类型" width="80">
              <template slot-scope="scope">
                <span :class="`baseColor color__${scope.row.operationType}`">{{
                  getTypeObj[scope.row.operationType].label
                }}</span>
              </template>
            </el-table-column>
            <role-column
              prop="operationTable"
              label="触发表"
              iconCon="icon-shujubiao"
              :colorIndex="2"
              :nameValue="['operationTable']"
            ></role-column>
            <el-table-column prop="operationContent" label="内容" width="80">
              <template slot-scope="scope">
                <span>{{
                  scope.row.operationType !== 3 ? '已设置' : '-'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="operationConditions" label="条件" width="80">
              <template slot-scope="scope"
                ><span>{{
                  scope.row.operationType !== 1 ? '已设置' : '-'
                }}</span></template
              >
            </el-table-column>
            <el-table-column prop="operationRemarks" label="备注">
            </el-table-column>
            <operate-column
              label="操作"
              :buttonArr="buttonArr"
              width="100"
              @edit="editTable"
              @delete="deleteAffectType"
            >
            </operate-column>
          </apiot-table>
        </el-form-item>
      </el-form>
    </section>
    <transition name="slide-bottom">
      <affect-type
        :visible.sync="showAffectType"
        v-if="showAffectType"
        :lambdaArr="lambdaArr"
        :typeList="typeList"
        :currentType="currentType"
        :editObj="editObj"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
        :triggerComp="triggerComp"
        @addAffectType="addAffectType"
      ></affect-type>
    </transition>
  </section>
</template>

<script>
import termMixin from '../termMixin';
import AffectType from '../AffectType';
import ActionTerm from '../ActionTerm';

export default {
  mixins: [termMixin],
  props: {
    //  配置，渲染树
    configData: {
      type: Array
    },
    // 所有组件
    triggerCompMap: {
      type: Object
    },
    // 条件
    effectiveConditions: {
      type: String
    },
    // item 所有数据，方便修改
    actionTriggerObj: {
      type: Object
    },
    // 当前触发控件
    triggerComp: {
      type: Object
    },
    // 触发事件
    triggerEvent: {
      type: Number
    },
    // 后端触发器
    removeBackendIds: {
      type: Array
    }
  },
  data() {
    return {
      showAffectType: false,
      showReturnValue: false,
      typeList: [
        { label: '新增', value: 1 },
        { label: '修改', value: 2 },
        { label: '删除', value: 3 },
        { label: '增改', value: 4 }
      ],
      buttonArr: [
        { name: 'entity.entityTable.operateBtn1', funcName: 'edit' },
        { name: '删除', funcName: 'delete' }
      ],
      currentType: 1, // 1 是新增 2 是编辑
      editObj: null,
      editIndex: 0
    };
  },

  components: {
    AffectType,
    ActionTerm
  },

  computed: {
    getTypeObj() {
      const obj = {};
      this.typeList.forEach((item, index) => {
        obj[index + 1] = item;
      });
      return obj;
    }
  },

  mounted() {},

  methods: {
    methodChange() {
      // this.actionTriggerObj.request_parameter = '';
    },
    addComp() {
      this.currentType = 1;
      this.editObj = null;
      this.showAffectType = true;
    },
    // 新增影响类型
    addAffectType(params) {
      this.actionTriggerObj.backendList.push(params);
    },
    editTable(row, scope) {
      this.currentType = 2;
      this.editObj = this.actionTriggerObj.backendList[scope.$index];
      this.showAffectType = true;
    },
    deleteAffectType(row, scope) {
      if (row.id) {
        // console.log('保存删除id');
        this.removeBackendIds.push(row.id);
      }
      this.actionTriggerObj.backendList.splice(scope.$index, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
.action {
  .icon-xinzeng {
    color: $--color-primary;
  }
  .icon-shezhi {
    color: $--color-primary;
  }
  &__term {
    margin-top: 8px;
    &--header,
    &--liHeader {
      display: flex;
      height: 30px;
      line-height: 30px;
      font-weight: 600;
      color: #333333;
      font-size: 13px;
    }
    &--addAnd,
    &--addTerm {
      margin-left: auto;
    }
    &--ul {
      margin-top: 10px;
    }
    &--li {
      padding: 0 15px;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      margin-bottom: 10px;
    }
    &--addTerm,
    &--deleteTerm {
      color: #333333;
      position: relative;
    }
    &--addTerm {
      margin-right: 10px;
      &:after {
        content: '';
        position: absolute;
        right: -14px;
        width: 1px;
        height: 12px;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    &--liChildren {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .termComp {
        position: absolute;
        margin-left: 14px;
      }
      .icon-shanchu {
        width: 40px;
        text-align: right;
        cursor: pointer;
      }
    }
    &--liChild {
      margin-left: 10px;
      &:nth-child(1) {
        width: 200px;
      }
      &:nth-child(2) {
        width: 100px;
      }
      &:nth-child(3) {
        width: 100px;
      }
      &:nth-child(4) {
        margin-right: 0;
        flex: 1;
      }
    }
  }
  .addBody {
    position: absolute;
    right: 0;
    margin-top: -28px;
    span {
      color: #333333;
    }
  }
  &__endData {
    border-radius: 4px;
    border: 1px solid #e9e9e9;
    padding: 16px 15px 0;
  }
}
.filterableInput__table {
  height: 300px !important;
  .baseColor {
    height: 28px;
    line-height: 28px;
    text-align: center;
    padding: 0 14px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    border-radius: 4px;
  }
  .color {
    &__1 {
      color: #fa6400;
      background: #ffede1;
    }
    &__2 {
      color: #10b98a;
      background: #ebfcf7;
    }
    &__3 {
      color: #e02020;
      background: #ffeaeb;
    }
    &__4 {
      color: #4689f5;
      background: #e5f0ff;
    }
  }
}
</style>
