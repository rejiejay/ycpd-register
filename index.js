window.onload = function () {
	init.main();
};

// 配置信息类
var config = (function () { // 匿名函数自执行
	// 判断是否测试环境	
	if (window.location.origin === 'file://' || window.location.host === 'store.demo.ichebaoyang.com') {
		// 测试环境
		return {
			url: {
				origin1: 'http://store.demo.ichebaoyang.com', // 请求源(服务器地址)
				origin2: 'http://api.demo.hotgz.com', // 请求源(服务器地址)
			
				// 车辆品牌车系以及短信验证码
				carBrandSeriesCode: 'http://store.demo.ichebaoyang.com/wx/Handler.ashx',

				/**
				 * 获取手机验证码
				 * http://api.demo.hotgz.com/ 找不到与请求 URI“http://localhost:85/Customer/GetVerifyCode”匹配的 HTTP 资源。
				 * http://store.demo.ichebaoyang.com/ 应用程序“YCPD_WX_JSZX”中的服务器错误, 暂时用下面这个
				 */
				getMobileCode: 'http://api.demo.hotgz.com/Customer/GetVerifyCode',
			
				// 通过VIN查询公众接口获取车型列表
				getCarModelByVin: 'http://api.demo.hotgz.com/Customer/GetCarModelByVin',
			
				// 车主注册
				register: 'http://api.demo.hotgz.com/Customer/Register',
			
				// 初始化微信JS-SDK
				getWxConfig: 'http://store.demo.ichebaoyang.com/wx/apiHandler.ashx',
				
				// 获取车主的车辆信息
				getCarList: 'http://api.demo.hotgz.com/Customer/GetCarList',

				// 获取人机验证码
				getMachineCode: 'http://api.demo.hotgz.com/Customer/GetVCodeImage',

				// 校验验证码与手机号是否正确
				checkVerifyCode: 'http://api.demo.hotgz.com/Customer/CheckVerifyCode',
			}
		}

	} else {
		// 线上生产环境
		return {
			url: {
				origin1: 'http://picc.hotgz.com', // 请求源(服务器地址)
				origin2: 'http://ycpdapi.hotgz.com', // 请求源(服务器地址)
				
				// 车辆品牌车系以及短信验证码
				carBrandSeriesCode: '/wx/Handler.ashx',
				
				// 获取手机验证码
				getMobileCode: 'http://ycpdapi.hotgz.com/Customer/GetVerifyCode',
				
				// 通过VIN查询公众接口获取车型列表
				getCarModelByVin: 'http://ycpdapi.hotgz.com/Customer/GetCarModelByVin',
				
				// 车主注册
				register: 'http://ycpdapi.hotgz.com/Customer/Register',
				
				// 初始化微信JS-SDK
                getWxConfig: 'http://picc.hotgz.com/wx/apiHandler.ashx',
				
				// 获取车主的车辆信息
				getCarList: 'http://ycpdapi.hotgz.com/Customer/GetCarList',

				// 获取人机验证码
				getMachineCode: 'http://ycpdapi.hotgz.com/Customer/GetVCodeImage',

				// 校验验证码与手机号是否正确
				checkVerifyCode: 'http://ycpdapi.hotgz.com/Customer/CheckVerifyCode',
			}
		}
	}
})();

// 初始化的类
var init = {
	// vue的实例挂载 (提供给外部访问与测试)
	vueMount: null,

	main: function main() {
		// 实例化 Vue
		this.initVue();
	},

	initVue: function initVue() {
		// 路由配置
		var routes = [
			/**
			 * 注册
             * @param {String} openid 微信 用户标识 o9rEN0_rX4ySFsIbKi5MBL8YGnAg
			 */
			{
				path: '/index/:openid', // 注册
				alias: ['/'],
				component: VmMain,
				meta: { title: '注册' },
			}, {
				path: '/agreement/', // 用户协议页
				component: VmAgreement,
				meta: { title: '养车频道用户服务协议' },
			}, 
			
			/**
			 * 我的车辆列表
             * @param {String} customerid 养车频道 用户标识 180910010001949590
			 */
			{ // 我的车辆列表
				path: '/mycar/:customerid',
				component: VmMyCar,
				meta: { title: '我的车辆' },
			}, 

			/**
			 * 完善车辆信息
             * @param {String} pageType 页面状态 register editor creater
			 */
			{
				path: '/supplement/:pageType',
				component: VmSupplement,
				meta: { title: '完善车辆信息' },
			}
		];

		// 初始化路由配置
		var router = new VueRouter({
			routes: routes
		});
		
		router.beforeEach( function (to, from, next) { // 全局的 beforeEach 守卫
			if (to.meta.title) { // 路由发生变化修改页面 title
				document.title = to.meta.title;
			}

			next();
		});

		// 初始化 Vue 到页面
		this.vueMount = new Vue({
			router: router
		});

		this.vueMount.$mount('#app');
	}
};

// ajaxs请求类
var ajaxs = {
	OpenID: '', // 用户标识
	Mobile: '', // 手机号码
	VerifyCode: '', // 手机验证码
	City: '深圳', // 所在城市 (默认深圳)
	customerid: '', // 用户 id
	carid: '', // 编辑的车辆 id

	/**
     * 获取 车辆品牌 列表
     */
	getBrand: function getBrand() {
		return new Promise(function (resolve, reject) {
			var form = new FormData();
			form.append("action", "GetBrand");
			
			$.ajax({
				url: config.url.carBrandSeriesCode,
				type: "POST",
                data: form,
                processData: false,
                contentType: false,
				success: function(res){
					if (res && res instanceof Array && res.length > 0) {
						resolve(res);
					} else {
						reject('向服务器发起请求查找车辆品牌列表成功, 但是数据有误!');
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					reject('向服务器发起请求查找车辆品牌列表失败, 原因: ' + errorThrown);
				}
			});
		});
	},

    /**
     * 获取 车型品牌的型号 列表
	 * @param {String} brand 车辆品牌 
     */
	getSeries: function getSeries(brand) {
		Vue.prototype.$indicator.open('正在加载数据...');

		return new Promise(function (resolve, reject) {
			var form = new FormData();
			form.append("action", "GetSeries");
			form.append("brand", brand);
			
			$.ajax({
				url: config.url.carBrandSeriesCode,
				type: "POST",
                data: form,
                processData: false,
                contentType: false,
				success: function(res){
					Vue.prototype.$indicator.close();
					if (res && res instanceof Array && res.length > 0) {
						resolve(res);
					} else {
						reject('向服务器发起请求查找品牌型号成功, 但是数据有误!');
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Vue.prototype.$indicator.close();
					reject('向服务器发起请求查找品牌型号失败, 原因: ' + errorThrown);
				}
			});
		});
	},

    /**
     * 获取 车型年份 列表
	 * @param {String} series 车型品牌的型号名称 
     */
	getCarYears: function getCarYears(series) {
		/**
		 * 因为 车型现在以 Session 来保存 
		 * 而本地环境是没有 Session 的, 所以返回死数据
		 */
		if (window.location.origin === 'file://') {
			return new Promise(function (resolve, reject) {
				resolve([{"yearNames":"2016"}, {"yearNames":"2015"}, {"yearNames":"2014"}, {"yearNames":"2013"}, {"yearNames":"2012"}, {"yearNames":"2011"}, {"yearNames":"2010"}, {"yearNames":"2009"}, {"yearNames":"2008"}, {"yearNames":"2007"}, {"yearNames":"2006"}, {"yearNames":"2005"}, {"yearNames":"2004"}, {"yearNames":"2003"}, {"yearNames":"2000"}, {"yearNames":"1999"}, {"yearNames":"1998"}, {"yearNames":"1997"}, {"yearNames":"1996"}, {"yearNames":"1995"}, {"yearNames":"1994"}, {"yearNames":"1992"}]);
			});
		} else {
			Vue.prototype.$indicator.open('正在加载数据...');

			return new Promise(function (resolve, reject) {
				var form = new FormData();
				form.append("action", "GetYears");
				form.append("SeriesName", series);
				
				$.ajax({
					url: config.url.carBrandSeriesCode,
					type: "POST",
					data: form,
					processData: false,
					contentType: false,
					success: function(res){
						Vue.prototype.$indicator.close();
						if (res && res instanceof Array && res.length > 0) {
							resolve(res);
						} else {
							reject('向服务器发起请求车型年份列表成功, 但是数据有误!');
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Vue.prototype.$indicator.close();
						reject('向服务器发起请求车型年份列表失败, 原因: ' + errorThrown);
					}
				});
			});
		}
	},

    /**
     * 获取 车辆具体型号 列表
	 * @param {String} series 车型品牌的型号名称 
	 * @param {String} years 车型的年份 
     */
	getCarYearModel: function getCarYearModel(series, years) {
		/**
		 * 因为 车型现在以 Session 来保存 
		 * 而本地环境是没有 Session 的, 所以返回死数据
		 */
		if (window.location.origin === 'file://') {
			return new Promise(function (resolve, reject) {
				resolve([{"yearModel":"740Li 3.0T 手自一体 豪华型"}, {"yearModel":"740Li 3.0T 手自一体 领先型"}, {"yearModel":"740Li 3.0T 手自一体 尊享型"}, {"yearModel":"750LixDrive 4.4T 手自一体 四座版"}, {"yearModel":"750LixDrive 4.4T 手自一体 五座版"}]);
			});
		} else {
			Vue.prototype.$indicator.open('正在加载数据...');

			return new Promise(function (resolve, reject) {
				var form = new FormData();
				form.append("action", "GetModel");
				form.append("SeriesName", series);
				form.append("years", years);
				
				$.ajax({
					url: config.url.carBrandSeriesCode,
					type: "POST",
					data: form,
					processData: false,
					contentType: false,
					success: function(res){
						Vue.prototype.$indicator.close();
						if (res && res instanceof Array && res.length > 0) {
							resolve(res);
						} else {
							reject('向服务器发起请求车辆具体型号列表成功, 但是数据有误!');
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Vue.prototype.$indicator.close();
						reject('向服务器发起请求车辆具体型号列表失败, 原因: ' + errorThrown);
					}
				});
			});
		}
	},

    /**
     * 获取 短信验证码
	 * @param {String} Mobile 手机号码 
	 * @param {String} Code 图形验证码
	 * @param {String} this.OpenID 用户唯一ID
     */
	getMobileCode: function getMobileCode(Mobile, Code) {
		var OpenID = this.OpenID;

		Vue.prototype.$indicator.open('正在加载数据...');

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
					Vue.prototype.$indicator.close();
					if (res && res.Code === 200 && res.Msg === '') {
						resolve(res);
					} else {
						reject('向服务器发起请求短信验证码成功, 但是' + res.Msg);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Vue.prototype.$indicator.close();
					reject('向服务器发起请求短信验证码失败, 原因: ' + errorThrown);
				}
			});
		});
	},

    /**
     * 通过VIN查询公众接口获取车型列表
	 * @param {String} vin Vehicle Identification Number（车辆识别码） 
     */
	getCarModelByVin: function getCarModelByVin(vin) {
		Vue.prototype.$indicator.open('正在加载数据...');

		return new Promise(function (resolve, reject) {
			$.get(config.url.getCarModelByVin, {vin: vin}, function(response, status, xhr) {
				Vue.prototype.$indicator.close();
				if (response && response.Code === 200 && response.Data instanceof Array && response.Data.length > 0) {
					resolve(response.Data[0]);
				} else {
					reject();
				}
			});
		});
	},

    /**
     * 车主注册
	 * @param {String} CarNo 车牌号
	 * @param {String} VinNo 车架号
	 * @param {String} Brand 品牌
	 * @param {String} Series 车系
	 * @param {String} Years 年份
	 * @param {String} Model 车型
	 * 
	 * @param {String} this.City 所在城市
	 * @param {String} this.OpenID 用户标识
	 * @param {String} this.Mobile 手机号码
	 * @param {String} this.VerifyCode 手机验证码
     */
	register: function register(CarNo, VinNo, Brand, Series, Years, Model) {
		var OpenID = this.OpenID;
		var Mobile = this.Mobile;
		var VerifyCode = this.VerifyCode;
		var City = this.City;

		Vue.prototype.$indicator.open('正在加载数据...');

		// 暂不添加的数据
		var submitData = {
			OpenID: OpenID,
			Mobile: Mobile,
			VerifyCode: VerifyCode,
			City: City
		}

		// 所有信息
		if (CarNo && VinNo && Brand && Series && Years && Model) {
			submitData.CarNo = CarNo;
			submitData.VinNo = VinNo;
			submitData.Brand = Brand;
			submitData.Series = Series;
			submitData.Years = Years;
			submitData.Model = Model;
		}

		return new Promise(function (resolve, reject) {
			$.ajax({
				url: config.url.register,
				type: "POST",
				dataType : 'json',
				data: submitData,
				success: function(res){
					Vue.prototype.$indicator.close();
					if (res && res.Code === 200) {
						resolve(res);
					} else {
						reject('注册失败，原因:' + res);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Vue.prototype.$indicator.close();
					reject('向服务器发起请求车主注册失败, 原因: ' + errorThrown);
				}
			});
		});
	},

    /**
     * 获取车主的车辆信息
	 * @param {String} this.customerid 养车频道 用户标识
     */
	getCarList: function getCarList() {
		var customerid = this.customerid;
		Vue.prototype.$indicator.open('正在加载数据...');

		return new Promise(function (resolve, reject) {
			$.get(config.url.getCarList, {CustomerID: customerid}, function(response, status, xhr) {
				Vue.prototype.$indicator.close();

				if (response && response.Code === 200 && response.Data instanceof Array) {
					resolve(response.Data);
				} else {
					reject('获取车主的车辆信息失败, 原因: ' + response.Msg);
				}
			});
		});
	},

    /**
     * 获取人机验证码
     */
	getMachineCode: function getMachineCode() {
		return config.url.getMachineCode + '?openid=' + this.OpenID + '&id=' + Math.floor(Math.random() * 1000);
	},

    /**
     * 校验手机与短信验证码是否正确
	 * @param {String} phoneValue 手机号码
	 * @param {String} verifyNumber 短信验证码
     */
	verifyMobileCodeNumber: function verifyMobileCodeNumber(phoneValue, verifyNumber) {
		Vue.prototype.$indicator.open('正在加载数据...');

		return new Promise(function (resolve, reject) {
			$.get(config.url.checkVerifyCode, {
				mobile: phoneValue, // 手机号码
				code: verifyNumber // 短信验证码
			}, function(response, status, xhr) {
				Vue.prototype.$indicator.close();
				if (response && response.Code === 200 && response.Msg === '') {
					resolve();
				} else {
					reject('短信验证码错误！');
				}
			});
		});
	},
};

/**
 * 定位类
 */
var wxLocation = {
    /**
     * 初始化微信JS-SDK
     * @param {Array} jsApiList
     * @return {Promise} resolve(ture) reject(error)
     */
    initJSSDK: function initJSSDK(jsApiList) {
        var _this = this;

        return new Promise(function (resolve, reject) {
            _this.getWxConfig() // 获取权限验证配置信息
            .then(function (wxConfig) {

                wx.ready(function () {
                    // 注册 配置成功的事件
                    resolve(true);
                });

                wx.error(function (res) {
                    // 注册 配置失败的事件
                    reject('向服务器发起请求获取权限验证配置信息成功, 但是初始化配置信息失败, 原因: ' + JSON.stringify(res));
                });

                wx.config({ // 初始化配置信息
                    debug: false,
                    appId: wxConfig.appId,
                    timestamp: wxConfig.timestamp,
                    nonceStr: wxConfig.nonceStr,
                    signature: wxConfig.signature,
                    jsApiList: jsApiList
                });
            }, function (error) {
                reject(error);
            });
        });
    },

    /**
     * 获取权限验证配置信息
     * @param {methods} GET
     * @param {contentType} json application/json; charset=utf-8
     * @return {Promise} resolve({) reject(error)
     */
    getWxConfig: function getWxConfig() {
        var _this = this;

        return new Promise(function (resolve, reject) {
            $.ajax({
                url: config.url.getWxConfig + '?action=WxConfig&url=' + window.encodeURIComponent(window.location.href),
                type: "get",
                success: function success(wxConfig) {
                    resolve(wxConfig);
                },
                error: function error(error) {
                    reject('向服务器获取权限验证配置信息发生错误!, 原因: ' + error);
                }
            });
        });
    },

    /**
     * 初始化
     * @return {Promise} resolve({
     *   longitude: longitude,
     *   latitude: latitude,
     * }) reject(error)
     */
    init: function init() {
        var _this = this;

        return new Promise(function (resolve, reject) {
            _this.initJSSDK(['getLocation', 'openLocation']).then(function (succeed) {
                wx.getLocation({
                    type: 'wgs84',

                    success: function success(res) {
                        resolve({
                            longitude: res.longitude,
                            latitude: res.latitude
                        });
                    },

                    fail: function fail(res) {
                        reject("获取地理位置信息失败：" + res.errMsg);
                    },

                    cancel: function cancel() {
                        reject("获取地理位置信息被取消");
                    }
                });
            }, function (error) {
                reject(error);
            });
        });
	},
	
    /**
     * 根据定位获取所在城市名称
     * @param {Object} position longitude latitude
     * @return {Promise} resolve('城市名称') reject(error)
     */
	getCityName: function getCityName(position) {
		return new Promise(function (resolve, reject) {
			/**
			 * 剪切掉匹配到文字的后半段部分
			 * @param {String} string 裁剪前的文字
			 * @param {String} match 要裁剪匹配的文字
			 * @return {String} 裁剪后的文字
			 */
			function sliceLastIndexOfBy (string, match) {
				let stringOfMatch= string.indexOf(match);
				if (stringOfMatch !== -1) {
					return string.slice(0, stringOfMatch);
				} else {
					return string
				}
			}

			$.ajax({
				url: `http://api.map.baidu.com/geocoder/v2/?ak=enYTT6LMF8UAQGe9xmiOKGsw&callback=renderReverse&location=${position.latitude},${position.longitude}&output=json&pois=1`,
				type: "get",
				dataType: "jsonp",
				jsonp: "callback",
				success(data) {
					if (data.status === 0) {
						resolve(sliceLastIndexOfBy(data.result.addressComponent.city, '市'));
					} else {
						reject('成功发起请求获取所在城市名称, 但是请求数据有误. 原因:' + error);
					}
				},
				error(error) {
					reject('请求获取所在城市名称失败. 原因:' + error);
				}
			});
		})
	},
}

/**
 * Vue类
 * 注册页面
 */
var VmMain = {
	template: '#register',

	data: function data() {
		return {
			clientWidth: document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth,

			// 手机号码
			phoneValue: '',

			// 是否显示人机验证码模态框
			isMachineModalShow: false,

			// 人机验证码
			machineNumber: '',

			// 验证号码
			verifyNumber: '',

			// 是否 正在获取验证码
			isVerifyGeting: false,

			// 倒计时60秒
			countDown: 60,
			
			// 是否同意协议
			isAgreement: false,
		};
	},

	mounted: function mounted() { 
		// 页面状态 初始化
		ajaxs.OpenID = this.$route.params.openid;
		
		// 初始化位置信息
		wxLocation.init()
		.then(function(position) {
			wxLocation.getCityName(position)
			.then(function(cityName) {
				ajaxs.City = cityName;
			});
		});
	},

	methods: {
		
		/**
		 * 校验手机号码
		 */
		verifyPhoneValue: function verifyPhoneValue() {
			if (this.phoneValue === '') {
				return utils.consequencer.error('手机号码不能为空');
			}

			// 正则匹配表达式: https://github.com/VincentSit/ChinaMobilePhoneNumberRegex
			if (/^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/.test(this.phoneValue) === false) {
				return utils.consequencer.error('请输入正确的手机号码格式');
			}

			return utils.consequencer.success();
		},

		/**
		 * 获取验证码
		 */
		verifyNumberHandle: function verifyNumberHandle() {

			// 校验手机号码
			if (this.verifyPhoneValue().result !== 1) {
				return alert(this.verifyPhoneValue().message);
			}

			// 判断是否正在获取验证码
			if (this.isVerifyGeting === false) { // 没有获取验证码的情况
				
				this.isMachineModalShow = true; // 弹出模态框
				this.renderBase64MachineNumber();
			}
		},

		/**
		 * 渲染验证码
		 */
		renderBase64MachineNumber: function renderBase64MachineNumber() {
			this.$refs.base64MachineNumber.src = ajaxs.getMachineCode();
		},

		/**
		 * 验证验证码是否正确
		 */
		checkVerifyCode: function checkVerifyCode() {
			var _this = this;

			if (this.machineNumber.length !== 4) {
				return alert('请输入正确验证码');
			}

			// // 图形验证码移动的距离 暂时为零
			ajaxs.getMobileCode(this.phoneValue, this.machineNumber)
			.then(function () {
				_this.isVerifyGeting = true; // 表示正在获取
				_this.isMachineModalShow = false; // 弹出模态框
				// 定时器倒计时 60 秒
				for(var i = 0; i < 60; i++ ) {
					(function (i) { // 匿名函数自执行创建闭包
						setTimeout(function() {
							_this.countDown--;
							if (i === 59) {
								_this.countDown = 60;
								_this.isVerifyGeting = false;
							}
						}, i * 1000);
					})(i);
				}
			}, function (error) {
				alert(error);
			}); 
		},

		/**
		 * 跳转到 养车频道用户服务协议
		 */
		jumpToAgreement: function jumpToAgreement() {
			this.$router.push({ path: '/agreement/' });
		},

		/**
		 * 校验验证号码是否正确
		 * 并且跳转到下一页
		 */
		submitRegister: function submitRegister() {
			var _this = this;

			// 校验手机号码
			if (this.verifyPhoneValue().result !== 1) {
				return alert(this.verifyPhoneValue().message);
			}

			// 校验验证码
			if (this.verifyNumber.length !== 4) {
				return alert('请输入正确格式验证码!');
			}

			// 用户协议
			if (this.isAgreement === false) {
				return alert('请同意用户协议!');
			}

			ajaxs.verifyMobileCodeNumber(this.phoneValue, this.verifyNumber)
			.then(function () {
				// 存储数据到 ajaxs (全局)
				ajaxs.OpenID = _this.$route.params.openid;
				ajaxs.Mobile = _this.phoneValue;
				ajaxs.VerifyCode = _this.verifyNumber;
				_this.$router.replace({ path: '/supplement/register' });
			}, function (error) {
				alert(error);
			})

		},
	},
};

/**
 * Vue类
 * 养车频道用户服务协议
 */
var VmAgreement = {
	template: '#agreement',

	data: function data() { return {} },

	mounted: function mounted() { },

	methods: { }
}

/**
 * Vue类
 * 我的车辆页面
 */
var VmMyCar = {
	template: '#mycar',

	data: function data() {
		return {
			// 车辆列表
			carList: [
				// {
				//  nativeData: {}, // 原始数据
				// 	carNo: '粤B12345', // 车牌号
				// 	carType: '比亚迪-泰', // 车牌号
				// 	isDefault: true, // 是否默认
				// }
			],
		}
	},

	mounted: function mounted() {
		var _this = this;
		ajaxs.customerid = this.$route.params.customerid;

		ajaxs.getCarList()
		.then(function (carList) {
			// 判断数据是否为空
			if (carList.length > 0) {
				_this.carList = carList.map(function (item, key) {
					return {
						nativeData: JSON.parse(JSON.stringify(item)),
						carNo: item.CarNo, // 车牌号
						carType: item.Model + item.Brand, // 车辆类型
						isDefault: (item.IsDefault === 1), // 1为默认车辆 0为非默认车辆
					}
				});
			} else {
				// 否则跳转到新增车辆信息页面
				_this.jumpToCreater();
			}
		}, function (error) {
			alert(error);
		});
	},

	methods: {
		/**
		 * 编辑 车辆信息
		 * @param {Object} nativeData 原始数据
		 */
		jumpToEditor: function jumpToEditor(nativeData) {
			ajaxs.carid = nativeData.CarID; // 赋值到 ajaxs里面存储
			this.$router.push({ path: '/supplement/editor', query: nativeData });
		},

		/**
		 * 新增 车辆信息
		 */
		jumpToCreater: function jumpToCreater() {
			this.$router.push({ path: '/supplement/creater' });
		},
	}
}

/**
 * Vue类
 * 完善车辆信息页面
 */
var VmSupplement = {
	template: '#supplement',

	data: function data() {
		return {
			/**
			 * 页面状态
             * @param {String} register 注册状态 
             * @param {String} editor 编辑状态
             * @param {String} creater 新增状态 
			 */
			pageType: 'register',

			/**
			 * 车牌 与 省份
			 */
			carNoProvince: '粤', // 车牌号省份
			plateNo: '',  // 车牌号码
			myCarKeyBoard: function () {}, // 实例 (车牌选择)

			/**
			 * 车架号码 提示信息
			 */ 
			platVin: '', // 车架号码
			isPlatExchange: false, // 是否交换操作
			dialogTip: false, // 驾驶证 提示信息

			/**
			 * 车辆品牌
			 */ 
			brandModalVisible: false, // 选择 车辆品牌模态框
			carBrand: '', // 选择中的车辆品牌
			brandGroup: [ // 选择 车辆品牌 列表
				// {
				// 	title: 'A',
				// 	list: [
				// 		'阿尔冰娜'
				// 	],
				// }
			],

			/**
			 * 车型品牌的型号
			 */ 
			carSeries: '', // 选择中的车型品牌的型号
			seriesList: [ // 车型品牌的型号列表
				// 'X6'
			],

			/**
			 * 车型年份 列表
			 */ 
			carYears: '', // 选择中的车型年份
			yearsList: [ // 车型年份 列表
				// 'X6'
			],

			/**
			 * 车辆具体型号 列表
			 */ 
			carYearModel: '', // 选择中的车辆具体型号
			yearModelList: [ // 车辆具体型号 列表
				// 'X6'
			],

			/**
			 * 是否设为默认车辆
			 */ 
			isDefaultSetting: false,
		}
	},

	mounted: function mounted() {
		var _this = this;
		
		// 页面状态 初始化
		this.pageType = this.$route.params.pageType;

		// 判断 页面是否 编辑状态
		if (this.pageType === 'editor') {
			// 如果是编辑状态, 初始化页面数据
			var query = this.$route.query;

			this.carNoProvince = query.CarNo.slice(0,1); // 车牌号省份

			this.plateNo = query.CarNo.slice(1); // 车牌号码	
			this.myCarKeyBoard = new CarKeyBoard({ // 实例化 车牌选择, 并且把 车牌号码 带进去
				bindInputDom: 'ycpd-carplateid-input',
				plateNo: this.plateNo,
			});

			this.platVin = query.CarNo.slice(1); // 车架号码
			
			this.isPlatExchange = true; // 表示交换操作
					
			// 选择中的车辆品牌
			this.carBrand = query.Brand; 

			// 选择中的车型品牌的型号
			this.carSeries = query.Series; 
			this.initCarSeries(query.Brand, query.Series);
			
			// 选择中的车型年份
			this.carYears = query.Years; 
			this.initCarYears(query.Series, query.Years);
			
			// 选择中的车辆具体型号
			this.carYearModel = query.Series; 
			this.initCarYearModel(query.Series, query.Years, query.Series);

			this.isDefaultSetting = (query.IsDefault === 1);
		} else {
			// 实例化 车牌选择
			this.myCarKeyBoard = new CarKeyBoard({
				bindInputDom: 'ycpd-carplateid-input'
			});
		}


		// 绑定 车牌号码输入
        this.myCarKeyBoard.succeedHandle(function (result) {
            _this.plateNo = result;
		});

		// 初始化 车辆品牌 列表
		this.initCarBrand();
	},

	methods: {
		/**
		 * 初始化 车辆品牌 列表
		 */
		initCarBrand: function initCarBrand() {
            var _this = this;
			ajaxs.getBrand()
			.then(function (brandGroup) {
				_this.brandGroup = brandGroup.map(function (brand) {
					return {
						title: brand.Group,
						list: brand.Brands.split(','),
					}
				});
			}, function (error) {
				alert(error);
			});
		},

		/**
		 * 初始化 品牌 车系列表
		 * @param {string} carBrand 选择中的车辆品牌
		 * @param {string} carSeries 选择中的车型品牌的型号 (非必填) 这个是通过VIN查询公众接口获取车型的时候带进去的
		 */
		initCarSeries: function initCarSeries(carBrand, carSeries) {
			var _this = this;
			
			ajaxs.getSeries(carBrand) // 获取车系号
			.then(function (series) {
				
				var isRepeated = false; // 是否拥有通过VIN查询公众接口获取车型的“重复”数据
				_this.seriesList = series.map(function (item) {

					// 判断是否拥有通过VIN查询公众接口获取车型的数据
					if (carSeries && carSeries === item.brandSeriesName) {
						isRepeated = true;
					}
					
					return item.brandSeriesName
				});

				if (carSeries && isRepeated === false) {
					_this.seriesList.push(carSeries);
				}
			}, function (error) {
				alert(error);
			});
		},

		/**
		 * 初始化 车型年份 列表
		 * @param {string} carSeries 选择中的 车辆品牌车系
		 * @param {string} carYears 选择中的车型年份 (非必填) 这个是通过VIN查询公众接口获取车型的时候带进去的
		 */
		initCarYears: function initCarYears(carSeries, carYears) {
			var _this = this;
			
			ajaxs.getCarYears(carSeries) // 获取 车型年份 列表
			.then(function (years) {
				var isRepeated = false;  // 是否拥有通过VIN查询公众接口获取车型的“重复”数据

				_this.yearsList = years.map(function (item) {
					
					// 判断是否拥有通过VIN查询公众接口获取车型的数据
					if (carYears && carYears === item.yearNames) {
						isRepeated = true;
					}

					return item.yearNames
				});

				if (carYears && isRepeated === false) {
					_this.yearsList.push(carYears);
				}
			}, function (error) {
				alert(error);
			});
		},

		/**
		 * 初始化 车辆具体型号 列表
		 * @param {string} carSeries 选择中的 车辆品牌车系
		 * @param {string} newCarYears 选择中的 车辆品牌车系年份
		 * @param {string} newCarYearModel 选择中的 车辆具体型号 (非必填) 这个是通过VIN查询公众接口获取车型的时候带进去的
		 */
		initCarYearModel: function initCarYearModel(carSeries, newCarYears, newCarYearModel) {
			var _this = this;

			ajaxs.getCarYearModel(carSeries, newCarYears) // 获取 车辆具体型号 列表
			.then(function (carYearModel) {
				var isRepeated = false;  // 是否拥有通过VIN查询公众接口获取车型的“重复”数据

				_this.yearModelList = carYearModel.map(function (item) {
					
					// 判断是否拥有通过VIN查询公众接口获取车型的数据
					if (newCarYearModel && newCarYearModel === item.yearModel) {
						isRepeated = true;
					}

					return item.yearModel
				});

				if (newCarYearModel && isRepeated === false) {
					_this.yearModelList.push(newCarYearModel);
				}
			}, function (error) {
				alert(error);
			});
		},

		/**
		 * 选择车牌省份
		 */
		selectProvince: function selectProvince() {
            var _this = this;

            this.myCarKeyBoard.showProvincesKeyboard()
            .then(function (value) {
				_this.carNoProvince = value;
            }, function (cancel) {
				console.log('取消选择省份');
            });
		},

		/**
		 * 选择 车型品牌的型号
		 * 并且初始化 series 车系号
		 */
		selectCarBrand: function selectCarBrand(item) {

			this.brandModalVisible = false; // 模态框 隐藏
			this.carBrand = item; // 设置为选中的

			/**
			 * 清空数据
			 */
			this.carSeries = '';
			this.seriesList = [];
			this.carYears = '';
			this.yearsList = [];
			this.carYearModel = '';
			this.yearModelList = [];

			this.initCarSeries(item); // 初始化 品牌 车系列表
		},

		/**
		 * 品牌车系年份车型 提示 选择顺序
		 */
		selectTip: function selectTip() {
			if (this.carBrand === '') {
				// 先判断 是否选择中的 车辆品牌
				alert('请先选择车辆品牌');

			} else if (this.carSeries === '') {
				// 判断 是否选择中的车 型品牌的型号
				alert('请先选择车系');
			
			} else if (this.carYears === '') {
				// 判断 是否选择中的 车型年份
				alert('请先选择车系');
			}
		},

		/**
		 * 通过VIN查询公众接口获取车型列表
		 */
		platVinExchange: function platVinExchange() {
			var _this = this;

			// 十七个英数组成, 英文字母“I”、“O”、“Q”均不会被使用
			if (this.platVin.length ===  17) {
				
				ajaxs.getCarModelByVin(this.platVin) // 查询失败不做处理
				.then(function (carInfor) {
					_this.isPlatExchange = true; // 表示交换操作
					
					// 选择中的车辆品牌
					_this.carBrand = carInfor.Brand; 

					// 选择中的车型品牌的型号
					_this.carSeries = carInfor.Series; 
					_this.initCarSeries(carInfor.Brand, carInfor.Series);
					
					// 选择中的车型年份
					_this.carYears = carInfor.ListingYear; 
					_this.initCarYears(carInfor.Series, carInfor.ListingYear);
					
					// 选择中的车辆具体型号
					_this.carYearModel = carInfor.SalesName; 
					_this.initCarYearModel(carInfor.Series, carInfor.ListingYear, carInfor.SalesName);
				});
			}
		},

		/**
		 * 表单校验
		 */
		verifyAll: function verifyAll() {
			// 校验车牌 省份
			
			if (this.plateNo.length === '') {
				return utils.consequencer.error('车牌号码不能为空!');
			} else if (this.plateNo.length !== 5 && this.plateNo.length !== 6) {
				return utils.consequencer.error('车牌号码有误!');
			}

			// 校验车架号码
			if (this.platVin.length ===  '') {
				return utils.consequencer.error('车架号码不能为空!');
			} else if (this.plateNo.length !==  17) {
				return utils.consequencer.error('车牌号码有误!');
			}
			
			// 校验 车辆品牌
			if (this.carBrand === '') {
				return utils.consequencer.error('请选择车辆品牌!');
			}
			
			// 校验 车型品牌的型号
			if (this.carSeries === '') {
				return utils.consequencer.error('请选择车型品牌的型号!');
			}
			
			// 校验 车型年份
			if (this.carYears === '') {
				return utils.consequencer.error('请选择车型年份!');
			}
			
			// 校验 车辆具体型号
			if (this.carYearModel === '') {
				return utils.consequencer.error('请选择车辆具体型号!');
			}

			return utils.consequencer.success();
		},

		/**
		 * 注册提交按钮
		 */
		registerSubmit: function registerSubmit() {
			// 表单校验
			var myVerifyAll = this.verifyAll();
			if (myVerifyAll.result !== 1) {
				alert(myVerifyAll.message);
			}

			// 判断页面状态
			if (this.pageType === '注册状态') {
				ajaxs.register(
					this.carNoProvince + this.plateNo, // 车牌号
					this.platVin, // 车架号
					this.carBrand, // 品牌
					this.carSeries, // 型号
					this.carYears, // 年份
					this.carYearModel // 车辆具体型号
				)
			}
		},

		/**
		 * 暂不添加
		 */
		notToRegister: function notToRegister() {
			ajaxs.register()
			.then(function () {
				alert('成功')
			}, function (error) {
				alert('失败');
			})
		},
	},

	watch: {
		/**
		 * 监听选择中的 车型品牌的型号
		 */
		carSeries: function carSeries(newCarSeries, oldCarSeries) {
			// 车型品牌的型号 为空的时候, 表示清空操作
			// 清空操作不执行任何请求
			if (newCarSeries === '') {
				return false;
			}

			// 通过VIN查询公众接口获取车型列表
			if (this.isPlatExchange) {
				return false;
			}
			
			/**
			 * 清空数据
			 */
			this.carYears = '';
			this.yearsList = [];
			this.carYearModel = '';
			this.yearModelList = [];
	
			// 初始化 车型年份 列表
			this.initCarYears(newCarSeries);
		},

		/**
		 * 监听选择中的 选择中的车型年份
		 */
		carYears: function carYears(newCarYears, oldCarYears) {
			// 车型品牌的型号 为空的时候, 表示清空操作
			// 清空操作不执行任何请求
			if (newCarYears === '') {
				return false;
			}

			// 通过VIN查询公众接口获取车型列表
			if (this.isPlatExchange) {
				return false;
			}

			/**
			 * 清空数据
			 */
			this.carYearModel = '';
			this.yearModelList = [];
	
			// 获取 车辆具体型号 列表
			this.initCarYearModel(this.carSeries, newCarYears);
		},
	}
}

// 抽象的方法
var utils = {
	// 获取URL参数
	loadPageVar: function loadPageVar(sVar) {
		return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	},

	// 封装
	consequencer: {
		/**
		 * 请求成功
		 * @param {any} data 返回成功的数据封装
		 * @param {string} message 返回成功的信息封装
		 * @return {any} 成功封装的结果
		 */
		success: function success(data, message) {
			return {
				result: 1,
				data: data || null,
				message: message || 'success'
			}
		},

		/**
		 * 请求失败
		 * @param {string} message 返回失败的信息封装
		 * @param {number} result 返回失败的数据封装
		 * @param {any} data 返回失败的数据封装
		 * @return {any} 失败封装的结果
		 */
		error: function error(message, result, data) {
			return {
				result: result || 0,
				data: data || null,
				message: message
			}
		},
	},
};
