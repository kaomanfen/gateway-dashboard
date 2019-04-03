import request from '@/utils/request'

export function operationLogs(type, id, page = 1) {
  return request({
    url: '/operation-logs/' + id + '/' + type + '?page=' + page,
    method: 'get'
  })
}
