<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      @select="handleSelect"
      router
    >
      <el-menu-item index="/">
        项目列表
      </el-menu-item>
      <el-menu-item index="/mycard">
        我的成片
      </el-menu-item>
      <!-- <el-menu-item :route='{path: "/aaa"}' index='3'>123132</el-menu-item> -->
      <!-- <el-menu-item index="4"
        ><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item
      > -->
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '/',
    };
  },
  created() {
    this.setCurrentRoute()
  },
  mounted() {
    console.log(this.$route, 'this')
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    setCurrentRoute() {
      this.activeIndex = this.$route.path
    }
  },
  watch: {
    $route() {
      this.setCurrentRoute()
    }
  },
};
</script>

<style lang="scss" scoped>
</style>