/**
* @name: form
* @author: DELL
* @date: 2023/2/20 16:29
* @description：form
* @update: 2023/2/20 16:29
*/
<!-- 页面 -->
<template>
  <div class="formConfig">
    <el-form
        label-position="top"
        label-width="80px"
        :model="info"
        class="form"
        ref="addColumn"
    >
      <div class="form--line">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
                label="分组名称"
                class="form--child"
                prop="columnName"
            >
              <apiot-input
                  disabled
                  maxlength="30"
                  v-model="info.name"
              ></apiot-input>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-form-item :label="this.$t('entity.isRequired')" class="form&#45;&#45;child">-->
<!--          <el-radio-group v-model="formData.requisiteDict">-->
<!--            <el-radio-->
<!--                :label="item.value"-->
<!--                :key="item.value"-->
<!--                v-for="item in $store.state.dictManage.REQUISITE_TYPE"-->
<!--            >{{ item.name }}</el-radio-->
<!--            >-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      formData: {}
    };
  },

  components: {},

  computed: {},

  mounted() {

  },

  methods: {},
  name: 'groupForm',
};
</script>

<style lang='scss' scoped>
.formConfig{
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
