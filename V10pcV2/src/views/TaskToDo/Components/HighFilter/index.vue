/**
* @name: index
* @author: DELL
* @date: 2023/3/18 10:21
* @description：index
* @update: 2023/3/18 10:21
*/
<!-- 页面 -->
<template>
  <apiot-dialog
      class="highSearch searchCondition"
      :visible.sync="visible1"
      title="高级筛选"
      :isShowFooter="false"
  >
    <div class="searchCondition__high">
      <el-form
          ref="form"
          class="searchCondition__high--body"
          :model="form"
          label-width="80px"
          label-position="top"
      >
        <el-form-item class="searchComp__left">
          <div slot="label">
            <span> 流程名称 </span>
<!--            <el-dropdown-->
<!--                @command="handleCommand($event, 'wi.instance_name', 'lambda')"-->
<!--                class="searchComp__condition"-->
<!--                placement="bottom-start"-->
<!--            >-->
<!--          <span class="el-dropdown-link">-->
<!--            {{ conditionArr[form['wi.instance_name'].lambda] }}-->
<!--           <i class="iconfont icon-shujiantouzhankai"></i>-->
<!--          </span>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item-->
<!--                    :command="3"-->
<!--                    :value="3"-->
<!--                >模糊匹配-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item-->
<!--                    :command="1"-->
<!--                    :value="1"-->
<!--                >等于-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item-->
<!--                    :command="2"-->
<!--                    :value="2"-->
<!--                >不等于-->
<!--                </el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
          </div>
          <el-select
              class="searchComp__left--fw"
              style="width: 100%;"
              filterable
              v-model="form['wi.instance_name'].value"
              placeholder="请选择流程名称"
          >
            <el-option
                v-for="(item, i) in flowNames"
                :key="`${item}_${i}`"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
<!--          <el-input-->
<!--              clearable-->
<!--              class="searchComp__left&#45;&#45;fw"-->
<!--              v-model="form['wi.instance_name'].value"-->
<!--              placeholder="请输入流程名称"-->
<!--          />-->
        </el-form-item>
        <el-form-item class="searchComp__left">
          <div slot="label">
            <span> 节点名称 </span>
<!--            <el-dropdown-->
<!--                @command="handleCommand($event, 'wt.task_name', 'lambda')"-->
<!--                class="searchComp__condition"-->
<!--                placement="bottom-start"-->
<!--            >-->
<!--          <span class="el-dropdown-link">-->
<!--            {{ conditionArr[form['wt.task_name'].lambda] }}-->
<!--           <i class="iconfont icon-shujiantouzhankai"></i>-->
<!--          </span>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item-->
<!--                    :command="3"-->
<!--                    :value="3"-->
<!--                >模糊匹配-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item-->
<!--                    :command="1"-->
<!--                    :value="1"-->
<!--                >等于-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item-->
<!--                    :command="2"-->
<!--                    :value="2"-->
<!--                >不等于-->
<!--                </el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
          </div>
          <el-input
              clearable
              class="searchComp__left--fw"
              v-model="form['wt.task_name'].value"
              placeholder="请输入节点名称"
          />
        </el-form-item>
        <el-form-item class="searchComp__left">
          <div slot="label">
            <span> 发起人 </span>
<!--            <el-dropdown-->
<!--                @command="handleCommand($event, 'wi.trigger_user_id', 'lambda')"-->
<!--                class="searchComp__condition"-->
<!--                placement="bottom-start"-->
<!--            >-->
<!--          <span class="el-dropdown-link">-->
<!--            {{ conditionArr[form['wi.trigger_user_id'].lambda] }}-->
<!--           <i class="iconfont icon-shujiantouzhankai"></i>-->
<!--          </span>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item-->
<!--                    :command="1"-->
<!--                    :value="1"-->
<!--                >等于-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item-->
<!--                    :command="2"-->
<!--                    :value="2"-->
<!--                >不等于-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item-->
<!--                    :command="4"-->
<!--                    :value="4"-->
<!--                >In-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item-->
<!--                    :command="5"-->
<!--                    :value="5"-->
<!--                >Not In-->
<!--                </el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
          </div>
          <CCUsers
              :value="form['wi.trigger_user_id'].value"
              @change="handleCommand($event, 'wi.trigger_user_id', 'value')"
          />
        </el-form-item>
        <el-form-item class="searchComp__left">
          <div slot="label">
            <span> 发起时间 </span>
<!--            <el-dropdown-->
<!--                @command="handleCommand($event, 'wi.trigger_time', 'lambda')"-->
<!--                class="searchComp__condition"-->
<!--                placement="bottom-start"-->
<!--            >-->
<!--          <span class="el-dropdown-link">-->
<!--            {{ conditionArr[form['wi.trigger_time'].lambda] }}-->
<!--           <i class="iconfont icon-shujiantouzhankai"></i>-->
<!--          </span>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item-->
<!--                    :command="8"-->
<!--                    :value="8"-->
<!--                >日期范围内-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item-->
<!--                    :command="9"-->
<!--                    :value="9"-->
<!--                >日期范围外-->
<!--                </el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
          </div>
          <el-date-picker
              class="searchComp__left--fw"
              v-model="form['wi.trigger_time'].value"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <footer class="searchCondition__high--footer">
        <apiot-button @click="visible1 = false">取消</apiot-button>
        <apiot-button type="primary" @click="handleOk">确定</apiot-button>
      </footer>
    </div>
  </apiot-dialog>
</template>

<script>
import { timeShortcuts } from '@/config';

// const CCUsers = () =>
//     import('@/views/Flow/Content/Process/ConfigDrawer/ConfigComponents/FlowApproval/CCUsers');
const CCUsers = () => import('../UserSelect/index');
const initObj = {
  'wi.instance_name': {
    value: '',
    lambda: 3,
  },
  'wt.task_name': {
    value: '',
    lambda: 3,
  },
  'wi.trigger_user_id': {
    value: [],
    lambda: 4,
  },
  'wi.trigger_time': {
    value: [],
    lambda: 8,
  }
};
export default {
  props: {
    flowNames: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      userDialogVisible: false,
      visible1: false,
      pickerOptions: {
        shortcuts: timeShortcuts,
      },
      form: JSON.parse(JSON.stringify(initObj)),
      conditionArr: {
        1: '等于',
        2: '不等于',
        3: '模糊匹配',
        4: 'In',
        5: 'Not In',
        6: '大于等于',
        7: '小于等于',
        8: '日期范围内',
        9: '日期范围外'
      },
    };
  },

  components: {
    CCUsers
  },

  computed: {},

  mounted() {
  },

  methods: {
    handleCommand(v, key, key1) {
      this.form[key][key1] = v;
    },
    show() {
      this.visible1 = true;
      this.form = JSON.parse(JSON.stringify(initObj));
    },
    handleOk() {
      const arr = [];
      const normalKey = ['wi.instance_name', 'wt.task_name'];
      Object.keys(this.form)
          .forEach((key) => {
            const obj = this.form[key];
            if (normalKey.includes(key) && obj.value) {
              arr.push({
                name: key,
                value: obj.value,
                lambda: obj.lambda
              });
            }
            if (key === 'wi.trigger_user_id' && obj.value.length) {
              const ids = obj.value.map((user) => user.id)
                  .join(',');
              arr.push({
                name: key,
                value: ids,
                lambda: obj.lambda
              });
            }
            if (key === 'wi.trigger_time' && obj.value && obj.value.length) {
              if (obj.lambda === 8) {
                arr.push({
                  name: key,
                  value: obj.value[0],
                  lambda: 6
                }, {
                  name: key,
                  value: obj.value[1],
                  lambda: 7
                },);
              }
              if (obj.lambda === 9) {
                arr.push({
                  name: key,
                  value: obj.value[0],
                  lambda: 7
                }, {
                  name: key,
                  value: obj.value[1],
                  lambda: 6
                },);
              }
            }
          });
      this.visible1 = false;
      this.$emit('doHighFilter', arr);
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.highSearch {
  ::v-deep {
    .el-form-item__label {
      padding-top: 0px;
      line-height: 18px;
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      display: flex;
    }
  }
}

.searchCondition {
  &__high {
    overflow: auto;
    height: 100%;

    &--header {
      box-sizing: border-box;
      height: 54px;
      line-height: 53px;
      border-bottom: 1px solid #e9e9e9;
      padding-left: 20px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
    }

    &--footer {
      padding: 0 20px;
      box-sizing: border-box;
      height: 64px;
      border-top: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    &--body {
      padding: 10px 20px 0;
      box-sizing: border-box;
      height: calc(100% - 64px);
      overflow-x: hidden;
      overflow-y: auto;

      .searchComp__condition {
        cursor: pointer;
        font-weight: normal;
        color: $--color-primary;
        padding: 2px 10px;
        font-family: PingFangSC-Regular, PingFang SC;

        &:hover {
          background-color: #f6f6f8;
          border-radius: 4px;

          .el-dropdown-link {
            .iconfont {
              visibility: visible;
            }
          }
        }

        .el-dropdown-link {
          .iconfont {
            visibility: hidden;
          }
        }
      }
    }
  }

  ::v-deep {
    & > .el-dialog {
      height: 540px;

      & > .el-dialog__body {
        padding: 0;
        height: calc(100% - 54px);

        .el-date-editor {
          width: 100%;
        }
      }
    }
  }
}
</style>
