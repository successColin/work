/**
* @name: inndex
* @author: DELL
* @date: 2021/9/14 14:21
* @description：inndex
* @update: 2021/9/14 14:21
*/
<!-- 页面 -->
<template>
  <div class="contentWrap">
    <div class="config-property">
      <div class="form-item">
        <div class="form-item-label">自动处理规则</div>
        <div class="form-item-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="isTriggerUserAutoPass"
              >流程触发者自动通过</el-checkbox
            >
            <br />
            <el-checkbox label="isCheckUserNullAutoPass"
              >审批人为空时自动通过</el-checkbox
            >
            <br />
            <el-checkbox label="isAlreadyCheckUserAutoPass"
              >已经审批过该对象的审批人自动通过</el-checkbox
            >
            <br />
            <!--            <el-checkbox label="isSameCheckUserWithLastNodeAutoPass"-->
            <!--              >处理人与上一节点相同自动通过</el-checkbox-->
            <!--            >-->
            <!--            <br />-->
          </el-checkbox-group>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">工作流撤回</div>
        <div class="form-item-content">
          <el-checkbox
            label="允许触发者撤回"
            v-model="allowRevoke"
          ></el-checkbox>
          <div class="select-field" v-if="allowRevoke">
            <div class="form-item-label">选择节点</div>
            <div>
              <apiot-select
                v-model="lastAllowRevokeNodeId"
                filterable
                placeholder="请选择撤回节点"
              >
                <el-option
                  v-for="item in approveNodeArr"
                  :key="item.nodeId"
                  :label="item.title"
                  :value="item.nodeId"
                >
                </el-option>
              </apiot-select>
            </div>
            <div class="memo">通过后不允许撤回</div>
          </div>
        </div>
      </div>
      <!--      <div class="form-item">-->
      <!--        <div class="form-item-label">人工节点通知</div>-->
      <!--        <div class="form-item-content">-->
      <!--          <el-checkbox v-model="radio2" label="工作流触发者不发送通知"></el-checkbox>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="form-item">-->
      <!--        <div class="form-item-content">-->
      <!--          <div class="item-content-box">-->
      <!--            <div class="box-left">允许查看流程图</div>-->
      <!--            <div class="box-right">-->
      <!--              <el-switch-->
      <!--                  v-model="enabled"-->
      <!--                  active-color="#4689F5"-->
      <!--                  inactive-color="#E0E0E0">-->
      <!--              </el-switch>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    flowData: {
      type: Object,
      default: () => {}
    },
    currentVersion: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      checkList: [],
      options: [],
      value: '',
      lastAllowRevokeNodeId: '',
      radio2: '',
      enabled: true,
      allowRevoke: '', // 触发方式
      termObj: {}, // 设置筛选条件的值
      approveNodeArr: [], // 流程中所有的审批节点
      approveNode: '' // 撤回的审批节点
    };
  },

  components: {},

  computed: {},

  mounted() {
    // console.log(this.currentVersion, '节点配置');
    const { globalAttributes } = this.currentVersion;
    if (JSON.stringify(globalAttributes) !== '{}') {
      const {
        lastAllowRevokeNodeId,
        allowRevoke,
        isAlreadyCheckUserAutoPass,
        isCheckUserNullAutoPass,
        isSameCheckUserWithLastNodeAutoPass,
        isTriggerUserAutoPass
      } = globalAttributes;
      this.lastAllowRevokeNodeId = lastAllowRevokeNodeId;
      this.allowRevoke = allowRevoke;
      if (isAlreadyCheckUserAutoPass) {
        this.checkList.push('isAlreadyCheckUserAutoPass');
      }
      if (isCheckUserNullAutoPass) {
        this.checkList.push('isCheckUserNullAutoPass');
      }
      if (isSameCheckUserWithLastNodeAutoPass) {
        this.checkList.push('isSameCheckUserWithLastNodeAutoPass');
      }
      if (isTriggerUserAutoPass) {
        this.checkList.push('isTriggerUserAutoPass');
      }
    }
    this.getApproveNodeList();
  },
  watch: {
    radio: {
      immediate: true,
      deep: true,
      handler(v) {
        // console.log(v);
        if (!v) {
          this.value1 = '';
        }
      }
    },
    value: {
      immediate: true,
      deep: true,
      handler() {
        if (['SAVEOREDIT', 'ONLYEDIT'].includes(this.radio) && this.value) {
          this.getFieldList();
        }
      }
    }
  },

  methods: {
    getApproveNodeList() {
      // 获取所有的审批节点
      const approveNodeArr = [];
      const approveLoop = (obj = {}, arr = []) => {
        // console.log(3232423, JSON.stringify(obj) === '{}');
        if (JSON.stringify(obj) === '{}') return;
        if (obj.type === 'approver') {
          arr.push({
            nodeId: obj.nodeId,
            title: obj.properties.title
          });
        }
        if (Object.prototype.hasOwnProperty.call(obj, 'childNode')) {
          approveLoop(obj.childNode, approveNodeArr);
        }
        if (
          Object.prototype.hasOwnProperty.call(obj, 'conditionNodes') &&
          obj.conditionNodes &&
          Array.isArray(obj.conditionNodes)
        ) {
          obj.conditionNodes.forEach((item) => {
            approveLoop(item, approveNodeArr);
          });
        }
      };
      approveLoop(this.flowData, approveNodeArr);
      this.approveNodeArr = approveNodeArr;
      // console.log(this.approveNodeArr, 'approveNodeArr');
    }
  },
  name: 'inndex'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  height: 100%;
  overflow: auto;

  .config-property {
    padding: 10px 20px;
    box-sizing: border-box;

    .form-item {
      margin-bottom: 10px;

      .form-item-label {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        text-align: left;
      }

      .form-item-content {
        text-align: left;

        .item-content-box {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          width: 100%;
          height: 46px;
          line-height: 46px;

          .box-left {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }

        ::v-deep {
          .el-checkbox {
            height: 30px;
            line-height: 30px;

            .el-checkbox__label {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }

          .el-radio {
            height: 30px;
            line-height: 30px;

            .el-radio__label {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }

        .select-field {
          .icon-bangzhu {
            font-size: 13px;
            color: #aaaaaa;
            font-weight: normal;
            cursor: pointer;

            &:hover {
              color: #4689f5;
            }
          }

          .memo {
            width: 100%;
            height: 40px;
            margin-top: 10px;
            padding-left: 10px;
            line-height: 40px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #808080;
            background: #f1f3f6;
            border-radius: 4px;
            box-sizing: border-box;
          }

          ::v-deep {
            .el-select {
              width: 100%;
            }

            .el-input__inner {
              border: 1px solid #e9e9e9;
            }

            .el-select {
              .el-input__inner:hover {
                border-color: #c0c4cc;
              }
            }

            .el-input__suffix {
              display: none;
            }

            .el-input {
              height: auto;
            }

            .el-icon-close {
              background: none;
              color: #78a7e5;

              &:hover {
                color: #4689f5;
              }
            }
          }
        }
      }
    }

    .list-btn {
      width: 100%;

      .iconfont {
        margin-right: 5px;
        color: #4689f5;
      }
    }
  }

  ::v-deep {
    .el-dialog__header {
      text-align: left;
    }

    .formula__box--header {
      text-align: left;
    }

    .formula__box--main {
      text-align: left;
    }
  }
}
</style>
