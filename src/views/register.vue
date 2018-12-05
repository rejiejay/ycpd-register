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
                
                <div class="modal-main-input flex-start-center">
                    <div id="captcha-slider" class="captcha-slider"></div>
                </div>
                
                <div class="main-confirm-content">
                </div>
            </div>
        </div>

        <!-- 【数字验证】人机验证模态框 -->
        <!-- <div class="machine-verify-modal flex-center" :class="{'machine-verify-show': isMachineModalShow}">
            <div class="verify-modal-shade" @click="isMachineModalShow = false"></div>
            <div class="verify-modal-main" :style="'width: ' + (clientWidth - 30) + 'px;'">

                <div class="modal-main-title">人机验证</div>
                
                <div class="modal-main-input flex-start-center">
                    <input class="flex-rest" v-model="machineNumber" placeholder="输入右边的验证码以获取短信验证码" />
                    <div class="flex-center" @click="renderBase64MachineNumber"><img ref="base64MachineNumber" src="" /></div>
                </div>
                <div class="modal-main-error" v-if="machineNumberErrorMsg !== ''">{{machineNumberErrorMsg}}</div>
                
                <div class="main-confirm-content">
                    <div class="modal-main-confirm" @click="checkVerifyCode">确认</div>
                </div>
            </div>
        </div> -->

        <!-- 协议 -->
        <div class="register-agreement">
            <div class="register-agreement-content flex-start-center" @click="isAgreement = !isAgreement">
                <div class="agreement-radio-content" 
                    :class="[isAgreement ? 'agreement-radio-selected' : 'register-agreement-radio']"
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
// 自定义组件类
import Consequencer from "@/utils/Consequencer";
import wxLocation from "@/components/wxLocation";
import carNoInput from "@/components/carNoInput";

export default {
    name: 'register',

    components: { carNoInput },

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
            
			machineNumberErrorMsg: '', // 人机验证码错误信息

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

    created: function created() { 
        // 实现本地缓存
        if(window.localStorage.getItem('phoneValue') && window.localStorage.getItem('verifyNumber')){
            this.verifyNumber = window.localStorage.getItem('verifyNumber')
            this.phoneValue = window.localStorage.getItem('phoneValue')
        }

        window.localStorage.setItem('openid', this.$route.params.openid)  // 本地存储 openid， 其他地方会用到
    },

	mounted: function mounted() { 
        // 初始化页面数据
        this.initPageData();

        // 初始化 【滑动拼图】人机验证模态框
        this.initCaptchaSlider();
    },
    
    watch: {
        /**
         * 监听输入验证码
         * 则将错误信息清空
         */
        machineNumber: function () {
            this.machineNumberErrorMsg = '';
        }
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
            // 页面状态 初始化
            this.$store.commit('initOpenid', this.$route.params.openid); // 设置到 vuex
            
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
         * 初始化 【滑动拼图】人机验证模态框
         */
        initCaptchaSlider: function initCaptchaSlider() {
            const _this = this;

            CaptchaSlider.init({
                id: 'captcha-slider',
                width: 310,
                height: 155,
            })
            .then(function (succeed) {
                _this.checkVerifyCode();
                // alert('succeed!');
            }, function (error) {

                // alert('error!');
            });
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

			// 校验手机号码
			if (this.verifyPhoneValue().result !== 1) {
				return alert(this.verifyPhoneValue().message);
			}

			// 判断是否正在获取验证码
			if (this.isVerifyGeting === false) { // 没有获取验证码的情况
				
                this.isMachineModalShow = true; // 弹出模态框
                // 不需要生成 数字验证码
				// this.renderBase64MachineNumber();
			}
		},

		/**
		 * 渲染验证码
		 */
		renderBase64MachineNumber: function renderBase64MachineNumber() {
			this.$refs.base64MachineNumber.src = ajaxs.getMachineCode(this.$route.params.openid);
		},

		/**
		 * 验证验证码是否正确
		 */
		checkVerifyCode: function checkVerifyCode() {
			var _this = this;

			// if (this.machineNumber.length !== 4) {
			// 	return alert('请输入正确验证码');
			// }

			// 图形验证码移动的距离 暂时为零
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
                // _this.machineNumberErrorMsg = error;
			}); 
		},

		/**
		 * 跳转到 养车频道用户服务协议
		 */
		jumpToAgreement: function jumpToAgreement() {
            window.localStorage.setItem('phoneValue',this.phoneValue)
            window.localStorage.setItem('verifyNumber',this.verifyNumber)
			this.$router.push({ path: '/agreement/', });
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

			ajaxs.verifyMobileCodeNumber(this.phoneValue, this.verifyNumber)
			.then(function () {
                /**
                 * 存储数据到 vuex (全局)
                 * 简单的跳转逻辑犯不着用 vuex，徒增复杂度
                 * 直接路由带过去就行了
                 */
                _this.$store.commit('initPhone', { 
                    mobile: _this.phoneValue,
                    verifyCode: _this.verifyNumber,
                });
                
				_this.replaceToRouter('/supplement/register', {
                    mobile: _this.phoneValue,
                    verifyCode: _this.verifyNumber,
                    carNo: _this.carNoComponents.carNo,
                    carType: _this.carNoComponents.carType,
                });
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
