<template>
  <div style="padding: 0 15px" @click="toggleClick">
    <i :class="`iconfont icon-vertical${!isActive?'left':'right'}`" style="opacity: .4;"></i>
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
