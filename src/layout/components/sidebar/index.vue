<template>
  <div class="has-logo">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      router
      background-color="#E4EBF2"
      text-color="#6B7277"
      active-text-color="#4B7378"
      :collapse="isCollapse"
      :collapse-transition="false"
    >

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
import { mapGetters } from 'vuex'
import sideBarItem from './sideBarItem'
export default {
  components: {
    sideBarItem
  },
  data() {
    return {
      activeIndex: "/userList",
    };
  },
  // mounted() {
  //   console.log('permission_routes', this.permission_routes)
  // },
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
  },
  methods: {
    setCurrentRoute() {
      let path = this.$route.path
      switch (path) {
        // case '/productDetail':
        //   this.activeIndex = '/workManager'
        //   return;
        case '/viewDetail':
          this.activeIndex = '/viewList'
          return;
      }
      if(path.includes('/workDetail')) {
        this.activeIndex = '/workManager'
        return
      }
      if(path.includes('/productDetail')) {
        this.activeIndex = '/productManager'
        return
      }
      this.activeIndex = this.$route.path;
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
      background-color: #fff !important;
    }
    &:not(.is-active):hover{
      background-color: #DBE2E8 !important;
    }
  }
}
</style>