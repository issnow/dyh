<template>
  <div class="navbar">
    <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
    />
    <div class="right-menu">
      <el-dropdown class="right-menu-item">
        <div class="avatar-wrapper">
          <img v-if="userInfo.headicon" v-lazy="url" class="user-avatar"/>
          <i v-else class="iconfont icon-user" style="font-size: 30px"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleAccountSetting"
          >账号设置
          </el-dropdown-item
          >
          <el-dropdown-item @click.native="handlePasswordSetting"
          >修改密码
          </el-dropdown-item
          >
          <el-dropdown-item @click.native="handleLogout"
          >退出登录
          </el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <div class="email">{{ userInfo.email }}</div>
    </div>

    <!-- 账号设置 -->
    <accountSetting
        :visible="accountVisible"
        @hideDialog="accountVisible = false"
    />

    <!-- 修改密码 -->
    <passwordSetting
        :visible="passwordVisible"
        @hideDialog="passwordVisible = false"
    />
<!--    <download></download>-->
  </div>
</template>

<script>
import Hamburger from "@/components/Hamburger";
import accountSetting from "@component/accountSetting";
import passwordSetting from "@component/passwordSetting";
import download from './download';
import {logout} from "@api/user";
import {mapGetters, mapActions} from "vuex";

export default {
  components: {
    Hamburger,
    accountSetting,
    passwordSetting,
    download,
  },
  computed: {
    ...mapGetters(["userInfo", "sidebar"]),
    url() {
      return this.userInfo.headicon;
    },
  },
  data() {
    return {
      accountVisible: false,
      passwordVisible: false,
    };
  },
  methods: {
    ...mapActions(["app/toggleSideBar"]),
    toggleSideBar() {
      this["app/toggleSideBar"]();
    },
    handleAccountSetting() {
      this.accountVisible = true;
    },
    handlePasswordSetting() {
      this.passwordVisible = true;
    },
    async handleLogout() {
      sessionStorage.removeItem("isLogin");
      sessionStorage.removeItem("token");
      let {msg, status} = await logout();
      if (status == 1) {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";

.navbar {
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #1c1e26;
  line-height: 46px;
  padding-right: 14px;
  transition: width 0.28s;

  #hamburger-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;

    .email {
      color: $white;
      display: inline-block;
      margin-right: 10px;
      height: 100%;
      vertical-align: middle;
      font-size: 14px;
    }

    .right-menu-item {
      height: 100%;

      .avatar-wrapper {
        display: inline-block;
        margin-right: 10px;
        height: 100%;
        vertical-align: middle;
      }

      .avatar-wrapper {
        img {
          margin-top: 9px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }

  }


}
</style>
