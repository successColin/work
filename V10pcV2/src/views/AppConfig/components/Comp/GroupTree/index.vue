<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    title="分组树"
    class="groupTree"
    :append-to-body="true"
    @sure-click="sureClick"
  >
    <el-tree
      class="groupTree__tree"
      :data="getGroupTree"
      node-key="compId"
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{ data }">
        <el-radio v-model="radio" :label="data.compId" v-if="!data.isMenu">{{
          data.name
        }}</el-radio>
        <span v-else>
          {{ data.name }}
        </span>
      </span>
    </el-tree>
  </apiot-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    configData: {
      type: Object,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      radio: '',
    };
  },
  mounted() {},
  computed: {
    getGroupTree() {
      const treeData = [];
      this.configData.funcArea.groupArr.forEach((group) => {
        const obj = {
          compId: group.compId,
          name: group.name,
          isMenu: false,
          children: [],
        };
        if (!group.menuArr) {
          return;
        }
        group.menuArr.forEach((menu) => {
          if (menu.type === 3) {
            const menuObj = {
              compId: menu.compId,
              name: menu.menuName,
              isMenu: true,
              children: [],
            };
            obj.children.push(menuObj);
            if (menu.childPageConfig) {
              menu.childPageConfig.funcArea.groupArr.forEach((childGroup) => {
                menuObj.children.push({
                  compId: childGroup.compId,
                  name: childGroup.name,
                  isMenu: false,
                });
              });
            }
          }
        });
        treeData.push(obj);
      });
      return treeData;
    },
  },
  components: {},
  methods: {
    sureClick() {
      if (!this.radio) {
        return this.$message.warning({
          message: '请选择分组',
        });
      }
      this.$emit('sureClick', this.radio);
      this.$emit('update:visible', false);
    },
  },
  watch: {
    show(v) {
      if (v) {
        this.radio = '';
      }
    },
  },
};
</script>

<style lang="scss">
.groupTree {
  &__tree {
    overflow-y: auto;
  }
}
</style>
