import { myHttps } from './request'
const baseUrl = 'https://iot.jxts119.com/api/'
// const baseurl = 'http://localhost:8848/api'
export const login = data => {
  return myHttps('post', baseUrl + 'authorize/login', data)
}

export const editPassword = data => {
  return myHttps('put', baseUrl + 'user/passwd', data)
}
export const getUserInfo = () => {
  return myHttps('get', baseUrl + 'user/detail')
}
// 萤石设备列表
export const getMonitoringList = data =>
  myHttps('post', baseUrl + 'video-device-instance/_query', data)

export const getMonitoringDetail = id =>
  myHttps('get', baseUrl + `video-device-instance/${id}/detail`)
// 设备列表
export const getDeviceList = data =>
  myHttps('post', baseUrl + 'device-instance/_query', data)
// 设备详情
export const getDeviceDetail = id =>
  myHttps('get', baseUrl + `device-instance/${id}/detail`)
// 设备运行情况
export const getDeviceDashboard = data =>
  myHttps('post', baseUrl + `dashboard/_multi`, data)
// 设备功能设置
export const setDeviceFunction = (params, data) =>
  myHttps(
    'post',
    baseUrl + `device/invoked/${params.id}/function/${params.metaId}`,
    data
  )
// 设备运行情况历史数据
export const getDeviceDashboardHistoryChart = data =>
  myHttps(
    'post',
    baseUrl +
      `device-instance/${data.id}/property/${data.type}/_query/no-paging`,
    data
  )
// 告警记录
export const getWarningList = data =>
  myHttps('post', baseUrl + `alarm/record/_query`, data)
// 告警日志
export const getWarningHistory = (alarmConfigId, data) =>
  myHttps('post', baseUrl + `alarm/history/${alarmConfigId}/_query`, data)
// code获取微信信息
export const getWxInfo = data =>
  myHttps(
    'get',
    'https://api.weixin.qq.com/sns/jscode2session',
    data,
    'callback'
  )
// 告警等级配置
export const getAlarmLevelConfig = params =>
  myHttps('get', baseUrl + `alarm/config/default/level`, { params })
