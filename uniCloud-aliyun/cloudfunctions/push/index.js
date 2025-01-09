// 'use strict';
// exports.main = async (event, context) => {
// 	//event为客户端上传的参数
// 	console.log('event : ', event)
	
// 	//返回数据给客户端
// 	return event
// };
// 简单的使用示例
'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__B9D79BA"}) //注意这里需要传入你的应用appId，用于指定接收消息的客户端
exports.main = async (event, context) => {
	const data=JSON.parse(event.body)
	return await uniPush.sendMessage({
		"push_clientid": data.push_clientid, 	//填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
		"title": data.title,	
		"content": data.content,
		"payload": {
			"text":"体验一下uni-push2.0"
		},
		"force_notification":true,
		"category":{"harmony":"EXPRESS", "huawei":"EXPRESS", "vivo":"ORDER"},
		"options":{
			"HW":{
				"/message/android/target_user_type":1
			}
		}
	})
};
