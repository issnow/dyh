<template>
  <div class="app-main-wrap">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view :key="key"></router-view>
        </keep-alive>
      </transition>
      <div class="footer">
        <div class="desc">
<!--          <span>帮助</span><span>隐私</span><span>条款</span>-->
        </div>
        <p>copyright @ 2021 江苏文投大运河文化传播</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "appMain",
  computed: {
    key() {
      // return this.$route.path
      return this.$route.name !== undefined
        ? this.$route.name + new Date()
        : this.$route + new Date();
    },
  },
};
</script>

<style lang="scss" scoped>
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.app-main-wrap {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  .app-main {
    flex: 1;
    position: relative;
    overflow: scroll;
    background-color: #fff;
    overflow: auto;
    .footer {
      height: 70px;
      padding: 10px 0;
      text-align: center;
      font-size: 12px;
      z-index: 100;
      color: #6b7277;
      opacity: 0.5;

      .desc span {
        display: inline-block;
        padding: 0 20px;
      }
    }
  }
}
</style>
