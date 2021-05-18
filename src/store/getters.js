const getters = {
  sidebar: state => state.app.sidebar,
  permission_routes: state => state.user.routes,
  userInfo: state => state.user.userInfo,
}
export default getters
