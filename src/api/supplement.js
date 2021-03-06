import config from "./../config/index";
import { Indicator } from 'mint-ui';

export default {
	/**
     * 获取 车辆品牌 列表
     */
	getBrand: function getBrand(Name) {
		return new Promise(function (resolve, reject) {
			var form = new FormData();
			form.append("action", "GetBrand");
			form.append("Name", Name);
			
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
						// reject('向服务器发起请求查找车辆品牌列表成功, 但是数据有误!');
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					reject('未找到此车辆品牌');
				}
			});
		});
	},

    /**
     * 获取 车型品牌的型号 列表
	 * @param {String} brand 车辆品牌 
     */
	getSeries: function getSeries(brand) {
		Indicator.open('正在加载数据...');

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
					Indicator.close();
					if (res && res instanceof Array && res.length > 0) {
						resolve(res);
					} else {
						reject('未找到该品牌车系');
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Indicator.close();
					// reject('向服务器发起请求查找品牌型号失败, 原因: ' + errorThrown);
				}
			});
		});
	},

    /**
     * 获取 车型年份 列表
	 * @param {String} series 车型品牌的型号名称 
     */
	getCarYears: function getCarYears(series) {
        Indicator.open('正在加载数据...');

		/**
		 * 因为 车型现在以 Session 来保存 
		 * 而本地环境是没有 Session 的, 所以返回死数据
		 */
		if (window.location.hostname === 'localhost' || window.location.origin === 'file://') {
			return new Promise(function (resolve, reject) {
				resolve([{"yearNames":"2016"}, {"yearNames":"2015"}, {"yearNames":"2014"}, {"yearNames":"2013"}, {"yearNames":"2012"}, {"yearNames":"2011"}, {"yearNames":"2010"}, {"yearNames":"2009"}, {"yearNames":"2008"}, {"yearNames":"2007"}, {"yearNames":"2006"}, {"yearNames":"2005"}, {"yearNames":"2004"}, {"yearNames":"2003"}, {"yearNames":"2000"}, {"yearNames":"1999"}, {"yearNames":"1998"}, {"yearNames":"1997"}, {"yearNames":"1996"}, {"yearNames":"1995"}, {"yearNames":"1994"}, {"yearNames":"1992"}]);
			});
		} else {
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
						Indicator.close();
						if (res && res instanceof Array && res.length > 0) {
							resolve(res);
						} else {
							// reject('向服务器发起请求车型年份列表成功, 但是数据有误!');
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Indicator.close();
						// reject('向服务器发起请求车型年份列表失败, 原因: ' + errorThrown);
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
		if (window.location.hostname === 'localhost' || window.location.origin === 'file://') {
			return new Promise(function (resolve, reject) {
				resolve([{"yearModel":"740Li 3.0T 手自一体 豪华型"}, {"yearModel":"740Li 3.0T 手自一体 领先型"}, {"yearModel":"740Li 3.0T 手自一体 尊享型"}, {"yearModel":"750LixDrive 4.4T 手自一体 四座版"}, {"yearModel":"750LixDrive 4.4T 手自一体 五座版"}]);
			});
		} else {
			Indicator.open('正在加载数据...');

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
						Indicator.close();
						if (res && res instanceof Array && res.length > 0) {
							resolve(res);
						} else {
							// reject('向服务器发起请求车辆具体型号列表成功, 但是数据有误!');
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Indicator.close();
						// reject('向服务器发起请求车辆具体型号列表失败, 原因: ' + errorThrown);
					}
				});
			});
		}
	},

    /**
     * 通过VIN查询公众接口获取车型列表
	 * @param {String} vin Vehicle Identification Number（车辆识别码） 
     */
	getCarModelByVin: function getCarModelByVin(vin) {
		Indicator.open('正在加载数据...');

		return new Promise(function (resolve, reject) {
			$.get(config.url.getCarModelByVin, {vin: vin, openid: window.localStorage.openid}, function(response, status, xhr) {
				Indicator.close();
				if (response && response.Code === 200 && response.Msg === "" && response.Data instanceof Array && response.Data.length > 0) {
					resolve(response.Data[0]);
				} else {
					reject('获取车辆具体型号列表失败,请手动选择');
				}
			});
		});
	},

    /**
     * 车主注册【这个已经废弃】
	 * 以后不要这么传参数，传一个 对象的可控性比较高
	 * @param {String} CarNo 车牌号
	 * @param {String} CarType 车牌类型
	 * @param {String} VinNo 车架号
	 * @param {String} Brand 品牌
	 * @param {String} Series 车系
	 * @param {String} Years 年份
	 * @param {String} Model 车型
	 * 
	 * @param {String} userinfo.city 所在城市
	 * @param {String} userinfo.openid 用户标识
	 * @param {String} userinfo.mobile 手机号码
	 * @param {String} userinfo.verifyCode 手机验证码
     */
	register: function register(userinfo, CarNo, CarType, VinNo, Brand, Series, Years, Model) {
		var OpenID = userinfo.openid;
		var Mobile = userinfo.mobile;
		var VerifyCode = userinfo.verifyCode;
		var City = userinfo.city;

		Indicator.open('正在加载数据...');

		// 暂不添加的情况
		var submitData = {
			OpenID: OpenID,
			Mobile: Mobile,
			VerifyCode: VerifyCode,
			City: City,
			CarNo: CarNo, // 不管注册不注册都需要携带 车牌
			CarType: CarType, // 不管注册不注册都需要携带 车牌
		}

		// 所有信息
		if (CarNo && Brand && Series && Years && Model) {
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
					Indicator.close();
					if (res && res.Code === 200 && res.Msg === '') {
						resolve(res);
					} else {
						reject('注册失败，原因:' + res.Msg);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Indicator.close();
					reject('向服务器发起请求车主注册失败, 原因: ' + errorThrown);
				}
			});
		});
	},

    /**
     * 添加/编辑车主汽车
	 * @param {String} customerid 养车频道 用户标识
	 * @param {String} CarID 车唯一标识 存在表示 编辑 false 表示新增
	 * @param {String} CarNo 车牌号
	 * @param {String} CarType 车牌类型
	 * @param {String} VinNo 车架号
	 * @param {String} Brand 品牌
	 * @param {String} Series 车系
	 * @param {String} Years 年份
	 * @param {String} Model 车型
	 * @param {boolean} IsDefault 是否默认
     */
	saveCar: function saveCar(customerid, CarID, CarNo, CarType, VinNo, Brand, Series, Years, Model, IsDefault) {
		Indicator.open('正在提交数据...');
		// 所有信息
		var submitData = {
			CarNo: CarNo,
			CarType: CarType, // 车牌类型
			VIN: VinNo,
			Brand: Brand,
			Series: Series,
			Years: Years,
			Model: Model,
			CustomerID: customerid,
			IsDefault: IsDefault ? 1 : 0, 
		}

		// 存在表示 编辑
		if (CarID) {
			submitData.CarID = CarID;
		}

		return new Promise(function (resolve, reject) {
			$.ajax({
				url: config.url.saveCar,
				type: "POST",
				dataType : 'json',
				data: submitData,
				success: function(res){
					Indicator.close();
					if (res && res.Code === 200 && res.Msg === '') {
						resolve(res);
					} else {
						reject('添加/编辑失败，原因:' + res.Msg);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					Indicator.close();
					reject('向服务器发起请求车主添加/编辑失败, 原因: ' + errorThrown);
				}
			});
		});

	},
};
