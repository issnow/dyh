<template>
  <div>
    <div class="title">创建新项目</div>
    
    <el-row :gutter="20" class="mt20">
      <el-col :span="6" v-for="(e,i) in 3" :key="i">
        <create-new-pro-item :type='e' ></create-new-pro-item>  
      </el-col>  
      <!-- <el-col :span="6">
        <create-new-pro-item :type='2'></create-new-pro-item>  
      </el-col>  
      <el-col :span="6">
        <create-new-pro-item :type='3'></create-new-pro-item>  
      </el-col>   -->
    </el-row>
    

    <el-card class="new-item-card mt20" @click.native="click">
      sadfsdafs
    </el-card>
    <el-row>
      <el-col :span='8' v-for="(e,i) in 3" :key="i">
        <el-card class=" mt20">
          <p>safsdf</p>
          <p>sfasdfasdf</p>
        </el-card>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
  import createNewProItem from '@component/createNewProItem'
import CreateNewProItem from '../components/createNewProItem.vue'
  export default {
    components: {
      createNewProItem
    },
    methods: {
      click() {
        console.log('click')
      }
    },
  }
</script>

<style lang="scss" scoped>
.new-item-card {
  width: 200px;
}
</style>