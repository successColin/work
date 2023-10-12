/**
* @name: Agree
* @author: DELL
* @date: 2023/10/10 14:43
* @description：Agree
* @update: 2023/10/10 14:43
*/
<!-- 页面 -->
<template>
  <div class="agreeBox" :class="`${eventType}${_uid}`">
    <div class="actuator">
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
          <i class="icon-xinzeng iconfont m-r-4"></i>添加执行器
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="8">外部接口</el-dropdown-item>
          <el-dropdown-item command="6">后台数据</el-dropdown-item>
          <el-dropdown-item command="7">存储过程</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="listWrap">
      <component
          :is="getCom(item)"
          :key="item.key"
          v-bind="$attrs"
          :value="item"
          @del="del(item)"
          v-for="item in this.config.nodeEvents"></component>
    </div>
  </div>
</template>

<script>
import { nodeComType } from '@/config';
import Sortable from 'sortablejs';
import ExtInt from './ExtInt';
import StoredProcedure from './StoredProcedure';
import BackgroundData from './BackgroundData';

export default {
  props: {
    eventType: {
      type: String
    },
    value: {
      type: Object,
      default() {
        return {
          nodeEvents: []
        };
      }
    }
  },
  data() {
    return {
      config: { ...this.value }
    };
  },

  components: {
    ExtInt,
    StoredProcedure,
    BackgroundData
  },

  computed: {
    getCom() {
      return function (item) {
        return nodeComType[item.nodeType];
      };
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.rowDrop();
    });
  },
  watch: {
    config: {
      deep: true,
      handler(v) {
        this.$emit('change', { value: v, type: this.eventType });
        // this.$nextTick(() => {
        //   this.rowDrop();
        // });
      }
    }
  },
  methods: {
    rowDrop() {
      if (!this.eventType) return;

      const el = document.querySelector(`.agreeBox.${this.eventType}${this._uid} .listWrap`);
      console.log(this, el);
      const _this = this;
      Sortable.create(el, {
        animation: 700,
        handle: '.icon-zongxiangtuodong',
        draggable: '.dragItem',
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.config.nodeEvents.splice(oldIndex, 1)[0];
          _this.config.nodeEvents.splice(newIndex, 0, currRow);
        }
      });
    },
    del(item) {
      const i = this.config.nodeEvents.findIndex((node) => node.key === item.key);
      this.config.nodeEvents.splice(i, 1);
    },
    handleCommand(command) {
      const key = new Date().getTime();
      const configParams = {
        8: {
          apiCode: '',
          params: []
        },
        7: {
          sysProceduresObj: {},
          proceduresList: []
        },
        6: {
          ruleList: []
        }
      };
      this.config.nodeEvents.push({
        key,
        nodeType: +command,
        attribute: configParams[command],
      });
    }
  },
  name: 'CommonConfig',
};
</script>

<style lang='scss' scoped>
.agreeBox {
  width: 100%;
  height: 100%;

  .actuator {
    height: 40px;
  }

  .listWrap {
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
    .extInt{
      margin-bottom: 10px;
      ::v-deep{
        .el-collapse-item__wrap, .el-collapse-item__header {
          border-bottom: 1px solid #EBEBEB;
        }
        //.el-collapse-item:last-child{
        //  border-bottom: 1px solid #EBEBEB;
        //}
      }
    }

    &::-webkit-scrollbar {
      width: 0;
    }

    //将宽度设为0，滚动条就会隐藏。
    &::-webkit-scrollbar {
      display: none;
    }

    //隐藏滚轮
  }
}
</style>
