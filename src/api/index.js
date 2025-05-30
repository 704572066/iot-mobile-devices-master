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
// 设备列表不分页
export const getDeviceListNoPaging = data =>
  myHttps('post', baseUrl + 'device-instance/_query/no-paging?paging=false', data)
// 设备详情
export const getDeviceDetail = id =>
  myHttps('get', baseUrl + `device-instance/${id}/detail`)
// 设备地址分类
export const getDeviceAddressCategory = orgId =>
  myHttps('get', baseUrl + `device-instance/${orgId}/address-category`)
  
// 多个设备定位geo
export const getDeviceGeo = orgId =>
  myHttps('get', baseUrl + `device-instance/${orgId}/multi/geo/_query`)
// 单个设备定位geo
export const getDeviceGeoById = deviceId =>
myHttps('get', baseUrl + `device-instance/${deviceId}/geo/_query`)
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
  
// 通过用户所属组织过滤告警记录
export const getWarningListByOrgId = data =>
  myHttps('post', baseUrl + `alarm/record/_query_native`, data)

// 告警日志
export const getWarningHistory = (alarmConfigId, data) =>
  myHttps('post', baseUrl + `alarm/history/${alarmConfigId}/_query`, data)
// 根据orgid获取所属设备告警处理记录
export const getAllWarningHandleHistoryByOrgId = (data) =>
  myHttps('post', baseUrl + `alarm/record/handle-history/_query_native`, data)
// admin用户获取所属设备告警处理记录
export const getAllWarningHandleHistoryByAdmin = (data) =>
  myHttps('post', baseUrl + `alarm/record/all-handle-history/_query_native`, data)
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
