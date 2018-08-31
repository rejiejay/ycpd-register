window.onload = function () {
	init.main();
};

// 配置类
var config = (function () { // 匿名函数自执行
	// 判断是否测试环境	
	if ( window.location.origin === 'file://' || window.location.host === 'store.demo.ichebaoyang.com' ) {
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
				path: '/', 
				component: VmMain
			}, { 
				path: '/supplement', 
				component: VmSupplement
			}
        ];

		// 初始化路由配置
        var router = new VueRouter({ 
          routes: routes
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
		return {};
	},

	mounted: function mounted() {},

	methods: {},
};

var VmSupplement = { // 完善车辆信息 Vue类
	template: '#supplement',

	data: function data() {
		return {
		}
	},

	mounted: function mounted() {
	},

	methods: {

	}
}

// 抽象的方法
var utils = {
	// 获取URL参数
    loadPageVar: function loadPageVar(sVar) {
        return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    },
};
