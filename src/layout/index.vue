<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class="fixed-header">
        <navbar></navbar>
        <!-- 面包屑 -->
        <!-- <breadcrumb></breadcrumb> -->
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain, Navbar, breadcrumb } from "./components";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["sidebar"]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
      };
    },
  },
  components: {
    Sidebar,
    AppMain,
    Navbar,
    breadcrumb,
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  .sidebar-container {
    transition: width 0.28s;
    width: 210px !important;
    background-color: #001529;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
  &.hideSidebar {
    .sidebar-container {
      width: 64px !important;
    }
    .main-container {
      margin-left: 64px;
      .fixed-header {
        width: calc(100% - 64px);
      }
    }
  }
  .main-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: 210px;
    position: relative;
    background-color: $white;
    .fixed-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 2010;
      width: calc(100% - #{$sideBarWidth});
      transition: width 0.28s;
      + .app-main-wrap {
        padding-top: 50px;
      }
    }
  }
}
</style>