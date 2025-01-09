import { myHttpThird } from './request'
// 第三方
// 获取验证码
export const getCode = () =>
  myHttpThird('get', `http://www.smartiot-china.com:9999/admin/api/login/code`)
// 登录
// data:{"code":"c4x8","domain":"www.smartiot-china.com","password":"18668399921","phone":"18668399921","uuid":"validate_codee7d3db25180b4e4eb0d96458a92161f2"}
export const thirdLogin = data =>
  myHttpThird(
    'post',
    `http://www.smartiot-china.com:9999/admin/api/login/login`,
    data
  )
// 获取用户信息
export const getUserInfo = id =>
  myHttpThird('get', `http://www.smartiot-china.com:9999/admin/api/user/${id}`)
// 获取摄像头token
export const getCameraToken = () =>
  myHttpThird(
    'get',
    `http://www.smartiot-china.com:9999/admin/api/camera/getYingshiAcssessToken`
  )
