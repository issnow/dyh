<template>
  <div>
    <el-button @click="click">click</el-button>
  </div>
</template>

<script>
  export default {
    methods: {
      click() {
        this.$emit('myevent', 12)
      },
      fn() {
        console.log(23)
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>