<template>
  <el-breadcrumb separator="/">
    <!-- transition-group -->
    <el-breadcrumb-item v-for="(e) in levelList" :key="e.path">
      {{e.meta.title}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    data() {
      return {
        levelList: null
      }
    },
    created(){
      this.getBreadcrumb()
    },
    watch: {
      $route(newValue, oldValue) {
        this.getBreadcrumb()
      }
    },
    methods: {
      getBreadcrumb() {
        console.log(this.$route, 'route')
        let matched = this.$route.matched.filter(e=>e.meta&&e.meta.title)
        this.levelList = matched.filter(e=>e.meta&&e.meta.title)
      }
    },
  }
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  background-color: #fff;
  width: 100%;
  height: 50px;
  padding-left: 24px;
  margin-top: 24px;
  line-height: 46px;
}
</style>