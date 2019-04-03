import request from '@/utils/request'

export function getMenu() {
  return request({
    url: '/projects',
    method: 'get'
  })
}
export function getApiMenu(groupId) {
  return request({
    url: '/projects/' + groupId + '/api',
    method: 'get'
  })
}

export function getTestMenu(groupId) {
  return request({
    url: '/projects/' + groupId + '/collect-set',
    method: 'get'
  })
}
export function getTestCollectMenu(groupId) {
  return request({
    url: '/projects/' + groupId + '/collect',
    method: 'get'
  })
}
