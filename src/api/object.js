import request from '@/utils/request'

export function getObject(id) {
  return request({
    url: '/projects/' + id,
    method: 'GET'
  })
}
export function addObject(data) {
  return request({
    url: '/projects',
    method: 'POST',
    data: data
  })
}
export function updateObject(id, data) {
  return request({
    url: '/projects/' + id,
    method: 'PUT',
    data: data
  })
}
export function delObject(id) {
  return request({
    url: '/projects/' + id,
    method: 'DELETE'
  })
}

export function addCategory(data) {
  return request({
    url: '/category',
    method: 'POST',
    data: data
  })
}

export function updateCategory(id, data) {
  return request({
    url: '/category/' + id,
    method: 'PUT',
    data: data
  })
}

export function delectCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'DELETE'
  })
}
export function fetchCategory(id) {
  return request({
    url: '/projects/' + id + '/category',
    method: 'GET'
  })
}

export function addTestCategory(data) {
  return request({
    url: '/collects',
    method: 'POST',
    data: data
  })
}

export function updateTestCategory(id, data) {
  return request({
    url: '/collects/' + id,
    method: 'PUT',
    data: data
  })
}
export function delectTestCategory(id) {
  return request({
    url: '/collects/' + id,
    method: 'DELETE'
  })
}
