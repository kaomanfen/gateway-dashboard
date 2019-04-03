import request from '@/utils/request'

export function list() {
  return request({
    url: '/wafs',
    method: 'get'
  })
}

export function put(id, data) {
  return request({
    url: '/wafs/' + id,
    method: 'PUT',
    data: data
  })
}
