import request from '@/utils/request'

export function getGroups() {
  return request({
    url: '/groups',
    method: 'get'
  })
}
export function getGroup(id) {
  return request({
    url: '/groups/' + id,
    method: 'get'
  })
}

export function addGroup(data) {
  return request({
    url: '/groups',
    method: 'post',
    data
  })
}

export function updateGroup(id, data) {
  return request({
    url: '/groups/' + id,
    method: 'put',
    data
  })
}

export function getProjectList(id) {
  return request({
    url: '/groups/' + id + '/project',
    method: 'get'
  })
}

export function delGroup(id) {
  return request({
    url: '/groups/' + id,
    method: 'DELETE'
  })
}
