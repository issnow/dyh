<template>
  <div>
    <!-- <input type="text" v-model="value" @change='change'> -->
    <el-input
      style="width: 100px"
      class='mt20'
      v-model="input"
      placeholder="请输入内容"
      @input="change"
    ></el-input>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    change: _.debounce(v=>{
      console.log(v)
    }, 300),
  },
};
</script>

<style lang="scss" scoped>
</style>