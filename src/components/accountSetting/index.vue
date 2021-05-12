<template>
  <el-dialog
    title="账号设置"
    :visible.sync="visible"
    class="account-dialog"
    @close="$emit('hideDialog')"
  >
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
    </el-upload>

    <div class="username">
      {{form.name}}
    </div>

    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      class="user-center-form"
    >
      <div class="user-id">
        <i class="el-icon-user"></i>
        <el-form-item label="用户ID:">
          <el-input
            placeholder="请输入"
            v-model="form.userID"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="name">
        <i class="el-icon-user"></i>
        <el-form-item label="昵称:" prop="name">
          <el-input placeholder="请输入" v-model="form.name"></el-input>
        </el-form-item>
      </div>
      <div class="email">
        <i class="el-icon-user"></i>
        <el-form-item label="邮箱:" prop="email">
          <el-input placeholder="请输入" v-model="form.email"></el-input>
        </el-form-item>
      </div>
      <div class="user-id">
        <i class="el-icon-user"></i>
        <el-form-item label="角色:">
          <el-input
            placeholder="请输入"
            v-model="form.role"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="phone">
        <i class="el-icon-user"></i>
        <el-form-item label="联系方式:" prop="phone">
          <el-input placeholder="请输入" v-model="form.phone"></el-input>
        </el-form-item>
      </div>
      <div class="org">
        <i class="el-icon-user"></i>
        <el-form-item label="所属机构:">
          <el-input
            :disabled="true"
            placeholder="请输入"
            v-model="form.org"
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
      <el-button type="primary" @click="submitForm('form')">提 交</el-button>
      <el-button @click="$emit('hideDialog')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      form: {
        userID: 12312312,
        name: "张三",
        email: "abc@moviebook.cn",
        phone: "",
        role: "管理员/创作者",
        phone: 13812345678,
        org: "南京大学",
      },
      rules: {
        name: [
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
      imageUrl: "",
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.$emit("hideDialog");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      console.log('file',res, file)
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      console.log(file, 'file')
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style lang="scss" scoped>
.account-dialog {
  .user-center-form {
    > div {
      display: flex;
      margin-bottom: 24px;
      align-items: center;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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