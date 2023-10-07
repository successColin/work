/**
* @name: index
* @author: DELL
* @date: 2021/10/30 14:39
* @description：index
* @update: 2021/10/30 14:39
*/
<!-- 页面 -->
<template>
  <div class="databaseWrap">
    <div class="opearWrap">
      <c-select
          filterable
          v-model="val"
          class="selectData"
          :options="options"
          @change="change"
      >
      </c-select>
<!--      <div class="look" @click="toggleFlag=!toggleFlag">-->
<!--        <i class="el-icon-edit"></i>-->
<!--      </div>-->
      <div class="dataBtn" @click="toggle">+</div>
    </div>
    <CDialog
        :visible.sync="visible"
        title="MQTT数据源"
        classStyle="middlingDialog"
        :isNeedBtn="false"
    >
      <DataList :init="init" :tableData="options"/>
    </CDialog>
  </div>
</template>

<script>
import {insertDataFilter, updateDataFilter, getMqttList} from '@/services/home';

const DataList = () => import('./DataList/index');
const JSEditor = () => import('@/pages/Configuration/ConfigComponents/JsEditor/index');
const JsonEditor = () => import('@/pages/Configuration/ConfigComponents/JsonEditor/index');


export default {
  props: {
    value: {
      type: Number
    },
    activeComponent: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      val: 1,
      options: [],
      toggleFlag: false
    };
  },

  components: {
    DataList
  },

  computed: {},
  watch: {
  },
  mounted() {
    this.init();
  },

  methods: {
    async init() {
      const list = await getMqttList();
      this.options = list.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id
        }
      });
      this.$nextTick(() => {
        this.val = this.value;
      })
    },
    toggle() {
      this.visible = true;
    },
    change(value) {
      this.val = value;
      if (value) {
        const currentObj = this.options.find((item) => item.id === value);
        console.log(currentObj, 'currentObj');
        this.$emit('change', currentObj);
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.databaseWrap {
  width: 100%;
  transition: height 0.5s ease;

  .opearWrap {
    display: flex;
    align-items: center;

    .selectData {
      flex: 0 0 83%;
    }

    .look {
      flex: 0 0 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      border-right: 1px solid;
      border-top: 1px solid;
      border-bottom: 1px solid;
      box-sizing: border-box;
      border-color: #2F437F;

      & > i {
        color: #FFFFFF;

        &.roteY {
          transform: rotate(90deg);
          transition: all 0.4s ease;
        }

        &.roteX {
          transform: rotate(0deg);
          transition: all 0.4s ease;
        }
      }
    }

    .dataBtn {
      flex: 1;
      width: 32px;
      height: 32px;
      margin-left: 10px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      background: $component-background-color;
      border: 1px solid $component-border-color;
      box-sizing: border-box;

      &:hover {
        border: 1px solid $component-borderFocus-color;
        transition: all 0.2s;
        cursor: pointer;
      }
    }
  }

  .editContent {
    width: 100%;
    height: 100%;

    .canEditArea {
      width: 100%;
      height: 261px;

      ::v-deep {
        .js-editor-wrap {
          height: 261px;

          &.fullScreen {
            height: calc(100% - 50px);
          }

          .CodeMirror {
            min-height: 261px;
          }

          .CodeMirror-scroll {
            min-height: 261px;
          }
        }
      }
    }

    .previewArea {
      width: 100%;
      height: 261px;
      display: flex;
      justify-content: space-between;

      .changeBefore, .changeAfter {
        width: 48%;

        .title {
          color: #FFFFFF;
          opacity: .7;
          line-height: 40px;
        }

        ::v-deep {
          .json-editor-wrap {
            height: 200px;

            &.fullScreen {
              height: calc(100% - 50px);
            }

            .CodeMirror {
              min-height: 200px;
            }

            .CodeMirror-scroll {
              min-height: 200px;
            }
          }
        }

      }
    }

    .previewArea {
      width: 100%;
      height: calc(100% / 2);
    }
  }
}
</style>
