/**
* @name: index
* @author: DELL
* @date: 2022/5/5 14:00
* @description：index
* @update: 2022/5/5 14:00
*/
<!-- 页面 -->
<template>
  <div class="wrap" v-loading="loading">
    <div class="searchWrap">
      <apiot-button type="primary" @click="visible = true">
        <i class="icon-xinzeng iconfont m-r-4"></i>
        新增流程
      </apiot-button>
      <search-input @getList="getList" v-model.trim="keywords"></search-input>
    </div>
    <div class="listWrap">
      <div class="listContentWrap">
        <apiot-nodata v-if="!list.length"></apiot-nodata>
        <div class="listItemWrap" v-for="(item, index) in list" :key="item.id">
          <div class="iconfont icon-liucheng" :style="getColor(index)"></div>
          <div class="itemContent">
            <div class="contentBlock p-l-18">
              <div class="name">
                {{ item.workflowCode }}-{{ item.workflowName }}
              </div>
              <div class="des">创建时间：{{ item.createTime }}</div>
            </div>
            <div class="contentBlock p-l-18">
              <div class="des">
                <div style="float: left; line-height: 24px; margin-right: 10px">
                  创建人
                </div>
                <Users
                  :row="item"
                  :key="item.createuserid"
                  userid="createuserid"
                  prop="createUser"
                />
              </div>
              <div class="des">更新时间：{{ item.modifyTime }}</div>
            </div>
            <div class="contentBlock p-r-30">
              <div class="des tr">
                <div v-if="item.activeVersion" class="userWrap">
                  当前使用版本：
                  <span class="tag">v{{ item.activeVersion }}</span>
                </div>
              </div>
              <div class="tr">
                <apiot-button type="text" @click="doEdit(item)"
                  >编辑</apiot-button
                >
                <apiot-button type="text" @click="doDel(item)"
                  >删除</apiot-button
                >
                <apiot-button type="primary" size="mini" @click="design(item)">
                  <i class="icon-caidansheji iconfont m-r-4"></i>
                  设计
                </apiot-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <apiot-dialog
      :visible.sync="visible"
      custom-class="editOrAdd"
      :title="flowObj.id ? '编辑流程' : '新增流程'"
      :destroy-on-close="true"
      :modal-append-to-body="false"
      v-on:sure-click="handleOk"
      :loading="btnLoading"
    >
      <div>
        <el-form
          @submit.native.prevent
          ref="dynamicValidateForm"
          label-width="80px"
          label-position="top"
          :model="flowObj"
          :rules="rules"
        >
          <el-form-item prop="workflowCode" label="流程编码">
            <apiot-input v-model="flowObj.workflowCode"></apiot-input>
          </el-form-item>
          <el-form-item prop="workflowName" label="流程名称">
            <apiot-input v-model="flowObj.workflowName"></apiot-input>
          </el-form-item>
        </el-form>
      </div>
    </apiot-dialog>
    <FlowDesign
      v-if="flowVisible"
      @doBack="doBack"
      :activeFlow="designObj"
    ></FlowDesign>
  </div>
</template>

<script>
import { addFlow, delFlow, editFlow, getFlowList } from '@/api/flow';
import { userColorArr } from '@/config';
import Users from '@/views/Users/Main/UserColumn/Users/index';
import FlowDesign from './Process/index';

export default {
  data() {
    return {
      btnLoading: false,
      flowVisible: false,
      keywords: '',
      selectKey: {},
      list: [],
      loading: false,
      visible: false,
      flowObj: {},
      rules: {
        workflowName: [{ required: true, message: '请输入流程名称', trigger: 'change' }]
      },
      designObj: {} // 设计对象
    };
  },

  components: {
    FlowDesign,
    Users
  },

  computed: {
    getColor() {
      return function (index) {
        const i = index % 5;
        return `color: ${userColorArr[i]}`;
      };
    }
  },
  watch: {
    visible(v) {
      if (!v) {
        this.flowObj = {};
      }
    }
  },
  mounted() {
    this.$bus.$off('FlowGroup').$on('FlowGroup', (item) => {
      this.selectKey = item;
      this.getList();
    });
    this.$bus.$off('flowDesign_back').$on('flowDesign_back', () => {
      this.doBack();
    });
  },

  methods: {
    doBack() {
      this.flowVisible = false;
      this.designObj = {};
    },
    design(item) {
      console.log(item);
      this.flowVisible = true;
      this.designObj = item;
    },
    handleOk() {
      this.$refs.dynamicValidateForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          this.add();
        } else {
          return false;
        }
      });
    },
    async doDel({ id }) {
      // 删除流程
      try {
        await this.$confirm('确定删除该流程吗？', this.$t('common.tip'), { type: 'warning' });
        await delFlow({ workflowInfoId: id });
        await this.getList();
        this.$message.success('删除成功!');
      } catch (e) {
        console.warn(e);
      }
    },
    doEdit(obj) {
      this.flowObj = JSON.parse(JSON.stringify(obj));
      this.visible = true;
    },
    async add() {
      // 新增流程
      this.loading = true;
      try {
        const functionId = this.selectKey.id;
        const { id } = this.flowObj;
        const api = id ? editFlow : addFlow;
        await api({
          groupId: functionId,
          ...this.flowObj
        });
        await this.getList();
        this.visible = false;
        this.btnLoading = false;
        this.$message.success('操作成功!');
      } catch (e) {
        this.loading = false;
        this.btnLoading = false;
        this.$message.warning('操作失败');
      }
    },
    async getList() {
      const params = {
        keywords: this.keywords,
        groupId: this.selectKey.id
      };
      try {
        this.loading = true;
        this.list = await getFlowList(params);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .searchWrap {
    width: 100%;
    height: 42px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .listWrap {
    width: 100%;
    height: calc(100% - 42px);
    box-sizing: border-box;
    overflow-y: auto;

    .listContentWrap {
      width: 100%;
      height: 100%;
      padding: 0 10px;
      box-sizing: border-box;

      .listItemWrap {
        display: flex;
        align-items: center;
        height: 97px;
        margin-bottom: 10px;
        background: #ffffff;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        border: 1px solid #f1f1f1;

        .icon-liucheng {
          margin-left: 26px;
          font-size: 32px;
        }

        .itemContent {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;

          .contentBlock {
            flex: 1;
            align-items: center;
            display: grid;
            height: 65%;
            box-sizing: border-box;

            .name {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            .des {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #808080;
              .userWrap {
                height: calc(63.05px / 2);
              }
              .tag {
                display: inline-block;
                height: 24px;
                padding: 0 10px;
                color: #4689f5;
                line-height: 24px;
                background: #e5f0ff;
                border-radius: 4px;
              }
            }

            .tr {
              text-align: right;
            }
          }

          .p-l-18 {
            padding-left: 18px;
          }

          .p-r-30 {
            padding-right: 30px;
          }
        }
      }
      .listItemWrap:hover {
        box-shadow: 0px 2px 10px 0px rgb(0 0 0 / 14%);
      }
    }
  }
  ::v-deep {
    .editOrAdd .el-dialog__body {
      height: 170px;
      padding: 20px;
    }
  }
}
</style>
