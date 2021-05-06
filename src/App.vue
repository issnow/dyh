<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-header>
        <a-header></a-header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <a-side></a-side>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import header from "./views/header.vue";
import aSide from "./views/aSide.vue";
export default {
  data() {
    return {
      a: "主页",
    };
  },
  components: {
    aHeader: header,
    aSide,
  },
};
</script>

<style lang="scss" scoped>
@import "$css/var.scss";
#app {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: $fontColorBlack;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: $bgColorBlack;
  color: #333;
  text-align: center;
  line-height: 200px;
  
}

.el-main {
  background-color: $bgColor;
  color: $fontColorBlack;
  // text-align: center;
  // line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

</style>
<style lang="scss">
@import "$css/var.scss";

.el-aside {
  .el-menu-item {
    color: $fontColorGray;
    &:focus, &:hover {
      background-color: $bgColorBlack;
    }
    &.is-active {
      color: $fontColorWhite;
    }
  }
}
</style>