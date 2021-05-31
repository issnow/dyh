<template>
  <div style="padding: 0 15px" @click="toggleClick">
    <i v-show="!isActive" class="iconfont icon-indent"></i>
    <i v-show="isActive" class="iconfont icon-outdent"></i>
  </div>
</template>

<script>
export default {
  name: "Hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleClick() {
      this.$emit("toggleClick");
    },
  },
};
</script>

<style scoped>
.iconfont {
  font-size: 22px;
  color: #f0f0f0;
  cursor: pointer;
}
</style>
