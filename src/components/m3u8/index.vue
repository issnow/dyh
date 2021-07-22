<template>
  <div
    class="m3u8"
    @mouseover="comMouseOver"
    @mouseout="comMouseOut"
    ref="previewComponents"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="mask" ref="mask">
      <img
        src="../../assets/audioPlay.png"
        class="play-btn"
        width="23"
        alt=""
      />
    </div>
    <div class="hoverback" ref="hoverback" @click="previewClick"></div>
    <el-dialog
      fullscreen
      :visible="show"
      @before-close="closeDialog"
      :show-close="false"
    >
      <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog" />
      <player :src="src" :bgImage="bgImage" ref="player" />
    </el-dialog>
  </div>
</template>
<script>
import player from "./player.vue";
export default {
  components: {
    player,
  },
  props: ["bgImage", "src"],
  data() {
    return {
      show: false,
    };
  },
  methods: {
    comMouseOver() {
      this.$refs.mask.style.display = "block";
      if (this.bgImage != "") {
        this.$refs.hoverback.style.setProperty("display", "block");
      }
    },
    comMouseOut() {
      this.$refs.mask.style.display = "none";
      this.$refs.hoverback.style.setProperty("display", "none");
    },

    previewClick() {
      this.show = true;
    },
    closeDialog() {
      this.show = false;
      this.$refs.player.close();
    },
  },
};
</script>
<style lang="scss" scope>
.m3u8 {
  position: relative;
  cursor: pointer;
  width: 84px;
  height: 48px;
  // max-width: 84px;
  // max-height: 48px;
  background: #ccc;
  // background-image: url("./../assets/logo.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  opacity: 1;
  border-radius: 4px;
  margin-left: calc(50% - 43px);
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    width: 100%;
    height: 100%;
  }
  .el-dialog.is-fullscreen {
    background: rgba($color: #000000, $alpha: 0.5);
    .contenainer {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 25pt;
  }
  .hoverback {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
    opacity: 0.2;
    display: none;
    pointer-events: auto;
  }
  .mask {
    position: absolute;
    display: none;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.6;
    .play-btn {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .el-dialog__body {
    height: 95%;
    .el-dialog__close {
      font-size: 25pt;
      position: relative;
      left: calc(100% - 80px);
      top: 40px;
      color: #fff;
    }
  }
  .video-player {
    width: 960px;
    margin-left: calc(50% - 480px);
    height: 540px;
    margin-top: 10vh;
  }
}
</style>