<template>
  <div class="download">
    <el-badge :value="downloadList.length > 0? downloadList.length: ''">
      <el-popover width="400" trigger="click" placement="bottom"
                  popper-class="popper-download">
        <div class="download-content">
          <div class="download-item" v-for="item in downloadList" :key="item.id">
            <div class="download-title">{{ item.fileName }}</div>
            <el-progress :percentage="item.progress"></el-progress>
          </div>
          <div v-if="downloadList.length === 0" class="download-none">没有正在下载的任务</div>
        </div>
        <div class="download-icon" slot="reference">
          <i class="icon el-icon-download"></i>
        </div>

      </el-popover>

    </el-badge>
  </div>
</template>

<script>
export default {
  name: "download",
  data: function () {
    return {
      downloadCount: '',
      downloadList: [],
    };
  },
  mounted() {
    console.log('mounted');
    onfire.on('download:begin', ({id, fileName}) => {
      this.$message({
        type: 'success',
        message: `文件 ${fileName} 开始下载`,
      });
      this.downloadList.push({
        id: id,
        fileName: fileName,
        progress: 0,
      });
    });
    onfire.on('download:progress', ({id, fileName, progress}) => {
      const index = this.downloadList.findIndex((item) => {
        return item.id === id;
      });
      if (index > -1) {
        this.$set(this.downloadList, index, {id, fileName, progress});
      }
    });
    onfire.on('download:success', ({id, fileName}) => {
      const index = this.downloadList.findIndex((item) => {
        return item.id === id;
      });
      if (index > -1) {
        this.downloadList.splice(index, 1);

      }
    });
    onfire.on('download:error', ({id, fileName}) => {
      const index = this.downloadList.findIndex((item) => {
        return item.id === id;
      });
      if (index > -1) {
        this.downloadList.splice(index, 1);

      }

      this.$message({
        type: 'error',
        message: `文件 ${fileName} 下载失败`,
      });
    });
  },

};
</script>

<style scoped lang="scss">
.download {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  right: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .download-icon {
    width: 24px;
    height: 24px;
    border: 1px solid rgba(255, 255, 255, 0.84);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      color: rgba(255, 255, 255, 0.84);
      line-height: 16px;
      font-size: 16px;
    }
  }


  //color: #ffffff;
  //font-size: 20px;

}

.popper-download {
  .download-content {
    min-height: 50px;
    position: relative;

    .download-none {
      color: #909399;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
