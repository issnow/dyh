<template>
  <el-menu-item :index="index">
    <i :class="'el-icon-'+icon"></i>
    <span slot="title">{{title}}</span>
  </el-menu-item>
</template>

<script>
export default {
  props: ["index", "icon", "title"],
};
</script>

<style lang="scss" scoped>
</style>