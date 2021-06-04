<template>
  <div class="login-container">
    <div class="logo">
      <img :src="getImg('logo/登录页/big-logo.svg')" alt="" width="250" />
      <!-- <svg class="icon" aria-hidden="true" style="font-size: 92px;">
        <use xlink:href="#icon-denglulogo"></use>
      </svg> -->
      <h1>欢迎访问大运河文化短视频智能剪辑平台</h1>
    </div>
    <div class="login-form-wrap">
      <img
        class="form-login"
        :src="getImg('logo/登录页/登录页logo.svg')"
        alt=""
        width="100"
      />
      <div>大运河文化短视频智能剪辑平台</div>
      <div>大运河文化短视频智能剪辑平台</div>
      <el-form :model="form" :rules="rules" ref="form" class="login-form">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="请填写邮箱" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请填写密码"
            @keyup.enter.native="onChange"
            show-password
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
      <img
        class="footer-img"
        :src="getImg('logo/登录页/影谱支持.svg')"
        alt=""
        width="300"
        style="background: #ccc;"
      />
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { loginApp } from "@api/user";
import { mapMutations } from "vuex";
export default {
  // beforeRouteEnter (to, from, next) {
  //   console.log(to, 'to')
  //   sessionStorage.emoveItem('isLogin')
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
      loading: false,
    };
  },
  methods: {
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
            this.$message({ message: msg, type: "success" });
            this["user/SET_USER_INFO"](element);
            this["user/SET_ROUTES"](element);
            if (element.type == 1 || element.type == 0) {
              this.$router.push({ path: "/projectList" });
            } else if (element.type == 2) {
              this.$router.push({ path: "/viewList" });
            }
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
  background: url(../../assets/login-bg.jpg) no-repeat center;
  background-size: cover;
  .login-form-wrap {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    align-items: center;
    position: absolute;
    top: 20%;
    right: 13%;
    width: 27vw;
    height: 58.7vh;
    padding: 6.1vh 3.4vw 2.5vh;
    background-color: #fff;
    z-index: 99;
    overflow: hidden;
    .form-login {
      margin-bottom: 20px;
    }
    .footer-img {
      position: absolute;
      bottom: 3.3vh;
    }
    > div {
      font-size: 20px;
    }
    .login-form {
      margin-top: 55px;
      width: 100%;
      .deep-blue {
        background-color: $deepBlue;
      }
      ::v-deep .el-form-item {
        .el-input__inner {
          background: #fff;
          border: 2px solid #B2BCCF;
          // border: none;
          // border-bottom: 1px solid #999;
          // border-radius: 0;
          // padding: 0;
          // font-size: 14px;
          // color: #fff;
          // &::placeholder {
          //   color: $gray;
          // }
        }
      }
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    // background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    z-index: -99;
    animation: fade 2s;
  }
  .logo {
    z-index: 9;
    color: #fff;
    position: absolute;
    top: 27%;
    left: 9%;
    i {
      display: inline-block;
      font-size: 100px;
    }
    h1 {
      font-size: 30px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      line-height: 58px;
      color: #fff;
    }
  }
  // .footer-img {
  //   position: absolute;
  //   bottom: 50px;
  //   left: 50%;
  //   transform: translateX(-50%);
  // }
}
</style>