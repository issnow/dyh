<template>
  <div class="line">
    <!-- <span v-for="e,i in list" :key="i"></span> -->
    <el-tooltip  v-for="(e,i) in item" :key="i" class="item" effect="dark" :content="e.text" placement="top">
      <span :style="e"></span>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    props: ['item']
  }
</script>

<style lang="scss" scoped>
.line {
  position: relative;
  flex: 1;
  height: 8px;
  border-radius: 15px;
  background-color: rgb(180, 176, 176);
  span {
    position: absolute;
    top: 0;
    // left: 20%;
    // right: 30%;
    height: 100%;
    // background-color: #3c8cff;
    border-radius: 15px;
    opacity: .7;
  }
}
</style>