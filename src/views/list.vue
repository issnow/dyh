<template>
  <div>
    <div class="title">创建新项目</div>
    
    <el-card class="new-item-card marginT20">
      sadfsdafs
    </el-card>
    <el-row>
      <el-col :span='8' v-for="(e,i) in 3" :key="i">
        <el-card class=" marginT20">
          <p>safsdf</p>
          <p>sfasdfasdf</p>
        </el-card>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.new-item-card {
  width: 200px;
}
</style>