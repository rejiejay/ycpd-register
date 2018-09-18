import config from "./../config/index";
import { Indicator } from 'mint-ui';

export default {
    /**
     * 获取人机验证码
     */
	getMachineCode: function getMachineCode() {
		return config.url.getMachineCode + '?openid=' + this.OpenID + '&id=' + Math.floor(Math.random() * 1000);
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
					Mobile: Mobile,
					OpenID: OpenID,
					Code: Code,
				},
				success: function(res){
					Indicator.close();
					if (res && res.Code === 200 && res.Msg === '') {
						resolve(res);
					} else {
						reject('向服务器发起请求短信验证码成功, 但是' + res.Msg);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Indicator.close();
					reject('向服务器发起请求短信验证码失败, 原因: ' + errorThrown);
				}
			});
		});
	},
};
