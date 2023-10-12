/**
* @name: 后台数据
* @author: DELL
* @date: 2023/10/10 16:29
* @description：ExtInt
* @update: 2023/10/10 16:29
*/
<!-- 页面 -->
<template>
  <div class="extInt dragItem">
    <CollapseCard>
      <template v-slot:title>
        <div class="header">
          <div>
            <span class="iconfont icon-zongxiangtuodong m-r-10"></span>
            <i class="iconfont icon-houtaishuju m-r-8"></i>
            <span>后台数据</span>
          </div>
          <div class="right">
            <apiot-button class="list-btn" @click.stop="doShow(1, {})">
              <i class="icon-xinzeng iconfont m-r-4"></i>
              添加影响类型
            </apiot-button>
            <div @click="del" class="m-l-20">
              <span class="iconfont icon-shanchu"></span>删除
            </div>
          </div>
        </div>
      </template>
      <template>
        <div class="content">
          <apiot-nodata
              style="min-height: 140px"
              v-if="!value.attribute.ruleList.length"/>
          <div class="listItem" v-for="item in value.attribute.ruleList" :key="item.uuid">
            <div class="title">{{getType(item)}}</div>
            <div class="trigger">
              <span class="des__label">触发表:</span>
              <span class="des_table" title="ct_task">
                <span class="iconfont icon-shujubiao"></span>
                <span class="des_tableName">{{item.tableName}}</span>
              </span>
            </div>
            <div class="memo" :title="item.memo">
              备注：{{item.memo}}
            </div>
            <div class="operator">
              <span class="iconfont icon-bianji" @click="doShow(2, item)"></span>
              <span class="split">|</span>
              <span class="iconfont icon-shanchu" @click="delItem(item)"></span>
            </div>
          </div>
        </div>
      </template>
    </CollapseCard>
    <transition name="slide-bottom">
      <AddImpact
          :visible.sync="visible"
          v-if="visible"
          :lambdaArr="lambdaArr"
          :currentType="currentType"
          :editObj="detialObj"
          @addAffectType="addAffectType"
          :showType="[1, 6]"
          :currentVersion="currentVersion"
      />
    </transition>
  </div>
</template>

<script>
import { lambdaArr } from '@/config';
import CollapseCard from '@/views/Proxy/Layout/ApiConfig/components/collapseCard';
import AddImpact from '../../FlowBackgroundData/AddImpact';

export default {
  props: {
    currentVersion: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: Object,
      default() {
        return {
          key: '',
          nodeType: '6',
          attribute: {
            ruleList: []
          },
        };
      }
    }
  },
  data() {
    return {
      detialObj: {}, // 内容详情
      lambdaArr,
      visible: false,
      currentType: 1, // 1 新增， 2 编辑
    };
  },

  components: {
    AddImpact,
    CollapseCard
  },

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
  },

  mounted() {
  },
  watch: {
    value: {
      deep: true,
      handler(v) {
        console.log(v, '组件值变化');
      }
    }
  },
  methods: {
    addAffectType(params) {
      if (this.currentType === 1) {
        params.uuid = Date.parse(new Date());
        this.value.attribute.ruleList.unshift(params);
      } else {
        const { uuid } = this.detialObj;
        const obj = {
          ...params,
          uuid
        };
        const index = this.value.attribute.ruleList.findIndex((item) => item.uuid === uuid);
        this.value.attribute.ruleList.splice(index, 1, obj);
      }
      // console.log(params, 'params', this.ruleList);
    },
    delItem({ uuid }) {
      const index = this.value.attribute.ruleList.findIndex((item) => item.uuid === uuid);
      this.value.attribute.ruleList.splice(index, 1);
    },
    doShow(type, obj) { // 新增或者编辑
      this.visible = true;
      this.currentType = type;
      this.detialObj = obj;
    },
    del() {
      this.$emit('del');
    }
  },
  name: 'ExtInt',
};
</script>

<style lang='scss' scoped>
.extInt {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 20px;
    box-sizing: border-box;

    div {
      display: flex;
      align-items: center;
    }

    .icon-zongxiangtuodong {
      color: #AAAAAA;
      cursor: pointer;
    }

    .icon-houtaishuju {
      font-size: 24px;
      color: rgb(250, 183, 28);
    }

    .right {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;

      span, .icon-xinzeng {
        color: #4689F5;
        cursor: pointer;
      }
    }
  }

  .content {
    padding: 10px 10px 0 10px;
    box-sizing: border-box;

    .listItem {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 0 10px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #E9E9E9;
      box-sizing: border-box;

      .title {
        width: 60px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      .trigger {
        width: 220px;
        display: flex;
        align-items: center;
        .des__label {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #808080;
        }

        .des_table {
          display: inline-block;
          height: 24px;
          margin-left: 10px;
          padding: 0 10px 0 8px;
          line-height: 24px;
          background: #e5f0ff;
          border-radius: 4px;
          align-items: center;

          .icon-shujubiao {
            margin-right: 2px;
            color: #5a80ed;
            font-size: 20px;
            vertical-align: top;
          }
          .des_tableName{
            display: inline-block;
            max-width: 124px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 13px;
            font-family: PingFangSC-Regular,PingFang SC;
            font-weight: 400;
            color: #333;
          }
        }
      }
      .memo{
        width: 283px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .operator {
        width: 50px;
        display: flex;
        align-items: center;
        span {
          display: none;
          color: #bbc3cd;
          vertical-align: middle;
          cursor: pointer;
        }
        .iconfont:hover {
          color: #4689f5;
        }
        .split{
          margin: 0 8px;
          color: #e9e9e9;
        }
      }
      &:hover .operator span{
        display: block;
        transition: all .1s ease;
      }
    }
    ::v-deep {
      .el-dialog__body {
        height: calc(100% - 54px - 54px) !important;
      }
    }
  }

  ::v-deep {
    .el-collapse-item__header {
      height: 42px;
      line-height: 42px;
    }
  }
}
</style>
