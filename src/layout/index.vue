<template>
  <div class="app-wrapper" :class="classObj">
    <div class="fixed-header">
      <logo :collapse="isCollapse" />
      <navbar></navbar>
    </div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <!-- <div class="fixed-header">
        <navbar></navbar>
      </div> -->
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain, Navbar, breadcrumb } from "./components";
import { mapGetters } from "vuex";
import logo from "./components/sidebar/logo";
export default {
  computed: {
    ...mapGetters(["sidebar"]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
      };
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  components: {
    Sidebar,
    AppMain,
    Navbar,
    breadcrumb,
    logo,
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  .fixed-header {
    display: flex;
    position: fixed;
    height: 50px;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    // overflow: hidden;
  }
  .sidebar-container {
    transition: width 0.28s;
    width: 150px !important;
    background-color: #001529;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 50px;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
  &.hideSidebar {
    .sidebar-container,
    .sidebar-logo-container {
      width: 64px !important;
    }
    .navbar {
      width: calc(100% - 64px);
    }
    .main-container {
      margin-left: 64px;
      // .fixed-header {
      //   width: calc(100% - 64px);
      // }
    }
  }
  .main-container {
    padding-top: 50px;
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: 150px;
    position: relative;
    background-color: $white;
  }
}
</style>