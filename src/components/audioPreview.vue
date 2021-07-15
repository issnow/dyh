<template>
  <div class="audio-preview">
    <el-button @click="dialogVisible = true">音频预览</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      fullscreen
    >
      <audio class="audio-play" :src="source" controls preload></audio>
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
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-preview {
  ::v-deep .el-dialog.is-fullscreen {
    background-color: rgba(0,0,0,.5);
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
}
</style>