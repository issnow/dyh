<template>
  <el-dialog
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" label-width="90px" ref="form">
      <el-form-item label="名称:" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="上传文件:" prop="media_type">
        <el-select
          v-model="form.media_type"
          placeholder="请选择"
          @change="changeType"
        >
          <el-option
            :label="e.name"
            :value="e.key"
            v-for="e in media_type"
            :key="e.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="selectVideo" label="画幅:">
        <el-select v-model="form.wh_ratio" placeholder="请选择">
          <el-option
            :label="e.name"
            :value="e.key"
            v-for="e in wh_ratio"
            :key="e.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="selectVideo" label="分辨率:">
        <el-select v-model="form.resolution" placeholder="请选择">
          <el-option
            :label="e.name"
            :value="e.key"
            v-for="e in resolution"
            :key="e.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-upload2" @click="onUpload">上传文件</el-button>
      </el-form-item>
    </el-form>
    <input
      type="file"
      id="uploadProduct"
      ref="uploadProduct"
      @change="fileChange"
      style='display: none;'
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')">提 交</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add,temporaryKey } from "@api/product";
export default {
  props: ["visible", "wh_ratio", "resolution", "media_type"],
  data() {
    return {
      form: {
        media_type: "",
        title: "",
        wh_ratio: "",
        resolution: "",
        url: "",
      },
      selectVideo: false,
      rules: {
        title: [
          { required: true, message: "请输入作品名称关键字", trigger: "blur" },
        ],
        media_type: [
          { required: true, message: "请选择类型", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    changeType(v) {
      this.selectVideo = v == 1 ? true : false;
    },
    resetFields() {
      this.selectVideo = false;
      this.$refs.form.resetFields();
    },
    handleClose(done) {
      this.resetFields();
      this.$emit("hideDialog");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.form, "form");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async onUpload() {
      let res = await temporaryKey()
      console.log(res, 'res')
      this.$refs.uploadProduct.click();
    },
    async fileChange() {
      let file = this.$refs.uploadProduct.files[0];
      let filename = file.name
        .slice(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      console.log(file, filename);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>