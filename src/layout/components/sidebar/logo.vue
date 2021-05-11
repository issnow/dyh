<template>
  <div class="sidebar-logo-container">
    <!-- <transition name="sidebarLogoFade"> -->
        <img :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      <!-- <router-link class="sidebar-logo-link" path='/'> -->
        <!-- <div>2324</div> -->
      <!-- </router-link> -->
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '大运河',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container{
  position: relative;
  // display: flex;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
  .sidebar-logo-link {
    height: 100%;
    width: 100%;
  }
  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 12px;
  }
  .sidebar-title {
    display: inline-block;
    margin: 0;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 14px;
    vertical-align: middle;
  }
}
</style>