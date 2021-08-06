<template>
  <div class="image-info">
    <div class="title">{{ title }}:</div>
    <div class="item">
      <span class="label">格式:</span>
      <span class="content">{{ viewInfo.video_format }}</span>
    </div>
    <div class="item">
      <span class="label">大小:</span>
      <span class="content">{{ viewInfo.video_size }}</span>
    </div>
    <div class="item">
      <span class="label">创建时间:</span>
      <span class="content">{{ viewInfo.created_at }}</span>
    </div>
    <div class="item">
      <span class="label">更新时间:</span>
      <span class="content">{{ viewInfo.updated_at }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    viewInfo: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";

.image-info {
  .title {
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
    font-size: 16px;
    color: $deepDark;
    font-weight: 600;
  }
  .item {
    margin-top: 20px;
    font-size: 14px;
    .label {
      color: $gray;
      display: inline-block;
      width: 100px;
      text-align: right;
      padding-right: 12px;
    }
  }
}
</style>