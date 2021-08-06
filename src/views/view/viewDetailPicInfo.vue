<template>
  <div class="view-detail-video-info">
    <div class="header">图片信息:</div>
    <div class="content">
      <div class="content-line">
        <div class="info-item">
          <div class="info-label">格式:</div>
          <div class="info-content">{{ product.video_format }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">创建时间:</div>
          <div class="info-content">{{ product.created_at }}</div>
        </div>
      </div>

      <div class="content-line">
        <div class="info-item">
          <div class="info-label">大小:</div>
          <div class="info-content">{{ product.video_size }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">更新时间:</div>
          <div class="info-content">{{ product.updated_at }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "viewDetailVideoInfo",
  props: ['product'],
};
</script>

<style scoped lang="scss">
.view-detail-video-info {
  .header {
    font-size: 16px;
    font-weight: 600;
    width: 100%;
    //text-align: right;
    border-bottom: 1px solid #E4E7ED;
    padding-bottom: 10px;
  }

  .content {
    margin-top: 10px;

    .content-line {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: 20px;
    }

  }

  .info-item {
    min-width: 240px;
    font-size: 14px;
    display: flex;
    align-items: center;

    .info-label {
      width: 60px;
      text-align: right;
      margin-right: 10px;
    }

    .info-content {
      flex: 1;
    }
  }
}
</style>
