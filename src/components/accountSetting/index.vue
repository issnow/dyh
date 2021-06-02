<template>
  <el-dialog
    title="账号设置"
    :visible.sync="visible"
    class="account-dialog"
    :before-close="beforeClose"
    width="33%"
    :close-on-click-modal='false'
  >
    <div class="upload-avatar" @click="handleUpload">
      <input
        type="file"
        id="uploadFile"
        ref="uploadRef"
        @change="fileChange"
        accept="image/jpg, image/png"
      />
      <img v-lazy="url" alt="" class="avatar" v-if="userInfo.headicon" />
      <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
    </div>

    <div class="username">
      {{ userInfo.nickname }}
    </div>

    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      class="user-center-form"
    >
      <el-form-item label="用户ID:">
        <el-input
          placeholder="请输入"
          v-model="form.id"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称:" prop="nickname">
        <el-input placeholder="请输入" v-model.trim="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input placeholder="请输入" v-model.trim="form.email"></el-input>
      </el-form-item>
      <el-form-item label="角色:">
        <el-input
          placeholder="请输入"
          v-model="form.type"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式:" prop="phone">
        <el-input
          placeholder="请输入"
          v-model.trim="form.phone"
          onkeyup="value=value.replace(/[^\d]/g,'')"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属机构:">
        <el-input
          :disabled="true"
          placeholder="请输入"
          v-model="form.institutions"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="submitForm('form')"
        :loading="btnLoading"
        >提 交</el-button
      >
      <el-button @click="beforeClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadPhoto, getUserInfo, saveUser } from "@api/user";
import { mapGetters, mapMutations, mapActions } from "vuex";
import ee from "@/config/event";
export default {
  props: ["visible"],
  computed: {
    ...mapGetters(["userInfo"]),
    url() {
      return this.userInfo.headicon;
    },
  },
  watch: {
    userInfo: {
      handler(newValue, oldValue) {
        // console.log(newValue, "newValue");
        const { id, nickname, email, type, phone, institutions } = newValue;
        this.form = {
          id,
          nickname,
          email,
          type: type == 1 ? "创作者" : "管理员",
          phone,
          institutions,
        };
      },
      immediate: true,
    },
  },
  data() {
    return {
      form: {},
      rules: {
        nickname: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      btnLoading: false,
    };
  },
  methods: {
    ...mapMutations(["user/SET_USER_INFO"]),
    ...mapActions(["user/asyncGetUserInfo"]),
    createReader(file) {
      return new Promise((resolve) => {
        var reader = new FileReader();
        reader.onload = function (evt) {
          var image = new Image();
          image.onload = function () {
            var width = this.width;
            var height = this.height;
            resolve({
              width,
              height,
            });
          };
          image.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    async fileChange() {
      let file = this.$refs.uploadRef.files[0];
      let filename = file.name
        .slice(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      let types = ["jpg", "jpeg", "png"];
      if (file.size > 1024 * 1024 * 2) {
        this.$message({
          type: "error",
          message: "请上传大小不能超过2M图片",
        });
        return;
      }

      if (!types.includes(filename)) {
        this.$message({
          type: "error",
          message: "请上传png、jpeg、jpg格式图片",
        });
        return;
      }

      let { width, height } = await this.createReader(file);
      if (width >= 300 || height >= 300) {
        this.$message({
          type: "error",
          message: "请上传尺寸小于等于300*300图片",
        });
        return;
      }

      let formData = new FormData();
      formData.append("file", file);
      formData.append("id", this.userInfo.id);
      let { msg, status } = await uploadPhoto(formData);
      if (status == 1) {
        this.$message({
          type: "success",
          message: msg,
        });
        this["user/asyncGetUserInfo"]();

        // let { status, element } = await getUserInfo({ id: this.userInfo.id });
        // if (status == 1) {
        //   this["user/SET_USER_INFO"](element);
        // }
      } else {
        this.$message({
          type: "error",
          message: msg,
        });
      }
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
    beforeClose() {
      this.resetFields();
      this.$emit("hideDialog");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.btnLoading = true;
          // console.log(this.form);
          const { id, nickname, email, phone } = this.form;
          let params = { id, nickname, email, phone };
          let { status, msg } = await saveUser(params);
          this.btnLoading = false;
          if (status == 1) {
            this.$message({
              type: "success",
              message: msg,
            });
            this["user/asyncGetUserInfo"]();
            this.$emit("hideDialog");
            ee.emit("getTableData");
          } else {
            this.$message({
              type: "error",
              message: msg,
            });
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    handleUpload() {
      this.$refs.uploadRef.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.account-dialog {
  .username {
    text-align: center;
  }
  .user-center-form {
    // display: flex;
    // flex-flow: column nowrap;
    // align-items: center;
    // > div {
    //   width: 100%;
    //   display: flex;
    //   margin-bottom: 24px;
    //   align-items: center;
    //   .el-form-item {
    //     margin-bottom: 0;
    //     .el-form-item__content {
    //       width: 200px;
    //     }
    //   }
    // }
  }

  .upload-avatar {
    input {
      display: none;
    }
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 110px;
    height: 110px;
    margin-left: calc(50% - 55px);
    &:hover {
      border-color: #409eff;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }
  .avatar {
    width: 110px;
    height: 110px;
    display: block;
  }
}
</style>
