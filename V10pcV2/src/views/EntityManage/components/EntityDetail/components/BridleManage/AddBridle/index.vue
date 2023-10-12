<!-- 添加或者编辑 约束 -->
<template>
  <apiot-drawer
    v-on="$listeners"
    v-bind="$attrs"
    :title="drawerTitle"
    @sure-click="sureClick"
  >
    <el-form
      label-position="top"
      label-width="80px"
      :model="formData"
      :rules="rules"
      class="form"
      ref="bridle-form"
    >
      <div class="form--line">
        <el-form-item
          label="约束名称"
          class="form--child"
          prop="constraintName"
        >
          <apiot-input
            v-model="formData.constraintName"
            placeholder="请输入约束名称"
          ></apiot-input>
        </el-form-item>
        <el-form-item label="约束类型" class="form--child">
          <el-select v-model="formData.typeDict" placeholder="请选择类型">
            <el-option
              v-for="item in typesArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item label="字段名称" class="form--child">
          <multi-form-item
            :itemTheme="2"
            itemIconClass="icon-benren"
            :multiStr.sync="multiStr"
            @multiSelect="showMultiSelect"
          >
            <template v-slot:dialog>
              <multi-dialog
                :visible.sync="multiVisible"
                :itemTheme="2"
                itemIconClass="icon-benren"
                :multiStr.sync="multiStr"
                @sure-click="multiSure"
              ></multi-dialog>
            </template>
          </multi-form-item>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item label="是否必填" class="form--child">
          <el-radio-group v-model="formData.enabled">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item label="约束内容" class="form--child" prop="memo">
          <apiot-input
            type="textarea"
            rows="2"
            :autosize="{ minRows: 2, maxRows: 8 }"
            v-model="formData.memo"
            placeholder="请输入约束内容"
          ></apiot-input>
        </el-form-item>
      </div>
    </el-form>
  </apiot-drawer>
</template>

<script>
import MultiDialog from '../../MultiDialog';

export default {
  props: {
    curDrawerType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 表单数据
      formData: {
        constraintName: '',
        enabled: 2,
        typeDict: 1,
        memo: ''
      },
      typesArr: [
        { label: '唯一约束', value: 1 },
        { label: '检查约束', value: 2 }
      ],

      multiStr: '',
      // 是否显示多选
      multiVisible: false
    };
  },

  components: {
    MultiDialog
  },

  computed: {
    drawerTitle() {
      return this.curDrawerType === 1 ? '新增约束' : '编辑约束';
    },
    rules() {
      return {
        constraintName: [{ required: true, message: '请输入约束名称', trigger: 'change' }],
        memo: [{ required: true, message: '请输入约束内容', trigger: 'change' }]
      };
    }
  },

  mounted() {},

  methods: {
    // 新增编辑弹窗层的确认
    sureClick() {
      // console.log('确认按钮1');
    },
    showMultiSelect() {
      this.multiVisible = true;
    },
    // 多选弹窗的确认
    multiSure() {}
  }
};
</script>

<style lang='scss' scoped>
</style>
