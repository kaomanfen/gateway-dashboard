import request from '@/utils/request'

export function getCache(project, env, type) {
  return request({
    url: '/projects/' + project + '/kvstore/env/' + env + '/type/' + type,
    method: 'get'
  })
}
export function updateCache(project, env, type) {
  return request({
    url: '/projects/' + project + '/kvstore',
    method: 'post',
    data: {
      env: env,
      type: type
    }
  })
}
