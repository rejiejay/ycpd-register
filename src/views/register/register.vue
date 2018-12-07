<!-- 注册页面 -->
<template>
    <div class="register">
   
        <!-- 车牌号 -->
        <div class="register-input">
            <div class="register-content-container" style="background: #fff;">
                
                <carNoInput ref="carNoComponent" @outPutHandle="carNoHandle" />

            </div>
        </div>

        <!-- 注册 -->
        <div class="register-input">
            <div class="register-content">

                <!-- 手机号码 -->
                <div class="register-input-item flex-start-center">
                    <div class="input-item-lable">手机号码:</div>
                    <div class="input-item-main flex-rest">
                        <input v-model="phoneValue" placeholder="请填写手机号码" />
                    </div>
                </div>
                <div class="register-input-line"></div>
                
                <!-- 短信验证码 -->
                <div class="register-input-item flex-start-center">
                    <div class="input-item-lable">短信验证:</div>
                    <div class="input-item-main flex-start-center flex-rest">
                        <input v-model="verifyNumber" maxlength="4" placeholder="输入4位手机短信验证码" />
                    </div>
                    <div class="input-item-verify">
                        <div class="item-verify-content"
                            :class="{'item-verify-disable' : isVerifyGeting}"
                            @click="verifyNumberHandle"
                        >{{isVerifyGeting ? (countDown + '秒后获取') : '获取验证码'}}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 【滑动拼图】人机验证模态框 -->
        <div class="machine-verify-modal flex-center" :style="`display: ${isMachineModalShow ? 'flex' : 'none'}`">
            <div class="verify-modal-shade" @click="isMachineModalShow = false"></div>
            <div class="verify-modal-main" :style="'width: ' + (clientWidth - 30) + 'px;'">

                <div class="modal-main-title">人机验证</div>
                
                <div class="modal-main-input flex-center">
                    <captchaSlider ref="captchaSliderComponent" @resolve="captchaSliderResolver" />
                </div>
                
                <div class="main-confirm-content">
                </div>
            </div>
        </div>

        <!-- 协议 -->
        <div class="register-agreement">
            <div class="register-agreement-content flex-start-center">
                <div class="agreement-radio-content" 
                    :class="[isAgreement ? 'agreement-radio-selected' : 'register-agreement-radio']"
                    @click="isAgreement = !isAgreement"
                >
                    <svg width="16" height="16" t="1535773287663" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2604" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path d="M511.452 957.752c-246.502 0-447.037-200.535-447.037-447.027 0-246.497 200.535-447.037 447.037-447.037S958.49 264.228 958.49 510.725c0 246.492-200.535 447.027-447.038 447.027z m0-842.788c-218.224 0-395.766 177.542-395.766 395.766s177.542 395.75 395.766 395.75 395.766-177.525 395.766-395.75-177.541-395.766-395.766-395.766z" p-id="2605"></path>
                        <path v-if="isAgreement" d="M438.477 684.841a25.605 25.605 0 0 1-18.125-7.516l-148.46-148.47a25.626 25.626 0 0 1 0-36.25 25.626 25.626 0 0 1 36.25 0l130.335 130.33 272.44-272.42a25.626 25.626 0 0 1 36.25 0 25.626 25.626 0 0 1 0 36.25L456.602 677.32a25.641 25.641 0 0 1-18.125 7.521z" p-id="2606"></path>
                    </svg>
                </div>

                <div class="register-agreement-text">
                    我已阅读并同意<span @click="jumpToAgreement">《养车频道用户服务协议》</span>
                </div>
            </div>
        </div>

        <!-- 提交 -->
        <div class="register-submit" @click="submitRegister">
            <div class="register-submit-content">确认</div>
        </div>
    </div>
</template>

<script>

// 请求类
import ajaxs from "@/api/register";
import supplementAjaxs from "@/api/supplement";
// 自定义组件类
import Consequencer from "@/utils/Consequencer";
import wxLocation from "@/components/wxLocation";
import carNoInput from "@/components/carNoInput";
import captchaSlider from "@/components/captcha-slider";

export default {
    name: 'register-main',

    components: { carNoInput, captchaSlider },

    data () {
        return {
			clientWidth: document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth,

			// 手机号码
			phoneValue: '',

			// 是否显示人机验证码模态框
            isMachineModalShow: false,

			// 人机验证码
			machineNumber: '',

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
            
			// 验证号码
			verifyNumber: '',

			// 是否 正在获取验证码
			isVerifyGeting: false,

			// 倒计时60秒
			countDown: 60,
			
			// 是否同意协议
            isAgreement: false,
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
        // 初始化页面数据
        this.initPageData();
    },

    destroyed: function () {
		window.removeEventListener('scroll', this.scrollBottom); // 移除滚动事件，检测滚动到页面底部
    },

	methods: {
        /**
         * 页面初始化
         */
        initPageData: function initPageData() {
            var _this = this;
            
            // 判断openid 的合法性 并且 缓存openid 
            if (this.$route.params.openid && this.$route.params.openid.length > 15) {
                this.$store.commit('initOpenid', this.$route.params.openid); // 设置到 vuex
                window.localStorage.setItem('openid', this.$route.params.openid)  // 本地存储 openid， 其他地方会用到

            // 如果 openid 不存在
            } else {
                // 提示重新获取（非常重要）
                if (confirm('获取微信用户信息失败, 是否重新获取?')) {
                    window.location.href = config.YcpdUrlWidthWxCode(); // 重新获取 code

                } else {
                    // 如果不进行重新获取 弹出报错信息 返回上一页
                    alert('注册失败, 无法获取微信openid, 请联系客服人员.');
                    window.history.back(-1);
                }
            }
    
            // 初始化位置信息
            wxLocation.init()
            .then(function(position) {
                wxLocation.getCityName(position)
                .then(function(cityName) {
                    _this.$store.commit('initCity', cityName); // 设置到 vuex
                });
            });
        },

        /**
         * 【滑动拼图】人机验证模态框 验证成功
         */
        captchaSliderResolver: function captchaSliderResolver() {
            this.checkVerifyCode();
        },
        
        /**
         * 从车牌输入的组件获取车牌号
         */
        carNoHandle: function carNoHandle(data) {
            this.carNoComponents = data;
        },

		/**
		 * 校验手机号码
		 */
		verifyPhoneValue: function verifyPhoneValue() {
			if (this.phoneValue === '') {
				return Consequencer.error('手机号码不能为空');
			}

			// 正则匹配表达式: https://github.com/VincentSit/ChinaMobilePhoneNumberRegex
			if (/^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/.test(this.phoneValue) === false) {
				return Consequencer.error('请输入正确的手机号码格式');
			}

			return Consequencer.success();
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
			if (this.isVerifyGeting === false) { // 没有获取验证码的情况

                this.isMachineModalShow = true; // 弹出模态框

                this.$nextTick(function () {


                    // 因为 Vue 可能与 canvas 不兼容， 所以每当这个模态框打开的时候，渲染一次
                    _this.$refs.captchaSliderComponent.initNumerical();

                    // 多加一次定时器渲染， 因为还有图片渲染不出来的情况
                    setTimeout(() => {
                        // 因为 Vue 可能与 canvas 不兼容， 所以每当这个模态框打开的时候，渲染一次
                        _this.$refs.captchaSliderComponent.initCanvasBackground();
                    }, 100);
                });
			}
		},

		/**
		 * 验证验证码是否正确
		 */
		checkVerifyCode: function checkVerifyCode() {
			var _this = this;

            // 图形验证码移动的距离 暂时为零
            // 因为以前是数字验证码, 所以 这个是兼容的写法，历史遗留问题
			ajaxs.getMobileCode(this.phoneValue, this.machineNumber, this.$route.params.openid)
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
			this.$router.push({ path: 'agreement', });
		},

		/**
		 * 校验验证号码是否正确
		 * 并且跳转到下一页
		 */
		submitRegister: function submitRegister() {
			var _this = this;

            // 校验车牌号码 组件已经校验好了
            if (this.carNoComponents.verify === false) {
				return alert(this.carNoComponents.message);
            }

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

            /**
             * 【第三步】 根据状态去跳转对应的页面
             */
            let jumpHandleBystaus = () => {
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
            }
            
            /**
             * 【第二步】 暂不添加车辆信息 注册
             */
            let notAddCarInforToRegister = () => {
                supplementAjaxs.register(
                    _this.userinfo, 
                    _this.carNoComponents.carNo, // 车牌号
                    _this.carNoComponents.carType, // 车牌类型
                ).then(function () {
                    /**
                     * 注册成功后，【第三步】 根据状态去跳转对应的页面
                     */
                    jumpHandleBystaus();
                
                }, function (error) {
                    alert('注册失败');
                })
            }

            /**
             * 【第一步】 校验手机号码 与 code 是否正确
             */
			ajaxs.verifyMobileCodeNumber(this.phoneValue, this.verifyNumber)
			.then(function () {
                // 原本是应该跳转到 车辆信息 
                // 考虑需求会改动，这段代码就不删掉了，以后可能会有添加车辆信息的需求
                // /**
                //  * 存储数据到 vuex (全局)
                //  * 简单的跳转逻辑犯不着用 vuex，徒增复杂度
                //  * 直接路由带过去就行了
                //  */
                // _this.$store.commit('initPhone', { 
                //     mobile: _this.phoneValue,
                //     verifyCode: _this.verifyNumber,
                // });
				// _this.replaceToRouter('/supplement/register', {
                //     mobile: _this.phoneValue,
                //     verifyCode: _this.verifyNumber,
                //     carNo: _this.carNoComponents.carNo,
                //     carType: _this.carNoComponents.carType,
                // });

                notAddCarInforToRegister(); // 校验手机号码成功 【第二步】暂不添加车辆信息 注册
			}, function (error) {
				alert(error);
			});
		},

        /**
         * 重定向到路由
         * @param {object} query 携带的参数 非必填
         */
        replaceToRouter: function replaceToRouter(url, query) {
            let routerConfig = {
                path: url,
            }

            query ? routerConfig.query = query : null; // 初始化携带的参数 非必填

            this.$router.replace(routerConfig);
        },
	},
}

</script>

<style scoped lang="less">
@black1: #303133;
@black2: #606266;
@black3: #909399;
@black4: #C0C4CC;

// 人机验证模态框
@machine-verify-modal-z-index: 2;
@machine-verify-shade-z-index: 2;
@machine-verify-content-z-index: 3;

.register {
    position: relative;
    width: 100%;
    min-height: 100%;
    background-color: #f5f5f5;
}

// 输入
.register-input {
    padding-top: 10px;
    font-size: 14px;

    // 框架
    .register-content {
        background-color: #fff;
        padding-left: 15px;

        .register-input-item {
            height: 45px;

            .input-item-lable {
                color: @black1;
                width: 70px;
            }
        }

        input {
            width: 95%;
            padding: 0px 2.5%;
            border: none;
            outline: none;
            font-size: 14px;
            color: @black1;
            background-color: transparent;
        }

        input::-webkit-input-placeholder,
        input::-moz-placeholder,   /* Mozilla Firefox 19+ */
        input:-moz-placeholder,  /* Mozilla Firefox 4 to 18 */
        input:-ms-input-placeholder { /* Internet Explorer 10-11 */ 
            color: @black1;
        }
    }

    // 获取验证码
    .input-item-verify {
        height: 30px;
        padding-right: 15px;

        .item-verify-content {
            height: 30px;
            line-height: 30px;
            width: 100px;
            text-align: center;
            border-radius: 4px;
            color: #FF8D18;
            border: 1px solid #FF8D18;
            background: #FFF5EA;
        }

        .item-verify-disable {
            color: @black2;
            border: 1px solid #CCCCCC;
            background: #F5F5F5;
        }
    }

    // 横线
    .register-input-line {
        background-color: #ddd;
        height: 1px;
        width: 100%;
    }
}

// 人机验证模态框
.machine-verify-modal {
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    z-index: @machine-verify-modal-z-index;

    // 遮罩层
    .verify-modal-shade {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        z-index: @machine-verify-shade-z-index;
        background-color: rgba(0, 0, 0, 0.46);
    }

    // 内容
    .verify-modal-main {
        position: relative;
        border-radius: 5px;
        background: #fff;
        z-index: @machine-verify-content-z-index;
    }

    // 标题
    .modal-main-title {
        padding-top: 15px;
        padding-left: 15px;
        padding-bottom: 15px;
        font-size: 16px;
        color: @black1;
    }

    // 输入
    .modal-main-input {
        padding-left: 15px;
        padding-right: 15px;
        // border-top: 1px solid #ddd;
        // border-bottom: 1px solid #ddd;
        min-height: 45px;

        input {
            line-height: 45px;
            border: none;
            outline: none;
            font-size: 14px;
            color: @black1;
            background-color: transparent;
        }

        div {
            height: 100%;
        }

        input::-webkit-input-placeholder,
        input::-moz-placeholder,   /* Mozilla Firefox 19+ */
        input:-moz-placeholder,  /* Mozilla Firefox 4 to 18 */
        input:-ms-input-placeholder { /* Internet Explorer 10-11 */ 
            color: @black1;
        }
    }

    // 错误信息
    .modal-main-error {
        padding: 15px 15px 0px 15px;
        font-size: 14px;
        color: #F56C6C;
    }

    // 确认按钮
    .main-confirm-content {
        padding: 15px;

        .modal-main-confirm {
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            border-radius: 3px;
            text-align: center;
            color: #fff;
            background-color: #E50012;
        }
    }
}

.machine-verify-show {
    display: flex;
}

// 协议
.register-agreement {
    padding: 0px 15px;

    .register-agreement-content {
        height: 35px;

        // 单选框
        .agreement-radio-content {
            position: relative;
            top: 1px;
            width: 15px;
        }
    }

    // 单选框
    .register-agreement-radio path {
        fill: @black3;
    }
    
    // 单选框选中
    .agreement-radio-selected path {
        fill: #E50012;
    }

    // 协议文本
    .register-agreement-text {
        padding-left: 5px;
        font-size: 12px;
        color: @black3;

        span {
            color: #5594FF;
        }
    }
}

// 提交
.register-submit {
    padding: 10px 15px;
    
    .register-submit-content {
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        border-radius: 3px;
        text-align: center;
        color: #fff;
        background-color: #E50012;
    }
}

</style>
