<template>
  <section class="funcArea config">
    <div class="config__header">主功能区</div>
    <div class="config__body">
      <draggable
        v-model="activeObj.groupArr"
        group="tabs"
        animation="300"
        class="m-t-12"
        handle=".icon-zongxiangtuodong"
      >
        <transition-group class="funcArea__list" tag="ul">
          <li
            class="funcArea__tab"
            v-for="(child, i) in activeObj.groupArr"
            :key="child.compId"
          >
            <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-10"></i>
            <apiot-input
              class="input"
              v-model="child.name"
              @focus="nameFocus(child)"
              @blur="nameBlur(child)"
              placeholder="请输入分组名称"
            ></apiot-input>
            <el-tooltip
              effect="dark"
              content="删除"
              :enterable="false"
              placement="bottom"
            >
              <i
                class="iconfont icon-shanchu m-r-14 m-l-10"
                @click="deleteChild(i)"
              ></i
            ></el-tooltip>
          </li>
        </transition-group>
      </draggable>
      <apiot-button
        @click="addgroup"
        class="funcArea__addGroup config__body--btn"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '分组' }) }}
      </apiot-button>
      <apiot-button
        @click="addArticleGroup"
        class="funcArea__addGroup config__body--btn"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '文章分组' }) }}
      </apiot-button>
    </div>
  </section>
</template>

<script>
import { createUnique } from '@/utils/utils';

export default {
  props: {
    activeObj: {
      type: Object
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  created() {},

  methods: {
    // 新增group
    addgroup() {
      const groupObj = {
        compId: createUnique(),
        compName: 'FuncGroup',
        configCompName: 'FuncGroupConfig',
        name: '',
        menuArr: [],
        enableGroupName: 1,
        rowNum: 4, // 个数
        showStyle: 1, // 展示风格
        heightPix: 1 // 高度
      };
      groupObj.name = `分组(${groupObj.compId})`;
      this.activeObj.groupArr.push(groupObj);
    },
    addArticleGroup() {
      const groupObj = {
        compId: createUnique(),
        compName: 'AppInfo',
        configCompName: 'AppInfoConfig',
        name: '',
        term: 1,
        time: 1
      };
      groupObj.name = `文章分组(${groupObj.compId})`;
      this.activeObj.groupArr.push(groupObj);
    },
    // 删除
    deleteChild(i) {
      this.activeObj.groupArr.splice(i, 1);
    },
    // 名字的失焦恢复
    nameFocus(child) {
      child.backName = child.name;
    },
    nameBlur(child) {
      if (!child.name) {
        child.name = child.backName;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
.funcArea {
  &__tab {
    height: 36px;
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 16px;
      color: #bbc3cd;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
    }
    .icon-zongxiangtuodong {
      cursor: move;
    }
    .icon-sheweimoren {
      visibility: hidden;
      &.active {
        color: $--color-primary;
        visibility: visible;
      }
    }
    .input {
      flex: 1;
      ::v-deep {
        .el-input__inner {
          height: 28px;
          line-height: 28px;
        }
      }
    }
    &.active,
    &:hover {
      background: #f1f7ff;
      .icon-sheweimoren {
        visibility: visible;
      }
    }
  }
  &__addGroup {
    margin-top: 10px;
  }
}
</style>
