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
          <img
            v-if="userInfo.headicon"
            v-lazy="url"
            class="user-avatar"
          />
          <i v-else class="iconfont icon-user" style="font-size: 30px;"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleAccountSetting">账号设置</el-dropdown-item>
          <el-dropdown-item @click.native="handlePasswordSetting">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="email">{{userInfo.email}}</div>
    </div>

    <!-- 账号设置 -->
    <accountSetting
      :visible='accountVisible'
      @hideDialog='accountVisible=false'
    />

    <!-- 修改密码 -->
    <passwordSetting
      :visible='passwordVisible'
      @hideDialog='passwordVisible=false'
    />
  </div>
</template>

<script>
import Hamburger from "@/components/Hamburger";
import accountSetting from '@component/accountSetting'
import passwordSetting from '@component/passwordSetting'
import { logout } from '@api/user'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Hamburger,
    accountSetting,
    passwordSetting
  },
  computed: {
    ...mapGetters(["userInfo", 'sidebar']),
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
    ...mapActions(['app/toggleSideBar']),
    toggleSideBar() {
      this['app/toggleSideBar']()
    },
    handleAccountSetting() {
      this.accountVisible = true
    },
    handlePasswordSetting() {
      this.passwordVisible = true
    },
    async handleLogout() {
      sessionStorage.removeItem('isLogin')
      sessionStorage.removeItem('token')
      let {msg, status} = await logout()
      if(status == 1) {
        this.$router.push('/login')
      }else {
        this.$message({
          type: 'error',
          message: msg
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@css/var.scss';
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background-color: #fff;
  background-color: #4C7378;
  line-height: 46px;
  padding-right: 24px;
  #hamburger-container {
    float: left;
  }
  .right-menu {
    float: right;
    height: 100%;
    .email {
      color: $white;
      display: inline-block;
      margin-right: 20px;
      height: 100%;
      vertical-align: middle;
    }
    .right-menu-item {
      height: 100%;
      .avatar-wrapper{
        display: inline-block;
        margin-right: 20px;
        height: 100%;
        vertical-align: middle;
      }
      .avatar-wrapper {
        img {
          margin-top: 5px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>