<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot-scope="scope">
      <RoleAndOrg
        :keyName="keyName"
        :row="scope.row"
        v-bind="$attrs"
      ></RoleAndOrg>
    </template>
  </el-table-column>
</template>

<script>
import RoleAndOrg from './RoleAndOrg/index';

export default {
  props: {
    keyName: {
      type: String,
      default() {
        return 'name';
      }
    }
  },
  data() {
    return {};
  },

  components: { RoleAndOrg },

  computed: {
    getIconName() {
      return () => {
        if (this.type === 'org') {
          return 'icon-zuzhi';
        }
        if (this.type === 'pos') return 'icon-zhiwei';
        return '';
      };
    }
  },

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.org {
  box-sizing: border-box;
  height: 24px;
  line-height: 18px;
  padding: 3px 8px;
  background: #e5f0ff;
  border-radius: 4px;

  & > .icon-zuzhi {
    font-size: 16px;
    color: #4689f5;
  }

  & > .name {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}

.pos {
  box-sizing: border-box;
  height: 24px;
  line-height: 18px;
  padding: 3px 8px;
  background: #ffede1;
  border-radius: 4px;

  & > .icon-zhiwei {
    font-size: 16px;
    color: #fc8256;
  }

  & > .name {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
</style>
