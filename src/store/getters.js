const getters = {
  sidebar: state => state.app.sidebar,
  app: state => state.app.app,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  pid: state => state.user.pid,
  objectBaseInfo: state => state.object.baseInfo,
  objectEnv: state => state.object.env,
  objectStepsActive: state => state.object.active,
  logo: state => state.app.logo

}
export default getters
