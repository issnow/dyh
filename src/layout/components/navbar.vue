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
            :src="url"
            class="user-avatar"
          />
          <!-- <img
            v-if="avatar"
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            class="user-avatar"
          /> -->
          <i v-else class="el-icon-user-solid"></i>
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
import { baseURL } from "@api/request";
import { mapGetters } from 'vuex'
export default {
  components: {
    Hamburger,
    accountSetting,
    passwordSetting
  },
  computed: {
    ...mapGetters(["userInfo"]),
    url() {
      return baseURL + this.userInfo.headicon;
    },
  },
  data() {
    return {
      sidebar: {
        opened: true,
      },
      accountVisible: false,
      passwordVisible: false,
      // avatar: true,
    };
  },
  methods: {
    toggleSideBar() {
      // this.$store.dispatch('app/toggleSideBar')
    },
    handleAccountSetting() {
      this.accountVisible = true
    },
    handlePasswordSetting() {
      this.passwordVisible = true
    },
    async handleLogout() {
      sessionStorage.removeItem('isLogin')
      let {msg, status} = await logout()
      if(status == 1) {
        this.$router.push('/login')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  line-height: 46px;
  padding-right: 24px;
  #hamburger-container {
    float: left;
  }
  .right-menu {
    float: right;
    height: 100%;
    .email {
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