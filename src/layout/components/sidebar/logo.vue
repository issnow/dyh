<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link">
        <img :src="getImg('logo/标题/标题logo图形.svg')" class="sidebar-logo" />
        <!-- <svg class="icon" aria-hidden="true" style="font-size: 28px">
          <use xlink:href="#icon-biaotilogotuxing"></use>
        </svg> -->
      </div>
      <div v-else key="expand" class="sidebar-logo-link">
        <img :src="getImg('logo/标题/标题logo图形.svg')" class="sidebar-logo" />
        <img
          class="sidebar-title"
          :src="getImg('logo/标题/标题logo文字.svg')"
          alt=""
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["collapse"],
  methods: {
    getImg(src) {
      if (src) {
        return require("@/assets/" + src);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  position: relative;
  width: 248px;
  height: 100%;
  line-height: 50px;
  background: #4c7378;
  text-align: center;
  overflow: hidden;
  img {
    object-fit: none;
  }
  .sidebar-logo-link {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 100%;
    width: 100%;
  }
  .sidebar-logo {
    margin-left: 8px;
    width: 28px;
    margin-right: 8px;
    transition: all .28s;
  }
  .sidebar-title {
    width: 204px;
    display: inline-block;
    margin: 0;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 14px;
  }
  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
      margin-left: 0px;
    }
  }
}
</style>