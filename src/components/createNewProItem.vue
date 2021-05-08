<template>
  <div class="create-new-pro-item">
    <el-card
      :body-style="{ padding: 0 }"
      shadow="hover"
      class="create-new-pro-item-card"
      @click.native="goToClip"
    >
      <img src="../assets/icon_video.png" alt="" />
      <div class="title">{{ titles[type].title }}</div>
      <div class="desc">{{ titles[type].desc }}</div>
    </el-card>

    <!-- dialog -->
    <video-clip-dialog 
      :dialogFormVisible='dialogFormVisible'
      @hideDialogFormVisible='hideDialogFormVisible'
    ></video-clip-dialog>
  </div>
</template>

<script>
import videoClipDialog from './videoClipDialog.vue';
export default {
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      // type: 1,//1-视频剪辑 2-直播剪辑 3-视频拆条
      titles: {
        1: {
          title: "视频剪辑",
          desc: "自由的制作原创视频",
        },
        2: {
          title: "直播剪辑",
          desc: "录制直播画面，即时拆剪精彩片段",
        },
        3: {
          title: "视频拆条",
          desc: "一键自动拆条，支持手动调整",
        },
      },
      dialogFormVisible: false
    };
  },
  methods: {
    goToClip() {
      switch (this.type) {
        case 1:
          this.dialogFormVisible = true
          break;
      
        default:
          break;
      }
    },
    hideDialogFormVisible() {
      this.dialogFormVisible = false
    }
  },
  components: {
    videoClipDialog
  },
};

</script>

<style lang="scss" scoped>
@import "@css/var.scss";
.create-new-pro-item {
  &-card {
    width: 283px;
    cursor: pointer;
    img {
      display: flex;
      object-fit: none;
      background-color: $deepDark;
      justify-content: center;
      align-items: center;
      height: 160px;
      width: 100%;
    }
    .title {
      font-size: 17px;
      color: $deepDark;
      margin-top: 20px;
      margin-left: 10px;
      line-height: 30px;
    }
    .desc {
      font-size: 14px;
      color: $dark;
      margin-left: 10px;
      margin-bottom: 20px;
      line-height: 23px;
    }
    // ::v-deep .el-card__body {
    //   padding: 0;
    // }
  }
}
</style>