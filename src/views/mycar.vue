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
                    @click="jumpToEditor(item.nativeData)"
                >
                    <div class="list-item-main flex-rest">
                        <div class="list-item-titile">{{item.carNo}}</div>
                        <div class="list-item-lable">{{item.carType}}</div>
                    </div>
                    <div class="list-item-icon flex-start-center">
                        <span v-if="item.isDefault">默认</span>
                        <svg width="18" height="18" t="1530499422424" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" xmlns:xlink="http://www.w3.org/1999/xlink" >
                            <path fill="#909399" d="M325.399273 235.124364L600.157091 488.727273 325.399273 742.353455a34.909091 34.909091 0 1 0 47.36 51.316363l302.545454-279.272727a34.909091 34.909091 0 0 0 0-51.316364l-302.545454-279.272727a34.909091 34.909091 0 1 0-47.36 51.316364" p-id="1465"></path>
                        </svg>
                    </div>
                </div>
                <div class="list-item-delete flex-center" 
                    :class="{'item-delete-show' : item.delBtnVisible}"
                    @click="deleteItem(item.CarID)"
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
		}
	},

	mounted: function mounted() {
        this.$store.commit('initCustomerid', this.$route.params.customerid); // 设置到 vuex
		this.getCarList();
	},

	methods: {
		/**
		 * 获取车辆信息
		 */
		getCarList: function getCarList() {
			var _this = this;

			ajaxs.getCarList(this.$route.params.customerid)
			.then(function (carList) {
				// 判断数据是否为空
				if (carList.length > 0) {
					_this.carList = carList.map(function (item, key) {
						return {
							nativeData: JSON.parse(JSON.stringify(item)),
							CarID: item.CarID, // 车唯一标识
							carNo: item.CarNo, // 车牌号
							carType: item.Model + item.Brand, // 车辆类型
							isDefault: (item.IsDefault === 1), // 1为默认车辆 0为非默认车辆
							delBtnVisible: false, // 是否显示删除按钮
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

		/**
		 * 编辑 车辆信息
		 * @param {Object} nativeData 原始数据
		 */
		jumpToEditor: function jumpToEditor(nativeData) {

            this.$store.commit('initCarid', nativeData.CarID); // 设置到 vuex
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
		deleteItem: function deleteItem(CarID) {
			var _this = this;

			if (confirm("确认要删除吗?")) {
				ajaxs.deleteCar(CarID)
				.then(function () {
					// 删除成功, 再次获取一一次车辆信息
					_this.getCarList();
				}, function (error) {
					alert(error);
				});
			}
		},

		/**
		 * 开始触摸车辆列表 (用于删除)
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
        }
    }

    // 右箭头
    .list-item-icon {
        padding-right: 15px;

        .list-item-lable {
            color: @black3;
        }
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
