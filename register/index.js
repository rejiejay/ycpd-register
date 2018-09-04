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
				// 车辆品牌车系链接
				carBrandSeries: 'http://store.demo.ichebaoyang.com/wx/Handler.ashx',
			}
		}

	} else {
		// 线上生产环境
		return {
			url: {
				origin: 'http://ycpdapi.hotgz.com', // 请求源(服务器地址)
				// 车辆品牌车系链接
				carBrandSeries: '/wx/Handler.ashx',
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
			{
				path: '/', // 注册
				component: VmMain,
				meta: { title: '注册' },
			},{
				path: '/agreement', // 用户协议页
				component: VmAgreement,
				meta: { title: '养车频道用户服务协议' },
			}, { // 我的车辆列表
				path: '/mycar',
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
				url: config.url.carBrandSeries,
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
     * 获取 品牌型号 列表
	 * @param {String} brand 车辆品牌 
     */
	getSeries: function getSeries(brand) {
		Vue.prototype.$indicator.open('正在加载数据...');

		return new Promise(function (resolve, reject) {
			var form = new FormData();
			form.append("action", "GetSeries");
			form.append("brand", brand);
			
			$.ajax({
				url: config.url.carBrandSeries,
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
		 * 获取验证码
		 */
		verifyNumberHandle: function verifyNumberHandle() {
			const _this = this;

			// 判断是否正在获取验证码
			if (this.isVerifyGeting === false) {
				this.isVerifyGeting = true; // 表示正在获取
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
			}
		},

		/**
		 * 跳转到 养车频道用户服务协议
		 */
		jumpToAgreement: function jumpToAgreement() {
			this.$router.push({ path: '/agreement' });
		},

		/**
		 * 获取验证码
		 */
		submitRegister: function submitRegister() {
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
			 * 车系
			 */ 
			carSeries: '', // 选择中的车系
			seriesList: [ // 选择中的车系
				// 'X6'
			],
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
		 * 选择 车辆品牌
		 * 并且初始化 series 车系号
		 */
		selectCarBrand: function selectCarBrand(item) {
			var _this = this;

			this.brandModalVisible = false; // 模态框
			this.carBrand = item;
			
			ajaxs.getSeries(item) // 获取车系号
			.then(function (series) {
				_this.seriesList = series.map(function (item) {
					return item.brandSeriesName
				})
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
};
