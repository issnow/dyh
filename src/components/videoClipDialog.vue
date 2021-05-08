<template>
  <el-dialog
    title="选择项目尺寸"
    :visible.sync="dialogFormVisible"
    @close="$emit('hideDialogFormVisible')"
  >
    <el-form :model="form">
      <el-form-item>
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入项目名称"
        ></el-input>
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-form-item label="画幅比例">
            <el-select v-model="form.frameScale" >
              <el-option
                v-for="item in scaleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="分辨率">
            <el-select v-model="form.resolution" >
              <el-option
                v-for="item in resolutionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

        </el-col>
      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('hideDialogFormVisible')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["dialogFormVisible"],
  data() {
    return {
      form: {
        name: "",
        frameScale: "16:9",
        resolution: 540,
      },
      scaleOptions: [
        {
          value: "16:9",
          label: "16:9",
        },
        {
          value: "1:1",
          label: "1:1",
        },
        {
          value: "9:16",
          label: "9:16",
        },
      ],
      resolutionOptions: [
        {
          value: 540,
          label: 540,
        },
        {
          value: 720,
          label: 720,
        },
        {
          value: 1080,
          label: 1080,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-form {
    .el-row {
      .el-col:last-child {
        .el-form-item {
          display: flex;
          justify-content: flex-end;
        }
      }
      .el-form-item {
        display: flex;
        ::v-deep .el-form-item__label {
          min-width: 68px;
        }
      }
    }
  }
}
</style>