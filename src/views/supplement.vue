<!-- 注册页面 -->
<template>
<div class="supplement">
   
    <!-- 车牌号 -->
    <div class="supplement-input-list supplement-carNo">
        <div class="input-list-content">
            
            <carNoInput ref="carNoComponent" @outPutHandle="carNoHandle" />

        </div>
    </div>

    <!-- 车辆型号 -->
    <div class="supplement-input-list supplement-carType">
        <div class="supplement-input-title">车辆型号</div>
        <div class="input-list-content">
            <div class="input-item flex-start">
                <div class="input-item-title">车架号码:</div>
                <div class="input-item-main flex-rest flex-start-center">
                    <input v-model="platVin" v-on:blur="platVinExchange" class="item-rigth-input"  style="text-transform: uppercase" placeholder="请输入车架号码" />
                </div>
                <div class="input-item-tip flex-start-center" @click="dialogTip = true;">
                    <svg t="1530501234558" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2537" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        width="20" height="20">
                        <path d="M510.827291 64.041572c247.095701 0.027629 448.76684 201.816448 448.279746 448.541713-0.490164 247.641123-201.838961 448.843588-448.570365 448.240861-247.462045-0.603751-447.696462-200.955848-448.02392-448.288956C62.184271 265.653359 263.742846 64.013943 510.827291 64.041572zM916.774907 512.36532C916.739091 288.773939 735.657896 107.047038 511.049349 106.58655c-223.89121-0.458441-405.925103 181.25311-406.15944 405.79105-0.233314 223.61287 181.448562 405.16581 405.673369 405.804353C733.898833 918.818449 916.810722 736.084615 916.774907 512.36532zM535.794939 657.30027c-19.142989 0-37.775348 0-56.938803 0 0-11.373025-0.607844-22.537296 0.127913-33.612539 1.484817-22.364357 6.65763-43.814901 18.343787-63.300698 9.094122-15.164375 20.674878-28.250414 33.540907-40.276309 15.978926-14.935154 32.148188-29.677926 47.809889-44.939515 9.222035-8.985652 17.418718-19.008936 21.679765-31.483038 10.207479-29.883611 3.681856-56.56939-16.198937-80.3367-33.015951-39.469943-88.2356-40.821731-122.050754-21.066805-21.313422 12.450567-34.092469 31.502481-41.552371 54.414307-3.344165 10.271948-5.653767 20.880563-8.651031 32.155351-19.651572-2.333138-39.766702-4.721535-60.636009-7.198959 0.778736-5.205559 1.336438-10.100032 2.26253-14.923898 5.196349-27.060309 14.589276-52.297087 32.253588-73.943083 21.519106-26.369577 49.554626-41.723264 82.579787-48.061622 34.471093-6.615675 68.919672-5.901407 102.44216 4.986571 42.920532 13.939477 74.679863 41.176818 89.112574 84.563978 13.856589 41.654702 7.048533 81.003895-20.22667 116.155487-17.302061 22.298865-38.820144 40.415478-59.041698 59.83169-8.895601 8.541537-17.895579 17.136286-25.622564 26.696012-11.477402 14.198374-15.858176 31.370475-17.241686 49.325405C537.00551 636.422777 536.474414 646.580115 535.794939 657.30027zM475.157907 777.74034c0-22.494317 0-44.771693 0-67.411319 22.538319 0 44.810578 0 67.458391 0 0 22.425755 0 44.709271 0 67.411319C520.208962 777.74034 497.807766 777.74034 475.157907 777.74034z" p-id="2538" 
                            fill="#26a2ff">
                    </path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 车辆型号 提示信息 -->
    <div class="dialog-tip flex-center" v-bind:class="{'dialog-tip-deny' : (dialogTip === false)}">
        <div class="dialog-tip-shade" @click="dialogTip = false;" ></div>

        <div class="dialog-tip-content">
            <div class="dialog-tip-img">
                <img alt="驾驶证" src="https://ycpd-assets.oss-cn-shenzhen.aliyuncs.com/ycpd/business/icon/drivinglicence.png">
            </div>
        </div>
    </div>

    <!-- 品牌车系年份车型等 -->
    <div class="supplement-input-list series-year-model">
        <div class="supplement-input-title">输入车架号可为您自动解析车辆型号</div>
        <div class="input-list-content" id="car">

            <!-- 品牌 -->
            <div class="input-item flex-start"
                @click="showBrandList"
            >
                <div class="input-item-title">品&ensp;&ensp;&ensp;&ensp;牌:</div>
                <div class="input-item-main flex-rest"
                    v-bind:class="{'item-show-placeholder' : (carBrand === '')}"
                >
                    {{ carBrand === '' ? '请选择车辆品牌' : carBrand}}
                </div>
                <div class="input-item-icon flex-start-center">
                    <svg width="18" height="18" t="1530499422424" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" xmlns:xlink="http://www.w3.org/1999/xlink" >
                        <path fill="#C0C4CC" d="M325.399273 235.124364L600.157091 488.727273 325.399273 742.353455a34.909091 34.909091 0 1 0 47.36 51.316363l302.545454-279.272727a34.909091 34.909091 0 0 0 0-51.316364l-302.545454-279.272727a34.909091 34.909091 0 1 0-47.36 51.316364" p-id="1465"></path>
                    </svg>
                </div>
            </div>
            <!-- <div class="input-line"></div> -->
            
            <!-- 车系 -->
            <div class="input-item flex-start">
                <div class="input-item-title">车&ensp;&ensp;&ensp;&ensp;系:</div>

                <!-- 当车系列表为空时候, 显示placeholder占位符 -->
                <div v-if="seriesList.length === 0" class="input-item-main flex-rest item-show-placeholder" @click="selectTip">请选择车辆车系</div>
                
                <div v-else class="input-item-main flex-rest input-item-select"
                    v-bind:class="{'item-show-placeholder' : (carSeries === '')}"
                >
                    <select  v-model="carSeries" @click="isPlatExchange = false;">
                        <option value="" disabled :selected="carSeries === ''" hidden>请选择车辆车系</option>
                        <option 
                            v-for="(series, key) in seriesList" 
                            :key="key"
                            :value="series"
                        >{{series}}</option>
                    </select>
                </div>
                <div class="input-item-icon flex-start-center">
                    <svg width="18" height="18" t="1530499422424" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" xmlns:xlink="http://www.w3.org/1999/xlink" >
                        <path fill="#C0C4CC" d="M325.399273 235.124364L600.157091 488.727273 325.399273 742.353455a34.909091 34.909091 0 1 0 47.36 51.316363l302.545454-279.272727a34.909091 34.909091 0 0 0 0-51.316364l-302.545454-279.272727a34.909091 34.909091 0 1 0-47.36 51.316364" p-id="1465"></path>
                    </svg>
                </div>
            </div>
            <!-- <div class="input-line"></div> -->
            
            <!-- 年份 -->
            <div class="input-item flex-start">
                <div class="input-item-title">年&ensp;&ensp;&ensp;&ensp;份:</div>

                <!-- 当车型年份列表为空时候, 显示placeholder占位符 -->
                <div v-if="yearsList.length === 0" class="input-item-main flex-rest item-show-placeholder" @click="selectTip">请选择车辆年份</div>

                <div v-else class="input-item-main flex-rest input-item-select"
                    v-bind:class="{'item-show-placeholder' : (carYears === '')}"
                >
                    <select v-model="carYears" @click="isPlatExchange = false;">
                        <option value="" disabled :selected="carYears === ''" hidden>请选择车辆车系</option>
                        <option 
                            v-for="(years, key) in yearsList" 
                            :key="key"
                            :value="years"
                        >{{years}}</option>
                    </select>
                </div>
                <div class="input-item-icon flex-start-center">
                    <svg width="18" height="18" t="1530499422424" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" xmlns:xlink="http://www.w3.org/1999/xlink" >
                        <path fill="#C0C4CC" d="M325.399273 235.124364L600.157091 488.727273 325.399273 742.353455a34.909091 34.909091 0 1 0 47.36 51.316363l302.545454-279.272727a34.909091 34.909091 0 0 0 0-51.316364l-302.545454-279.272727a34.909091 34.909091 0 1 0-47.36 51.316364" p-id="1465"></path>
                    </svg>
                </div>
            </div>
            <!-- <div class="input-line"></div> -->
            
            <!-- 车型 -->
            <div class="input-item flex-start">
                <div class="input-item-title">车&ensp;&ensp;&ensp;&ensp;型:</div>

                <!-- 当车辆具体型号列表为空时候, 显示placeholder占位符 -->
                <div v-if="yearModelList.length === 0" class="input-item-main flex-rest item-show-placeholder" @click="selectTip">请选择车辆车型</div>

                <div v-else class="input-item-main flex-rest input-item-select"
                    v-bind:class="{'item-show-placeholder' : (carYearModel === '')}"
                >
                    <select v-model="carYearModel">
                        <option value="" disabled :selected="carYearModel === ''" hidden>请选择车辆车系</option>
                        <option 
                            v-for="(yearModeItem, key) in yearModelList" 
                            :key="key"
                            :value="yearModeItem"
                        >{{yearModeItem}}</option>
                    </select>
                </div>
                <div class="input-item-icon flex-start-center">
                    <svg width="18" height="18" t="1530499422424" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" xmlns:xlink="http://www.w3.org/1999/xlink" >
                        <path fill="#C0C4CC" d="M325.399273 235.124364L600.157091 488.727273 325.399273 742.353455a34.909091 34.909091 0 1 0 47.36 51.316363l302.545454-279.272727a34.909091 34.909091 0 0 0 0-51.316364l-302.545454-279.272727a34.909091 34.909091 0 1 0-47.36 51.316364" p-id="1465"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- 择车辆品牌模态框 -->
    <div class="car-brand-modal" v-if="brandModalVisible">
        <!-- 头部 -->
         <div id="listTop"></div>
         <!-- 搜索框 -->
        <form id="search_box" action="javascript:return true;">
           <input id="myinput" type="search" v-model="searchName"  @keyup.13="search()" ref="input1" placeholder="输入关键字搜索">
           <img class="icon_search" src="../assets/img/icon_search@2x.png">
        </form>
        <!-- <mt-header title="择车辆品牌">
          
        </mt-header> -->
        <img  @click="hidebrandModalVisible" id="back" src="../assets/img/返回@2x.png" alt="">
        <img @click="goTop" id="goTop" src="../assets/img/top@2x.png" alt="">
        <!-- 选择列表 -->
        <div class="brand-modal-group"
            v-for="(group, groupKey) in brandGroup" 
            :key="groupKey"
        >
            <div class="modal-group-title">{{group.title}}</div>

            <div class="modal-group-list">
                <div class="group-list-content">
                    <div class="modal-group-item flex-start-center"
                        v-for="(item, key) in group.list" 
                        :key="key"
                        v-bind:class="{'item-bottom-line' : ((key + 1) !== group.list.length)}"
                        @click="selectCarBrand(item)"
                    >
                        <div class="group-item-main flex-rest">{{item}}</div>

                        <div class="group-item-icon flex-center">
                            <svg width="18" height="18" t="1530499422424" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" xmlns:xlink="http://www.w3.org/1999/xlink" >
                                <path fill="#C0C4CC" d="M325.399273 235.124364L600.157091 488.727273 325.399273 742.353455a34.909091 34.909091 0 1 0 47.36 51.316363l302.545454-279.272727a34.909091 34.909091 0 0 0 0-51.316364l-302.545454-279.272727a34.909091 34.909091 0 1 0-47.36 51.316364" p-id="1465"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 是否为默认车辆  如果是注册流程, 则不渲染这个按钮 -->
    <div class="is-setting-default" v-if="pageType !== 'register'">
        <div class="setting-default-content flex-start-center">
            <div  id="cesi" class="setting-default-main flex-rest">是否设为默认车辆</div>
            <span>{{isDefaultSetting ? '是' : '否'}}</span>
            <div class="setting-default-switch">
                <label for="switch-cp" class="weui-switch-cp">
                    <input :disabled='isDefaultDisabled' v-model="isDefaultSetting" id="switch-cp" ref="settingDefault" class="weui-switch-cp__input" type="checkbox">
                    <div class="weui-switch-cp__box"></div>
                </label>
            </div>
        </div>
    </div>

    <!-- 确认 -->
    <div class="submit-button submit-affirm">
        <div class="submit-button-content" @click="registerSubmit">确认</div>
    </div>

    <!-- 暂不添加
    如果是注册流程, 则渲染这个按钮 -->
    <div class="submit-button submit-cancel" v-if="pageType === 'register'">
        <div class="submit-button-content" @click="notToRegister">暂不添加</div>
    </div>
</div>
</template>

<script>

// 框架类
import { Toast } from 'mint-ui'
// 配置类
import config from '@/config/index.js'
// 请求类
import ajaxs from "@/api/supplement";
// 自定义组件类
import Consequencer from "@/utils/Consequencer";2
import html5WxBMapLocation from "@/components/html5WxBMapLocation.js";
import carNoInput from "@/components/carNoInput";

export default {
    name: 'supplement',

    components: { carNoInput },

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
            carNoComponents: { // 车牌组件来的数据
                verify: false,
                message: '',
                carNo: '粤',
                carNoProvince: '粤',
                plateNo: '',
                carType: '',
            },
			carNoProvince: '粤', // 车牌号省份
			plateNo: '',  // 车牌号码

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
            isDefaultSetting: true,
            isDefaultDisabled: false, // 是否可以修改默认车辆， 有些情况是不可修改的，例如只有一辆的情况下

            //搜索名
            searchName:''
		}
    },

    computed: {
        /**
         * 顶层 vuex 用户信息
         */
        userinfo: function userinfo() {
            return this.$store.getters.statesGetters;
        }
    },

	mounted: function mounted() {
        // console.log(this.userinfo)
		let _this = this;
		
		// 页面状态 初始化
		this.pageType = this.$route.params.pageType;
            
        // 初始化页面数据
        let query = this.$route.query;


		// 判断 页面是否 编辑状态
		if (this.pageType === 'editor') {

            // 初始化 车牌组件的车牌号
            this.carNoComponents.carNo = query.CarNo;
			this.$refs.carNoComponent.initPlateNoHandle(query.CarNo, query.CarType);

			this.platVin = query.VIN; // 车架号码
			
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
			this.carYearModel = query.Model; 
            this.initCarYearModel(query.Series, query.Years, query.Model);
            
            // 设置默认车辆
            this.isDefaultSetting = (query.IsDefault === 1);
            // 判断是否可以修改默认车辆
            if ( query.IsDefault == '1' ) {
                this.isDefaultDisabled = true;
            }
        
		} else if (this.pageType === 'register') { // 判断是否注册页面跳转进来
            // 初始化 车牌组件的车牌号
            this.carNoComponents.carNo = query.carNoComponents;
			this.$refs.carNoComponent.initPlateNoHandle(query.carNo, query.carType);
        }
	},

	methods: {
        /**
         * 弹出车型品牌列表 模态框
         */
        showBrandList: function showBrandList() {
            this.brandModalVisible = true;
            // 初始化 车辆品牌 列表
            this.initCarBrand();
        },

        /**
         * 隐藏车型品牌列表 模态框
         */
        hidebrandModalVisible: function hidebrandModalVisible() {
            this.brandModalVisible = false;
            this.searchName = '';
            this.initCarBrand();
        },

		/**
		 * 初始化 车辆品牌 列表
		 */
		initCarBrand: function initCarBrand() {
            var _this = this;

			ajaxs.getBrand(this.searchName)
			.then(function (brandGroup) {
				_this.brandGroup = brandGroup.map(function (brand) {
					return {
						title: brand.Group,
						list: brand.Brands.split(','),
					}
				});
			}, function (error) {
				Toast({ message: error, duration: 1500 });
                _this.brandGroup = [];
			});
        },
        
        /**
         * 从车牌输入的组件获取车牌号
         */
        carNoHandle: function carNoHandle(data) {
            this.carNoComponents = data;
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
				this.carSeries = '';
                this.seriesList = [];
                this.carYears = '';
                this.yearsList = [];
                this.carYearModel = '';
                this.yearModelList = [];

				ajaxs.getCarModelByVin(this.platVin) // 查询失败不做处理
				.then(function (carInfor) {
                    if(carInfor.Matching=='True'){
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
                    } else {
                        return alert('解析出现错误, 请手动选择!');
                    }
				});
			}
		},

		/**
		 * 表单校验
		 */
		verifyAll: function verifyAll() {
			// 校验车牌 省份
			// if (this.plateNo.length === 0) {
			// 	return Consequencer.error('车牌号码不能为空!');
			// } else if (this.plateNo.length < 5 && this.plateNo.length > 6) {
			// 	return Consequencer.error('车牌号码有误!');
			// }

			// // 校验车架号码
		    // if (this.platVin.length !==  17) {
			// 	return Consequencer.error('车架号码有误!');
            // }

            // 校验车牌号码 组件已经校验好了
            if (this.carNoComponents.verify === false) {
                return Consequencer.error(this.carNoComponents.message);
            }
			
			// 校验 车辆品牌
			if (this.carBrand === '') {
				return Consequencer.error('请选择车辆品牌!');
			}
			
			// 校验 车型品牌的型号
			if (this.carSeries === '') {
				return Consequencer.error('请选择车型品牌的型号!');
			}
			
			// 校验 车型年份
			if (this.carYears === '') {
				return Consequencer.error('请选择车型年份!');
			}
			
			// 校验 车辆具体型号
			if (this.carYearModel === '') {
				return Consequencer.error('请选择车辆具体型号!');
			}

			return Consequencer.success();
        },

		/**
		 * 注册提交按钮
		 */
		registerSubmit: function registerSubmit() {
            let _this = this;

			// 表单校验
			var myVerifyAll = this.verifyAll();
			if (myVerifyAll.result !== 1) {
				return alert(myVerifyAll.message);
            }

            if (this.platVin && this.platVin.length!==17) {
				return ('车架号码有误!');
            }
            
			// 判断页面状态
			if (this.pageType === 'register') { // 注册状态
				ajaxs.register(
                    this.userinfo,
					this.carNoComponents.carNo, // 车牌号
					this.carNoComponents.carType, // 车牌类型
					this.platVin, // 车架号
					this.carBrand, // 品牌
					this.carSeries, // 型号
					this.carYears, // 年份
                    this.carYearModel, // 车辆具体型号
				).then(function () {
                    _this.jumpHandleBystaus();
                  
				}, function (error) {
					alert('注册失败, 原因:' + error);
				})
			} else if (this.pageType === 'editor') { // 编辑状态
				ajaxs.saveCar(
                    this.userinfo,
					this.$route.query.CarID, // 车唯一标识
					this.carNoComponents.carNo, // 车牌号
                    this.carNoComponents.carType, // 车牌类型
					this.platVin, // 车架号
					this.carBrand, // 品牌
					this.carSeries, // 型号
					this.carYears, // 年份
					this.carYearModel, // 车辆具体型号
					this.isDefaultSetting, // 是否默认车辆
				).then(function () {
                    if(window.localStorage.getItem('isyuyue')=='1'){
                        window.location.href = `../carReservation/index.html#/?carNo=${_this.carNoProvince + _this.plateNo}&brand=${_this.carBrand}&series=${_this.carSeries}&years=${_this.carYears}&model=${_this.carYearModel}&openId=${window.localStorage.getItem('openId')}&name=${window.localStorage.getItem('name')}`
                       
                    } else {
                        window.history.back(-1);

                    }
				
				}, function (error) {
					alert(error);
				});
			} else if (this.pageType === 'creater') { // 新增状态
				ajaxs.saveCar(
                    this.userinfo,
					false, // 车唯一标识 false 表示新增
					this.carNoComponents.carNo, // 车牌号
                    this.carNoComponents.carType, // 车牌类型
					this.platVin, // 车架号
					this.carBrand, // 品牌
					this.carSeries, // 型号
					this.carYears, // 年份
					this.carYearModel, // 车辆具体型号
					this.isDefaultSetting, // 是否默认车辆
				).then(function () {
					if ( window.localStorage.getItem('isyuyue') === '1' ) {
                        window.location.href = `../carReservation/index.html#/?carNo=${_this.carNoComponents.plateNo}&brand=${_this.carBrand}&series=${_this.carSeries}&years=${_this.carYears}&model=${_this.carYearModel}&openId=${window.localStorage.getItem('openId')}&name=${window.localStorage.getItem('name')}`

                    } else {
                        window.history.back(-1);

                    }
				}, function (error) {
					alert(error);
				});
			}
        },
        
        /**
         * 根据状态去跳转对应的页面
         */
        jumpHandleBystaus: function jumpHandleBystaus() {
            let latitude = 114;
            let longitude = 22.7;

            /**
             * 跳转到优惠加油页面方法
             */
            let jumpToGetStation = () => {
                $.ajax({
                    url: config.url.getStationHandler,
                    type: "post",
                    data: {
                        action: "GetStation",
                        lattude: latitude,
                        lontude: longitude,
                        openid: window.localStorage.getItem('openid'),
                    },
                    success: function(datas) {
                        window.location.href = datas.Url;
                    }
                });
            }

            // 判断页面状态  根据状态去跳转对应的页面
            if ( window.localStorage.getItem('pageType') === 'piccPage' || window.localStorage.getItem('pageType') === '人保' ) {
                window.location.href = `../carReservation/index.html#/?openId=${window.localStorage.getItem('openid')}&name=人保`;

            } else if ( window.localStorage.getItem('pageType') === '平安' ) {
                window.location.href = `../carReservation/index.html#/?openId=${window.localStorage.getItem('openid')}&name=平安`;

            } else if ( window.localStorage.getItem('pageType') === 'LCY' ) {
                window.location.href = `../carReservation/index.html#/?openId=${window.localStorage.getItem('openid')}&name=理车云`;

            } else if ( window.localStorage.getItem('pageType') === 'gasStation' ) {

                // 获取定位
                if( window.localStorage.getItem('latitude') && window.localStorage.getItem('longitude') ) {
                    latitude = window.localStorage.getItem('latitude');
                    longitude = window.localStorage.getItem('longitude');
                    jumpToGetStation(); // 跳转到优惠加油页面方法

                } else {

                    // 获取定位
                    html5WxBMapLocation(this, true)
                    .then(position => {
                        latitude = position.latitude;
                        longitude = position.longitude;
                        jumpToGetStation(); // 跳转到优惠加油页面方法

                    }, error => {
                        // 获取定位失败，就用默认的定位跳转就好了，不需要报错
                        jumpToGetStation(); // 跳转到优惠加油页面方法
                    });
                }

            } else {
                // 否则这就 哪里点的就回哪里
                window.history.back(-1); 
            }
        },


		/**
		 * 暂不添加
		 */
		notToRegister: function notToRegister() {
            const _this = this;

            // 校验车牌号码 组件已经校验好了
            if (this.carNoComponents.verify === false) {
				return alert(this.carNoComponents.message);
            }

			ajaxs.register(
                this.userinfo, 
                this.carNoComponents.carNo, // 车牌号
                this.carNoComponents.carType, // 车牌类型
            ).then(function () {
                /**
                 * 注册成功后，跳转到
                 */
                _this.jumpHandleBystaus();
               
			}, function (error) {
				alert('注册失败');
			})
        },
        
        // 车辆品牌页 点击按钮回顶部
		goTop: function goTop() {
           let anchorElement = document.getElementById('listTop')
            if (anchorElement) {
                anchorElement.scrollIntoView()
            }
        },

        // 搜索功能
		search: function search() {
            this.$refs.input1.blur();  //关闭键盘
            this.initCarBrand()         //调用搜索车辆品牌功能
           
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

</script>

<style scoped lang="less">
@black1: #303133;
@black2: #606266;
@black3: #909399;
@black4: #C0C4CC;

// 车牌提示信息
@dialog-tip-z-index: 2;
@dialog-tip-shade-z-index: 3;
@dialog-tip-content-z-index: 4;

// 选择车辆品牌
@car-brand-modal-z-index: 2;

// 横线
@input-line-z-index: 1;

.supplement {
    position: relative;
    width: 100%;
    min-height: 100%;
    background-color: #f5f5f5;
}

// 列表复用部分
.supplement-input-list {

    .input-list-content {
        // border-top: 1px solid #ddd;
        // border-bottom: 1px solid #ddd;
        background-color: #fff;
    }
    #car {
       background-color: #f5f5f5;
    }

    // 横线
    .input-line {
        position: relative;
        // z-index: @input-line-z-index;
        margin-left: 15px;
        height: 0.5px;
        background: #ddd;
    }

    // 项目复用
    .input-item {
        padding: 0px 15px;
        height: 50px;
        line-height: 50px;
        margin-bottom:1px;
        background-color: #fff;
    }

    // 标题信号
    .supplement-input-title {
        padding-left: 15px;
        height: 35px;
        line-height: 35px;
    }

    .input-item-title {
        width: 80px;
        font-size: 14px;
        line-height: 50px;
        color: @black2;
    }

    .input-item-main {
        color: @black1;
        font-size: 14px;
    }
    
    .item-rigth-input {
        width: 100%;
        border: 0px;
        outline: none;
        line-height: 50px;
        font-size: 14px;
        color: @black1;
    }

    input:focus { 
        outline: none;
    }
}

// 车牌号
.supplement-carNo {
    padding-top: 10px;

    .input-item-select {
        // padding-right: 5px;
        font-size: 15px;
        line-height: 50px;
        font-weight: bold;
        color: @black1;
        display: inline-block;
        width:12px;
    }

    .item-rigth-icon {
        color: @black1;
        padding-right: 5px;
        transform: rotate(90deg);
        margin-top:5px;
    }
    
    .ycpd-carplateid-input {
        line-height: 50px;
        font-size: 14px;
        color: @black1;

        .plateid-input-content {
            letter-spacing: 4px;
        }
    }
}

// 车辆型号
.supplement-carType {
    // 标题信号
    .supplement-input-title {
        font-size: 14px;
        color: @black2;
    }

    .input-item-tip {
        height: 47px;
    }
}

// 车辆型号 提示信息
.dialog-tip {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.46);
    z-index: @dialog-tip-z-index;
    
    .dialog-tip-shade {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: @dialog-tip-shade-z-index;
    }

    .dialog-tip-content {
        position: relative;
        padding: 15px;
        z-index: @dialog-tip-content-z-index;
    
        .dialog-tip-img {
            width: 100%;
            height: 100%;
            background: #fff;
            border-radius: 22px;
            overflow: hidden;
        }
    
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
}
.dialog-tip-deny { display: none; }

// 品牌车系年份车型等
.series-year-model {

    // 顶部提示
    .supplement-input-title {
        font-size: 12px;
        color: #FF8D18;
    }

    // 主要部分
    .input-item-main {
        line-height: 50px;
        height: 50px;
    }

    // 向右的箭头
    .input-item-icon {
        height: 42px;
    }

    // 选择的下拉框
    .input-item-select select {
        font-size: 14px;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        color: @black1;
        background-color: #fff;

        option {
            color: @black1;
        }
    }

    // 显示占位符
    .item-show-placeholder {
        color: @black3;

        select,
        option {
            color: @black3;
        }
    }
}

// 择车辆品牌模态框
.car-brand-modal {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    // overflow-y: scroll;
    z-index: @car-brand-modal-z-index;
    .brand-modal-group:nth-child(5) {
        margin-top:55px;
    }

    // 搜索框
    #search_box {
        width: 100%;
        position: fixed;
        top:0px;
        height: 55px;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
        z-index: 3;
        input {
            display: block;
            margin:0 auto;
            margin-top: 12px;
            height: 34px;
            width: 90%;
            border: 1px solid #f5f5f5;
            border-radius: 5px !important;
            background-color: #f5f5f5;
            padding-left: 55px;
            box-sizing: border-box;
            font-size: 14px;
            outline: none;
            -webkit-appearance:none !important;

        }
        input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
            color: #ccc;
        }
        input:-moz-placeholder, textarea:-moz-placeholder {
            color: #ccc;
        }
        input::-moz-placeholder, textarea::-moz-placeholder {
            color: #ccc;
        }
        input:-ms-input-placeholder, textarea:-ms-input-placeholder {
            color: #ccc;
        }
        .icon_search {
            height: 16px;
            width: 16px;
            position: absolute;
            top: 21px;
            left: 30px;
        }
    }

    // 模态框 头部
    .mint-header {
        background-color: #E50012;
        
    }
    #arrow {
        height:40px;
        background-color: #fff;
        line-height: 40px;
    }
    #goTop {
        width:55px;
        height:55px;
        color:#fff;
        line-height: 40px;
        text-align: center;
        position:fixed;
        bottom:40px;
        right:8px;
        border-radius:20px;
    }
    #back {
        width:55px;
        height:55px;
        color:#fff;
        line-height: 40px;
        text-align: center;
        position:fixed;
        bottom:100px;
        right:8px;
        border-radius:20px;
    }

    // 模态框 组
    .brand-modal-group {
        .modal-group-title {
            background-color: #f5f5f5 !important;
            padding-left: 15px;
            height: 40px;
            line-height: 40px;
            color: @black2;
        }
    }

    // 模态框 列表
    .modal-group-list {
        background: #fff;
        border-top: 0.5px solid #ddd;
        border-bottom: 0.5px solid #ddd;

        .group-list-content {
            padding-left: 15px;
        }

        .modal-group-item {
            padding-right: 15px;
            height: 45px;
            line-height: 45px;
        }

        .item-bottom-line {
            border-bottom: 0.5px solid #ddd;
        }
    }
}

// 是否为默认车辆
.is-setting-default {
    padding-top: 10px;

    // 整体框架部分
    .setting-default-content {
        padding: 0px 15px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        // border-top: 1px solid #ddd;
        // border-bottom: 1px solid #ddd;
        background-color: #fff;
    }

    // 主要文字部分
    .setting-default-main {
        color: @black2;
    }

    // 选择按钮文字
    span {
        color: @black2;
        padding-right: 7.5px;
    }
    
    // 选择按钮部分
    .weui-switch,
    .weui-switch-cp__box{
        position: relative;
        width: 52px;
        height: 24px;
        border: 1px solid #DFDFDF;
        outline: 0;
        border-radius: 16px;
        box-sizing: border-box;
        background-color: #DFDFDF;
        -webkit-transition: background-color 0.1s, border 0.1s;
        transition: background-color 0.1s, border 0.1s;
    }
    .weui-switch:before,
    .weui-switch-cp__box:before{
        content:" ";
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 30px;
        border-radius: 15px;
        background-color: #FDFDFD;
        -webkit-transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
        transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
        transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
        transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1), -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    }
    .weui-switch:after,
    .weui-switch-cp__box:after{
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 22px;
        height: 22px;
        border-radius: 15px;
        background-color: #FFFFFF;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        -webkit-transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
        transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35), -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
    }
    .weui-switch:checked,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box{
        border-color:#04BE02;
        background-color:#04BE02;
    }
    .weui-switch:checked:before,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box:before{
        -webkit-transform:scale(0);
        transform:scale(0);
    }
    .weui-switch:checked:after,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box:after{
        -webkit-transform:translateX(28px);
        transform:translateX(28px);
    }
    .weui-switch-cp__input{
        position:absolute;
        left:-9999px;
    }
    .weui-switch-cp__box{
        display:block;
    }

    @keyframes blink {
        0% {
            background-color: white;
        }
        
        50% {
            background-color: @black2;
        }

        100% {
            background-color: white;
        }
    }
}

// 底部按钮复用部分
.submit-button {
    padding-left: 15px;
    padding-right: 15px;

    .submit-button-content {
        border-radius: 4px;
        height: 45px;
        line-height: 45px;
        text-align: center;
    }
}

// 确认
.submit-affirm {
    padding-top: 20px;

    .submit-button-content {
        color: #fff;
        background-color: #E50012;
    }
}

// 暂不添加
.submit-cancel {
    padding-top: 12px;

    .submit-button-content {
        background: #fff;
        color: @black3;
        border: 1px solid #ddd;
    }
}


</style>
