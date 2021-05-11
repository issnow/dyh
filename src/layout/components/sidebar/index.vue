<template>
  <div class="has-logo">
    <!-- <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :background-color="variables.dark"
      :text-color="variables.gray"
      :unique-opened="false"
      :active-text-color="variables.white"
      :collapse-transition="false"
      mode="vertical"
    >
      <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu> -->
    <logo />
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      @select="handleSelect"
      router
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-submenu index='/user'>
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user">用户列表</el-menu-item>
        <el-menu-item index="/user/usercenter">个人中心</el-menu-item>
      </el-submenu>

      <el-submenu index='/work'>
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>作品管理</span>
        </template>
        <el-menu-item index="/work/manager">作品管理</el-menu-item>
        <el-menu-item index="/work/detail">作品详情</el-menu-item>
      </el-submenu>

      <el-submenu index='/project'>
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>项目管理</span>
        </template>
        <el-menu-item index="/project/projectList">项目列表</el-menu-item>
      </el-submenu>
    </el-menu>

  </div>
</template>

<script>
import logo from './logo'
export default {
  components: {
    logo,
  },
  data() {
    return {
      isCollapse: true,
      activeIndex: "/user",
    };
  },
  computed: {
    // activeMenu() {
    //   const route = this.$route;
    //   const { meta, path } = route;
    //   // if set path, the sidebar will highlight the path you set
    //   if (meta.activeMenu) {
    //     return meta.activeMenu;
    //   }
    //   return path;
    // },
    // isCollapse() {
    //   return !this.sidebar.opened;
    // },
  },
  created() {
    this.setCurrentRoute();
  },
  methods: {
    setCurrentRoute() {
      this.activeIndex = this.$route.path;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  watch: {
    $route() {
      this.setCurrentRoute();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu {
  border-right-width: 0;
}
</style>