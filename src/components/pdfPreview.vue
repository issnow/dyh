<template>
  <div class="pdf-wrap">
    <el-dialog :show-close='false' :visible.sync="visible" fullscreen>
      <i class="iconfont icon-close" @click="beforeClose"></i>
      <iframe class="pdf" :src="src" frameborder="0"></iframe>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    beforeClose() {
      this.$emit("handleClose");
    },
  },
};
</script>

<style lang="scss" scoped>
.pdf-wrap {
  position: relative;
  ::v-deep .el-dialog__body {
    height: 100%;
    padding-top: 40px;
    padding-bottom: 0;
  }
  ::v-deep .el-dialog__header {
    padding: 0;
  }
  .iconfont {
    position: absolute;
    right: 2%;
    top: 5px;
    font-size: 30px;
  }
  .pdf {
    margin-left: 3%;
    width: 94%;
    height: 100%;
  }
}
</style>