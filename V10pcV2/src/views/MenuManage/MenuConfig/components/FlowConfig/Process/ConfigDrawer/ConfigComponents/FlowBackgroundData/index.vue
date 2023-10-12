/**
* @name: index
* @author: DELL
* @date: 2021/10/13 8:53
* @description：index
* @update: 2021/10/13 8:53
*/
<!-- 页面 -->
<template>
  <div class="conditionWrap">
    <div class="addType">
      <apiot-button class="list-btn" @click="doShow(1, {})">
        <i class="icon-xinzeng iconfont m-r-4"></i>
        添加影响类型
      </apiot-button>
    </div>
    <div class="typeListWrap">
      <div class="listItem" v-for="item in ruleList" :key="item.uuid">
        <div class="listItem__title">
          <div class="item-left">
            <span class="iconfont icon-houtaishuju"></span>
            <span class="item-name">{{ getType(item) }}</span>
          </div>
          <div class="item-right">
            <span class="iconfont icon-bianji" @click="doShow(2, item)"></span>
            <span class="split">|</span>
            <span class="iconfont icon-shanchu" @click="del(item)"></span>
          </div>
        </div>
        <div class="listContent">
          <div class="listItem__des" style="margin-bottom: 6px">
            <span class="des__label">触发表:</span>
            <span class="des_table">
              <span class="iconfont icon-shujubiao"></span>
              <span class="des_tableName">{{ item.tableName }}</span>
            </span>
          </div>
          <div class="listItem__des">
            <span class="des__label">备注:</span>
            <span class="des__memo">{{ item.memo }}</span>
          </div>
        </div>
      </div>
    </div>
    <transition name="slide-bottom">
      <AddImpact
        :visible.sync="visible"
        v-if="visible"
        :lambdaArr="lambdaArr"
        :configData="configData"
        :currentType="currentType"
        :editObj="detialObj"
        @addAffectType="addAffectType"
        :triggerCompMap="triggerCompMap"
      />
    </transition>
  </div>
</template>

<script>
import { lambdaArr } from '@/config/index';
import AddImpact from './AddImpact/index';

export default {
  props: {
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      detialObj: {}, // 内容详情
      lambdaArr,
      visible: false,
      currentType: 1, // 1 新增， 2 编辑
      configData: [], // 页面配置信息
      ruleList: []
    };
  },

  components: { AddImpact },

  computed: {
    getType() {
      return function(item) {
        if (item.type === 'INSERT') {
          return '新增类型';
        }
        if (item.type === 'UPDATE') {
          return '编辑类型';
        }
        if (item.type === 'DELETE') {
          return '删除类型';
        }
        return '编辑类型';
      };
    },
    // 获取所有的校验单位
    getAllcheck() {
      const obj = {};
      if (this.configData[0] && this.configData[0].children.length) {
        const compPath = `${this.configData[0].name}`;
        this.configData[0].children.forEach((bigArea) => {
          const bigPath = `${compPath}/${bigArea.name}`;
          if (bigArea.children.length) {
            bigArea.children.forEach((tab) => {
              obj[tab.compId] = JSON.parse(JSON.stringify(tab));
              obj[tab.compId].compType = 'TAB';
              const tabPath = `${bigPath}/${tab.compId}`;
              if (tab.children.length) {
                tab.children.forEach((area) => {
                  if (area.compName === 'BtnsArea') {
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((comp) => {
                        obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                        obj[comp.compId].compPath = areaPath;
                      });
                    }
                  } else {
                    obj[area.compId] = JSON.parse(JSON.stringify(area));
                    obj[area.compId].compType = 'AREA';
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((smallArea) => {
                        if (smallArea.children) {
                          smallArea.children.forEach((comp) => {
                            obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                            obj[comp.compId].compPath = areaPath;
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
        return obj;
      }
      return obj;
    },
    triggerCompMap() {
      const curInfo = {};
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        curInfo[key] = {};
        curInfo[key].compName = this.getAllcheck[key].name;
        curInfo[key].compType = this.getAllcheck[key].compType;
        curInfo[key].compPath = this.getAllcheck[key].compPath;
      });
      return curInfo;
    }
  },

  mounted() {
    const configData = sessionStorage.getItem('configData');
    if (configData) {
      this.configData = JSON.parse(configData);
    }
    if (JSON.stringify(this.nodeInfo) !== '{}') {
      this.ruleList = this.nodeInfo.ruleList || [];
    }
  },

  methods: {
    doShow(type, obj) {
      this.visible = true;
      this.currentType = type;
      this.detialObj = obj;
    },
    addAffectType(params) {
      if (this.currentType === 1) {
        params.uuid = Date.parse(new Date());
        this.ruleList.unshift(params);
      } else {
        const { uuid } = this.detialObj;
        const obj = {
          ...params,
          uuid
        };
        const index = this.ruleList.findIndex((item) => item.uuid === uuid);
        this.ruleList.splice(index, 1, obj);
      }
      // console.log(params, 'params', this.ruleList);
    },
    del({ uuid }) {
      const index = this.ruleList.findIndex((item) => item.uuid === uuid);
      this.ruleList.splice(index, 1);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.conditionWrap {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  box-sizing: border-box;

  .addType {
    width: 100%;
    padding: 10px 20px 0 20px;
    box-sizing: border-box;

    .icon-xinzeng {
      color: #4689f5;
    }

    ::v-deep {
      .el-button {
        width: 100%;
      }
    }
  }

  .typeListWrap {
    height: calc(100% - 42px);
    margin: 0 auto;
    overflow-y: auto;

    .listItem {
      width: calc(100% - 40px);
      margin: 0 auto;
      flex-direction: column;
      margin-top: 10px;
      min-height: 106px;
      border: 1px solid #e9e9e9;
      border-radius: 4px;
      box-sizing: border-box;

      &:hover .listItem__title {
        background: #fafafa;
      }

      &:hover .listItem__title .item-right {
        display: block;
      }

      .listItem__title {
        height: 40px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e9e9e9;
        box-sizing: border-box;

        .item-left {
          width: calc(300px - 80px);
          padding-left: 10px;
          line-height: 36px;
          text-align: left;
          box-sizing: border-box;
          overflow: hidden;

          .icon-houtaishuju {
            margin-right: 10px;
            font-size: 24px;
            color: #fab71c;
            vertical-align: middle;
          }

          .item-name {
            font-size: 13px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #333333;
            vertical-align: middle;
          }
        }

        .item-right {
          display: none;
          padding-right: 10px;
          box-sizing: border-box;

          .iconfont {
            color: #bbc3cd;
            vertical-align: middle;
            cursor: pointer;

            &:hover {
              color: #4689f5;
            }
          }

          .split {
            margin: 0 8px;
            color: #e9e9e9;
          }
        }
      }

      .listContent {
        padding: 10px;
        box-sizing: border-box;

        .listItem__des {
          text-align: left;

          .des__label {
            min-width: 30px;
            display: inline-block;
            margin-right: 10px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #808080;
            line-height: 24px;
          }

          .des_table {
            display: inline-block;
            height: 24px;
            padding: 0 10px 0 8px;
            line-height: 24px;
            background: #e5f0ff;

            border-radius: 4px;

            .icon-shujubiao {
              margin-right: 2px;
              color: #5a80ed;
              font-size: 20px;
              vertical-align: text-top;
            }

            .des_tableName {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              vvertical-align: text-top;
            }
          }

          .des__memo {
            height: 20px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #808080;
            line-height: 20px;
            word-wrap: break-word;
          }
        }
      }
    }
  }
}
</style>
