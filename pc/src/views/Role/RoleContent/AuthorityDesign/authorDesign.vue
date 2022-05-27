<!-- 页面 -->
<template>
  <apiot-tabs
      v-on="$listeners"
      v-bind="$attrs"
      :tabsArr="tabsArr"
  >
    <template v-slot:commonPcDesign>
      <design-list :designObj="designObj"
                   :activeTabsKey="activeTabsKey"
                   :functionType="functionType"
                   com="PCDesign"></design-list>
    </template>
    <template v-slot:commonMobileDesign>
      <design-list :designObj="designObj"
                   :activeTabsKey="activeTabsKey"
                   :functionType="functionType"
                   com="mobileDesign"></design-list>
    </template>
  </apiot-tabs>
</template>

<script>
import DesignList from '../DesignList/designList';

export default {
  props: {
    designObj: {
      type: Object,
      default: () => {
      }
    },
    activeTabsKey: {
      type: String,
      default: 'PCDesign'
    },
    functionType: {
      type: String,
      default: 'user',
    }
  },
  beforeUpdate() {
    this.tabsArr = [
      {
        label: this.$t('role.desktopPermission'),
        compName: 'commonPcDesign',
        key: 'PCDesign',
      },
      {
        label: this.$t('role.Mobileterminalpermission'),
        compName: 'commonMobileDesign',
        key: 'mobileDesign',
      },
    ];
  },
  data() {
    return {
      tabsArr: [
        {
          label: this.$t('role.desktopPermission'),
          compName: 'commonPcDesign',
          key: 'PCDesign',
        },
        {
          label: this.$t('role.Mobileterminalpermission'),
          compName: 'commonMobileDesign',
          key: 'mobileDesign',
        },
      ],
    };
  },

  components: { DesignList },

  computed: {},

  mounted() {
  },

  methods: {},
};
</script>

<style lang='scss' scoped>
</style>
