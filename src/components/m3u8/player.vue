<template>
  <video-player
    ref="videoPlayer"
    class="video-player vjs-custom-skin"
    :playsinline="true"
    :options="playerOptions"
    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"
  ></video-player>
</template>

<script>
export default {
  props: ["src", "bgImage"],
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "application/x-mpegURL", // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: this.src, // url地址
            // src: "https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8", // url地址
            // src: "https://yingpu.obs.cn-east-3.myhuaweicloud.com/editor/2021/07/21/video/1191db05b3ecaf99bd2d782b7dfda54c/1191db05b3ecaf99bd2d782b7dfda54c.m3u8", // url地址
            // src: "http://ivi.bupt.edu.cn/hls/ahhd.m3u8", // url地址
          },
        ],
        hls: true,
        poster: this.bgImage, // 你的封面地址
        // width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, // 全屏按钮
        },
      },
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player; //自定义播放
    },
  },
  methods: {
    close() {
      console.log("player-close");
      this.$refs.videoPlayer.player.pause();
      this.$refs.videoPlayer.player.src(this.src);
      // this.$refs.videoPlayer.player.src(
      //   "https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8"
      // );
    },
    onPlayerPlay(e) {
      console.log(e);
    },
    onPlayerPause(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>