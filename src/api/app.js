import request from '@/utils/request'

export function projectsList() {
  return request({
    url: '/app-projects',
    method: 'get'
  })
}

export function addProjects(data) {
  return request({
    url: '/app-projects',
    method: 'post',
    data
  })
}
export function updateProjects(id, data) {
  return request({
    url: '/app-projects/' + id,
    method: 'put',
    data
  })
}

export function auditList(env, id) {
  return request({
    url: '/app-audit/' + env + '/' + id,
    method: 'get'
  })
}

export function addAudit(id, data) {
  return request({
    url: '/app-audit/' + id,
    method: 'post',
    data
  })
}
export function updateAudit(id, data) {
  return request({
    url: '/app-audit/' + id,
    method: 'put',
    data
  })
}

