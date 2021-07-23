const getters = {
  sidebar: state => state.app.sidebar,
  permission_routes: state => state.user.routes,
  userInfo: state => state.user.userInfo,
  params1: state =>state.workManager.params1,
  params2: state =>state.workManager.params2,
  page1: state =>state.workManager.page1,
  page2: state =>state.workManager.page2,
}
export default getters
