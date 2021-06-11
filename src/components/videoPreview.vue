<template>
  <div
    class="preview-components"
    ref="previewComponents"
    @mouseover="comMouseOver"
    @mouseout="comMouseOut"
  >
    <div class="mask" ref="mask">
      <img src="../assets/audioPlay.png" class="play-btn" width="23" alt=""/>
    </div>
    <i class="el-icon-video-plays" ref="playbutton" style="display: none"></i>
    <div class="hoverback" ref="hoverback" @click="previewClick"></div>

    <div class="poctureClass" v-if="isPicture">
        <div class="flotStyle"></div>
    </div>

    <div class="emojiClass" v-if="isEmoji">
        <img
            :src="source"
            alt
            srcset
            width="30"
            height="32"
            @click="previewClick"
        />
    </div>

    <div class="videoClass" v-if="isVideo" @click="previewClick">
      <div class="flotStyle"></div>
    </div>

    <div class="audioClass" v-if="isAudio" @click="previewClick">
        <div class="flotStyle"></div>
    </div>

    <el-dialog
      fullscreen
      :visible="show"
      :show-close="false"
      @opened="this.opendialog"
    >
      <i
        class="el-dialog__close el-icon el-icon-close"
        @click="this.closeDialog"
      />
      <div class="contenainer" ref="contenainers">
        <video
          :src="source"
          v-if="isVideo"
          @loadstart="addedcontenainers"
          @error="addedOnerror"
          style="width: 960px; height: 540px; position: relative"
          controls
          ref="player"
          disablePictureInPicture
          controlslist="nodownload"
        ></video>
        <audio
            :src="source"
            v-if="isAudio"
            controls
            @error="addedOnerror"
            ref="audioPlayer"
            @loadstart="addedcontenainers"
            controlslist="nodownload"
        ></audio>
        <img
            :src="source"
            v-if="isPicture"
            style="max-width:960px;max-height:540px"
        />
        <img
            :src="source"
            v-if="isEmoji"
            @load="addedcontenainers"
            style="width:72px;height:72px"
        />
        <span style="position: absolute" ref="errorText"></span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      modal: false,
      isFull: false,
    };
  },
  props: {
    source: {
      type: String,
      default: "",
    },
    isVideo: {
      type: Boolean,
      default: false,
    },
    bgImage: {
      type: String,
      default: "",
    },
    isAudio: {
        type: Boolean,
        default: false
    },
    isPicture: {
        type: Boolean,
        default: false
    },
    isEmoji: {
        type: Boolean,
        default: false
    },
    isText: {
        type: Boolean,
        default: false
    },
    isEffect: {
        type: Boolean,
        default: false
    },
    isFonts: {
        type: Boolean,
        default: false
    }
  },
  watch: {
    bgImage(newVal, oldVal) {
      // console.log("new value:>>", newVal, "old value:>>", oldVal);
      let path = newVal;
      let src = "url(" + path + ")";
      if (newVal != "") {
        this.$refs.previewComponents.style.backgroundImage = src;
        this.$refs.previewComponents.style.backgroundRepeat = "no-repeat";
        this.$refs.previewComponents.style.backgroundPosition = "center";
        this.$refs.previewComponents.style.backgroundSize = "cover";
      } else {
        this.$refs.previewComponents.style.backgroundImage = "";
        this.$refs.previewComponents.style.backgroundSize = "";
      }
    },
  },
  mounted() {
    // let src = "./../assets/img.png";
    if (this.bgImage != "") {
      let src = "url(" + this.bgImage + ")";
      this.$refs.previewComponents.style.backgroundImage = src;
      this.$refs.previewComponents.style.backgroundRepeat = "no-repeat";
      this.$refs.previewComponents.style.backgroundSize = "cover";
    }

    window.addEventListener("resize", this.winResize);
    if (this.isEmoji || this.isAudio) {
        this.$refs.previewComponents.style.backgroundColor =
            "rgba(0,0,0,0)";
            this.$refs.previewComponents.style.backgroundImage="none";
    }
    let self = this;
    this.$nextTick(function () {
      document.addEventListener("keyup", function (e) {
        if (e.keyCode == 27) {
          if (self.show) {
            // self.show = false;
            self.closeDialog();
          }
        }
      });
    });
  },
  methods: {
    addedOnerror() {
      console.log("video is error");
      let text = "";
      if (this.isVideo) {
        text = "视频无法播放";
        this.$refs.errorText.style.setProperty("color", "#fff");
      }
      if(this.isAudio){
          text="音频无法播放";
          this.$refs.errorText.style.setProperty('color','#ff0000');
          this.$refs.errorText.style.setProperty('padding-top','30px');
      }
      if(this.isPicture){
          text="图片无法显示";
          this.$refs.errorText.style.setProperty('color','#fff');
      }
      this.$refs.errorText.innerHTML = text;
    },
    comMouseOver() {
      this.$refs.mask.style.display = "block";
      if (this.bgImage != "") {
        this.$refs.hoverback.style.setProperty("display", "block");
      }
      if (this.isVideo) {
        if (this.source != "") {
          this.$refs.playbutton.style.setProperty("display", "block");
        }
      }
    },
    comMouseOut() {
      this.$refs.mask.style.display = "none";

      this.$refs.hoverback.style.setProperty("display", "none");
      if (this.isVideo) {
        this.$refs.playbutton.style.setProperty("display", "none");
      }
    },
    addedcontenainers() {
      this.$refs.contenainers.style.setProperty("display", "flex");
      this.$refs.contenainers.style.setProperty("justify-content", "center");
      this.$refs.contenainers.style.setProperty("align-items", "center");
    },
    opendialog() {
      if (this.isVideo) {
        this.$refs.player.play();
      }
      if (this.isAudio) {
          this.$refs.audioPlayer.play();
      }
    },
    previewClick() {
      console.log(":>>>>", this.source);
      if (this.source != "") {
        this.show = true;
      } else {
        if (this.isVideo) {
          this.$notify.error("视频未生成，无法预览");
        }
      }
    },
    closeDialog() {
      this.show = false;
      if (this.isVideo) {
        this.$refs.player.currentTime = 0;
        this.$refs.player.pause();
      }
      if(this.isAudio) {
          this.$refs.audioPlayer.currentTime =0;
          this.$refs.audioPlayer.pause();
      }
    },
    winResize(e) {
      if (!this.checkFull()) {
        this.isFull = false;
      } else {
        this.isFull = true;
      }
    },
    checkFull() {
      var isFull =
        document.fullScreenElement ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;

      // console.log("this is check full:>>", isFull);
      if (isFull === undefined) {
        isFull = false;
      }

      return isFull;
    },
  },
};
</script>

<style lang="scss">
.preview-components {
    position: relative;
    cursor: pointer;
    width: 84px;
    height: 100%;
    max-width: 84px;
    max-height: 48px;
    background: #ccc;
    // background-image: url("./../assets/img.png");
    // background-position: center;
    // background-repeat: no-repeat;
    opacity: 1;
    border-radius: 4px;
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
    .videoClass {
        .flotStyle {
            width: 86px;
            height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            // background-image: url("./../assets/bg.jpg");
            // background-repeat: no-repeat;
            // background-size: 86px 48px;
            opacity: 0.4;
        }
    }

    .audioClass {
        .flotStyle {
            width: 28px;
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url("./../assets/audioPlay.png");
            background-repeat: no-repeat;
            background-size: 28px 28px;
        }
        .flotStyle:hover {
            width: 28px;
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            // background-image: url("./../assets/audioPlayhover.png");
            // background-repeat: no-repeat;
            // background-size: 28px 28px;
        }
    }
    .poctureClass {
        .flotStyle {
            width: 86px;
            height: 48px;
            max-width: 84px;
            max-height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            //background-image: url("./../assets/bg.jpg");
            //background-repeat: no-repeat;
            // background-size: 136px 75px;
        }
    }
    .hoverback {
        width: 84px;
        height: 48px;
        position: absolute;
        background: #ffffff;
        opacity: 0.2;
        display: none;
        pointer-events: auto;
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
        transform: translate(-50%,-50%);
      }
    }
}
.el-icon-video-plays {
    width: 28px;
    height: 28px;
    // background-image: url("./../assets/audioPlayhover.png");
    // background-repeat: no-repeat;
    // background-size: 28px 28px;
    position: absolute;
    left: 38px;
    top: 23px;
}
</style>