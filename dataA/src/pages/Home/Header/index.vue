/**
* @name: index
* @author: DELL
* @date: 2021/10/30 16:56
* @description：index
* @update: 2021/10/30 16:56
*/
<!-- 页面 -->
<template>
  <div class="main1 flex-col">
    <div class="main2 flex-col">
      <div class="group1 flex-col">
        <UserName></UserName>
<!--        <img-->
<!--            class="img1"-->
<!--            referrerpolicy="no-referrer"-->
<!--            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngcefdfee17718f55541c16e628517ebe6923e25c57c7729430ad09bce97e92020"-->
<!--        />-->
<!--        <div class="box2 flex-col"><span class="txt2">机至官网</span></div>-->
<!--        <div class="box3 flex-col"><span class="txt3">平台系统</span></div>-->
        <!--        <img-->
        <!--            class="pic1"-->
        <!--            @click="doEnterFullScreen"-->
        <!--            referrerpolicy="no-referrer"-->
        <!--            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngda80634ae4086e78d030aa4714c7e692c67cfc63fc1680a618c3b64917edd9e4"-->
        <!--        />-->
<!--        <span class="iconfont icon-wentibangzhu pic2"></span>-->
        <CFullScreen></CFullScreen>
      </div>
      <div class="group2">
<!--        <span class="info2">APIoT&nbsp;</span>-->
<!--        <span class="word1">DataA&nbsp;1.0</span>-->
        <span class="word1">DataA&nbsp;</span>
        <span class="txt4">&nbsp;数据分析可视化</span>
      </div>
      <div class="group3 flex-col">
        <div class="box4 flex-col">
<!--              <span class="info3">-->
<!--                APIoT DataA 1.0 Digital Visualization-->
<!--              </span>-->
          <span class="info3">
                 DataA 1.0 Data analysis
              </span>
          <div class="main3 flex-col"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserName from './component/userName';
export default {
  data() {
    return {};
  },

  components: {
    UserName
  },

  computed: {},

  mounted() {},

  methods: {},
  beforeDestroy() {},
  name: 'index'
};
</script>

<style lang='scss' scoped>

.main1 {
  z-index: 3;
  height: 280px;
  background: url(~@/assets/homeBg2.png) 100% no-repeat;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnga78c94807d5c08d6822ead9dd172f3ad7dde04c936b6736403471e965c3824a6) 100% no-repeat;
  width: 100%;
}

.main2 {
  z-index: auto;
  width: 100%;
  height: 280px;
}

.group1 {
  z-index: 8;
  height: 50px;
  overflow: hidden;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng5618fef5c6f523f936cb62cdaaf2a314571a214510d1d673165d3b4989bb630c) 100% no-repeat;
  width: 100%;
  background-size: 100% 50px;
  justify-content: center;
  align-items: flex-end;
  padding-right: 26px;
  position: relative;
}


.img1 {
  z-index: 36;
  position: absolute;
  left: 20px;
  top: 15px;
  width: 74px;
  height: 20px;
}

.box2 {
  z-index: 34;
  height: 50px;
  width: 94px;
  justify-content: center;
  align-items: flex-end;
  padding-right: 17px;
  position: absolute;
  right: 325px;
  top: 0;
}

.txt2 {
  z-index: 35;
  width: 56px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 18px;
  text-align: right;
}

.box3 {
  z-index: 31;
  height: 50px;
  width: 94px;
  justify-content: center;
  align-items: flex-end;
  padding-right: 17px;
  position: absolute;
  right: 235px;
  top: 0;
}

.txt3 {
  z-index: 32;
  width: 56px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 18px;
  text-align: right;
}

.pic1 {
  z-index: 9;
  position: absolute;
  right: 163px;
  top: 16px;
  //width: 61px;
  height: 18px;
  font-size: 22px;
  color: #FFFFFF;
  cursor: pointer;
}

.pic2 {
  z-index: 9;
  position: absolute;
  right: 156px;
  top: 16px;
  width: 61px;
  height: 18px;
  font-size: 22px;
  color: #FFFFFF;
}

.group2 {
  z-index: 157;
  width: 430px;
  height: 50px;
  overflow-wrap: break-word;
  text-align: left;
  white-space: nowrap;
  align-self: flex-start;
  font-size: 0;
  margin: 0 0 0 208px;
}


.info2 {
  font-size: 36px;
  font-family: PingFangSC-Medium;
  color: rgba(255, 255, 255, 1);
  line-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.word1 {
  font-size: 36px;
  font-family: PingFangSC-Medium;
  color: rgba(70, 137, 245, 1);
  line-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.txt4 {
  font-size: 36px;
  font-family: PingFangSC-Medium;
  color: rgba(255, 255, 255, 1);
  line-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group3 {
  z-index: 4;
  height: 158px;
  background: url(~@/assets/homeBg.png) 100% no-repeat;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngb598dc86c935b2cbfdf1b373fb0547a737fd1d02954906eab9d978e0e357f71b) 100% no-repeat;
  width: 100%;
  background-size: 100% 158px;
}

.box4 {
  z-index: auto;
  width: 100%;
  height: 158px;
}

.info3 {
  z-index: 158;
  width: 242px;
  height: 22px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 16px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 22px;
  text-align: left;
  align-self: flex-start;
  margin-left: 208px;
}

.main3 {
  z-index: 5;
  width: 100%;
  height: 136px;
  background-image: linear-gradient(
          180deg,
          rgba(5, 16, 58, 0) 0%,
          rgba(5, 16, 58, 1) 100%
  );
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}
</style>
