import request from '@/utils/request'

export function queryOperateLogList(opeateLog) {
  return request({
    method: 'get',
    url: '/sys/operlog/list',
    params: opeateLog
  })
}