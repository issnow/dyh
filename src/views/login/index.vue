<template>
  <div class="login-container">
    <div class="logo"></div>
    <el-form :model="form" :rules="rules" ref="form" class="login-form">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请填写邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请填写密码"></el-input>
      </el-form-item>
      <el-button type="primary" @click="login('form')" style="width:100%;">登录</el-button>
    </el-form>
    <div class="mask"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ]
      },
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);

          this.$router.push({path: '/user'})
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  background: url(../../assets/login-bg.png);
  background-size: cover;
  .login-form {
    position: absolute;
    top: 50%;
    right: 15%;
    width: 250px;
    transform: translateY(-50%);
  }
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    opacity: 1;
    z-index: -99;
    animation: fade 2s;
  }
}
</style>