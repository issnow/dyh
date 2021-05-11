<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class="fix-header">
        <navbar></navbar>
        <breadcrumb></breadcrumb>
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain, Navbar,breadcrumb } from "./components";

export default {
  components: {
    Sidebar,
    AppMain,
    Navbar,
    breadcrumb
  },
};
</script>

<style lang="scss" scoped>
@import '@css/var.scss';
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  .sidebar-container {
    transition: width 0.28s;
    width: 210px !important;
    background-color: #304156;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
  .main-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: 210px;
    position: relative;
    background-color: $white;
  }
}
</style>