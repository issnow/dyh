<template>
  <div class="login-container">
    <div class="logo">
      <img
        v-lazy="
          'data:image/png;base64,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'
        "
      />
      <h1>欢迎访问大运河文化短视频智能剪辑平台</h1>
    </div>
    <el-form :model="form" :rules="rules" ref="form" class="login-form">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请填写邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请填写密码"
          @keyup.enter.native='onChange'
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="onChange" style="width: 100%"
        >登录</el-button
      >
    </el-form>
    <div class="mask"></div>
  </div>
</template>

<script>
import { loginApp } from "@api/user";
import { mapMutations } from "vuex";
export default {
  // beforeRouteEnter (to, from, next) {
  //   console.log(to, 'to')
  //   sessionStorage.removeItem('isLogin')
  //   next()
  // },
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
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    ...mapMutations(["user/SET_USER_INFO", "user/SET_ROUTES"]),
    login(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.form);
          let { status, msg, element } = await loginApp(this.form);
          if (status == 1) {
            this.$message({ message: msg, type: "success" });
            this["user/SET_USER_INFO"](element);
            this["user/SET_ROUTES"](element);
            this.$router.push({ path: "/userList" });
            window.addEventListener("beforeunload", () => {
              sessionStorage.setItem("isLogin", "1");
            });
          } else {
            this.$message({ message: msg, type: "error" });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onChange() {
      this.login('form')
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@css/var.scss';
.login-container {
  height: 100%;
  background: url(../../assets/login-bg1.png);
  background-size: cover;
  .login-form {
    position: absolute;
    top: 50%;
    right: 15%;
    width: 250px;
    transform: translateY(-50%);
    ::v-deep .el-form-item {
      .el-form-item__label {
        color: #fff;
        line-height: 28px;
        &::before {
          content: "";
          margin-right: 0;
        }
      }
      .el-input__inner {
        background: none;
        border: none;
        border-bottom: 1px solid #999;
        border-radius: 0;
        padding: 0;
        font-size: 14px;
        color: #fff;
        &::placeholder{
          color: $gray;
        }
      }
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 1;
    z-index: -99;
    animation: fade 2s;
  }
  .logo {
    z-index: 9;
    color: #fff;
    position: absolute;
    top: 40%;
    left: 10%;
    transform: translateY(-50%);
    h1 {
      font-size: 30px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: #ebeef5;
      line-height: 42px;
    }
  }
}
</style>