<!-- * @描述: 通用单选框 -->
<template>
  <div class="TagWrap">
    <el-button size="mini" @click="visible=true">
      <i class="iconfont icon-jiahao"></i> {{ $t('user.doAdd') }}
    </el-button>
        <apiot-tag
          size="medium"
          closable
          :style="getTagBgColor(tag)"
          @deleteSelf="delTag(tag)"
          v-for="tag in tagArr"
          :key="tag.name"
          >
          <i
              :class="{
                iconfont: true,
                [`${tag.icon?tag.icon.icon : 'icon-benren'}`]: true
        }" :style="getIconColor(tag)"></i>
          <span class="m-l-5" :style="`color: ${tag.fontColor}`">{{ tag.zhCN }}</span>
        </apiot-tag>
    <apiot-dialog
        :visible.sync="visible"
        :title="$t('user.roleTags')"
        :modal-append-to-body="false"
        v-on:sure-click="handleChooseRoles"
        v-on:cancle-click="visible = false"
    >
      <Tags :roles="tagArr" ref="roles" v-if="visible"></Tags>
    </apiot-dialog>
  </div>
</template>

<script>
import { getUsersState } from '@/api/user';
import Tags from './Tags/tags';

export default {
  inheritAttrs: false,
  props: {
    tags: {
      type: String,
      default: ''
    },
    updateData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      addTagWrap: 'addTagWrap',
      selectColor: '#5A80ED',
      input: '',
      colorArr: [
        '#5A80ED',
        '#EE5E5E',
        '#FAB71C',
        '#FC8256',
        '#34C7BE',
        '#10B98A',
        '#1CA6FF',
        '#A853F2',
        '#EF4373',
        '#708DB7'
      ],
      tagArr: [], // 标签
      visible: false,
      list: []
    };
  },
  components: {
    Tags
  },
  computed: {
    getTagBgColor() {
      return function (tag) {
        if (tag.color) {
          return {
            background: `${tag.color} !important`
          };
        }
        return {};
      };
    },
    getIconColor() {
      return function (tag) {
        if (tag.icon && tag.icon.icon) {
          return {
            color: tag.icon.color
          };
        }
        return {};
      };
    }
  },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const res = await getUsersState({ dictKeys: 'DICT-00373' });
      this.list = res['DICT-00373'] || [];
      const arr = this.tags.split(',');
      this.tagArr = arr.reduce((init, pre) => {
        const current = this.list.find((item) => item.value === +pre);
        return current ? init.concat([current]) : init;
      }, []);
    },
    delTag(tag) {
      const index = this.tagArr.findIndex((item) => item.value === tag.value);
      this.tagArr.splice(index, 1);
      const values = this.tagArr.map((item) => item.value).join(',');
      this.$emit('editTag', values);
    },
    handleChooseRoles() {
      const list = this.$refs.roles.selectKeys;
      this.tagArr = list;
      this.visible = false;
      const values = this.tagArr.map((item) => item.value).join(',');
      this.$emit('editTag', values);
    }
  }
};
</script>
<style lang='scss' scoped>
.TagWrap {
  .icon-jiahao {
    vertical-align: bottom;
    color: #aaaaaa;
  }

  ::v-deep {
    .el-button--mini {
      padding: 0 8px;
      border: 1px dashed #e9e9e9;
      font-size: 14px;

      &:hover {
        border: 1px dashed $--color-primary;
        background: $--hover-color;

        & .icon-jiahao {
          color: $--color-primary;
        }
      }

      &:focus {
        border: 1px dashed $--color-primary;
        background: $--hover-color;

        & .icon-jiahao {
          color: $--color-primary;
        }
      }
    }

    .el-tag {
      margin-left: 4px;
      height: 30px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      border: none;
      line-height: 30px;
    }

    .el-icon-close {
      color: #ffffff;
      font-size: 16px;
      opacity: 0.8;
      top: 0;

      &:hover {
        color: #ffffff;
        opacity: 1;
        background: none;
      }
    }
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  /*初始状态 透明度为0*/
  40% {
    opacity: 0.5;
  }
  /*过渡状态 透明度为0*/
  100% {
    opacity: 1;
  }
  /*结束状态 透明度为1*/
}

@-webkit-keyframes fade-in {
  /*针对webkit内核*/
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
