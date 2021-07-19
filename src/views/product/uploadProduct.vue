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
        <el-button icon="el-icon-upload2" @click="onUpload" :loading="upLoading"
          >上传文件</el-button
        >
        <div>支持扩展名:{{supportExt[form.media_type].join(',')}}</div>
      </el-form-item>
      <el-form-item>
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="percentage"
        ></el-progress>
      </el-form-item>
    </el-form>
    <input
      type="file"
      id="uploadProduct"
      ref="uploadProduct"
      @change="fileChange"
      style="display: none"
    />
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="submitForm('form')"
        :loading="loading"
        :disabled="disabled"
        >提 交</el-button
      >
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, temporaryKey } from "@api/product";
export default {
  props: ["visible", "wh_ratio", "resolution", "media_type"],
  data() {
    return {
      form: {
        media_type: 1,
        title: "",
        wh_ratio: "",
        resolution: "",
        url: "",
      },
      selectVideo: true,
      rules: {
        title: [
          { required: true, message: "请输入作品名称关键字", trigger: "blur" },
        ],
        media_type: [
          { required: true, message: "请选择类型", trigger: "blur" },
        ],
      },
      percentage: 0,
      loading: false,
      upLoading: false,
      supportExt: {
        1: ['MP4','MOV','WMV','M2V','MPG'],
        2: ['MP3','FLAC','AAC','M4A'],
        3: ['JPG','PNG'],
        4: ['PDF']
      },
      // 取消断点上传
      hook: null
    };
  },
  mounted() {},
  computed: {
    disabled() {
      return !this.form.url;
    },
  },
  methods: {
    changeType(v) {
      this.selectVideo = v == 1 ? true : false;
    },
    resetFields() {
      this.selectVideo = true;
      this.$refs.form.resetFields();
      this.percentage = 0;
    },
    handleClose(done) {
      this.hook && this.hook.cancel()
      this.resetFields();
      this.$emit("hideDialog");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          console.log(this.form, "form");
          let p = {
            ...this.form,
          };
          let { status, msg } = await add(p);
          this.loading = false;
          if (status == 1) {
            this.$message({
              type: "success",
              message: msg,
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    async onUpload() {
      this.$refs.uploadProduct.click();
    },
    guid() {
      return "xxxxxxxxxxxx4xxxyxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    async fileChange() {
      this.upLoading = true;
      let _this = this;
      let file = this.$refs.uploadProduct.files[0];
      let ext = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
      console.log(file, ext);

      let { element } = await temporaryKey();

      // 创建ObsClient实例
      var obsClient = new ObsClient({
        security_token: element.data.securitytoken,
        access_key_id: element.data.access,
        secret_access_key: element.data.secret,
        server: "https://obs.cn-east-3.myhuaweicloud.com",
      });
      // var cp;
      // var hook;
      let d = new Date().toLocaleDateString().replace("/", "");
      obsClient.uploadFile(
        {
          Bucket: "yingpu",
          // Key: `crowdCreation/prod/product/20210709/sdfsfdsdfsfdxxx.jpg`,
          Key: `crowdCreation/prod/product/${d}/${_this.guid()}.${ext}`,
          SourceFile: file,
          PartSize: 9 * 1024 * 1024,
          ProgressCallback: function (
            transferredAmount,
            totalAmount,
            totalSeconds
          ) {
            _this.percentage = parseInt(
              (transferredAmount / totalAmount) * 100
            );
          },
          ResumeCallback: function (resumeHook, uploadCheckpoint) {
            _this.hook = resumeHook;
            // cp = uploadCheckpoint;
          },
        },
        function (err, result) {
          _this.upLoading = false;

          if (err) {
            console.error("Error-->" + err);
          } else {
            if (result.CommonMsg.Status < 300) {
              console.log(result.InterfaceResult, "res");
              console.log("RequestId-->" + result.InterfaceResult.RequestId);
              console.log("Bucket-->" + result.InterfaceResult.Bucket);
              console.log("Key-->" + result.InterfaceResult.Key);
              console.log("Location-->" + result.InterfaceResult.Location);
              // /yingpu/crowdCreation/prod/product/202107/19/xx.jpg
              // https://yingpu.obs.cn-east-3.myhuaweicloud.com/crowdCreation/prod/product/202107/19/xx.jpg
              _this.form.url = result.InterfaceResult.Location.replace(
                "/yingpu",
                "https://yingpu.obs.cn-east-3.myhuaweicloud.com"
              );
              _this.$message({
                type: "success",
                message: "上传成功",
              });
            } else {
              console.log("Code-->" + result.CommonMsg.Code);
              console.log("Message-->" + result.CommonMsg.Message);
            }
          }
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>