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
      <span class="userBox__AddBtn" @click="visible=true">
          <i class="iconfont icon-jiahao"></i>
        </span>
      <el-input
        class="search"
        v-model="searchInput"
        :placeholder="$t('org.searchUser')"
        @input="debouncedSearch"
        ref="btn"
      ></el-input>
    </div>
    <div class="userBox__result">
       <span
           class="userBox__tag"
           v-for="item in value"
           :key="item.id"
       >
          <user-headname
              :isBig="true"
              :isClear="true"
              @handleClear="deleteUser"
              :userInfo="item"
              prop="username"
              colorId="id"
          />
          </span>
    </div>
    <div class="userBox__searchWrap" v-if="searchInput && isShowSearchBox">
      <div class="searchResulet">
        {{ $t('user.search') }}"<span>{{ searchInput }}</span
        >"{{ $t('user.searchResult') }}{{ usersSearchList.length
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
      title="选择抄送人"
      :checkedUsers="value"
      @handleSure="handleSure"
    ></apiot-user-dialog>
  </section>
</template>

<script>
import { getUserPage } from '@/api/orgManage.js';
import { debounce } from '@/utils/utils';

export default {
  components: {
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
    value: {
      type: Array,
      default() {
        return [];
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
  },
  mounted() {
    // this.init();
    document.addEventListener('click', this.hideUserList, false);
    const dom = document.querySelector('.flowConfigWrap');
    if (dom) {
      dom.addEventListener('click', this.hideUserList, false);
    }
  },
  methods: {
    // 删除选中人员
    deleteUser(userInfo) {
      const list = [...this.value];
      const index = list.findIndex((item) => item.id === userInfo.id);
      list.splice(index, 1);
      this.$emit('select-flow-approval', list);
    },
    hideUserList() {
      this.isShowSearchBox = false;
    },
    hide() {
      this.searchInput = '';
      this.usersSearchList = [];
      this.isShowSearchBox = false;
    },
    // 选择搜索后的值
    chooseUser(tag) {
      const list = [...this.value];
      const index = list.findIndex((item) => `${item.id}` === `${tag.id}`);
      if (index === -1) {
        list.push(tag);
        this.$emit('select-flow-approval', list);
        this.hide();
      } else {
        this.$message({
          type: 'warning',
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
      this.$emit('select-flow-approval', users);
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
        orders: [
          {
            asc: true,
            column: 'id'
          }
        ]
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
  &__result {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    word-break: normal;
    ::v-deep{
      .user{
        margin: 0 10px 10px 0;
      }
    }
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
        color: #4689f5;
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
          max-width: 77px;
          z-index: 111;
          align-items: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          height: 30px;
          padding: 0 10px;
          background: #e5f0ff;
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
          background: #5a80ed;
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
        background: #ffeaeb;
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
        color: #ffffff;
        background: #ee5e5e;
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
        color: #bbc3cd;
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
