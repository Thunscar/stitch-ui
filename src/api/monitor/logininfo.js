import request from "@/utils/request.js";

export function queryLoginInfoList(loginInfo) {
  return request({
    method: 'get',
    url: '/sys/log/login/list',
    params: loginInfo
  })
}