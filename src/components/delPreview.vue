<template>
  <div class="del-preview">
    <el-tooltip content="作品违规，文件已被管理员删除！" placement="top">
      <i class="icon el-icon-warning-outline"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "delPreview",
};
</script>

<style scoped lang="scss">
@import "@css/var.scss";


.del-preview {
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    cursor: pointer;
    font-size: 36px;
    color: $supRed;
  }
}
</style>
