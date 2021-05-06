<template>
  <div>
    mycard
    <!-- <input-text></input-text> -->
    <el-row class="marginT20">
      <el-button @click="getData">默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
  </div>
</template>

<script>
  import inputText from '$component/inputText'
  import {
    getData
  } from '@api/main'
  export default {
    data() {
      return {
        value: ''
      }
    },
    components: {
      inputText,
    },
    methods: {
      async getData() {
        // let res = await this.$api.get('/api/aaa')
        let res = await getData()
        console.log(res, 'res')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>