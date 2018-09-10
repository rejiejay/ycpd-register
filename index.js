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
				origin: 'http://store.demo.ichebaoyang.com', // 请求源(服务器地址)
				// 车辆品牌车系以及短信验证码
				carBrandSeriesCode: 'http://store.demo.ichebaoyang.com/wx/Handler.ashx',
				/**
				 * 获取手机验证码
				 * http://api.demo.hotgz.com/ 找不到与请求 URI“http://localhost:85/Customer/GetVerifyCode”匹配的 HTTP 资源。
				 * http://store.demo.ichebaoyang.com/ 应用程序“YCPD_WX_JSZX”中的服务器错误, 暂时用下面这个
				 */
				getMobileCode: 'http://ycpdapi.hotgz.com/Customer/GetVerifyCode',
			}
		}

	} else {
		// 线上生产环境
		return {
			url: {
				origin: 'http://ycpdapi.hotgz.com', // 请求源(服务器地址)
				// 车辆品牌车系以及短信验证码
				carBrandSeriesCode: '/wx/Handler.ashx',
				// 获取手机验证码
				getMobileCode: 'http://ycpdapi.hotgz.com/Customer/GetVerifyCode',
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
             * @param {String} openid 用户标识 o9rEN0_rX4ySFsIbKi5MBL8YGnAg
			 */
			{
				path: '/:openid', // 注册
				component: VmMain,
				meta: { title: '注册' },
			}, {
				path: '/agreement', // 用户协议页
				component: VmAgreement,
				meta: { title: '养车频道用户服务协议' },
			}, 
			/**
			 * 我的车辆列表
             * @param {String} openid 用户标识 o9rEN0_rX4ySFsIbKi5MBL8YGnAg
			 */
			{ // 我的车辆列表
				path: '/mycar/:openid',
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
	 * @param {String} Jigsaw 图形验证码移动的距离
     */
	getMobileCode: function getMobileCode(Mobile, Jigsaw) {
		Vue.prototype.$indicator.open('正在加载数据...');

		return new Promise(function (resolve, reject) {
			$.ajax({
				url: config.url.getMobileCode,
				type: "POST",
				dataType : 'json',
				data: {
					Mobile: Mobile,
					Jigsaw: Jigsaw,
				},
				success: function(res){
					Vue.prototype.$indicator.close();
					if (res && res.Code === 200) {
						resolve(res);
					} else {
						reject('向服务器发起请求短信验证码成功, 但是数据有误!');
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Vue.prototype.$indicator.close();
					reject('向服务器发起请求短信验证码失败, 原因: ' + errorThrown);
				}
			});
		});
	},
};

/**
 * Vue类
 * 注册页面
 */
var VmMain = {
	template: '#register',

	data: function data() {
		return {
			// 手机号码
			phoneValue: '',

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

	mounted: function mounted() { },

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
			const _this = this;

			// 校验手机号码
			if (this.verifyPhoneValue().result !== 1) {
				return alert(this.verifyPhoneValue().message);
			}

			// 判断是否正在获取验证码
			if (this.isVerifyGeting === false) {
				// 图形验证码移动的距离 暂时为零
				ajaxs.getMobileCode(this.phoneValue, 0)
				.then(function () {
					_this.isVerifyGeting = true; // 表示正在获取
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
			}
		},

		/**
		 * 跳转到 养车频道用户服务协议
		 */
		jumpToAgreement: function jumpToAgreement() {
			this.$router.push({ path: '/agreement' });
		},

		/**
		 * 校验验证号码是否正确
		 * 并且跳转到下一页
		 */
		submitRegister: function submitRegister() {

			// 校验手机号码
			if (this.verifyPhoneValue().result !== 1) {
				return alert(this.verifyPhoneValue().message);
			}

			// 校验验证码
			if (this.verifyNumber.length !== 6) {
				return alert('请输入正确格式验证码!');
			}

			// 用户协议
			if (this.isAgreement === false) {
				return alert('请同意用户协议!');
			}

			this.$router.push({ path: '/supplement/register' });
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
				{
					carNo: '粤B12345', // 车牌号
					carType: '比亚迪-泰', // 车牌号
					isDefault: true, // 是否默认
				}, {
					carNo: '粤B12345', // 车牌号
					carType: '比亚迪-泰', // 车牌号
					isDefault: false, // 是否默认
				}
			],
		}
	},

	mounted: function mounted() {
	},

	methods: {
		/**
		 * 编辑 车辆信息
		 */
		jumpToEditor: function jumpToEditor() {
			this.$router.push({ path: '/supplement/editor' });
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

		// 实例化 车牌选择
		this.myCarKeyBoard = new CarKeyBoard({bindInputDom: 'ycpd-carplateid-input'});

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
			var _this = this;

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
			
			ajaxs.getSeries(item) // 获取车系号
			.then(function (series) {
				_this.seriesList = series.map(function (item) {
					return item.brandSeriesName
				});
			}, function (error) {
				alert(error);
			});
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
		}
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
			const _this = this;

			/**
			 * 清空数据
			 */
			this.carYears = '';
			this.yearsList = [];
			this.carYearModel = '';
			this.yearModelList = [];
	
			ajaxs.getCarYears(newCarSeries) // 获取 车型年份 列表
			.then(function (years) {
				_this.yearsList = years.map(function (item) {
					return item.yearNames
				});
			}, function (error) {
				alert(error);
			});
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
			const _this = this;

			/**
			 * 清空数据
			 */
			this.carYearModel = '';
			this.yearModelList = [];
	
			ajaxs.getCarYearModel(this.carSeries, newCarYears) // 获取 车辆具体型号 列表
			.then(function (carYearModel) {
				_this.yearModelList = carYearModel.map(function (item) {
					return item.yearModel
				});
			}, function (error) {
				alert(error);
			});
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
