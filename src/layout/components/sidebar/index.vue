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
    <logo
      :collapse="isCollapse"
    />
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      @select="handleSelect"
      router
      background-color="#001529"
      text-color="#8e8f93"
      active-text-color="#f0f0f0"
      :collapse="isCollapse"
    >

      <!-- <el-submenu index='/work'>
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
      </el-submenu> -->

      <!-- <el-menu-item index="/workManager">
        <i class="el-icon-setting"></i>
        <span slot="title">作品管理</span>
      </el-menu-item>
      <el-menu-item index="/projectList">
        <i class="el-icon-setting"></i>
        <span slot="title">项目管理</span>
      </el-menu-item>
      <el-menu-item index="/userList">
        <i class="el-icon-setting"></i>
        <span slot="title">用户管理</span>
      </el-menu-item > -->

      <sideBarItem
        v-for="(e) in permission_routes"
        :key="e.path"
        :icon='e.children[0].meta.icon'
        :title='e.children[0].meta.title'
        :index='e.path'
      />
    </el-menu>

  </div>
</template>

<script>
import logo from './logo'
import { mapGetters } from 'vuex'
import sideBarItem from './sideBarItem'
export default {
  components: {
    logo,
    sideBarItem
  },
  data() {
    return {
      // isCollapse: true,
      activeIndex: "/userList",
    };
  },
  mounted() {
    console.log('permission_routes', this.permission_routes)
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
    ...mapGetters(['sidebar', 'permission_routes']),
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  created() {
    this.setCurrentRoute();
    console.log('this',this)
  },
  methods: {
    setCurrentRoute() {
      switch (this.$route.path) {
        case '/workDetail':
          this.activeIndex = '/workManager'
          return;
      }
      
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
@import '@css/var.scss';
.el-menu {
  border-right-width: 0;
  .el-menu-item {
    ::v-deep &.is-active {
      background-color: #1890FF !important;
      color: $white !important;
    }
  }
}
</style>