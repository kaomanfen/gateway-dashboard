import request from '@/utils/request'

export function getPermissionsUserList(id, type) {
  return request({
    url: '/permissions/' + id + '/privilege/' + type,
    method: 'get'
  })
}
export function changePermissions(id, data) {
  return request({
    url: '/permissions/' + id,
    method: 'put',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/permissions',
    method: 'post',
    data
  })
}
export function delUser(id) {
  return request({
    url: '/permissions/' + id,
    method: 'DELETE'
  })
}

export function getUserList() {
  return request({
    url: '/users',
    method: 'get'
  })
}
