<template>
  <el-image
    :lazy="true"
    :style="styleObj"
    :src="src"
    :preview-src-list="list"
    :fit="fit"
  >
  </el-image>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      default: [],
    },
    styleObj: {
      type: Object,
      default: {},
    },
    fit: {
      type: String,
      default: "fill",
    },
  },
};
</script>

<style lang="scss" scoped>
.el-image {
  margin-left: 50%;
  transform: translateX(-50%);
  ::v-deep img {
    max-height: inherit;
  }
}
</style>