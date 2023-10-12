<template>
  <div class="cardUser__person">
    <span
      class="cardUser__person--tag m-r-6"
      v-for="item in formData.leaders || []"
      :key="item.id"
    >
      <user-avatar :userItem="item"></user-avatar>
    </span>
  </div>
</template>

<script>
import { selectList } from '@/api/menuConfig';

const userAvatar = () => import('_v/orgManage/components/userAvatar/index');
export default {
  name: '',
  props: {
    userids: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      formData: {
        leaders: [],
      },
    };
  },
  components: { userAvatar },
  methods: {
    // 数据初始化
    async initData(rowData) {
      if (rowData !== this.curValue) {
        this.curValue = rowData;
        const params = {
          selectContent:
            'account,email,enabled,icon,id,memo,orgId,telephone,username,wechat',
          selectFrom: 'sys_user',
          selectWhere: `(sys_user.id in (${rowData}))`,
        };
        const data = await selectList(params);
        data.forEach((item) => {
          item.icon =
            typeof item.icon === 'string' ? JSON.parse(item.icon) : item.icon;
        });
        // console.log(data);
        this.formData.leaders = data;
      } else {
        this.formData.leaders = [];
      }
    },
  },
  watch: {
    userids: {
      handler(v) {
        if (v) {
          this.initData(v);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.cardUser__person {
  display: flex;
  align-items: center;
}
.cardUser__person--tag {
  display: inline-block;
  height: 24px;
}
</style>
