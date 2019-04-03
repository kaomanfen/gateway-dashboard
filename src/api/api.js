import request from '@/utils/request'

export function getApiList(groupId, categoryId, page, is_auth = undefined, is_sign = undefined, name = undefined, path = undefined, version = undefined) {
  const params = { page: page }
  if (is_auth !== undefined) {
    params['is_auth'] = is_auth
  }
  if (is_sign !== undefined) {
    params['is_sign'] = is_sign
  }
  if (name !== undefined) {
    params['name'] = name
  }
  if (path !== undefined) {
    params['path'] = path
  }
  if (version !== undefined) {
    params['version'] = version
  }
  return request({
    url: '/projects/' + groupId + '/api/' + categoryId + '/category',
    params: params,
    method: 'get'
  })
}
export function getTestMenu(groupId) {
  return request({
    url: '/group/test/menu/' + groupId,
    method: 'get'
  })
}

export function getApiDetail(id) {
  return request({
    url: '/apis/' + id,
    method: 'get'
  })
}

export function getApiRunInfo(id) {
  return request({
    url: '/runs/' + id + '/api',
    method: 'get'
  })
}

export function getTestRunInfo(id) {
  return request({
    url: '/runs/' + id + '/collect',
    method: 'get'
  })
}
export function runs(data) {
  return request({
    url: '/runs',
    method: 'post',
    data
  })
}
export function saveRunApi(data) {
  return request({
    url: '/case',
    method: 'post',
    data
  })
}
export function updateRunApi(id, data) {
  return request({
    url: '/case/' + id,
    method: 'put',
    data
  })
}

export function apiCopy(apiId, type) {
  return request({
    url: '/apis/copy',
    method: 'post',
    data: {
      api_id: apiId,
      type: type
    }
  })
}

export function publicApi(id, env, description) {
  return request({
    url: '/apis/' + id + '/release',
    method: 'post',
    data: {
      env: env,
      description: description
    }
  })
}
export function offLineApi(id, env, description) {
  return request({
    url: '/apis/' + id + '/offline',
    method: 'post',
    data: {
      env: env,
      description: description
    }
  })
}
export function deleteCase(id) {
  return request({
    url: '/case/' + id,
    method: 'delete'
  })
}

export function addApi(data) {
  return request({
    url: '/apis',
    method: 'post',
    data
  })
}
export function updateApi(apiId, data) {
  return request({
    url: '/apis/' + apiId,
    method: 'put',
    data
  })
}
export function deleteApi(apiId) {
  return request({
    url: '/apis/' + apiId,
    method: 'delete'
  })
}
export function followApi(apiId) {
  return request({
    url: '/follows',
    method: 'post',
    data: {
      api_id: apiId
    }
  })
}
export function cancelFollowApi(apiId) {
  return request({
    url: '/follows/' + apiId,
    method: 'delete'
  })
}
export function testList(id, cid) {
  return request({
    url: '/case/project/' + id + '/collect/' + cid,
    method: 'get'
  })
}

export function batchTest(data) {
  return request({
    url: '/bulk-case',
    method: 'post',
    data
  })
}
