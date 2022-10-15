<!-- 页面 -->
<template>
  <el-form
    v-on="$listeners"
    v-bind="$attrs"
    ref="valiForm"
    :rules="rules"
    @submit.native.prevent
    :model="formData"
  >
    <el-row
      :gutter="gutter"
      class="form_el_row_wrap"
      style="margin: 0 !important"
    >
      <el-col :span="24" v-if="formData.id" class="btnWrap">
        <apiot-button
          type="primary"
          @click="resetPassword($t('user.sureReset'), 'pass')"
          >{{ $t('user.resetPassword') }}
        </apiot-button>
        <apiot-button
          class="departure"
          @click="resetPassword($t('user.sureOutLine'))"
          >{{ $t('user.outline') }}
        </apiot-button>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('user.username')" prop="username">
          <apiot-input
            :disabled="!!formData.id"
            v-model="formData.username"
            maxlength="30"
            show-word-limit
            v-forbid
            :placeholder="$t('user.placeEnterName')"
          ></apiot-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('user.account1')" prop="account">
          <apiot-input
            :disabled="!!formData.id"
            v-forbid
            v-model="formData.account"
            maxlength="30"
            show-word-limit
            :placeholder="$t('user.placeEnterAccount')"
          ></apiot-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('user.telephone')" prop="telephone">
          <el-input
            :placeholder="$t('user.placeEnterPhone')"
            v-model="formData.telephone"
            maxlength="11"
            show-word-limit
            class="tellphone"
          >
            <el-select
              value="86"
              slot="prepend"
              :placeholder="$t('placeholder.pleaseSelect')"
              style="width: 89px"
            >
              <el-option label="+86" value="86"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('user.userEmail')" prop="email">
          <apiot-input
            :placeholder="$t('user.placeEnterEmail')"
            v-model="formData.email"
          >
          </apiot-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('user.userwechat')" prop="wechat">
          <apiot-input
              :placeholder="$t('user.placeEnterWechat')"
              v-model="formData.wechat"
          >
          </apiot-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('user.accountState')" prop="enabled">
          <el-switch
              v-model="formData.enabled"
              :active-text="$t('user.Enable')"
              :active-value="true"
              :inactive-value="false"
              :inactive-text="$t('user.Disable')"
          >
          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('user.orgName')" prop="orgid">
          <edit-org
            :orgObj="formData.orgObj || {}"
            v-on:doEditOrg="(obj) => handleEditOrg(obj, 'orgObj', 'orgid')"
          >
          </edit-org>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('user.userPostName')" prop="userPostId">
          <edit-pos
            :orgObj="formData.posObj || {}"
            v-on:doEditOrg="(obj) => handleEditOrg(obj, 'posObj')"
          ></edit-pos>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('user.roleNames')" prop="roles">
          <ass-roles :roles="formData.roles || []" :updateData="updateData">
          </ass-roles>
        </el-form-item>
      </el-col>
      <!--      <el-col :span="12">-->
      <!--        <el-form-item label="用户到期时间" prop="accountExpiringTime">-->
      <!--          <el-date-picker-->
      <!--             v-model="formData.accountExpiringTime"-->
      <!--             type="date"-->
      <!--             value-format="yyyy-MM-dd"-->
      <!--             laceholder="选择日期">-->
      <!--          </el-date-picker>-->
      <!--        </el-form-item>-->
      <!--      </el-col>-->
      <el-col :span="12">
        <el-form-item :label="$t('user.addLable')" prop="userLabel">
          <add-Tag
            v-on:editTag="handleEditTag"
            :tags="formData.userLabel"
            :updateData="updateData"
          ></add-Tag>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('role.memo')" prop="memo">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="$t('role.pleaseEnterkeySearch')"
            v-model="formData.memo"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { resetPassword, updateUserState } from '@/api/user';
import AddTag from './AddTag/index';
import EditOrg from './EditOrg/index';
import AssRoles from './AssRoles/index';
import EditPos from './EditPos/index';

export default {
  inheritAttrs: false,
  props: {
    roleGroupList: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    updateData: {
      type: Function,
      default: () => {}
    },
    fetchUserList: {
      type: Function,
      default: () => {}
    },
    toggele: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      gutter: 30
    };
  },

  components: {
    AddTag,
    EditOrg,
    AssRoles,
    EditPos
  },

  computed: {},

  mounted() {
    // console.log(this.formData);
  },

  methods: {
    async resetPassword(message, type) {
      try {
        await this.$confirm(message, '提示');
        this.doReset(type);
      } catch (e) {
        // console.log(e);
      }
    },
    async doReset(type) {
      try {
        const api = type === 'pass' ? resetPassword : updateUserState;
        // console.log(api);
        await api({ userId: this.formData.id });
        this.$message({
          type: 'success',
          message: '操作成功！'
        });
        this.toggele();
        this.fetchUserList();
      } catch (e) {
        // console.log(e);
      }
    },
    handleEditTag(tagArr) {
      // 编辑标签
      this.updateData({ userLabel: tagArr });
    },
    handleEditOrg(obj, filed1, filed2) {
      // 修改组织
      const objValue = { [filed1]: obj };
      let newObj = null;
      if (!filed2) {
        newObj = objValue;
      } else {
        newObj = {
          ...objValue,
          [filed2]: obj.id
        };
      }
      this.updateData(newObj);
      if (filed1 === 'orgObj') {
        this.$refs.valiForm.validateField('orgid', () => {
          if (!this.formData.orgObj || !this.formData.orgObj.id) {
            return false;
          }
          return true;
        });
      }
    }
  },
  name: 'formItem'
};
</script>

<style lang='scss' scoped>
.form_el_row_wrap {
  padding: 16px 21px 34px 21px;
  -webkit-font-smoothing: antialiased;

  .btnWrap {
    padding-bottom: 6px;
    margin-bottom: 23px;
    padding-left: 0 !important;
    padding-right: 0 !important;
    width: calc(100% - 30px);
    margin-left: 15px;
    border-bottom: 1px solid #e9e9e9;
  }

  .departure {
    background: #ee5e5e;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    border: none;

    &:active {
      background: #ee5e5e !important;
    }

    &:focus {
      background: #ee5e5e !important;
    }

    &:hover {
      background: #ee5e5e !important;
      color: #ffffff !important;
      opacity: 0.8;
    }
  }

  .tellphone {
    ::v-deep {
      .el-input__inner {
        cursor: pointer;
      }
    }
  }

  ::v-deep {
    .el-form-item__label {
      padding-bottom: 4px;
      color: #333333;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
    }

    .el-form-item.is-error .orgWrapTitleAndSearch__search .el-input__inner {
      border-color: #e9e9e9;
    }
    .el-form-item.is-error
      .orgWrapTitleAndSearch__search
      .el-input__inner:focus {
      border-color: #4689f5;
    }

    .el-input__inner {
      height: 32px;
    }

    .el-select {
      width: 100%;
    }

    .el-form-item__error {
      padding: 4px;
    }

    .el-date-editor--date {
      width: 100%;
    }

    .is-checked .el-switch__core::after {
      margin-left: -20px;
    }

    .el-switch {
      .el-switch__label--left {
        &.is-active + .el-switch__core:after {
          left: 4px;
        }

        &.is-active + .el-switch__core {
          background: #a2c4fa;
          border-color: #a2c4fa;
        }

        &.is-active ~ .el-switch__label--right {
          display: none;
        }

        &.is-active {
          position: absolute;
          left: 25px;
          display: block;
          margin-right: 0;
          color: #ffffff;
          z-index: 2;

          & > span {
            color: #ffffff;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
          }
        }
      }

      .el-switch__label--right {
        &.is-active {
          position: absolute;
          //left: 35px;
          margin-left: 8px;

          & + .el-switch__core {
            background: #4689f5 !important;
          }

          & > span {
            color: #ffffff;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
          }
        }

        &.is-active ~ .el-switch__label--left {
          display: none;
        }
      }
    }

    .el-switch__label--left {
      display: none;
    }

    .el-switch__core:after {
      top: 3px;
      font-size: 14px;
    }

    .el-switch__core {
      width: 58px !important;
      height: 24px !important;
      border-radius: 13px;
    }

    .el-input__icon {
      line-height: 32px;
    }
  }
}
</style>
