<template>
  <div class="login-container">
    <div class="logo">
      <img :src="getImg('logo/登录页/logo02.png')" alt="" />
      <h1>欢迎登录大运河国家文化公园智能影像应用系统</h1>
    </div>
    <div class="login-form-wrap">
      <img
        class="form-login-img"
        :src="getImg('logo/登录页/图层 3@2x.png')"
        alt=""
      />
      <div class="title">大运河国家文化公园智能影像应用系统</div>
      <el-form :model="form" :rules="rules" ref="form" class="login-form">
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="请填写邮箱"
            prefix-icon="el-icon-user"
            class="te"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请填写密码"
            @keyup.enter.native="onChange"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          @click="onChange"
          :loading="loading"
          style="width: 100%"
          class="deep-blue"
          >登 录</el-button
        >
      </el-form>
      <img class="footer-img" :src="getImg('logo/登录页/sup.png')" alt="" />
    </div>
  </div>
</template>

<script>
import { loginApp } from "@api/user";
import { mapMutations } from "vuex";

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
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loading: false,
    };
  },
  created() {
    sessionStorage.removeItem("isLogin");
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  methods: {
    onWindowResize() {
      var html = document.documentElement;
      // x / 1920 = fs / 19.2
      let res = (innerWidth * 19.2) / 1920;
      html.style.fontSize = res + "px";
    },
    ...mapMutations(["user/SET_USER_INFO", "user/SET_ROUTES"]),
    login(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.form);
          this.loading = true;
          let { status, msg, element } = await loginApp(this.form);
          this.loading = false;
          if (status == 1) {
            sessionStorage.setItem("token", element.token);
            localStorage.setItem("nvseditlogintoken", element.token);
            localStorage.setItem("Authorization", element.token);
            this.$message({ message: msg, type: "success" });
            this["user/SET_USER_INFO"](element);
            this["user/SET_ROUTES"](element);

            if (element.type == 1 || element.type == 0) {
              this.$router.push({ path: "/projectList" });
            } else if (element.type == 2) {
              this.$router.push({ path: "/viewList" });
            }
            // window.addEventListener("beforeunload", () => {
            sessionStorage.setItem("isLogin", "1");
            // });
            document.documentElement.style.fontSize = "";
            window.removeEventListener("resize", this.onWindowResize);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onChange() {
      this.login("form");
    },
    getImg(src) {
      if (src) {
        return require("@/assets/" + src);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";
.login-container {
  height: 100%;
  background: url(../../assets/logo/登录页/bg1.jpg) no-repeat center;
  background-size: cover;
  .login-form-wrap {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    align-items: center;
    position: absolute;
    top: 20%;
    right: 13%;
    width: 27.13rem;
    padding: 3.43rem 2.91rem 0;
    background-color: transparent;
    box-shadow: 1px 1px 30px rgba(161,213,220, .5), -1px -1px 30px rgba(161,213,220, .5);
    z-index: 99;
    overflow: hidden;
    .form-login-img {
      width: 7.91rem;
      margin-bottom: 1.61rem;
    }
    .footer-img {
      position: absolute;
      bottom: 1.875rem;
      width: 50%;
    }
    .title {
      font-size: 1.15rem;
      color: #fff;
    }
    .login-form {
      margin-top: 5.1rem;
      width: 100%;
      .deep-blue {
        background-color: #4B7378;
        border-width: 0;
        line-height: 0;
        margin-bottom: 7.34rem;
        height: 2.81rem;
        font-size: 1.354rem;
        font-weight: 500;
      }
      ::v-deep .el-form-item {
        margin-bottom: 2.4vh;
        .el-input {
          vertical-align: middle;
          .el-input__prefix {
            width: 2.5rem;
          }
          .el-input__icon {
            font-size: 1.56rem;
            line-height: 3.07rem;
          }
          .el-input__inner {
            padding-left: 3.333rem;
            background-color: rgba(75, 115, 120, 0.2);
            color: #a1d5dc;
            border: 0.104rem solid #b2bccf;
            height: 2.96rem;
            font-size: 1.09rem;
          }
        }
      }
    }
  }
  .logo {
    z-index: 9;
    color: #fff;
    position: absolute;
    top: 27%;
    left: 9%;
    img {
      width: 17.55rem;
    }
    h1 {
      font-size: 2rem;
      font-family: Source Han Sans CN;
      font-weight: 500;
      line-height: 58px;
      color: #fff;
    }
  }
}
</style>