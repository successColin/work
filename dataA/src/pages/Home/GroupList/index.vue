/**
* @name: index
* @author: DELL
* @date: 2021/10/28 18:45
* @description：index
* @update: 2021/10/28 18:45
*/
<!-- 页面 -->
<template>
  <div class="main5 flex-col" v-loading="loading">
    <div class="mod1 flex-col">
      <div class="box5 flex-col">
        <div class="bd1 flex-row">
          <span class="word2">分组管理</span>
          <span class="iconfont icon-xinzeng label1" @click="doAdd"></span>
        </div>
      </div>
      <div class="box6Wrap">
        <div class="box6 flex-col"
             v-for="(item,index) in list"
             :key="item.id"
             @click="handleSelect(item)"
             :class="{selected:item.id===selected.id}"
        >
          <div class="mod2 flex-col">
            <div class="bd2 flex-row">
              <transition name="fade">
<!--                <span class="iconfont icon1" :class="getClassName(item)"></span>-->
                <img :src="getClassName(item)" alt="">
              </transition>
              <span class="info4" v-if="!item.isEdit">{{ item.name }}</span>
              <global-input
                  style="margin-left: 5px"
                  v-if="item.isEdit"
                  @blur="(e)=>doBlur(e,item, index)"
                  @keyup.enter.native="enterInput"
                  @keydown.native="doKeyDown"
                  @click.native.stop.prevent
                  v-model="item.name"
                  ref="globalInput"
                  placeholder="请输入分组名称"></global-input>
              <el-dropdown
                  trigger="click"
                  placement="bottom-end"
                  @command="(type)=>handleCommand(type,item,index)"
              >
                <span class="iconfont icon-gengduocaozuo label3" v-show="!item.isEdit"></span>
                <!--              <img-->
                <!--                  v-show="!item.isEdit"-->
                <!--                  class="label3"-->
                <!--                  referrerpolicy="no-referrer"-->
                <!--                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngf4faf00c599287b6faaa19825219edbbaca5158ea11f5c81dc6cd573406792d4"-->
                <!--              />-->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit">修改</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div v-if="!item.isEdit" class="layer1 flex-col">
                <span class="txt5">{{ item.screenNumber || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus';
import {getHomeGroupList, addHomeGroupList, delHomeGroup, editHomeGroup} from '@/services/home';
import close from '@/assets/close.svg';
import open from '@/assets/open.svg';

export default {
  props: {
    getGroupInfo: {
      type: Function,
      default: () => {
      }
    },
    type: {
      type: String,
      default: 'PC'
    }
  },
  data() {
    return {
      loading: false,
      list: [], // 分组的列表
      selected: {}, // 选择的对象
      editKey: null // 修改的对象
    };
  },

  components: {},

  computed: {
    getClassName() {
      return function (item) {
        return item.id !== this.selected.id ? close : open;
      }
    }
  },

  mounted() {

    const groupSelect = sessionStorage.getItem('groupDataSelect');
    if (groupSelect) {
      this.selected = JSON.parse(groupSelect);
      this.getGroupInfo(this.selected || {});
    }
    // this.$nextTick(() => {
    //   this.init();
    // })
  },
  watch: {
    list: {
      deep: true,
      handler(v) {
        Bus.$emit('GroupList', v);
      }
    },
    type: {
      deep: true,
      immediate: true,
      handler(v, o) {
        if (v !== o) {
          const groupSelect = sessionStorage.getItem('groupDataSelect');
          if (groupSelect) {
            this.selected = JSON.parse(groupSelect);
          } else {
            this.selected = {};
          }
          this.$nextTick(() => {
            this.init();
          })
        }
      }
    }
  },
  methods: {
    async init() { // 初始化数据
      this.loading = true;
      const data = await getHomeGroupList({ type : this.type });
      this.loading = false;
      Bus.$emit('GroupList', data);
      if (JSON.stringify(this.selected) === '{}') {
        this.handleSelect(data[0] || {});
      }
      this.list = data;
    },
    handleCommand(type, item, index) {
      if (type === 'del') {
        if (item.screenNumber) {
          this.$message({
            type: 'error',
            message: `${item.name}分组下存在数据，不允许删除！`
          });
          return;
        }
        this.$confirm(`此操作将删除${item.name}分组, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delHomeGroup({id: item.id}).then(() => {
            this.selected = {};
            this.init();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      if (type === 'edit') {
        const obj = {
          ...item,
          isEdit: true
        };
        this.list.splice(index, 1, obj);
        this.$nextTick(() => {
          this.$refs.globalInput[0].$children[0].focus();
        })
      }
    },
    handleSelect(item) {
      if (!item.id) {
        return;
      }
      this.selected = item;
      sessionStorage.setItem('groupDataSelect', JSON.stringify(item));
      this.getGroupInfo(item);
    },
    doAdd() {
      const noNameArr = this.list.filter((item) => item.isEdit);
      if (noNameArr.length) {
        this.$message.error('请填写分组名称！');
        return;
      }
      this.list.push({
        name: null, id: null, total: 0, isEdit: true
      })
      this.$nextTick(() => {
        this.$refs.globalInput[0].$children[0].focus();
      })
    },
    async doBlur(e, item, index) {
      if (!item.name) {
        this.$message.error('请填写分组名称');
        return;
      }
      let params = {name: item.name, type: this.type}
      let api = addHomeGroupList;
      if (item.id) {
        api = editHomeGroup;
        params = {
          name: item.name,
          id: item.id
        }
      }
      const data = await api(params);
      const obj = {
        ...item,
        isEdit: false,
        id: item.id ? item.id : data.id
      }
      this.list.splice(index, 1, obj);
    },
    enterInput(e) {
      e.target.blur();
    },
    doKeyDown(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        return false;
      }
      return '';
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.main5 {
  z-index: 45;
  height: 100%;
  width: 300px;
  justify-content: flex-start;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.mod1 {
  z-index: auto;
  width: 240px;
  padding: 10px 15px 17px 30px;
  height: 100%;
  box-shadow: inset -1px 0px 0px 0px #2f437f;
}

.box6Wrap {
  width: 100%;
  height: calc(100% - 110px);
  overflow-y: auto;
  overflow-x: hidden;
}

.box6 {
  z-index: 61;
  height: 36px;
  width: 100%;

  &.selected {
    .label3, .layer1 {
      display: block;
    }

    .mod2 {
      background-color: rgba(70, 137, 245, 0.18);
    }
  }
}

.bd2 {
  align-items: center;
}

.mod2 {
  z-index: 62;
  height: 36px;
  width: 225px;
  align-items: flex-start;
  padding-left: 15px;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(70, 137, 245, 0.18);
  }

  &:hover .label3 {
    display: block;
    transition: all 1s;
  }

  &:hover .layer1 {
    display: block;
    transition: all 1s;
  }
}

.box5 {
  z-index: 47;
  height: 46px;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
}

.bd1 {
  z-index: auto;
  width: 237px;
  height: 46px;
  justify-content: space-between;
  align-items: center;
  justify-content: space-between;
}

.word2 {
  z-index: 57;
  width: 64px;
  height: 22px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 22px;
  text-align: left;
}

.label1 {
  z-index: 48;
  width: 16px;
  height: 16px;
  font-size: 20px;
  color: $component-borderFocus-color;
  cursor: pointer;
}

.label2 {
  z-index: 75;
  width: 18px;
  height: 16px;
  margin-top: 2px;
}

.info4 {
  z-index: 74;
  width: 145px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 18px;
  text-align: left;
  margin: 2px 0 0 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.label3 {
  display: none;
  z-index: 66;
  width: 14px;
  color: $component-borderFocus-color;
}

.layer1 {
  display: none;
  z-index: 64;
  height: 20px;
  border-radius: 10px;
  background-color: rgba(70, 137, 245, 1);
  margin-left: 12px;
  width: 24px;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.txt5 {
  z-index: 65;
  width: 8px;
  height: 12px;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 20px;
  text-align: left;
}

.box7 {
  z-index: 82;
  height: 36px;
  width: 240px;
  justify-content: center;
  align-items: flex-start;
  padding-left: 15px;
}

.layer2 {
  z-index: auto;
  width: 65px;
  height: 18px;
  justify-content: space-between;
}

.icon1 {
  z-index: 84;
  width: 18px;
  height: 16px;
  font-size: 19px;
  color: $component-borderFocus-color;
}

.info5 {
  z-index: 83;
  width: 42px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 18px;
  text-align: left;
}

</style>
