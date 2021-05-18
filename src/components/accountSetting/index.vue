<template>
  <el-dialog
    title="账号设置"
    :visible.sync="visible"
    class="account-dialog"
    :before-close="beforeClose"
    width="33%"
  >
    <div class="upload-avatar" @click="handleUpload">
      <input type="file" id="uploadFile" ref="uploadRef" @change="fileChange" />
      <img :src="url" alt="" class="avatar" v-if="userInfo.headicon" />
      <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
    </div>

    <div class="username">
      {{ form.nickname }}
    </div>

    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      class="user-center-form"
    >
      <div class="user-id">
        <!-- <i class="el-icon-user"></i> -->
        <el-form-item label="用户ID:">
          <el-input
            placeholder="请输入"
            v-model="form.id"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="name">
        <!-- <i class="el-icon-user"></i> -->
        <el-form-item label="昵称:" prop="nickname">
          <el-input placeholder="请输入" v-model="form.nickname"></el-input>
        </el-form-item>
      </div>
      <div class="email">
        <!-- <i class="el-icon-user"></i> -->
        <el-form-item label="邮箱:" prop="email">
          <el-input placeholder="请输入" v-model="form.email"></el-input>
        </el-form-item>
      </div>
      <div class="user-id">
        <!-- <i class="el-icon-user"></i> -->
        <el-form-item label="角色:">
          <el-input
            placeholder="请输入"
            v-model="form.type"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="phone">
        <!-- <i class="el-icon-user"></i> -->
        <el-form-item label="联系方式:" prop="phone">
          <el-input placeholder="请输入" v-model.number="form.phone"></el-input>
        </el-form-item>
      </div>
      <div class="org">
        <!-- <i class="el-icon-user"></i> -->
        <el-form-item label="所属机构:">
          <el-input
            :disabled="true"
            placeholder="请输入"
            v-model="form.institutions"
          ></el-input>
        </el-form-item>
      </div>

      <!-- <div class="phone">
        <i class="el-icon-user"></i>
        <el-form-item label="当前密码:">123123123</el-form-item>
        <el-button type="text" style="margin-left: 50px" @click="changePassword"
          >修改</el-button
        >
      </div> -->
      <!-- <el-form-item label-width="20px">
        <el-button type="primary" @click="submitForm('form')">编辑</el-button>
        <el-button>取消</el-button>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')" :loading='btnLoading'>提 交</el-button>
      <el-button @click="beforeClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadPhoto, getUserInfo,saveUser } from "@api/user";
import { mapGetters, mapMutations,mapActions } from "vuex";
import { baseURL } from "@api/request";
export default {
  props: ["visible"],
  computed: {
    ...mapGetters(["userInfo"]),
    url() {
      return baseURL + this.userInfo.headicon;
    },
  },
  watch: {
    userInfo: {
      handler(newValue, oldValue) {
        console.log(newValue, "newValue");
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
      btnLoading: false
    };
  },
  methods: {
    ...mapMutations(["user/SET_USER_INFO"]),
    ...mapActions(['user/asyncGetUserInfo']),
    async fileChange() {
      let files = this.$refs.uploadRef.files;
      let formData = new FormData();
      formData.append("file", files[0]);
      formData.append("id", this.userInfo.id);
      let { msg, status } = await uploadPhoto(formData);
      if (status == 1) {
        this.$message({
          type: "success",
          message: msg,
        });
        this['user/asyncGetUserInfo']()
        
        // let { status, element } = await getUserInfo({ id: this.userInfo.id });
        // if (status == 1) {
        //   this["user/SET_USER_INFO"](element);
        // }

      }
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
    beforeClose() {
      this.resetFields()
      this.$emit('hideDialog')
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.btnLoading = true
          console.log(this.form);
          const {id,nickname,email,phone} = this.form
          let params = {id,nickname,email,phone}
          let {status, msg} = await saveUser(params)
          this.btnLoading =false
          if(status == 1) {
            this.$message({
              type: 'success',
              message: msg
            })
            this['user/asyncGetUserInfo']()
            this.$emit("hideDialog");
          }else {
            this.$message({
              type: 'error',
              message: msg
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleUpload() {
      this.$refs.uploadRef.click();
    },
    // handleAvatarSuccess(res, file) {
    //   console.log('file',res, file)
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    // beforeAvatarUpload(file) {
    //   console.log(file, 'file')
    //   const isJPG = file.type === "image/jpeg";
    //   const isLt2M = file.size / 1024 / 1024 < 2;

    //   if (!isJPG) {
    //     this.$message.error("上传头像图片只能是 JPG 格式!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传头像图片大小不能超过 2MB!");
    //   }
    //   return isJPG && isLt2M;
    // },
  },
};
</script>

<style lang="scss" scoped>
.account-dialog {
  .username {
    text-align: center;
  }
  .user-center-form {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    > div {
      display: flex;
      margin-bottom: 24px;
      align-items: center;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  // ::v-deep .avatar-uploader .el-upload,
  // .upload-avatar {
  //   border: 1px dashed #d9d9d9;
  //   border-radius: 50%;
  //   cursor: pointer;
  //   position: relative;
  //   overflow: hidden;
  //   &:hover {
  //     border-color: #409eff;
  //   }
  // }
  .upload-avatar {
    // display: flex;
    // justify-content: center;
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
    // border: 1px dashed #d9d9d9;
    // border-radius: 50%;
    // cursor: pointer;
    // position: relative;
    // overflow: hidden;
    // &:hover {
    //   border-color: #409eff;
    // }
  }
  .avatar {
    width: 110px;
    height: 110px;
    display: block;
  }
}
</style>