<template>
  <div>
    <el-image
      style="width: 100px; height: 100px"
      :src="src"
      :preview-src-list="list"
    >
    </el-image>
  </div>
</template>

<script>
export default {
  props: ['src', 'list']
};
</script>

<style lang="scss" scoped>
</style>