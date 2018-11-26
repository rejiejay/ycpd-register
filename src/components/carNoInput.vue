<!-- 车牌输入 -->
<template>
<div class="carNo-input flex-start-center">
    <div class="carNo-input-des" @click="outPutHandle">车&nbsp;牌&nbsp;号:</div>

    <div class="carNo-input-main flex-rest"><!-- rest 将选择 挤到最右边 -->
        <div class="carNo-input-container flex-center"
            :class="`carNo-${carTypeList[carType_index].key}-car`"
        >
            <div class="carNo-container-border flex-start-center"><!-- 框框圆圈部分 -->

                <!-- 车牌省份 -->
                <div class="carNo-main-province flex-start-center" @click="isProvincesKeyboardShow = true;">
                    <span>{{carNoProvince}}</span>
                    <svg width="18" height="18" t="1542074144888" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1837" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path d="M746.133905 372.497672a20.406035 20.406035 0 0 0-14.34361 5.864815L528.761003 577.653575c-9.104388 8.936471-23.895436 8.913946-32.971155-0.050171L294.101845 378.405491c-8.047739-7.948422-21.013199-7.866511-28.959573 0.180203-7.947398 8.045691-7.866511 21.011151 0.17918 28.958549l201.688003 199.197914c12.115635 11.966148 28.164014 18.569184 45.19225 18.595805h0.102389c16.990353 0 33.019278-6.551842 45.147199-18.456557l203.028269-199.293135c8.071288-7.921801 8.192106-20.887261 0.269282-28.957525a20.418321 20.418321 0 0 0-14.614939-6.133073z" p-id="1838"></path>
                    </svg>
                </div>

                <!-- 车牌号 -->
                <div class="carNo-main-plate flex-rest" 
                    :class="{'carNo-plate-isNull': plateNo === ''}"
                    @click="isPlatesKeyboardShow = true;"
                >{{plateNo === '' ? "点击输入" : plateNo}}</div>
                <div class="carNo-main-addtion" v-if="carTypeList[carType_index].value">{{carTypeList[carType_index].value}}</div>
            </div>
        </div>
    </div>

    <!-- 选择按钮 (小车 大车 新能源 教练 警察 香港 澳门) -->
    <div class="carNo-input-type flex-start-center" @click="carTypeSheetVisible = true;">
        <span>{{carTypeValue}}</span>
        <svg width="20" height="20" t="1542074144888" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1837" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path fill="#303133" d="M746.133905 372.497672a20.406035 20.406035 0 0 0-14.34361 5.864815L528.761003 577.653575c-9.104388 8.936471-23.895436 8.913946-32.971155-0.050171L294.101845 378.405491c-8.047739-7.948422-21.013199-7.866511-28.959573 0.180203-7.947398 8.045691-7.866511 21.011151 0.17918 28.958549l201.688003 199.197914c12.115635 11.966148 28.164014 18.569184 45.19225 18.595805h0.102389c16.990353 0 33.019278-6.551842 45.147199-18.456557l203.028269-199.293135c8.071288-7.921801 8.192106-20.887261 0.269282-28.957525a20.418321 20.418321 0 0 0-14.614939-6.133073z" p-id="1838"></path>
        </svg>
    </div>

    <!-- 选择模态框 (小车 大车 新能源 教练 警察 香港 澳门) -->
    <mt-actionsheet
        :actions="carTypeList"
        v-model="carTypeSheetVisible"
    ></mt-actionsheet>

    <!-- 车牌省份 模态框(键盘) -->
    <div class="ycpd-carno-province flex-column-center" v-if="isProvincesKeyboardShow">

        <!-- 遮罩 -->
        <div class="carno-province-shade flex-rest" @click="isProvincesKeyboardShow = false"></div>

        <!-- 主要内容 -->
        <div class="carno-province-main">
            <div class="carno-province-content">
                <div class="carno-province-list flex-start-center"
                    v-for="(list, keyShow) in provincesList" 
                    :key="keyShow"
                    :style="'padding-left: ' + carNoProvinceBlockWidth + 'px; padding-right: ' + carNoProvinceBlockWidth + 'px;'"
                >
                    <div class="car-license-item" 
                        v-for="(item, key) in list" 
                        :key="key"
                        :style="'padding-left: ' + carNoProvinceBlockWidth + 'px; padding-right: ' + carNoProvinceBlockWidth + 'px;'"
                        @click="selectProvince(item)"
                    ><span>{{item}}</span></div>
                </div>
            </div>
        </div>
    </div>

    <!-- 车牌号 模态框(键盘) -->
    <div class="ycpd-carno-plate flex-column-center" v-if="isPlatesKeyboardShow">

        <!-- 遮罩 -->
        <div class="carno-plate-shade flex-rest" @click="isPlatesKeyboardShow = false"></div>
        
        <!-- 主要内容 -->
        <div class="carno-plate-main">
            <!-- 数字 0~9 因为最小的屏幕宽度是 320 ，但是我们使用 30 宽度来计算 -->
            <div class="carno-plate-number flex-start">
                <div class="plate-number-item" 
                    v-for="(item, key) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]" 
                    :key="key"
                    :style="`padding: 0px ${carNoBlockInterval}px`"
                    @click="plateNumberHandle(item)"
                >
                    <!-- 当 plateNo 为 第一位的时候， 第一行是不可输入的状态 -->
                    <div class="number-item-container" :class="{'number-item-disable': plateNo.length === 0}">{{item}}</div>
                </div>
            </div>

            <!-- 键盘第一行 因为最小的屏幕宽度是 320 ，但是我们使用 30 宽度来计算 -->
            <div class="carno-plate-letter plate-letter1 flex-start">
                <div class="plate-letter-item" 
                    :class="{'carno-letter-disable': (plateNo.length !== 0 && (item === 'I' || item === 'O'))}" 
                    v-for="(item, key) in ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']" 
                    :key="key"
                    :style="`padding: 0px ${carNoBlockInterval}px`"
                    @click="plateLetterHandle(item)"
                >
                    <div class="letter-item-container">{{item}}</div>
                </div>
            </div>

            <div class="flex-center">
                <div class="carno-plate-letter plate-letter2 flex-start">
                    <div class="plate-letter-item" 
                        v-for="(item, key) in ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']" 
                        :key="key"
                        :style="`padding: 0px ${carNoBlockInterval}px`"
                        @click="plateLetterHandle(item)"
                    >
                        <div class="letter-item-container">{{item}}</div>
                    </div>
                </div>
            </div>

            <div class="plate-letter3 flex-start">
                <div class="plate-letter3-left flex-rest"></div>
                <div class="carno-plate-letter flex-start">
                    <div class="plate-letter-item" 
                        v-for="(item, key) in ['Z', 'X', 'C', 'V', 'B', 'N', 'M']" 
                        :key="key"
                        :style="`padding: 0px ${carNoBlockInterval}px`"
                        @click="plateLetterHandle(item)"
                    >
                        <div class="letter-item-container">{{item}}</div>
                    </div>
                </div>
                <div class="plate-letter3-del" :style="`padding: 0px ${carNoBlockInterval}px`" @click="delPlateNo">
                    <div class="letter-del-container flex-center">
                        <svg width="24" height="24" viewBox="0 0 46 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="个人中心" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="车辆信息完善-地区" transform="translate(-671.000000, -1247.000000)" fill="#030303"><g id="车牌-数字字母" transform="translate(0.000000, 889.000000)"><g id="Third-Row" transform="translate(118.000000, 339.000000)"><g id="Delete" transform="translate(526.000000, 0.000000)"><g id="Group" transform="translate(27.000000, 19.000000)"><path d="M0.87229799,25.118689 C-0.297821649,23.9485694 -0.295970172,22.0495791 0.872298005,20.881311 L14.3334384,7.4201705 C15.1177769,6.63583199 16.6514494,6 17.745226,6 L38.7578041,6 C42.6214809,6 45.7536098,9.13769531 45.7536098,13.0035965 L45.7536098,32.9964035 C45.7536098,36.864383 42.6279826,40 38.7578041,40 L17.7452259,40 C16.6452862,40 15.1182152,39.3646064 14.3334383,38.5798295 L0.87229799,25.118689 Z M30.0389349,22.9553805 L35.6994285,17.2948869 C36.2823846,16.7119308 36.2815756,15.7629923 35.6957891,15.1772059 C35.1059187,14.5873355 34.1618846,14.5897901 33.5781081,15.1735666 L27.9176145,20.8340602 L22.257121,15.1735666 C21.6741648,14.5906104 20.7252264,14.5914195 20.13944,15.1772059 C19.5495695,15.7670763 19.5520241,16.7111104 20.1358006,17.2948869 L25.7962942,22.9553805 L20.1358006,28.6158741 C19.5528445,29.1988302 19.5536535,30.1477687 20.13944,30.7335551 C20.7293104,31.3234255 21.6733445,31.3209709 22.257121,30.7371944 L27.9176145,25.0767008 L33.5781081,30.7371944 C34.1610643,31.3201506 35.1100027,31.3193415 35.6957891,30.7335551 C36.2856596,30.1436847 36.283205,29.1996506 35.6994285,28.6158741 L30.0389349,22.9553805 Z M4.17304801,24.419439 C3.38911348,23.6355045 3.39153914,22.3620698 4.17304797,21.580561 L16.0400997,9.71350932 C16.43416,9.319449 17.2048877,9 17.7569086,9 L38.7480877,9 C40.9602754,9 42.7536078,10.7941202 42.7536078,12.9968388 L42.7536078,33.0031609 C42.7536078,35.2105541 40.9665226,36.9999998 38.7480878,36.9999998 L17.756909,37 C17.202802,37 16.4348955,36.6812861 16.0401001,36.2864907 L4.17304801,24.419439 Z" id="Back"></path></g></g></g></g></g></g></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

// 框架类
import Vue from 'vue';
import { Actionsheet } from 'mint-ui';
// 初始化类
Vue.component('mt-actionsheet', Actionsheet);

export default {
    name: 'ycpd-sbsys-tabbar',

	data: function data() { 
        return {
            clientWidth: document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth, // 设备的宽度
            clientHeight: document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight, // 设备高度

            /**
             * 车牌
             */
            carNoProvince: '粤', // 车牌省份
            isProvincesKeyboardShow: false, // 车牌省份 模态框（键盘）
            provincesList: [ ["京", "沪", "浙", "苏", "粤", "鲁", "晋", "冀"],  ["豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂"],  ["津", "贵", "云", "桂", "琼", "青", "新", "藏"],  ["蒙", "宁", "甘", "陕", "闽", "赣", "湘"] ], // 车牌省 键盘值
            plateNo: '', // 车牌号码
            isPlatesKeyboardShow: false, // 车牌号 模态框（键盘）

            /**
             * 车型
             */
            carType_index: 0, // 选中的车型下标
            carTypeSheetVisible: false,
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

    computed: {
        /**
         * 车牌省份 键盘的宽度
         */
        carNoProvinceBlockWidth: function carNoProvinceBlockWidth() {
            var myIntervalWidth = (this.clientWidth - 288) / 18;
            myIntervalWidth = myIntervalWidth > 0 ? myIntervalWidth : 0;
            return myIntervalWidth;
        },

        /**
         * 车牌号 键盘的左右间隙
         */
        carNoBlockInterval: function carNoBlockInterval() {
            /**
             * 如果屏幕小于 300 的情况下
             * 这已经是我兼容的极限
             * 一共有10个按钮 这个时候的间隙 为0
             */ 
            if (this.clientWidth < 300) {
                return  0;
            } else {
                return (this.clientWidth - 300) / 20
            }
        },

        /**
         * 选中车型 对应 的中文昵称
         */
        carTypeValue: function carTypeValue() {
            return this.carTypeList[this.carType_index].name;
        },
    },

    watch: {
        /**
         * 车牌省份 每次改变 都必须向父组件输出一次 数据
         */ 
        carNoProvince: function carNoProvince() {
            this.outPutHandle();
        },

        /**
         * 车牌号码 每次改变 都必须向父组件输出一次 数据
         */ 
        plateNo: function plateNo() {
            this.outPutHandle();
        },

        /**
         * 车型 每次改变 都必须向父组件输出一次 数据
         */ 
        carType_index: function carType_index() {
            this.outPutHandle();
        },
    },

    mounted: function mounted() {
        /**
         * 组件初始化完成的时候，输出一次结果到父组件，否则父组件第一次校验车牌号的时候会取值空
         */
        this.outPutHandle();
    },

	methods: {
        /**
         * 初始化车牌号的方法
         * @param {string} plateNo 要传递给父组件
         */
        initPlateNoHandle: function initPlateNoHandle(plateNo) {
            // 为了避免函数报错， 必须先判断 传入的车牌号
            if (!plateNo || typeof(plateNo) !== "string" || plateNo.length < 4) {
                return alert(`车牌号数据‘${plateNo}’有误!`);
            }

            /**
             * 初始化车牌省份 carNoProvince
             * 车牌号第一位一定是 车牌省份
             */
            this.carNoProvince = plateNo.slice(0, 1);

            /**
             * 检查车型
             * 判断是否包含 '学' '警' '港' '澳'
             */
            if (plateNo.indexOf('学') !== -1) {
                this.carType_index = 3;
                return this.plateNo = plateNo.slice(1, (plateNo.length - 1));

            } else if (plateNo.indexOf('警') !== -1) {
                this.carType_index = 4;
                return this.plateNo = plateNo.slice(1, (plateNo.length - 1));

            } else if (plateNo.indexOf('港') !== -1) {
                this.carType_index = 5;
                return this.plateNo = plateNo.slice(1, (plateNo.length - 1));

            } else if (plateNo.indexOf('澳') !== -1) {
                this.carType_index = 6;
                return this.plateNo = plateNo.slice(1, (plateNo.length - 1));

            }

            /**
             * 判断是不是新能源
             */
            if (plateNo.length === 8) {
                this.carType_index = 2;
            }
            
            this.plateNo = plateNo.slice(1, plateNo.length);
        },

        /**
         * 选择车牌省份
         */
        selectProvince: function selectProvince(item) {
            this.carNoProvince = item; // 设置车牌省份
            this.isProvincesKeyboardShow = false; // 隐藏 车牌省份
            this.isPlatesKeyboardShow = true; // 显示 车牌键盘
        },

        /**
         * 选择车型
         * @param {number} index 车型的下标
         */
        selectCarType: function selectCarType(index) {
            /**
             * 当切换新能源的时候， 需要判断 车牌号的长度
             * 因为 新能源是 plateNo 的长度是 7
             */
            if (index === 0 || index === 1) {
                // 切换到 0,1 的车 长度 是6
                if (this.plateNo.length === 7) {
                    // 如果长度为 7 表示从新能源切换过来的 需要裁剪掉一位
                    this.plateNo = this.plateNo.slice(0, this.plateNo.length - 1);
                }
            } else if (index === 3 || index === 4 || index === 5 || index === 6) {
                // 切换到 3,4,5,6 的长度 是 5
                if (this.plateNo.length === 7) {
                    // 如果长度为 7 表示从新能源切换过来的 需要裁剪掉两位位
                    this.plateNo = this.plateNo.slice(0, this.plateNo.length - 2);
                } else if (this.plateNo.length === 6) {
                    // 如果长度为 7 表示从新能源切换过来的 需要裁剪掉一位
                    this.plateNo = this.plateNo.slice(0, this.plateNo.length - 1);
                }
            }

            this.carType_index = index;
        },

        /**
         * 输入数字
         */
        plateNumberHandle: function plateNumberHandle(item) {
            /**
             * 先判断是不是新能源
             * 新能源是 plateNo 的长度是 7
             */
            if (this.carType_index === 2) {
                // 判断长度有没有超越 最大长度 7
                if (this.plateNo.length >= 7) {
                    // 是新能源的情况下，并且 长度大于 等于 7 ，这个时候就不可继续新增数字了
                    return false;
                }
            } else if (this.carType_index === 3 || this.carType_index === 4 || this.carType_index === 5 || this.carType_index === 6) {
                // 判断长度有没有超越 最大长度 5
                if (this.plateNo.length >= 5) {
                    // 教练 警察 香港 澳门 车牌的情况下，并且 长度大于 等于 6 ，这个时候就不可继续新增数字了
                    return false;
                }
            } else {
                // 判断长度有没有超越 最大长度 6
                if (this.plateNo.length >= 6) {
                    // 普通车牌的情况下，并且 长度大于 等于 6 ，这个时候就不可继续新增数字了
                    return false;
                }
            }

            /**
             * 先判断 车牌号的长度是否 为空
             * 如果为空是不可以输入的
             */
            if (this.plateNo.length !== 0) {
                this.plateNo += item;
            }
        },

        /**
         * 输入字母
         */
        plateLetterHandle: function plateLetterHandle(item) {
            /**
             * 先判断是不是第一位
             * 不是第一位的情况下是不可输入 I 和 O 的
             */
            if (this.plateNo.length !== 0 && (item === 'I' || item === 'O')) {
                return false;
            }

            /**
             * 先判断是不是新能源
             * 新能源是 plateNo 的长度是 7
             */
            if (this.carType_index === 2) {
                // 判断长度有没有超越 最大长度 7
                if (this.plateNo.length >= 7) {
                    // 是新能源的情况下，并且 长度大于 等于 7 ，这个时候就不可继续新增数字了
                    return false;
                }
            } else if (this.carType_index === 3 || this.carType_index === 4 || this.carType_index === 5 || this.carType_index === 6) {
                // 判断长度有没有超越 最大长度 5
                if (this.plateNo.length >= 5) {
                    // 教练 警察 香港 澳门 车牌的情况下，并且 长度大于 等于 6 ，这个时候就不可继续新增数字了
                    return false;
                }
            }else {
                // 判断长度有没有超越 最大长度 6
                if (this.plateNo.length >= 6) {
                    // 普通车牌的情况下，并且 长度大于 等于 6 ，这个时候就不可继续新增数字了
                    return false;
                }
            }

            this.plateNo += item;
        },

        /**
         * 删除
         */
        delPlateNo: function delPlateNo() {
            /**
             * 先判断是不是第一位
             * 第一位是不可以删除的
             */
            if (this.plateNo.length === 0) {
                return false;
            }

            this.plateNo = this.plateNo.slice(0, this.plateNo.length - 1);
        },

        /**
         * 向父组件发送数据 (子组件向父传参)
         * 每次当车牌省份 以及 车牌号 车型 发生改变 就 进行参数传递
         */
        outPutHandle: function outPutHandle() {
            /**
             * 子组件 在此先校验一遍 就免去了父组件的校验
             */
            let verify = false;
            let message = '';

            // 先判断是不是新能源
            if (this.carType_index === 2) {
                if (this.plateNo.length  === 7) {
                    verify = true;
                } else {
                    message = '车牌号不正确';
                }
            } else if (this.carType_index === 3 || this.carType_index === 4 || this.carType_index === 5 || this.carType_index === 6) {
                // 非新能源车 的情况下
                if (this.plateNo.length  === 5) {
                    verify = true;
                } else {
                    message = '车牌号不正确';
                }
            } else {
                // 普通源车 的情况下
                if (this.plateNo.length  === 6) {
                    verify = true;
                } else {
                    message = '车牌号不正确';
                }
            }

            // 最后判断为空，因为会被覆盖
            if (this.plateNo === '') {
                message = '车牌号不能为空';
            }

            this.$emit('outPutHandle', {
                verify: verify,
                message: message,
                carNo: `${this.carNoProvince}${this.plateNo}${this.carTypeList[this.carType_index].value}`,
                carNoProvince: this.carNoProvince,
                plateNo: this.plateNo,
                carType: this.carTypeList[this.carType_index].value,
            });
        },
    }
}

</script>

<style scoped lang="less">
@black1: #303133;
@black2: #606266;
@black3: #909399;
@black4: #C0C4CC;

@carkeyboard-z-index: 2; // 键盘

// 车牌输入
.carNo-input {
    font-size: 14px;
    height: 60px;
    padding: 0px 15px;
    color: @black2;

    // 描述部分（车牌号:） 
    .carNo-input-des {
        width: 80px;;
    }

    // 主要部分 车牌号
    .carNo-input-main {
        color: #fff;

        .carNo-input-container {
            height: 40px;
            width: 170px;
            border-radius: 4px;

            .carNo-container-border {
                height: 34px;
                width: 164px;
                border-radius: 4px;
                // border: 1px solid #fff;
            }
        }

        // 车牌省份
        .carNo-main-province {
            height: 34px;
            padding-right: 7.5px;

            span {
                display: block;
                padding-left: 7.5px;
                line-height: 34px;
            }

            svg {
                position: relative;
                top: 1.5px;
            }
        }

        // 车牌主要内容部分
        .carNo-main-plate {
            padding-right: 5px;
            color: #fff;
            font-size: 16px;
            letter-spacing: 2.5px;
        }

        // 车牌附加信息 例如 (小车 大车 新能源 教练 警察 香港 澳门)
        .carNo-main-addtion {
            padding-right: 7.5px;
        }

        // 为空的时候 显示的颜色不一样 车牌主要内容部分
        .carNo-plate-isNull {
            font-size: 14px;
            letter-spacing: 0;
            color: rgba(255, 255, 255, 0.46);
        }

        // 小型车 小轿车 普通的车
        .carNo-normalCar-car {
            background-color: #5594FF;

            .carNo-container-border {
                border: 1px solid #fff;
            }

            .carNo-main-province { // 车牌省份
                color: #fff;

                svg {
                    fill: #fff;
                }
            }
        
            .carNo-main-plate { // 车牌主要内容部分
                color: #fff;
            }

            .carNo-plate-isNull { // 为空的时候 显示的颜色不一样 车牌主要内容部分
                color: rgba(255, 255, 255, 0.46);
            }
        }

        // 大车
        .carNo-autotruck-car {
            background-color: #FFDA00;

            .carNo-container-border {
                border: 1px solid #000;
            }

            .carNo-main-province { // 车牌省份
                color: #000;

                svg {
                    fill: #000;
                }
            }
        
            .carNo-main-plate { // 车牌主要内容部分
                color: #000;
            }

            .carNo-plate-isNull { // 为空的时候 显示的颜色不一样 车牌主要内容部分
                color: rgba(0, 0, 0, 0.64);
            }
        }

        // 新能源
        .carNo-newEnergy-car {
            background-color: #00D145;

            .carNo-container-border {
                border: 1px solid #fff;
            }

            .carNo-main-province { // 车牌省份
                color: #fff;

                svg {
                    fill: #fff;
                }
            }
        
            .carNo-main-plate { // 车牌主要内容部分
                color: #fff;
            }

            .carNo-plate-isNull { // 为空的时候 显示的颜色不一样 车牌主要内容部分
                color: rgba(255, 255, 255, 0.64);
            }
        }

        // 教练
        .carNo-coachCar-car {
            background-color: #FFDA00;

            .carNo-container-border {
                border: 1px solid #000;
            }

            .carNo-main-province { // 车牌省份
                color: #000;

                svg {
                    fill: #000;
                }
            }
        
            .carNo-main-plate { // 车牌主要内容部分
                color: #000;
            }

            .carNo-plate-isNull { // 为空的时候 显示的颜色不一样 车牌主要内容部分
                color: rgba(0, 0, 0, 0.64);
            }

            // 车牌附加信息 例如 (小车 大车 新能源 教练 警察 香港 澳门)
            .carNo-main-addtion {
                color: #000;
            }
        }

        // 警
        .carNo-policeCar-car {
            background-color: #fff;

            .carNo-container-border {
                border: 1px solid #000;
            }

            .carNo-main-province { // 车牌省份
                color: #000;

                svg {
                    fill: #000;
                }
            }
        
            .carNo-main-plate { // 车牌主要内容部分
                color: #000;
            }

            .carNo-plate-isNull { // 为空的时候 显示的颜色不一样 车牌主要内容部分
                color: rgba(0, 0, 0, 0.64);
            }

            // 车牌附加信息 例如 (小车 大车 新能源 教练 警察 香港 澳门)
            .carNo-main-addtion {
                color: #F61616;
            }
        }

        // 港 澳
        .carNo-HongKong-car,
        .carNo-Macao-car {
            background-color: #000;

            .carNo-container-border {
                border: 1px solid #fff;
            }

            .carNo-main-province { // 车牌省份
                color: #fff;

                svg {
                    fill: #fff;
                }
            }
        
            .carNo-main-plate { // 车牌主要内容部分
                color: #fff;
            }

            .carNo-plate-isNull { // 为空的时候 显示的颜色不一样 车牌主要内容部分
                color: rgba(255, 255, 255, 0.64);
            }

            // 车牌附加信息 例如 (小车 大车 新能源 教练 警察 香港 澳门)
            .carNo-main-addtion {
                color: #fff;
            }
        }
    }

    // 选中车型部分 (小车 大车 新能源 教练 警察 香港 澳门)
    .carNo-input-type { 
        height: 60px;

        svg {
            position: relative;
            top: 1.5px;
        }
    }
}

// 车牌省份 键盘
.ycpd-carno-province {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: @carkeyboard-z-index;

    // 遮罩层
    .carno-province-shade {
        width: 100%;
        // background: rgba(0, 0, 0, 0.12); // 不需要阴影
    }

    .carno-province-main {
        position: relative;
        background-color: #d8dadc;

        .carno-province-content {
            padding-top: 7.5px;
            padding-bottom: 7.5px;
        }

        .carno-province-list {
            padding-top: 7.5px;
            padding-bottom: 7.5px;
            padding-left: 7.5px; padding-right: 7.5px;
        }
    
        .car-license-item span {
            display: block;
            width: 36px;
            text-align: center;
            height: 40px;
            line-height: 40px;
            border-radius: 5px;
            color: @black2;
            font-size: 18px;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
    }
}

// 车牌号 键盘
.ycpd-carno-plate {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: @carkeyboard-z-index;

    // 遮罩层
    .carno-plate-shade {
        width: 100%;
        // background: rgba(0, 0, 0, 0.12); // 不需要阴影
    }

    // 车牌号 键盘内容部分
    .carno-plate-main {
        padding: 10px 0px;
        width: 100%;
        position: relative;
        background-color: #d8dadc;
    }

    // 12345679 部分
    .carno-plate-number {
        padding-bottom: 10px;

        .number-item-container {
            font-size: 16px;
            width: 30px;
            line-height: 40px;
            text-align: center;
            border-radius: 5px;
            color: @black1;
            background: #fff;
            box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.35);
        }

        .number-item-container:active {
            color: #F56C6C;
            background: rgba(0, 0, 0, 0.12);
        }

        .number-item-disable {
            color: #c1c1c1;
        }

        .number-item-disable:active {
            color: #c1c1c1;
            background: #fff;
        }
    }

    // 键盘 字母 行
    .carno-plate-letter {

        .letter-item-container {
            font-size: 16px;
            width: 30px;
            line-height: 40px;
            text-align: center;
            border-radius: 5px;
            color: @black1;
            background: #fff;
            box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.35);
        }

        .letter-item-container:active {
            color: #F56C6C;
            background: rgba(0, 0, 0, 0.12);
        }
    }

    //  键盘 字母 行 失效的样式
    .carno-letter-disable {

        .letter-item-container {
            color: #c1c1c1;
        }
        
        .letter-item-container:active {
            color: #c1c1c1;
            background: #fff;
        }
    }

    //  键盘 字母 第一行 第二行
    .plate-letter1,
    .plate-letter2 {
        padding-bottom: 10px;
    }

    //  键盘 字母 第三行
    .plate-letter3 {

        // 删除按钮
        .plate-letter3-del {

            .letter-del-container {
                font-size: 16px;
                width: 50px;
                height: 40px;
                text-align: center;
                border-radius: 5px;
                color: @black1;
                background: #aab2bb;
                box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.35);
            }

            .letter-del-container:active {
                background: #fff;
            }
        }
    }
}

</style>
