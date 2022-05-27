<!-- * @描述: 通用单选框 -->
<template>
  <div class="TagWrap">
    <el-popover
        placement="bottom-start"
        width="294"
        :popper-class="addTagWrap"
        :visible-arrow="false"
        v-model="visible"
    >
      <div class="box">
        <div class="colorWrap">
          <div
              v-for="color in colorArr"
              class="colorBox"
              :key="color"
              :style="'background:'+ color"
              @click="changeColor(color)"
          >
            <i class="el-icon-check"
               :class="{selected:selectColor===color}"
               v-if="selectColor===color"></i>
          </div>
        </div>
        <div class="enterTag">
          <apiot-input
              maxlength="10"
              show-word-limit
              v-model="input"
              :placeholder="$t('user.addLabelTag')"
              @keyup.enter.native="addTag"></apiot-input>
        </div>
        <div class="footer">
          <apiot-button @click="hide"
                        size="small"
          >{{ $t('common.cancle') }}
          </apiot-button>
          <apiot-button
              type="primary"
              @click="sureClick"
              size="small"
          >{{ $t('common.sure') }}
          </apiot-button>
        </div>
      </div>
      <el-button size="mini" slot="reference">
        <i class="iconfont icon-jiahao"></i> {{$t('user.doAdd')}}
      </el-button>
    </el-popover>
    <el-tag
        size="medium"
        closable
        :style="'background:'+ tag.color"
        @close="delTag(tag)"
        v-for="tag in tags" :key="tag.name">{{ tag.name }}
    </el-tag>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    updateData: {
      type: Function,
      default: () => {
      },
    },
  },
  data() {
    return {
      addTagWrap: 'addTagWrap',
      selectColor: '#5A80ED',
      input: '',
      colorArr: ['#5A80ED', '#EE5E5E', '#FAB71C', '#FC8256', '#34C7BE', '#10B98A', '#1CA6FF', '#A853F2', '#EF4373', '#708DB7'],
      tagArr: [], // 标签
      visible: false,
    };
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {
  },
  methods: {
    hide() {
      this.selectColor = '#5A80ED';
      this.input = '';
      this.visible = false;
    },
    changeColor(color) {
      this.selectColor = color;
    },
    sureClick() {
      this.addTag(this.input);
    },
    addTag() {
      if (!this.input) {
        this.$message({
          type: 'error',
          message: this.$t('user.placeEnterTag'),
        });
        return;
      }
      const tags = [...this.tags];
      const index = tags.findIndex((item) => item.name === this.input);
      if (index !== -1) {
        this.$message({
          type: 'error',
          message: this.$t('user.errorTag'),
        });
        return;
      }
      tags.push({
        name: this.input,
        color: this.selectColor,
      });
      this.visible = false;
      this.selectColor = '#5A80ED';
      this.input = '';
      // this.addTagWrap = 'addTagWrap active';
      this.updateData({ tags });
    },
    delTag(tag) {
      const tags = [...this.tags];
      const index = tags.findIndex((item) => item.name === tag.name && item.color === tag.color);
      tags.splice(index, 1);
      this.updateData({ tags });
      // this.$emit('editTag', this.tagArr);
    },
  },
};
</script>
<style lang='scss' scoped>
.TagWrap {
  .icon-jiahao {
    vertical-align: bottom;
    color: #AAAAAA;
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
      color: #FFFFFF;
      border: none;
      line-height: 30px;
    }

    .el-icon-close {
      color: #FFFFFF;
      font-size: 16px;
      opacity: 0.8;
      top: 0;

      &:hover {
        color: #FFFFFF;
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

@-webkit-keyframes fade-in { /*针对webkit内核*/
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
