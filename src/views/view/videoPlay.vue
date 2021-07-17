<template>
  <div class="video-play">
    <div class="video-warp">
      <video
          :src="src"
          controls
          preload
      >
      </video>
    </div>
    <div class="video-audit">
      <div class="video-audit-item">
        <div class="audit-title">视频:</div>
        <div class="audit-content">
          <div class="audit-list">
            <div class="audit-item"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: ['src'],
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";
.video-play {
  width: 100%;

  .video-warp {
    width: 100%;
    padding-left: 50px;
  }

  .video-audit {
    width: 100%;

    .video-audit-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding-top: 10px;
    }

    .audit-title {
      width: 50px;
      font-size: 14px;
    }
    .audit-content{
      flex: 1;
      padding: 0 12px;
      .audit-list {

        background: #ebeef5;
        height: 6px;
        border-radius: 4px;
        position: relative;

        .audit-item{
          width: 100%;
          height: 6px;
          background: $supRed;
          position: absolute;
          top: 0px;
          left: 0px;
          border-radius: 4px;
        }
      }
    }



  }

  video {
    display: block;
    width: 100%;
    height: 100%;
  }
}

</style>
