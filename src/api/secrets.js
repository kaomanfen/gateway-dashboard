import request from '@/utils/request'

export function getList() {
  return request({
    url: '/secrets',
    method: 'get'
  })
}
export function addSecret(data) {
  return request({
    url: '/secrets',
    method: 'post',
    data: data
  })
}
export function updateSecret(id, data) {
  return request({
    url: '/secrets/' + id,
    method: 'PUT',
    data: data
  })
}
export function delectSecret(id) {
  return request({
    url: '/secrets/' + id,
    method: 'DELETE'
  })
}
