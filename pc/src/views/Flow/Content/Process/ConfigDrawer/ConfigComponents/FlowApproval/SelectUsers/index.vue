/**
* @name: index
* @author: DELL
* @date: 2021/9/16 14:28
* @description：index
* @update: 2021/9/16 14:28
*/
<!-- 选择审批人页面 -->
<template>
  <section class="userBox">
    <div class="userBox__content">
      <el-popover
          popper-class="flow__select__appover"
          :visible-arrow="false"
          placement="bottom-start"
          width="300"
          trigger="click"
      >
        <div class="select__options">
          <div
              class="select__item"
              :class="{ active: orgVisible }"
              @click="showOrgDialog"
          >
            组织架构
          </div>
          <div
              class="select__item"
              :class="{ active: roleVisible }"
              @click="showRoleDialog"
          >
            角色
          </div>
          <div
              class="select__item"
              :class="{ active: posVisible }"
              @click="showPosDialog"
          >
            职位
          </div>
          <div
              class="select__item"
              :class="{ active: visible }"
              @click="showUserDialog"
          >
            固定人员
          </div>
          <div class="select__split"></div>
          <div class="select__memo">使用触发表源中的人员</div>
          <filterable-input
              style="margin: 0 20px;"
              class="list__item--column"
              placeholder="请选择字段"
              :tableName="tableName"
              :showInfo="approverObj.FIELD"
              :dialogType="2"
              :notShowSys="false"
              @selectRes="selectColumnRes"
          ></filterable-input>
          <div class="select__split"></div>
          <div class="select__memo">使用流程节点对象下的人员</div>
          <el-menu
              :default-active="active"
              :unique-opened="true"
              class="el-menu-vertical-demo"
              @select="selectUserType"
          >
            <el-submenu
                :index="`${node.id}`"
                v-for="node in nodeList"
                :key="node.id"
            >
              <template slot="title">
                <span>{{ node.nodeTitle }}</span>
              </template>
              <el-menu-item
                  :index="`${node.id}_1_${node.nodeTitle}`"
                  v-if="node.nodeType === 1"
              >
                <span>[人员]</span> 发起人
              </el-menu-item>
              <el-menu-item
                  :index="`${node.id}_2_${node.nodeTitle}`"
                  v-if="[3, 5].includes(node.nodeType)"
              >
                <span>[人员]</span>创建人
              </el-menu-item
              >
              <el-menu-item
                  :index="`${node.id}_3_${node.nodeTitle}`"
                  v-if="[3, 5].includes(node.nodeType)"
              >
                <span>[人员]</span>执行人
              </el-menu-item
              >
            </el-submenu>
          </el-menu>
        </div>
        <span class="userBox__AddBtn" ref="addBtn" slot="reference">
          <i class="iconfont icon-jiahao"></i>
        </span>
      </el-popover>
      <el-input
          class="search"
          v-model="searchInput"
          :placeholder="$t('org.searchUser')"
          @input="debouncedSearch"
          ref="btn"
      ></el-input>
    </div>
    <div class="selected-result">
      <div v-show="approverObj.ORG.length">
        <div class="selected-title">组织</div>
        <div>
          <el-tag
              class="org__item"
              v-for="item in approverObj.ORG"
              :key="item.id"
          >
            <span class="iconfont icon-zuzhi"></span>{{ item.name }}
            <span class="iconfont icon-guanbi" @click="deleteOrg(item)"></span>
          </el-tag>
        </div>
      </div>
      <div v-show="approverObj.ROLE.length">
        <div class="selected-title">角色</div>
        <div>
          <el-tag
              class="role__item"
              v-for="item in approverObj.ROLE"
              :key="item.id"
          >
            <span class="iconfont icon-jiaose"></span>{{ item.roleName }}
            <span class="iconfont icon-guanbi" @click="deleteRole(item)"></span>
          </el-tag>
        </div>
      </div>
      <div v-show="approverObj.POST.length">
        <div class="selected-title">职位</div>
        <div>
          <el-tag
              class="pos__item"
              v-for="item in approverObj.POST"
              :key="item.id"
          >
            <span class="iconfont icon-zhiwei"></span>{{ item.name }}
            <span class="iconfont icon-guanbi" @click="deletePos(item)"></span>
          </el-tag>
        </div>
      </div>
      <div v-show="approverObj.USER.length">
        <div class="selected-title">固定人员</div>
        <div style="overflow: hidden">
          <span
              class="userBox__tag"
              v-for="item in approverObj.USER"
              :key="item.id"
          >
            <user-headname
                :userInfo="item"
                prop="username"
                colorId="id"
                :isBig="true"
                :isClear="true"
                @handleClear="deleteUser"
            />
          </span>
        </div>
      </div>
      <div v-show="approverObj.FIELD && JSON.stringify(approverObj.FIELD) !== '{}'">
        <div class="selected-title fieldWrap">{{ text }}：
          {{ approverObj.FIELD ? approverObj.FIELD.columnName : '' }}
          <span class="iconfont icon-guanbi" @click="deleteField"></span>
        </div>
      </div>

      <ul class="flowDetailMembers" :key="updateKey">
        <li
            class="flexRow"
            :style="`z-index: ${i};`"
            v-for="(confg, i) in approverObj.NODE"
            :key="confg.timestamp"
        >
          <div class="flowDetailTagBox">
            <div
                class="flowDetailMemberNodeName ellipsis bold"
                :title="confg.nodeTitle"
            >
              {{ confg.nodeName }}
            </div>
            <div
                class="flowDetailMemberFieldName ellipsis bold"
                :title="renderBaseType(confg.baseType)"
            >
              {{ renderBaseType(confg.baseType) }}
            </div>
          </div>

          <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              popper-class="usersSelectPopover"
              v-if="confg.superiorType"
          >
            <div>
              <div
                  v-if="
                  !confg.superiorType || [1, 2].includes(confg.superiorType)
                "
                  class="select_item_user"
                  @click="selectCharge(confg, 1, i)"
              >
                组织负责人
              </div>
              <div
                  v-if="
                  !confg.superiorType || [1, 2].includes(confg.superiorType)
                "
                  class="select_item_user"
                  @click="selectCharge(confg, 2, i)"
              >
                上级组织负责人
              </div>
              <div
                  v-if="isTrue(confg.superiorType, 3)"
                  class="select_item_user"
                  @click="selectCharge(confg, 3, i)"
              >
                所属组织
              </div>
              <div
                  v-if="isTrue(confg.superiorType, 4)"
                  class="select_item_user"
                  @click="selectCharge(confg, 4, i)"
              >
                所属组织上级
              </div>
              <div
                  v-if="
                  ![1, 2, 3, 4].includes(confg.superiorType) &&
                  confg.superiorType
                "
                  class="select_item_user"
                  @click="selectCharge(confg, 5, i)"
              >
                职位
              </div>
            </div>

            <div
                class="ming Dropdown pointer flowDetailOrganize organizeTransform"
                v-if="confg.superiorType"
                slot="reference"
            >
              <div style="height: 28px">
                <div class="Dropdown--input Dropdown--border">
                  <div
                      class="flowDetailMemberOrganizeTitle"
                      :title="renderCharge(confg.superiorType)"
                  >
                    {{ renderCharge(confg.superiorType) }}
                  </div>
                </div>
              </div>
            </div>
          </el-popover>
          <div
              class="ming Dropdown pointer flowDetailOrganize organizeTransform"
              v-if="confg.postId"
          >
            <!--            <el-tag-->
            <!--                class="pos__item"-->
            <!--            >-->
            <!--              <span class="iconfont icon-zhiwei"></span>{{ confg.postName }}-->
            <!--            </el-tag>-->
            <div style="height: 28px">
              <div class="Dropdown--input Dropdown--border">
                <div class="flowDetailMemberOrganizeTitle postName" :title="confg.postName">
                  {{ confg.postName }}
                </div>
              </div>
            </div>
          </div>
          <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              popper-class="usersSelectPopover"
              v-if="isShowEnd(confg.superiorType, confg.postId)"
          >
            <div>
              <div
                  v-if="
                  !confg.superiorType || [1, 2].includes(confg.superiorType)
                "
                  class="select_item_user"
                  @click="selectCharge(confg, 1, i)"
              >
                组织负责人
              </div>
              <div
                  v-if="
                  !confg.superiorType || [1, 2].includes(confg.superiorType)
                "
                  class="select_item_user"
                  @click="selectCharge(confg, 2, i)"
              >
                上级组织负责人
              </div>
              <div
                  v-if="
                  !confg.superiorType ||
                  ![1, 2, 3, 4].includes(confg.superiorType)
                "
                  class="select_item_user"
                  @click="selectCharge(confg, 3, i)"
              >
                所属组织
              </div>
              <div
                  v-if="
                  !confg.superiorType ||
                  ![1, 2, 3, 4].includes(confg.superiorType)
                "
                  class="select_item_user"
                  @click="selectCharge(confg, 4, i)"
              >
                所属组织上级
              </div>
              <div
                  v-if="[3, 4].includes(confg.superiorType)"
                  class="select_item_user"
                  @click="selectCharge(confg, 5, i)"
              >
                职位
              </div>
            </div>
            <div class="opeMore" slot="reference">
              <span
                  v-if="
                  !confg.superiorType || [3, 4].includes(confg.superiorType)
                "
                  ref="addMores"
                  class="icon-gengduocaozuo iconfont"
              ></span>
            </div>
          </el-popover>
          <span
              @click="deleteCharge(i)"
              class="mLeft5 flowDetailMemberDel"
              data-tip="刪除"
          >
            <i class="icon-guanbi iconfont"></i>
          </span>
        </li>
      </ul>
    </div>
    <div class="userBox__searchWrap" v-if="searchInput && isShowSearchBox">
      <div class="searchResulet">
        {{ $t('user.search') }}"<span>{{ searchInput }}</span
      >"{{ $t('user.searchResult') }}{{
          usersSearchList.length
        }}{{ $t('user.item') }}
      </div>
      <ul class="listWrap" v-if="usersSearchList.length">
        <li
            @click="chooseUser(item)"
            v-for="item in usersSearchList"
            :key="item.id"
        >
          <user-headname
              :userInfo="item"
              prop="username"
              colorId="id"
          ></user-headname>
        </li>
      </ul>
    </div>
    <apiot-user-dialog
        ref="users"
        :visible.sync="visible"
        title="选择审批人"
        :checkedUsers="approverObj.USER"
        @handleSure="handleSure"
    ></apiot-user-dialog>
    <apiot-dialog
        :visible.sync="orgVisible"
        title="组织管理"
        @sure-click="handleSaveArr('orgVisible', 'ORG', 'org')"
    >
      <OrgComponent v-if="orgVisible" ref="org" :selected="approverObj.ORG"/>
    </apiot-dialog>
    <apiot-dialog
        :visible.sync="roleVisible"
        title="角色管理"
        @sure-click="handleSaveArr('roleVisible', 'ROLE', 'role')"
    >
      <RoleComponent v-if="roleVisible" :roles="approverObj.ROLE" ref="role"/>
    </apiot-dialog>
    <apiot-dialog
        :visible.sync="posVisible"
        title="职位管理"
        @sure-click="handleSaveArr('posVisible', 'POST', 'pos')"
    >
      <posComponent v-if="posVisible" :posArr="approverObj.POST" ref="pos"/>
    </apiot-dialog>
    <apiot-dialog
        :visible.sync="customRoleVisible"
        title="职位管理"
        @sure-click="handleSaveRoleArr('customRoleVisible')"
    >
      <posComponent v-if="customRoleVisible" :isSingle="true" ref="customPos"/>
    </apiot-dialog>
  </section>
</template>

<script>
import { debounce } from '@/utils/utils';
import { getUserPage } from '@/api/orgManage.js';
import { getBeforesNode } from '@/api/flow.js';
import OrgComponent from '@/views/Role/RoleContent/DesignDetial/Organization/organization';
import RoleComponent from '@/views/Users/Main/FormItem/AssRoles/Roles/roles';
import posComponent from '@/views/postManage/components/detail/components/orgDialog/post/index';

export default {
  components: {
    OrgComponent,
    RoleComponent,
    posComponent
  },

  props: {
    nodeType: {
      type: String,
      default: ''
    },
    flowData: {
      type: Object,
      default() {
        return {};
      }
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    // 审批人配置
    approverObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      index: 0,
      updateKey: 0,
      visible: false,
      searchInput: '',
      usersSearchList: [],
      isShowSearchBox: false,
      orgVisible: false, // 组织机构
      posVisible: false,
      roleVisible: false,
      collapse: {},
      active: '0',
      customRoleVisible: false,
      nodeList: [] // 节点列表
    };
  },

  computed: {
    text() {
      if (this.nodeType === 'approverObj') return '审批人字段';
      if (this.nodeType === 'FillIn') return '填写人字段';
      return '';
    },
    tableName() {
      if (this.flowData.type === 'start') {
        return this.flowData.properties.tableName;
      }
      return '';
    },
    isShowEnd() {
      return function (superiorType, postId) {
        if (postId) {
          return !postId;
        }
        return !superiorType || [3, 4].includes(superiorType);
      };
    },
    isTrue() {
      return function (superiorType, type) {
        return !superiorType || ([3, 4].includes(superiorType) && superiorType !== type);
      };
    },
    renderBaseType() {
      return function (baseType) {
        if (baseType === '1') {
          return '发起人';
        }
        if (baseType === '2') {
          return '创建人';
        }
        if (baseType === '3') {
          return '执行人';
        }
        return '发起人';
      };
    },
    renderCharge() {
      return function (baseType) {
        if (baseType === 1) {
          return '组织负责人';
        }
        if (baseType === 2) {
          return '上级组织负责人';
        }
        if (baseType === 3) {
          return '所属组织';
        }
        if (baseType === 4) {
          return '所属组织上级';
        }
        if (baseType === 5) {
          return '职位';
        }
        return '组织负责人';
      };
    }
  },
  mounted() {
    this.init();
    console.log(this.approverObj);
    document.addEventListener('click', this.hideUserList, false);
    document.querySelector('.flowConfigWrap').addEventListener('click', this.hideUserList, false);
  },
  methods: {
    deleteField() {
      this.$emit('select-flow-approval', {
        value: {},
        key: 'FIELD'
      });
      this.updateKey += 1;
    },
    selectColumnRes(res) {
      this.$emit('select-flow-approval', {
        value: res,
        key: 'FIELD'
      });
      this.updateKey += 1;
      this.hidePopover();
    },
    hideUserList() {
      this.isShowSearchBox = false;
    },
    deleteCharge(i) {
      const { NODE } = this.approverObj;
      NODE.splice(i, 1);
      this.$emit('select-flow-approval', {
        value: NODE,
        key: 'NODE'
      });
      this.updateKey += 1;
    },
    selectCharge(config, v, i) {
      if (v === 5) {
        this.index = i;
        this.customRoleVisible = true;
        // console.log(this.$refs);
        this.$refs.addMores[0].click();
        return;
      }
      const { NODE } = this.approverObj;
      config.superiorType = v;
      NODE.splice(i, 1, config);
      this.$emit('select-flow-approval', {
        value: NODE,
        key: 'NODE'
      });
      this.updateKey += 1;
    },
    selectUserType(key) {
      const arr = key.split('_');
      const timestamp = Date.parse(new Date());
      const obj = {
        uniqueKey: timestamp,
        nodeId: arr[0],
        nodeName: arr[2],
        baseType: arr[1]
      };
      const { NODE = [] } = this.approverObj;
      NODE.push(obj);
      this.$emit('select-flow-approval', {
        value: NODE,
        key: 'NODE'
      });
      this.updateKey += 1;
      this.hidePopover();
    },
    async init() {
      const list = await getBeforesNode(this.params);
      this.nodeList = list;
    },
    hide() {
      this.searchInput = '';
      this.usersSearchList = [];
      this.isShowSearchBox = false;
    },
    // 选择搜索后的值
    chooseUser(tag) {
      const { USER } = this.approverObj;
      const index = USER.findIndex((item) => `${item.id}` === `${tag.id}`);
      if (index === -1) {
        USER.push(tag);
        this.$emit('select-flow-approval', USER);
        this.hide();
      } else {
        this.$message({
          type: 'error',
          message: this.$t('user.hasUserSelected')
        });
      }
    },
    hidePopover() {
      // console.log('trgger');
      this.$refs.addBtn.click();
    },
    // 点击确定按钮
    handleSure(users) {
      this.visible = false;
      this.$emit('select-flow-approval', {
        value: users,
        key: 'USER'
      });
    },
    handleSaveArr(visible, key, comKey) {
      // 组织，用户，职位 共用处理
      const { selectKeys } = this.$refs[comKey];
      this[visible] = false;
      this.$emit('select-flow-approval', {
        value: JSON.parse(JSON.stringify(selectKeys)),
        key
      });
    },
    handleSaveRoleArr(visible) {
      const { selectKeys } = this.$refs.customPos;
      if (!selectKeys.length) {
        this.$message.error('请选择职位!');
        return;
      }
      this[visible] = false;
      const { NODE } = this.approverObj;
      const obj = NODE[this.index];
      obj.postId = selectKeys[0].id;
      obj.postName = selectKeys[0].name;
      NODE.splice(this.index, 1, obj);
      this.$emit('select-flow-approval', {
        value: NODE,
        key: 'NODE'
      });
    },
    showPosDialog() {
      // 职位弹框
      this.visible = false;
      this.orgVisible = false;
      this.posVisible = true;
      this.roleVisible = false;
      this.hidePopover();
    },
    showRoleDialog() {
      // 角色人员弹框
      this.visible = false;
      this.orgVisible = false;
      this.posVisible = false;
      this.roleVisible = true;
      this.hidePopover();
    },
    showUserDialog() {
      // 固定人员弹框
      this.visible = true;
      this.orgVisible = false;
      this.posVisible = false;
      this.roleVisible = false;
      this.hidePopover();
    },
    showOrgDialog() {
      // 组织弹框
      this.visible = false;
      this.orgVisible = true;
      this.posVisible = false;
      this.roleVisible = false;
      this.hidePopover();
    },
    // 删除选中人员
    deleteUser(userInfo) {
      const { USER } = this.approverObj;
      const index = USER.findIndex((item) => item.id === userInfo.id);
      USER.splice(index, 1);
      this.$emit('select-flow-approval', {
        value: USER,
        key: 'USER'
      });
    },
    // 删除选中组织
    deleteOrg(orgInfo) {
      const { ORG } = this.approverObj;
      const index = ORG.findIndex((item) => item.id === orgInfo.id);
      ORG.splice(index, 1);
      this.$emit('select-flow-approval', {
        value: ORG,
        key: 'ORG'
      });
    },
    deleteRole(roleInfo) {
      // 删除选中的角色
      const { ROLE } = this.approverObj;
      const index = ROLE.findIndex((item) => item.id === roleInfo.id);
      ROLE.splice(index, 1);
      this.$emit('select-flow-approval', {
        value: ROLE,
        key: 'ROLE'
      });
    },
    deletePos(posInfo) {
      // 删除选中的角色
      const { POST } = this.approverObj;
      const index = POST.findIndex((item) => item.id === posInfo.id);
      POST.splice(index, 1);
      this.$emit('select-flow-approval', {
        value: POST,
        key: 'POST'
      });
    },
    // 搜索
    async doSearch() {
      const value = this.searchInput;
      if (!value) return false;
      if (this.optionsVisible) this.optionsVisible = false;
      const params = {
        keywords: value,
        size: 99,
        current: 1,
        orders: [{
          asc: true,
          column: 'id'
        }]
      };
      try {
        const res = await getUserPage(params);
        // console.log(res);
        this.usersSearchList = res.records;
        this.isShowSearchBox = true;
      } catch (e) {
        // console.log(e);
      }
    }
  },
  created() {
    this.debouncedSearch = debounce(() => {
      this.doSearch();
    });
  },
  beforeDestroy() {
    if (document && document.querySelector('.flowConfigWrap')) {
      document.removeEventListener('click', this.hideUserList);
      document.querySelector('.flowConfigWrap').removeEventListener('click', this.hideUserList);
    }
  }
};
</script>

<style lang='scss' scoped>
.userBox {
  position: relative;

  ::v-deep {
    .el-tabs__nav-scroll {
      display: unset !important;
    }

    .el-tabs__header {
      padding: 0 !important;
      box-shadow: none !important;

      .el-tabs__nav-prev {
        display: none;
      }

      .el-tabs__nav-wrap {
        padding: 0 !important;
      }
    }

    .el-tabs__item {
      padding: 0 20px;
      height: 40px;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 13px !important;
      font-weight: 400 !important;
      color: #303133;
      position: relative;
    }
  }

  .search {
    margin-bottom: 5px;
    width: 200px;

    ::v-deep {
      .el-input__inner {
        border: none;
      }
    }
  }

  &__content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-bottom: -5px;
    max-height: 80px;
    overflow-y: auto;
  }

  .selected-result {
    .selected-title {
      height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 30px;

      & ~ div {
        overflow: hidden;

        ::v-deep {
          .org__item.el-tag {
            height: 28px;
            padding: 0 6px;
            margin: 0 6px 5px 0;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 28px;
            background: #e5f0ff;
            border-radius: 4px;
            border: none;

            .icon-zuzhi {
              margin-right: 3px;
              color: #4689f5;
            }

            .icon-guanbi {
              font-size: 10px;
              color: #bbc3cd;
              cursor: pointer;

              &:hover {
                color: #6b798d;
              }
            }
          }

          .role__item.el-tag {
            height: 28px;
            padding: 0 23px 0 6px;
            margin: 0 6px 3px 0;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 28px;
            background: #ffeaeb;
            border-radius: 4px;
            border: none;
            max-width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            position: relative;

            .icon-jiaose {
              margin-right: 3px;
              color: rgb(238, 94, 94);
            }

            .icon-guanbi {
              position: absolute;
              height: 26px;
              right: 5px;
              top: 2px;
              font-size: 10px;
              color: #bbc3cd;
              cursor: pointer;

              &:hover {
                color: #6b798d;
              }
            }
          }

          .pos__item.el-tag {
            height: 28px;
            padding: 0 23px 0 6px;
            margin: 0 6px 3px 0;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 28px;
            background: #ffede1;
            border-radius: 4px;
            border: none;
            max-width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            position: relative;

            .icon-zhiwei {
              margin-right: 3px;
              color: #fc8256;
            }

            .icon-guanbi {
              position: absolute;
              height: 26px;
              right: 5px;
              top: 2px;
              font-size: 10px;
              color: #bbc3cd;
              cursor: pointer;

              &:hover {
                color: #6b798d;
              }
            }
          }
        }
      }
    }

    .fieldWrap {
      display: flex;

      .icon-guanbi {
        display: none;
        cursor: pointer;
      }
      .icon-guanbi:hover {
        color: #4689F5;
      }
    }
    .fieldWrap:hover .icon-guanbi {
      display: block;
      margin-left: 10px;
    }

    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;
      white-space: nowrap;
    }

    .flexRow {
      display: flex;
      align-items: center;
      margin-top: 5px;
      overflow: hidden;

      .flowDetailTagBox {
        float: left;
        height: 30px;
        display: flex;
        position: relative;

        .flowDetailMemberNodeName {
          display: flex;
          position: relative;
          max-width: 90px;
          z-index: 111;
          align-items: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          height: 30px;
          padding: 0 10px;
          background: #E5F0FF;
          overflow: hidden;
          border-radius: 14px;
          box-shadow: 0 0 0 2px #fff;
          box-sizing: border-box;
        }

        .flowDetailMemberFieldName {
          position: relative;
          display: flex;
          align-items: center;
          padding-left: 20px;
          margin-left: -10px;
          background: #5A80ED;
          box-sizing: border-box;
          color: #fff;
          font-size: 12px;
          max-width: 200px;
          padding-right: 15px;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          box-shadow: 0 0 0 2px #fff;
          z-index: 22;
        }

        .flowDetailMemberTriangle {
          width: 0;
          height: 0;
          border-top: 14px solid transparent;
          border-left: 14px solid #01ca83;
          border-bottom: 14px solid transparent;
        }
      }
    }

    .flexRow:hover .flowDetailMemberDel {
      display: block;
    }

    .Dropdown--border {
      float: left;
      height: 28px;
      display: flex;
      color: #fff;
      font-size: 12px;
      line-height: 28px;

      .flowDetailMemberOrganizeTitle {
        width: 48px;
        padding: 0 10px 0 20px;
        margin-left: -10px;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        box-shadow: 0 0 0 2px #fff;
        background: #FFEAEB;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
        white-space: nowrap;
        z-index: 11;
      }

      .postName {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        background: #EE5E5E;
        z-index: 0;
      }

      .lowDetailMemberTriangleTransparent {
        position: absolute;
        width: 0;
        height: 0;
        border-top: 14px solid transparent;
        border-left: 14px solid #fff;
        border-bottom: 14px solid transparent;
      }

      .flowDetailMemberTriangleDark {
        width: 0;
        height: 0;
        border-top: 14px solid transparent;
        border-left: 14px solid #4c7d9e;
        border-bottom: 14px solid transparent;
      }
    }

    .opeMore {
      width: 28px;
      height: 28px;
      margin-left: 5px;
      text-align: center;
      line-height: 28px;
      border-radius: 50%;
      background: #f5f5f5;
      cursor: pointer;
    }

    .opeMore:hover .icon-gengduocaozuo {
      color: #4689f5;
    }

    .flowDetailMemberDel {
      display: none;
      margin-top: 4px;
      margin-left: 5px;
      cursor: pointer;

      .icon-guanbi {
        font-size: 14px;
        color: #BBC3CD;
      }

      .icon-guanbi:hover {
        color: #4689f5;
      }
    }
  }

  &__AddBtn {
    margin-bottom: 5px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px dashed #4689f5;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #4689f5;
    flex-shrink: 0;
    margin-right: 6px;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
      background: #edf3fe;
    }
  }

  &__tag {
    margin-top: 5px;
    padding-right: 6px;
    float: left;
  }

  .select__options {
    position: absolute;
    height: 142px;
    width: 100%;
    padding: 10px 0;
    top: 37px;
    background: #ffffff;
    box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    z-index: 3;

    & > .select__item {
      height: 36px;
      padding: 0 20px;
      line-height: 36px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;

      &:hover {
        cursor: pointer;
        background: #f1f7ff;
      }
    }
  }

  &__searchWrap {
    position: absolute;
    height: 164px;
    width: 100%;
    top: 37px;
    background: #ffffff;
    box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    z-index: 111;

    .searchResulet {
      height: 36px;
      padding-left: 21px;
      margin-top: 10px;
      line-height: 36px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;

      & > span {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4689f5;
      }
    }

    .listWrap {
      height: calc(100% - 46px);
      overflow: auto;

      & > li {
        height: 36px;
        padding-top: 7px;
        padding-left: 21px;
        line-height: 36px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        box-sizing: border-box;

        & > i {
          color: #ee5e5e;
          font-size: 20px;
          vertical-align: bottom;
        }

        &:hover {
          background: $--hover-color;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
