export const setActiveMenu = (path) => {
  let lis = document.querySelectorAll('.sidebar-container .el-menu .el-menu-item');
  debugger
  [].forEach.call(lis, (e)=>{
    e.classList.remove('is-active')
    if(e.dataset.path == path) {
      e.classList.add('is-active')
    }
  })
}
