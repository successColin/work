<template>
  <div class="thirdLinks">
    <apiot-button @click="addThirdLink"
      ><i class="iconfont icon-xinzeng"></i
      >{{ $t('common.add', { name: '' }) }}</apiot-button
    >
    <ul class="thirdLinks__ul" v-loading="loading">
      <li class="thirdLinks__li" v-for="item in linksData" :key="item.unique">
        <el-form
          :model="item"
          :rules="rules"
          :ref="`form${item.unique}`"
          @submit.native.prevent
          label-width="100px"
          class="thirdLinks__li--form"
        >
          <IconSelect
            :item.sync="item.iconObj"
            :shouldScale="true"
            class="thirdLinks__li--icon"
          ></IconSelect>
          <el-form-item prop="menuName" class="m-r-10">
            <apiot-input
              class="thirdLinks__li--name"
              v-model="item.menuName"
              :isForbid="false"
              :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
            ></apiot-input>
          </el-form-item>
          <el-form-item prop="linkAdress" class="thirdLinks__li--linkForm">
            <apiot-input
              class="thirdLinks__li--link"
              v-model="item.linkAdress"
              :isForbid="false"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('globalConfig.thirdLinks'),
                })
              "
            ></apiot-input>
          </el-form-item>
          <apiot-button
            type="text"
            class="thirdLinks__li--save"
            @click="saveThirdLink(item)"
            >{{ $t('common.save') }}</apiot-button
          >
          <apiot-button
            type="text"
            class="thirdLinks__li--delete"
            @click="deleteThirdLink(item, index)"
            >{{ $t('common.delete1') }}</apiot-button
          >
        </el-form>
      </li>
    </ul>
  </div>
</template>

<script>
import { getListByKey, saveGlobal, batchDelete } from '@/api/globalConfig';
import IconSelect from '../../MenuManage/components/IconSelect';
import { createUnique } from '../../../utils/utils';

export default {
  name: '',
  data() {
    return {
      linksData: [],
      rules: {
        menuName: [{ required: true, message: '请输入名称', trigger: 'change' }],
        linkAdress: [{ required: true, message: '请输入第三方链接', trigger: 'change' }]
      },
      loading: false
    };
  },
  components: {
    IconSelect
  },
  mounted() {
    // this.getListByKey();
    this.linksData = JSON.parse(JSON.stringify(this.$store.state.globalConfig.thirdLinks));
  },
  methods: {
    async getListByKey() {
      const res = await getListByKey({ parameterKey: 'THIRD_LINKS' });
      console.log(res);
      this.linksData = res.map((item) => {
        const obj = JSON.parse(item.attributeValue);
        return {
          ...item,
          ...obj
        };
      });
    },
    addThirdLink() {
      this.linksData.push({
        unique: createUnique(),
        iconObj: {
          icon: '',
          color: '',
          imageUrl: ''
        },
        menuName: '',
        linkAdress: ''
      });
    },
    async saveThirdLink(item) {
      const form = this.$refs[`form${item.unique}`][0];
      const res = await form.validate();
      if (res) {
        const params = {
          id: item.id || '',
          parameterKey: 'THIRD_LINKS',
          attributeKey: item.unique,
          attributeValue: JSON.stringify(item)
        };
        if (!params.id) {
          delete params.id;
        }
        this.loading = true;
        await saveGlobal(params);
        await this.$store.dispatch('fetchThirdLinks');
        this.linksData = JSON.parse(JSON.stringify(this.$store.state.globalConfig.thirdLinks));
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified')
        });
        this.loading = false;
      }
    },
    async deleteThirdLink(item, index) {
      console.log(item, index);
      const params = {
        id: item.id
      };
      this.loading = true;
      await batchDelete(params);
      await this.$store.dispatch('fetchThirdLinks');
      this.linksData = JSON.parse(JSON.stringify(this.$store.state.globalConfig.thirdLinks));
      this.$message({
        type: 'success',
        message: this.$t('common.deleteSuccess')
      });
      this.loading = false;
    }
  }
};
</script>

<style lang='scss' scoped>
.thirdLinks {
  height: calc(100% - 10px);
  margin: 10px 10px 0;
  box-sizing: border-box;
  border: 1px solid #e9e9e9;
  border-bottom: 0 none;
  padding: 10px 16px 0;
  .icon-xinzeng {
    margin-right: 4px;
    color: $--color-primary;
  }
  &__ul {
    margin: 10px 4px 0;
    height: calc(100% - 10px);
    overflow: auto;
  }
  &__li {
    display: flex;
    align-items: center;
    height: 74px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
    &:first-child {
      border-top: 1px solid #e9e9e9;
    }
    &--form {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      ::v-deep {
        .el-form-item {
          margin-bottom: 0;
          .el-form-item__content {
            margin-left: 0 !important;
          }
        }
      }
    }
    &--icon {
      margin-right: 10px;
    }
    &--name {
      width: 250px;
    }
    &--linkForm {
      flex: 1;
      margin-right: 10px;
    }
    &--link {
      width: 100%;
    }
  }
}
</style>
