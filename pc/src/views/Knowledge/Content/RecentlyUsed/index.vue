<!-- 页面 -->
<template>
  <div class="usedWrap">
    <div
      v-if="!renderTimeArr().length"
      class="apiotNoData"
      :placeholder="$t('common.noData')"
    ></div>
    <div class="list__item" v-for="item in renderTimeArr()" :key="item.name">
      <div class="list__time">
        <apiot-checkbox
          :value="!!checkData[item.name]"
          @change="(e) => changeAll(e, item.name)"
        ></apiot-checkbox>
        <span>{{ item.displayName }}</span>
      </div>
      <div class="list__content">
        <draggable
          animation="300"
          :move="onMove"
          @unchoose="unchoose"
          @choose="choose"
          :value="currentTimeList(item.name)"
        >
          <transition-group>
            <div
              v-for="items in currentTimeList(item.name)"
              :key="items.sysKlTree.id"
              :data-id="items.sysKlTree.id"
              :data-treeType="items.sysKlTree.treeType"
              @mouseenter="moveKey = items.sysKlTree.id"
              @mouseleave="moveKey = ''"
              class="contentBox__item"
              :class="{
                forbid: moveKey !== items.id,
                hasShowdow: isShow(items),
              }"
              @click.prevent="chooseFile(items, item.name)"
            >
              <div class="contentBox__imageBox">
                <img
                  :src="getFileUrl(items)"
                  alt=""
                  @click.stop="preView(items)"
                />
              </div>
              <div class="contentBox__fileName">
                <span
                  v-if="!isEdit(items)"
                  @click.stop="preView(items)"
                  :title="items.sysKlTree.name"
                >
                  {{ renderFileName(items.sysKlTree.name, items) }}
                </span>
                <apiot-input
                  v-model="editFileName"
                  @blur="handleSubmitFileName"
                  @keyup.enter.native="enterInput"
                  @keydown.native="keyDown"
                  @click.native.stop.prevent
                  ref="inputVal"
                  v-if="isEdit(items)"
                >
                </apiot-input>
              </div>
              <apiot-checkbox
                :value="isChecked(items)"
                v-show="isShow(items)"
                @change="chooseFile(items, item.name)"
                class="contentBox__checkbox"
              >
              </apiot-checkbox>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { showTimeName } from '@/utils/utils';

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
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      checkData: {},
      moveKey: '',
      dom: {},
      isDrag: false,
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
        if (obj && obj.sysKlTree.treeType && obj.sysKlTree.treeType !== 1) {
          const realNameArr = name.split('.');
          const len = realNameArr.length;
          const newRealName = realNameArr.slice(0, len - 1);
          return newRealName.join('.');
        }
        return name;
      };
    },
    currentTimeList() {
      return function(obj) {
        return this.list[obj] || [];
      };
    },
    renderTimeArr() {
      return function() {
        const arr = Object.keys(this.list);
        arr.sort((a, b) => b.localeCompare(a));
        const timeArr = [];
        arr.forEach((item) => {
          timeArr.push({
            name: item,
            displayName: showTimeName(item)
          });
        });
        return timeArr;
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
              this.$refs.inputVal[0].select();
              this.$refs.inputVal[0].focus();
            }
          });
        }
      }
    }
  },

  methods: {
    changeAll(e, key) {
      // 选中当前时间段的文件
      // console.log(e, key);
      const currentTimeArr = this.list[key];
      if (e) {
        currentTimeArr.forEach((item) => {
          const index = this.selectKeys.findIndex((obj) => obj.sysKlTree.id === item.sysKlTree.id);
          if (index === -1) {
            this.selectKeys.push({ ...item, time: key });
          }
        });
      } else {
        currentTimeArr.forEach((item) => {
          const index = this.selectKeys.findIndex((obj) => obj.sysKlTree.id === item.sysKlTree.id);
          if (index !== -1) {
            this.selectKeys.splice(index, 1);
          }
        });
      }
      this.$set(this.checkData, [key], e);
    },
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
      // // console.log(submitValue, obj);
      this.$emit('editFileName', submitValue, this.selectKeys[0].sysKlTree.id);
      // // console.log(this.editFileName);
      // this.$emit('editFileName', this.editFileName);
    },
    onMove(e) {
      this.dom = e;
      this.isDrag = true;
      return false;
    },
    choose(e) {
      const id = e.item.getAttribute('data-id');
      this.chooseItemId = id;
    },
    unchoose() {
      // 鼠标松开
      if (this.dom && this.dom.related && this.isDrag) {
        this.$emit('moveFileToNewFile', { dom: this.dom, chooseItemId: this.chooseItemId });
        this.dom = null;
        this.isDrag = false;
        this.chooseItemId = null;
      }
    },
    checkAll(value) {
      this.$emit('checkall', value);
    },
    chooseFile(item, key) {
      const index = this.selectKeys.findIndex((obj) => obj.sysKlTree.id === item.sysKlTree.id);
      const currentList = this.list[key];
      if (index === -1) {
        this.selectKeys.push({ ...item, time: key });
      } else {
        this.selectKeys.splice(index, 1);
      }
      const currentSelectArr = this.selectKeys.filter((items) => items.time === key);
      this.$set(this.checkData, key, currentList.length === currentSelectArr.length);
      this.updateData('edit', false);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.usedWrap {
  width: 100%;
  height: 100%;
  border-top: 1px solid #e9e9e9;
  overflow-y: auto;
  box-sizing: border-box;

  .list__item {
    width: 100%;
    .list__time {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e9e9e9;
      box-sizing: border-box;

      & > span {
        margin-left: 8px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
      }

      ::v-deep {
        .el-checkbox {
          margin-left: 10px;
        }
      }
    }
    .list__content {
      min-height: 130px;
      padding: 15px;
      overflow: hidden;
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
}
</style>
