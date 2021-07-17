<template>
<div class="view-detail-video-info">
  <div class="header">视频信息:</div>
  <div class="content">
    <div class="content-line">
      <div class="info-item">
        <div class="info-label">格式:</div>
        <div class="info-content">{{ product.video_format }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">大小:</div>
        <div class="info-content">{{ product.video_size }}</div>
      </div>
    </div>
    <div class="content-line">
      <div class="info-item">
        <div class="info-label">画幅:</div>
        <div class="info-content">{{ product.wh_ratio }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">时长:</div>
        <div class="info-content">{{ product.duration }}(S)</div>
      </div>
    </div>
    <div class="content-line">
      <div class="info-item">
        <div class="info-label">分辨率:</div>
        <div class="info-content">{{ product.resolution }}</div>
      </div>
    </div>
    <div class="content-line">
      <div class="info-item">
        <div class="info-label">创建时间:</div>
        <div class="info-content">{{ product.created_at }}</div>
      </div>
    </div>
    <div class="content-line">
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
  props:['product']
};
</script>

<style scoped lang="scss">
.view-detail-video-info{
  .header {
    font-size: 14px;
    font-weight: 600;
    width: 60px;
    text-align: right;
  }

  .content {
    margin-top: 10px;

    .content-line{
      display: flex;
      align-items: center;
      justify-content: start;
      margin-top: 10px;
    }

  }

  .info-item {
    min-width: 140px;
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
