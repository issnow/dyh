<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import router, {resetRouter} from '@/router'
import { mapGetters, mapActions,mapMutations } from "vuex";
import { checkLogin } from '@api/user'
export default {
  name: "App",
  computed: {
    ...mapGetters(["permission_routes"]),
  },
  methods: {
    ...mapMutations(['user/SET_USER_INFO', 'user/SET_ROUTES']),
  },
  async created() {
    
    // console.log(this, 'this')
    if(sessionStorage.getItem('isLogin') == 1) {
      let {status, element, } = await checkLogin()
      this['user/SET_ROUTES'](element)
    }
    

    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },

};
</script>
