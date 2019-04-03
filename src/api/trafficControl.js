import request from '@/utils/request'

export function list() {
  return request({
    url: '/rate-limiting',
    method: 'get'
  })
}

export function post(data) {
  return request({
    url: '/rate-limiting',
    method: 'POST',
    data
  })
}

export function put(id, data) {
  return request({
    url: '/rate-limiting/' + id,
    method: 'PUT',
    data
  })
}

export function del(id) {
  return request({
    url: '/rate-limiting/' + id,
    method: 'DELETE'
  })
}

export function bind(id, data) {
  return request({
    url: '/rate-limiting/bind-api/' + id,
    method: 'POST',
    data
  })
}

export function detailList(id) {
  return request({
    url: '/rate-limiting/' + id,
    method: 'GET'
  })
}

export function detailDel(id, data) {
  return request({
    url: '/rate-limiting/pluck-api/' + id,
    method: 'DELETE',
    data
  })
}

export function projectsList(groupId, page, name = undefined) {
  const params = { page: page }

  if (name !== undefined) {
    params['name'] = name
  }

  return request({
    url: 'rate-limiting/projects/' + groupId,
    params: params,
    method: 'get'
  })
}
