<!-- 注册页面 -->
<template>
<div class="mycar">
    
    <!-- 车辆信息 列表 -->
    <div class="mycar-list">
        <div class="mycar-list-content">

            <div class="list-item"
                v-for="(item, key) in carList" 
                :key="'00' + key"
                @touchstart="itemTouchStart(item, key, $event)"
            >
                <div class="list-item-slide flex-start-center"
                    :class="{'item-slide-left' : item.delBtnVisible}"
                   
                >
                    <div  @click="jumpToEditor(item.nativeData)" class="list-item-main flex-rest">
                        <div class="list-item-titile">{{item.carNo}}
                            <img src="../assets/img/icon_edit@2x.png" />
                        </div>
                        <div class="list-item-lable">{{item.carType}}</div>
                    </div>
                    <div @click="changeCar(item.nativeData)" class="list-item-icon" :class="[item.isDefault!='1'?'blue':'']">
                        <span >{{item.isDefault=='1'?'已选择':'选择'}}</span>
                    </div>
                </div>
                <div class="list-item-delete flex-center" 
                    :class="{'item-delete-show' : item.delBtnVisible}"
                    @click="deleteItem(item.CarID,item.isDefault)"
                ><div>删除</div></div>
            </div>
        </div>
    </div>

    <!-- 车辆信息 新增 -->
    <div class="mycar-add">
        <div class="mycar-add-position">
            <div class="mycar-add-content" @click="jumpToCreater">添加车辆</div>
        </div>
    </div>
</div>
</template>

<script>

import ajaxs from "./../api/mycar";
import ajaxsSupplement from "@/api/supplement";

export default {
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

            carTypeList: [
                // 小型车 小轿车 普通的车
                {
                    key: 'normalCar',
                    name: '小车',
                    value: '',
                    method: () => this.selectCarType(0),
                }, 
                // 大车
                {
                    key: 'autotruck',
                    name: '大车',
                    value: '',
                    method: () => this.selectCarType(1),
                },  
                // 新能源车型
                {
                    key: 'newEnergy',
                    name: '新能源',
                    value: '',
                    method: () => this.selectCarType(2),
                }, 
                // 教练
                {
                    key: 'coachCar',
                    name: '教练',
                    value: '学',
                    method: () => this.selectCarType(3),
                }, 
                // 警察
                {
                    key: 'policeCar',
                    name: '警察',
                    value: '警',
                    method: () => this.selectCarType(4),
                }, 
                // 香港车
                {
                    key: 'HongKong',
                    name: '香港',
                    value: '港',
                    method: () => this.selectCarType(5),
                }, 
                // 澳门
                {
                    key: 'Macao',
                    name: '澳门',
                    value: '澳',
                    method: () => this.selectCarType(6),
                }, 
            ],
		}
	},

	mounted: function mounted() {
        window.localStorage.setItem('customerid', this.$route.params.customerid); // 初始化 customerid
        window.localStorage.setItem('openid', this.$route.params.openid); // 初始化 openid

        // 添加成功 判断回调的 url 以及 项目名称 是否存在 
        if (this.$route.query && this.$route.query.callBackUrl && this.$route.query.objectName ) {
            // 如果存在 缓存 数据
            window.localStorage.setItem('callBackUrl', this.$route.query.callBackUrl); // 初始化 添加成功 回调的 url 链接
            window.localStorage.setItem('objectName', this.$route.query.objectName); // 添加成功 后的 项目名称
        }

        this.getCarList(); // 获取车辆信息
    },

	methods: {
		/**
		 * 获取车辆信息
		 */
		getCarList: function getCarList() {
            var _this = this;
            
            /**
             * 根据服务器返回的车辆类型 初始化 车牌号数据 转换的函数
             */
            let carTypeListToValue = CarType => {
                let itemCarType = '';

                _this.carTypeList.map(val => {
                    if (val.name === CarType) {
                        itemCarType = val.value;
                    }
                    
                    return val;
                });

                return itemCarType;
            }

			ajaxs.getCarList(window.localStorage.customerid)
			.then(function (carList) {
                    // 判断数据是否不为空
                    if (carList.length !== 0) {
                        _this.carList = carList.map(function (item, key) {
                            return {
                                nativeData: JSON.parse(JSON.stringify(item)),
                                CarID: item.CarID, // 车唯一标识
                                carNo: `${item.CarNo}${carTypeListToValue(item.CarType)}`, // 车牌号
                                carType: `${item.Brand} ${item.Model}`, // 车辆类型
                                isDefault: (item.IsDefault === 1), // 1为默认车辆 0为非默认车辆
                                delBtnVisible: false, // 是否显示删除按钮
                            }
                        });
					
				    } else {
                        // 如果无车辆信息
                        // 跳转到新增车辆信息页面
			            _this.$router.replace({ path: '/supplement/creater' });
				    }

			}, function (error) {
				alert(error);
			});

		},

        /**
         * 选择车辆的方法
         */
        changeCar(val) {
            let _this = this
            ajaxsSupplement.saveCar(
                window.localStorage.customerid,
                val.CarID, // 车唯一标识
                val.CarNo, // 车牌号
                val.CarType ? val.CarType : '小车', // 车牌型号
                val.VIN, // 车架号
                val.Brand, // 品牌
                val.Series, // 型号
                val.Years, // 年份
                val.Model, // 车辆具体型号
                '1', // 是否默认车辆
            ).then(() => {
                // 判断是否理车云
                if ( window.localStorage.callBackUrl == 'carReservation' ) {
                    // 如果是理车云跳转的路径不一样的
                    window.localStorage.removeItem('callBackUrl');
                    window.location.href = `../carReservation/index.html#/?openId=${window.localStorage.openid}&name=${window.localStorage.objectName}`;

                } else {
                    // 如果不是理车云的项目, 从哪里来的跳转到哪里去
                    window.history.back(-1);
                }

            }, error => alert(error));
        },

		/**
		 * 编辑 车辆信息
		 * @param {Object} nativeData 原始数据
		 */
		jumpToEditor: function jumpToEditor(nativeData) {

            window.localStorage.setItem('carId', nativeData.CarID);
			this.$router.push({ path: '/supplement/editor', query: nativeData });
		},

		/**
		 * 新增 车辆信息
		 */
		jumpToCreater: function jumpToCreater() {
			this.$router.push({ path: '/supplement/creater' });
        },
        
		/**
		 * 删除 车辆信息
		 * @param {String} CarID 车唯一标识
		 */
		deleteItem: function deleteItem(CarID, IsDefault) {
			var _this = this;
            
			if (confirm("确认要删除吗?")) {
                ajaxs.deleteCar(CarID, this.$route.params.customerid)
                .then(function () {
                    // 删除成功, 再次获取一一次车辆信息
                    _this.getCarList();

                }, function (error) {
                    alert(error);

                });
            }
				
		},

		/**
		 * 初始化 触摸车辆列表 (用于删除)
		 */
		itemTouchStart: function itemTouchStart(item, key, startEvent) {
			var _this = this;
			var touchStartX = startEvent.touches[0].pageX; // 开始触摸的位置

			function handleTouchMove(event) {
				var currentX = event.touches[0].pageX; // 每次 触摸 X距离
				var interval = currentX - touchStartX; // 每次 触摸 间隔
				
				// 判断是否显示
				if (interval < -100 && item.delBtnVisible === false) { // 显示删除按钮
					_this.carList[key].delBtnVisible = true;
				} else if (interval > 100 && item.delBtnVisible) { // 隐藏删除按钮
					_this.carList[key].delBtnVisible = false;
				}
				startEvent.preventDefault();
			}

			function handleTouchEnd() {
				window.removeEventListener('touchmove', handleTouchMove);
				window.removeEventListener('touchend', handleTouchEnd);
			}

            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
		},
	}
}

</script>

<style scoped lang="less">
@black1: #303133;
@black2: #606266;
@black3: #909399;
@black4: #C0C4CC;

.mycar {
    position: relative;
    width: 100%;
    min-height: 100%;
    background-color: #f5f5f5;
}

// 车辆信息列表
.mycar-list {
    padding-top: 5px;
    padding-bottom: 75px;

    // 项复用部分
    .list-item {
        position: relative;
        padding-top: 5px;
        font-size: 14px;
        color: @black2;
        overflow: hidden;
    }
    
    // 滑动区域
    .list-item-slide {
        position: relative;
        width: 100%;
        left: 0px;
        background: #fff;

        transition: left 0.2s;
        -moz-transition: left 0.2s;	/* Firefox 4 */
        -webkit-transition: left 0.2s;	/* Safari 和 Chrome */
        -o-transition: left 0.2s;	/* Opera */
    }

    // 滑动
    .item-slide-left {
        left: -120px;
    }
    
    // 内容区域
    .list-item-main {
        padding-left: 15px;
        padding-bottom: 15px;
        padding-top: 15px;

        .list-item-titile {
            font-family: '微软雅黑';
            padding-bottom: 2.5px;
            color: @black1;
            img {
                width:12px;
                height:12px;
            }
        }
    }

    // 右箭头
    .list-item-icon {
        height:30px;
        width:70px;
        border:1px solid #bbb;
        border-radius:15px;
        margin-right:15px;
        text-align: center;
        line-height: 30px;
        background-color: #EEEEEE;
        color:#BBBBBB;
        
    }
    .blue {
            background-color: #fff;
            color:#5594FF;
            border:1px solid #5594FF;
            border-radius:15px;
            margin-right:15px;
            text-align: center;
            line-height: 30px;
            height:30px;
            width:70px;
        }
    
    // 删除
    .list-item-delete {
        position: absolute;
        top: 5px;
        width: 120px;
        height: 100%;
        right: -120px;
        font-size: 14px;
        color: #fff;
        background: #ff1d1d;
        text-align: center;

        transition: right 0.2s;
        -moz-transition: right 0.2s;	/* Firefox 4 */
        -webkit-transition: right 0.2s;	/* Safari 和 Chrome */
        -o-transition: right 0.2s;	/* Opera */
    }

    .item-delete-show {
        right: 0px;
    }
}

// 车辆信息 新增
.mycar-add {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;

    .mycar-add-position {
        padding: 15px;
    }

    .mycar-add-content {
        border-radius: 4px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        color: #fff;
        background-color: #E50012;
    }
}


</style>
