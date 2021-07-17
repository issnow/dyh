<template>
  <div>
    <el-image
      :style='styleObj'
      :src="src"
      :preview-src-list="list"
    >
    </el-image>
  </div>
</template>

<script>
export default {
  props: ['src', 'list', 'styleObj']
};
</script>

<style lang="scss" scoped>
</style>