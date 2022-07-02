<!-- 页面 -->
<template>
  <div class="contentBox">
    <div class="selectedAllWrap">
      <apiot-checkbox :value="isCheckedAll()" @change="checkAll">
        {{ $t('role.selectAll') }}
      </apiot-checkbox>
    </div>
    <div class="filesContent">
      <div
        v-if="!list.length && !loading"
        class="apiotNoData"
        :placeholder="$t('common.noData')"
      ></div>
      <draggable
        filter=".forbid"
        animation="300"
        :move="onMove"
        @unchoose="unchoose"
        @choose="choose"
        @start="start"
        :sort="true"
        v-model="list"
      >
        <transition-group>
          <div
            v-for="(item, listI) in list"
            :key="item.sysKlTree.id"
            :data-id="item.sysKlTree.id"
            :data-treeType="item.sysKlTree.treeType"
            @mouseenter="moveKey = item.sysKlTree.id"
            @mouseleave="moveKey = ''"
            class="contentBox__item"
            :class="{ hasShowdow: isShow(item), imgHover: moveI === listI }"
            @click.prevent="chooseFile(item)"
          >
            <div
              class="contentBox__imageBox"
              :data-id="item.sysKlTree.id"
              :data-treeType="item.sysKlTree.treeType"
            >
              <img
                @mouseenter="moveI = listI"
                @mouseleave="moveI = -1"
                :data-id="item.sysKlTree.id"
                :data-treeType="item.sysKlTree.treeType"
                :src="getFileUrl(item)"
                alt=""
                @click.stop="preView(item)"
              />
            </div>
            <div
              class="contentBox__fileName"
              :data-id="item.sysKlTree.id"
              :data-treeType="item.sysKlTree.treeType"
            >
              <span
                @mouseenter="moveI = listI"
                @mouseleave="moveI = -1"
                v-if="!isEdit(item)"
                @click.stop="preView(item)"
                :title="item.sysKlTree.name"
              >
                <!--                {{ item.sysKlTree.name }}-->
                {{ renderFileName(item.sysKlTree.name, item.sysKlTree) }}
              </span>
              <apiot-input
                v-model="editFileName"
                @blur="handleSubmitFileName"
                @keyup.enter.native="enterInput"
                @keydown.native="keyDown"
                @click.native.stop.prevent
                ref="inputVal"
                v-if="isEdit(item)"
              >
              </apiot-input>
            </div>
            <apiot-checkbox
              :value="isChecked(item)"
              v-show="isShow(item) && moveI !== listI"
              @change="chooseFile(item)"
              class="contentBox__checkbox"
            >
            </apiot-checkbox>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  props: {
    updateData: {
      type: Function,
      default: () => {}
    },
    edit: {
      type: Boolean,
      default: false
    },
    fileUrl: {
      type: Function,
      default: () => {}
    },
    selectKeys: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moveI: -1,
      moveKey: '',
      dom: {},
      isDrag: false,
      startE: null,
      editFileName: '',
      chooseItemId: null // 拖拽的主题
    };
  },

  components: {
    draggable
  },

  computed: {
    renderFileName() {
      return function(name, obj) {
        if (obj && obj.treeType !== 1) {
          const realNameArr = name.split('.');
          const len = realNameArr.length;
          const newRealName = realNameArr.slice(0, len - 1);
          return newRealName.join('.');
        }
        return name;
      };
    },
    isEdit() {
      return function(item) {
        return (
          this.edit &&
          this.selectKeys.length === 1 &&
          this.selectKeys[0].sysKlTree.id === item.sysKlTree.id
        );
      };
    },
    isCheckedAll() {
      return function() {
        if (!this.selectKeys.length && !this.list.length) return false;
        return this.selectKeys.length === this.list.length;
      };
    },
    isChecked() {
      return function(item) {
        const arr = this.selectKeys.map((items) => items.sysKlTree.id);
        return arr.includes(item.sysKlTree.id);
      };
    },
    isShow() {
      return function(item) {
        const arr = this.selectKeys.map((items) => items.sysKlTree.id);
        return item.sysKlTree.id === this.moveKey || arr.includes(item.sysKlTree.id);
      };
    },
    getFileUrl() {
      return function(obj) {
        return this.fileUrl(obj);
      };
    }
  },

  mounted() {},
  watch: {
    edit: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue && this.selectKeys.length === 1) {
          const obj = this.selectKeys[0];
          const { name, treeType } = obj.sysKlTree;
          if (treeType !== 1) {
            const realNameArr = name.split('.');
            const len = realNameArr.length;
            const newRealName = realNameArr.slice(0, len - 1);
            this.editFileName = newRealName.join('.');
          } else {
            this.editFileName = name;
          }
          this.$nextTick(() => {
            if (this.$refs.inputVal[0]) {
              this.$refs.inputVal[0].focus();
              this.$refs.inputVal[0].select();
            }
          });
        }
      }
    }
  },

  methods: {
    preView(item) {
      this.$emit('preview', item);
    },
    // 不允许空格
    keyDown(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        return false;
      }
    },
    enterInput(e) {
      e.target.blur();
    },
    handleSubmitFileName() {
      const obj = this.selectKeys[0];
      let submitValue = this.editFileName;
      const { name, treeType } = obj.sysKlTree;
      if (treeType !== 1) {
        const realNameArr = name.split('.');
        const len = realNameArr.length;
        const newRealName = realNameArr[len - 1];
        submitValue += `.${newRealName}`;
      }
      this.$emit('editFileName', submitValue, this.selectKeys[0].sysKlTree.id);
    },
    onMove(e) {
      this.dom = e;
      this.isDrag = true;
      return false;
    },
    start(e) {
      this.startE = e;
    },
    choose(e) {
      const id = e.item.getAttribute('data-id');
      this.chooseItemId = id;
    },
    unchoose(e) {
      // 鼠标松开
      const { originalEvent } = e;
      const elementDom = originalEvent.toElement;
      if (this.dom && this.dom.related && this.isDrag && this.startE) {
        const targetId = elementDom.getAttribute('data-id');
        const id = this.startE.item.getAttribute('data-id');
        if (targetId !== id) {
          this.$emit('moveFileToNewFile', {
            dom: this.dom,
            chooseItemId: this.chooseItemId
          });
        }
      }
      this.dom = null;
      this.startE = null;
      this.isDrag = false;
      this.chooseItemId = null;
    },
    checkAll(value) {
      this.$emit('checkall', value);
    },
    chooseFile(item) {
      const index = this.selectKeys.findIndex((obj) => obj.sysKlTree.id === item.sysKlTree.id);
      if (index === -1) {
        this.selectKeys.push(item);
      } else {
        this.selectKeys.splice(index, 1);
      }
      this.updateData('edit', false);
    }
  },
  name: 'BlockContent'
};
</script>

<style lang='scss' scoped>
.contentBox {
  width: 100%;
  height: 100%;

  .selectedAllWrap {
    height: 40px;
    padding: 0 10px;
    position: relative;
    line-height: 36px;
    border-bottom: 1px solid #e9e9e9;
    border-top: 1px solid #e9e9e9;
    box-sizing: border-box;
  }

  .filesContent {
    padding: 15px;
    width: 100%;
    height: calc(100% - 40px);
    box-sizing: border-box;

    .contentBox__item {
      float: left;
      position: relative;
      width: 175px;
      height: 130px;
      padding: 5px;
      margin-right: 15px;
      margin-bottom: 15px;
      cursor: pointer;
      box-sizing: border-box;

      &.hasShowdow {
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.14);
        border-radius: 4px;
      }
      &.imgHover {
        & .contentBox__imageBox img {
          width: 56px;
          height: 56px;
          margin-top: 17px;
          transition: width .2s, height .2s;
        }
        & .contentBox__fileName span {
          text-decoration: underline;
        }
      }
      .contentBox__imageBox {
        height: 90px;
        text-align: center;
        background: #f8f9fb;

        & > img {
          width: 48px;
          margin-top: 21px;
        }
      }

      .contentBox__fileName {
        text-align: center;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 35px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        & > span:hover {
          transition: all 0.5s ease-in;
        }

        ::v-deep {
          .el-input__inner {
            height: 24px;
            line-height: 24px;
          }
        }
      }

      .contentBox__checkbox {
        position: absolute;
        top: 9px;
        right: 9px;
      }
    }
  }
}
</style>
