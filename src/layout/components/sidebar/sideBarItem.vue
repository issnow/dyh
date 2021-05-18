<template>
  <el-menu-item :index="index" :data-path='index'>
    <i :class='"iconfont "+icon'></i>
    <span slot="title">{{title}}</span>
  </el-menu-item>
</template>

<script>
export default {
  props: ["index", "icon", "title"],
};
</script>

<style lang="scss" scoped>
.iconfont {
  font-size: 18px;
  margin-right: 8px;
}
</style>