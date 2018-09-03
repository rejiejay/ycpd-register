window.onload = function () {
	init.main();
};

// 配置类
var config = (function () { // 匿名函数自执行
	// 判断是否测试环境	
	if (window.location.origin === 'file://' || window.location.host === 'store.demo.ichebaoyang.com') {
		// 测试环境
		return {

		}

	} else {
		// 线上生产环境
		return {

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
			}, { // 我的车辆列表
				path: '/mycar',
				component: VmMyCar,
				meta: { title: '我的车辆' },
			}, { // 完善车辆信息
				path: '/supplement',
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
     * 测试请求
     * @param {string} pageNo 分页
     */
	test: function test() {
		var _this = this;

		// var result = { // 测试数据
		// 	"message": "请求成功",
		// };

		Vue.prototype.$indicator.open('正在加载数据...');
		return new Promise(function (resolve, reject) {

			// resolve(result.stores); // 返回测试数据

			$.get("/api/storeCarWash")
				.done(function (data) {
					Vue.prototype.$indicator.close();
					if (data && data.code == 200) {
						resolve(data.stores);
					} else {
						reject('向服务器发起请求成功，但是查找所有获取门店列表数据有误, 原因: ' + JSON.stringify(data));
					}
				}).fail(function (data) {
					Vue.prototype.$indicator.close();
					reject('向服务器发起请求查找所有获取门店列表失败, 原因: ' + JSON.stringify(data));
				});
		});
	},
};

var VmMain = { // 注册 Vue类
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
		}
	},
};

var VmMyCar = { // 完善车辆信息 Vue类
	template: '#mycar',

	data: function data() {
		return {
		}
	},

	mounted: function mounted() {
	},

	methods: {

	}
}

var VmSupplement = { // 完善车辆信息 Vue类
	template: '#supplement',

	data: function data() {
		return {
			// 车牌号省份
			carNoProvince: '粤',

			// 车牌号码
			plateNo: '', 

			// 实例 (车牌选择) 
			myCarKeyBoard: function () {}, 

			// 驾驶证
			dialogTip: false,
		}
	},

	mounted: function mounted() {
        var _this = this;
		
		// 实例化 车牌选择
		this.myCarKeyBoard = new CarKeyBoard({bindInputDom: 'ycpd-carplateid-input'});

		// 绑定 车牌号码输入
        this.myCarKeyBoard.succeedHandle(function (result) {
            _this.plateNo = result;
		});
	},

	methods: {
		/**
		 * 选择省份
		 */
		selectProvince: function selectProvince() {
            var _this = this;

            this.myCarKeyBoard.showProvincesKeyboard()
            .then(function (value) {
				_this.carNoProvince = value;
            }, function (cancel) {
				console.log('取消选择省份');
            });
		}
	}
}

// 抽象的方法
var utils = {
	// 获取URL参数
	loadPageVar: function loadPageVar(sVar) {
		return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	},
};

// 抽象的方法
var utils = {
	// 获取URL参数
	loadPageVar: function loadPageVar(sVar) {
		return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	},
};
