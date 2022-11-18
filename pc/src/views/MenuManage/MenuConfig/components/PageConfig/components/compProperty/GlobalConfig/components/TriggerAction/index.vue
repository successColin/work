<template>
  <div class="triggerAction">
    <div class="triggerAction__wrapper">
      <header class="triggerAction__header">
        <h1>配置触发动作</h1>
        <apiot-button
          class="triggerAction__return"
          @click="$emit('update:showTrigger', false)"
        >
          <i class="iconfont icon-guanbi"></i>{{ $t('common.close') }}
        </apiot-button>
      </header>
      <section class="triggerAction__body">
        <header class="action__header">
          <apiot-button type="primary" @click="addAction">
            <i class="iconfont icon-xinzeng m-r-4"></i
            >{{ $t('common.add', { name: '动作' }) }}
          </apiot-button>
          <apiot-button
            class="action__header--delete"
            @click="batchDeleteDesignTriggers"
          >
            <i class="iconfont icon-shanchu m-r-4"></i
            >{{ $t('common.delete', { name: '动作' }) }}
          </apiot-button>
          <apiot-button class="action__header--relate" @click="showRelate">
            <i class="iconfont icon-guanxiguanlian m-r-4"></i>全局关系
          </apiot-button>
          <condition-input
            style="margin-top: 9px"
            :selectArr="$store.state.dictManage.TRIGGER_EVENT"
            :selectValue.sync="triggerEvent"
            @getList="listDesignTriggers"
            v-model.trim="keyWord"
          ></condition-input>
        </header>
        <section class="action__main">
          <apiot-table
            :tableData="filterData"
            row-key="id"
            :highlight-current-row="true"
            :dropColumnData="dropColumnData"
            @selection-change="handleSelectionChange"
            dropClass=".action__main"
            ref="entityTable"
          >
            <component
              v-for="(item, index) in dropColumnData"
              :key="`${item.prop}_${index}`"
              :label="$t(item.label)"
              :prop="item.prop"
              sortable="custom"
              :sort-orders="['ascending', 'descending']"
              show-overflow-tooltip
              :typesPropArr="item.typesPropArr"
              :typesPropName="item.typesPropName"
              :colorIndex="item.colorIndex"
              :min-width="item.width"
              :is="dropColumnData[index].compName"
              :buttonArr="item.buttonArr"
              :fixed="item.fixed"
              :triggerCompMap="triggerCompMap"
              :nameValue="item.nameValue"
              :iconCon="item.iconCon"
              :tableData="filterData"
              @switchChange="modifyDesignTriggers"
              @editTrigger="editTrigger"
            ></component>
          </apiot-table>
        </section>
      </section>
    </div>
    <add-action
      ref="addAction"
      :configData="configData"
      :currentType="currentType"
      :showAddAction="showAddAction"
      :visible.sync="showAddAction"
      :triggerCompMap="triggerCompMap"
      :hasTriggerComp="hasTriggerComp"
      @listDesignTriggers="listDesignTriggers"
    ></add-action>
    <transition name="slide-bottom">
      <relate-gird
        v-if="showGird"
        :visible.sync="showGird"
        :configData="configData"
        :triggerCompMap.sync="triggerCompMap"
      ></relate-gird>
    </transition>
  </div>
</template>

<script>
import {
  batchDeleteDesignTriggers,
  enableAndDisableTriggers,
  getDesignTriggersLinkDiagram,
  listDesignTriggers
} from '@/api/menuConfig';
import AddAction from '../AddAction';
import RelateGird from '../RelateGird';

export default {
  props: {
    showTrigger: {
      type: Boolean,
      default: false
    },
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    hasTriggerComp: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [],
      filterData: [],
      dropColumnData: [
        // 触发组件
        {
          label: 'menuConfig.triggerTable.triggerComp',
          prop: 'comp',
          compName: 'CompColumn',
          width: 100
        },
        // 触发事件
        {
          label: 'menuConfig.triggerTable.triggerLinkCode',
          prop: 'linkCode',
          compName: 'ElTableColumn',
          width: 100
        },
        // 触发事件
        {
          label: 'menuConfig.triggerTable.triggerEvent',
          prop: 'triggerEvent',
          typesPropName: 'TRIGGER_EVENT',
          colorIndex: [1, 4, 2],
          compName: 'TypesColumn',
          width: 100
        },
        // 触发事件
        {
          label: 'menuConfig.triggerTable.triggerType',
          prop: 'triggerType',
          typesPropName: 'TRIGGER_TYPE',
          colorIndex: [5],
          compName: 'TypesColumn',
          width: 300
        },
        // 优先级
        {
          label: 'menuConfig.triggerTable.triggerPriority',
          prop: 'triggerPriority',
          compName: 'RoleColumn',
          iconCon: 'icon-youxianji',
          colorIndex: 1,
          nameValue: ['triggerPriority'],
          width: 100
        },
        // 是否启用
        {
          label: 'entity.indexesTable.isExecuted',
          prop: 'triggerEnabled',
          compName: 'SwitchColumn',
          width: 100
        },
        // 编辑
        {
          buttonArr: [{ name: 'entity.entityTable.operateBtn1', funcName: 'editTrigger' }],
          fixed: 'right',
          compName: 'OperateColumn',
          width: 80
        }
      ],
      keyWord: '',
      currentType: 1, // 1 是新增 2是编辑
      showAddAction: false,
      triggerEvent: '', // 触发类型
      selectedIds: '',
      showGird: false,
      actionObj: {
        1: {
          name: '影响控件属性',
          type: 1
        },
        2: {
          name: '调用外部接口',
          type: 2
        },
        3: {
          name: '影响后台数据',
          type: 3
        },
        4: {
          name: '调用存储过程',
          type: 4
        }
      }
    };
  },

  components: {
    AddAction,
    RelateGird
  },

  computed: {},

  mounted() {
    this.listDesignTriggers();
  },

  inject: ['isPanel', 'sysMenuDesignId'],

  methods: {
    async listDesignTriggers(flag) {
      if (flag !== 1 || !this.keyWord) {
        const data = await listDesignTriggers({
          sysMenuDesignId: this.isPanel ? this.sysMenuDesignId : this.$route.query.id,
          triggerEvent: this.triggerEvent
        });
        // console.log(data);
        data.forEach((item) => {
          item.comp = {
            compId: item.triggerCompId,
            compPath: item.triggerCompPath
          };
          const arr = item.triggerType.split(',');
          let str = '';
          arr.forEach((v) => {
            str += this.actionObj[v].name;
          });
          item.filterTriggerType = str;
        });
        this.tableData = data;
        this.filterData = this.tableData;
      }
      if (this.keyWord) {
        this.filterTableData(this.filterData);
      }
    },
    // 新增动作
    addAction() {
      this.currentType = 1;
      this.$nextTick(() => {
        this.$refs.addAction.init();
      });
      this.showAddAction = true;
    },

    // 搜索操作
    filterTableData(data) {
      this.filterData = data.filter((item) => {
        if (item.comp.compName.indexOf(this.keyWord) !== -1) {
          return true;
        }
        if (item.filterTriggerType.indexOf(this.keyWord) !== -1) {
          return true;
        }
        if (item.linkCode.indexOf(this.keyWord) !== -1) {
          return true;
        }
        return false;
      });
    },
    async modifyDesignTriggers(v) {
      await enableAndDisableTriggers({
        triggerEnabled: v.triggerEnabled,
        linkCode: v.linkCode,
        sysMenuDesignId: this.isPanel ? this.sysMenuDesignId : this.$route.query.id
      });
      this.$message({
        type: 'success',
        message: '编辑成功'
      });
    },
    editTrigger(v) {
      this.currentType = 2;
      this.$nextTick(() => {
        this.$refs.addAction.init(v);
      });
      this.showAddAction = true;
    },

    handleSelectionChange(data) {
      const arr = [];
      data.forEach((item) => {
        arr.push(item.linkCode);
      });
      this.selectedIds = arr.join();
    },
    // 删除触发器
    async batchDeleteDesignTriggers() {
      if (!this.selectedIds) {
        return this.$message({
          type: 'warning',
          message: this.$t('entity.selectDelData')
        });
      }
      try {
        await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        });
        await batchDeleteDesignTriggers({
          linkCodes: this.selectedIds,
          sysMenuDesignId: this.isPanel ? this.sysMenuDesignId : this.$route.query.id
        });
        this.listDesignTriggers();
        this.getDesignTriggersLinkDiagram();
      } catch (error) {
        // console.log(error);
      }
    },
    // 新增后改变配置触发器的组件
    // 配置触发器的组件
    async getDesignTriggersLinkDiagram() {
      const data = await getDesignTriggersLinkDiagram({
        sysMenuDesignId: this.isPanel ? this.sysMenuDesignId : this.$route.query.id,
        triggerType: ''
      });
      const obj = {};
      data.compList.forEach((item) => {
        if (!obj[item.compId]) {
          obj[item.compId] = {
            msg: '该组件存在触发器配置，请先删除或更改该触发器',
            ...item
          };
        }
      });
      this.$bus.$emit('changeHasTriggerComp', obj);
    },
    // 查看关系图
    showRelate() {
      this.showGird = true;
    }
  }
};
</script>

<style lang='scss' scoped>
.triggerAction {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  right: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  &__wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 0;
    background-color: #f6f6f8;
  }
  &__header {
    height: 46px;
    line-height: 46px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    h1 {
      padding-left: 20px;
    }
  }
  &__return {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    width: 100px;
    height: 46px;
    border-width: 0 0 0 1px;
    border-color: #ebebeb;
    border-radius: 0;
    color: #333333;
    font-size: 16px;

    i {
      font-size: 20px;
      margin-right: 8px;
      color: #9b9b9b;
    }

    &:hover,
    &:active,
    &:focus {
      border-color: #ebebeb !important;
      background-color: #fff !important;
      i {
        color: $--color-primary;
      }
    }
  }
  &__body {
    position: absolute;
    top: 56px;
    left: 10px;
    right: 10px;
    bottom: 0;
    background-color: #fff;
    padding: 0 10px;
    .action {
      &__header {
        height: 48px;
        line-height: 48px;
        &--delete,
        &--relate {
          .iconfont {
            color: $--color-primary;
          }
        }
        &--relate {
          float: right;
          margin-top: 9px;
        }
      }
      &__main {
        height: calc(100% - 48px);
      }
    }
  }
}
</style>
