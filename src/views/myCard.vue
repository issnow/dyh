<template>
  <div>
    mycard
    <!-- <input-text></input-text> -->
    <el-row class="mt20">
      <el-button @click="getData">默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>

      <my-btn @myevent='customEvent' ref='btn'></my-btn>
    </el-row>
  </div>
</template>

<script>
  import inputText from '@component/inputText'
  import myBtn from '@component/btn'
  import {
    getData
  } from '@api/main'
  export default {
    data() {
      return {
        value: ''
      }
    },
    created() {
      console.log('created',this)
    },
    mounted() {
      console.log('mounted',this)
    },
    components: {
      inputText,
      myBtn
    },
    methods: {
      async getData() {
        // let res = await this.$api.get('/api/aaa')
        let res = await getData()
        console.log(res, 'res')
        this.$refs.btn.fn()
      },
      customEvent(v) {
        console.log(v)
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>