<template>
  <div class="navbar">


    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="right-menu">
      <i class="el-icon-user-solid"></i>
      <div class="email">abc@moviebook.cn</div>
      <i class="el-icon-user-solid"></i>
    </div>

  </div>
</template>

<script>
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Hamburger,
  },
  data() {
    return {
      sidebar: {
        opened: true
      }
    }
  },
  methods: {
    toggleSideBar() {
      // this.$store.dispatch('app/toggleSideBar')
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  line-height: 46px;
  #hamburger-container {
    float: left;
  }
  .right-menu {
    float: right;
    *{
      display: inline-block;
      margin-right: 20px;
    }
  }
}
</style>