import config from "./../config/index";
import { Indicator } from 'mint-ui';

export default {
    /**
     * 获取人机验证码
	 * @param {String} OpenID 用户唯一ID
     */
	getMachineCode: function getMachineCode(OpenID) {
		return `${config.url.getMachineCode}?openid=${OpenID}&id=${Math.floor(Math.random() * 1000)}`;
    },
    
    /**
     * 获取 短信验证码
	 * @param {String} Mobile 手机号码 
	 * @param {String} Code 图形验证码
	 * @param {String} OpenID 用户唯一ID
     */
	getMobileCode: function getMobileCode(Mobile, Code, OpenID) {

		Indicator.open('正在加载数据...');

		return new Promise(function (resolve, reject) {
			$.ajax({
				url: config.url.getMobileCode,
				type: "POST",
				dataType : 'json',
				data: {
					CodeIs: true, // CodeIs 为true会忽略数字验证码
					Mobile: Mobile,
					OpenID: OpenID,
					// Code: Code, // 因为忽略数字验证码 所以 code 随机生成 4位小数
					Code: Math.floor(Math.random() * 1000),
				},
				success: function(res){
					Indicator.close();
					if (res && res.Code === 200 && res.Msg === '') {
						resolve(res);
					} else {
						reject(res.Msg);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Indicator.close();
					reject('向服务器发起请求短信验证码失败, 原因: ' + errorThrown);
				}
			});
		});
	},

    /**
     * 校验手机与短信验证码是否正确
	 * @param {String} phoneValue 手机号码
	 * @param {String} verifyNumber 短信验证码
     */
	verifyMobileCodeNumber: function verifyMobileCodeNumber(phoneValue, verifyNumber) {
		Indicator.open('正在加载数据...');
		
		return new Promise(function (resolve, reject) {
			$.get(config.url.checkVerifyCode, {
				mobile: phoneValue, // 手机号码
				code: verifyNumber // 短信验证码
			}, function(response, status, xhr) {
				Indicator.close();
				if (response && response.Code === 200 && response.Msg === '') {
					resolve();
				} else {
					reject('短信验证码错误！');
				}
			});
		});
	},

	/**
	 * 暂不添加车辆信息 注册
	 * @param {String} OpenID 微信用户唯一标识 openid (必填)
	 * @param {String} City 所在城市 (必填)
	 * @param {String} Mobile 用户手机号 (必填)
	 * @param {String} VerifyCode 手机验证码 (必填)
	 * @param {String} CarNo 车牌号 (必填) 
	 * @param {String} CarType 车型 (必填) 
	 */
	notAddCarInforToRegister: function notAddCarInforToRegister(parameter) {
		return new Promise(function (resolve, reject) {
			$.ajax({
				url: config.url.register,
				type: "POST",
				dataType : 'json',
				data: parameter,
				success: function(res){
					Indicator.close();
					if (res && res.Code === 200 && res.Msg === '') {
						resolve(res);
					} else {
						reject(`注册失败，原因: ${res.Msg}`);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Indicator.close();
					reject(`向服务器发起请求车主注册失败，原因: ${errorThrown}`);
				}
			});
		});
	},
};
