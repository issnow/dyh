<template>
  <div class="audio-preview">
    <!-- <div class="flotStyle" @click="dialogVisible=true"></div> -->
    <i class="iconfont icon-Musicfiles" @click="dialogVisible=true"></i>

    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      fullscreen
    >
      <audio class="audio-play" :src="source" controls preload ref="audio"></audio>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["source"],
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$refs.audio.pause()
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-preview {
  height: 100%;
  ::v-deep .el-dialog.is-fullscreen {
    background-color: rgba(0, 0, 0, 0.5);
    .el-dialog__close {
      font-size: 50px;
      color: #fff;
    }
    .el-dialog__body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 30px);
      .audio-play {
        width: 30%;
      }
    }
  }
  .flotStyle {
    margin-left: 50%;
    transform: translateX(-50%);
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("./../assets/audioPlay.png");
    background-repeat: no-repeat;
    background-size: 28px 28px;
    cursor: pointer;
  }
  .flotStyle:hover {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("./../assets/audioPlayhover.png");
    background-repeat: no-repeat;
    background-size: 28px 28px;
  }
  .icon-Musicfiles {
    margin-left: calc(50% - 14px);
    font-size: 35px;
    cursor: pointer;
    line-height: 48px;
  }
}
</style>