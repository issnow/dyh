<template>
  <el-image :style="styleObj" :src="src" :preview-src-list="list" fit="scale-down">
  </el-image>
</template>

<script>
export default {
  props: ["src", "list", "styleObj"],
};
</script>

<style lang="scss" scoped>
.el-image {
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>