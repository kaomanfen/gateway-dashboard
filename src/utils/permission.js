import store from '@/store'
import { Message } from 'element-ui'
import roles from '@/utils/roles'
export function routeCheck(route, showMsg = true) {
  if (store.getters.roles.is_admin === 1) {
    return true
  }
  if (route.params.id) {
    const preojectId = route.params.id
    const permissionName = roles[store.getters.roles.project[preojectId]]
    if (permissionName.indexOf(route.name) > -1) {
      if (showMsg) {
        Message.error('没有权限')
      }
      return false
    }
  }
  if (route.params.zoneId) {
    const zoneId = route.params.zoneId
    const permissionName = roles[store.getters.roles.zone[zoneId]]
    if (permissionName.indexOf(route.name) > -1) {
      if (showMsg) {
        Message.error('没有权限')
      }
      return false
    }
  }
  return true
}

export function componentCheck(route, name) {
  if (store.getters.roles.is_admin === 1) {
    return true
  }
  if (route.params.id) {
    const preojectId = route.params.id
    const permissionName = roles[store.getters.roles.project[preojectId]]
    if (permissionName.indexOf(name) > -1) {
      return false
    }
  }
  if (route.params.zoneId) {
    const zoneId = route.params.zoneId
    const permissionName = roles[store.getters.roles.zone[zoneId]]
    if (permissionName.indexOf(name) > -1) {
      return false
    }
  }
  return true
}
