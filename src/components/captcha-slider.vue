<!-- 车牌输入 -->
<template>
<div class="captcha-slider">

    <!-- 滑动拼图部分 -->
    <div id="captcha-slider-content" class="captcha-slider-content">
        <!-- 刷新的按钮 -->
        <div class="captcha-slider-refresh" @click="initNumerical" :style="`left: ${sliderWidth - 23 - 15}px;`">
            <svg width="23" height="23" t="1543993084076" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1781" xmlns:xlink="http://www.w3.org/1999/xlink" >
                <path fill="#409EFF" d="M1020.444444 460.8 834.844444 230.4c-19.2-25.6-57.6-25.6-76.8 0L572.444444 460.8c-12.8 19.2 0 44.8 19.2 44.8l70.4 0c0 134.4 0 307.2-243.2 448-6.4 6.4 0 12.8 6.4 12.8 454.4-70.4 492.8-377.6 492.8-460.8l76.8 0C1020.444444 505.6 1033.244444 480 1020.444444 460.8L1020.444444 460.8 1020.444444 460.8zM438.044444 518.4 361.244444 518.4c0-134.4 0-307.2 243.2-448 6.4-6.4 0-12.8-6.4-12.8C143.644444 128 105.244444 435.2 105.244444 518.4L28.444444 518.4C2.844444 518.4-9.955556 544 9.244444 563.2L194.844444 793.6c19.2 25.6 57.6 25.6 76.8 0l185.6-230.4C470.044444 544 457.244444 518.4 438.044444 518.4L438.044444 518.4 438.044444 518.4z" p-id="1782"></path>
            </svg>
        </div>

        <canvas ref="captchasliderbackground" class="captcha-slider-background"></canvas>
        <canvas ref="captchasliderobjective" class="captcha-slider-objective captcha-slider-position"></canvas>
        <canvas ref="captchasliderblockshadow" :style="`left: ${targetLeftStyle}px`" class="captcha-slider-blockshadow captcha-slider-position"></canvas>
        <canvas ref="captchasliderblock" :style="`left: ${targetLeftStyle}px`" class="captcha-slider-block captcha-slider-position"></canvas>
    </div>

    <!-- 底部拖动部分 -->
    <div class="captcha-slider-drag" :class="{'slider-drag-activate': dragHandleIcon === 'active', 'slider-drag-succeed': dragHandleIcon === 'succeed', 'slider-drag-failure': dragHandleIcon === 'failure'}" ref="sliderdragcontent" :style="`width: ${sliderWidth - 2}px;`">
        
        <div class="slider-drag-mask" ref="dragmask" :style="`width: ${dragmaskwidth}px;`">
            <div class="slider-drag-handle flex-center" ref="draghandle" :style="`left: ${draghandleleft}px;`">

                <svg v-if="dragHandleIcon === 'normal' || dragHandleIcon === 'active'" t="1530238656201" width="23" height="23" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2557" xmlns:xlink="http://www.w3.org/1999/xlink" >
                    <path d="M244.363636 556.939636h469.248l-184.762181 170.565819a34.909091 34.909091 0 1 0 47.36 51.29309l250.391272-231.121454a34.955636 34.955636 0 0 0 0-51.293091l-250.391272-231.121455a34.862545 34.862545 0 0 0-49.338182 1.95491 34.909091 34.909091 0 0 0 1.978182 49.338181l184.762181 170.565819H244.363636a34.909091 34.909091 0 1 0 0 69.818181" p-id="2558"></path>
                </svg>

                <svg v-else-if="dragHandleIcon === 'succeed'" width="24" height="24" t="1530238678016" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3369" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path fill="#fff" d="M378.410667 850.450963C364.491852 850.450963 350.610963 845.293037 340.02963 834.939259L20.920889 523.529481C-0.279704 502.821926-0.279704 469.295407 20.920889 448.587852 42.121481 427.880296 76.48237 427.880296 97.682963 448.587852L378.410667 722.526815 925.75763 188.491852C946.958222 167.784296 981.319111 167.784296 1002.519704 188.491852 1023.720296 209.161481 1023.720296 242.688 1002.519704 263.395556L416.791704 834.939259C406.172444 845.293037 392.291556 850.450963 378.410667 850.450963L378.410667 850.450963Z" p-id="3370"></path>
                </svg>

                <svg v-else-if="dragHandleIcon === 'failure'" width="24" height="24" t="1530238678016" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3369" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path fill="#fff" d="M733.952 336.333l-46.285-46.285L512 465.664 336.333 290.048l-46.285 46.285L465.664 512 290.048 687.667l46.285 46.285L512 558.336l175.667 175.616 46.285-46.285L558.336 512z" p-id="4163"></path>
                </svg>
            </div>
        </div>

        <div class="slider-drag-text" ref="dragtext">{{dragText}}</div>
    </div>

</div>
</template>

<script>

export default {
    name: 'captchaSlider',

	data: function data() { 
        return {
            clientWidth: document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth, // 设备的宽度
            clientHeight: document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight, // 设备高度

            sliderHeight: 155,
            sliderWidth: 310,
            my_x_axis: 0,
            target_x_axis: 100, // 目标位置
            matchOffset: 3, // 匹配 偏差范围

            targetLeftStyle: 0,

            dragText: '向右滑动滑块验证',

            dragmaskwidth: 0,
            draghandleleft: 0,

            /**
             * 拖动的 icon
             * @param {string} normal 正常 icon
             * @param {string} active 激活 icon
             * @param {string} succeed 成功 icon
             * @param {string} failure 失败 icon
             */
            dragHandleIcon: 'normal',
        } 
    },

    mounted: function mounted() {
        this.initCanvas(); // 初始化 Canvas

        // 初始化拖动事件
        this.initSliderDrag();

        // 因为有时候不知道为啥会获取失败, 所以分别延时获取3次
        setTimeout(() => {
            this.initCanvasBackground();
        }, 1000);
        setTimeout(() => {
            this.initCanvasBackground();
        }, 2000);
    },

	methods: {
        /**
         * 初始化 数值
         */
        initNumerical: function initNumerical() {
            this.dragHandleIcon = 'normal';
            this.my_x_axis = 0;
            this.draghandleleft = 0;
            this.dragmaskwidth = 0;
            this.targetLeftStyle = this.my_x_axis - this.target_x_axis;
            this.dragText = '向右滑动滑块验证';

            this.initCanvasBackground();
        },

        /**
         * 初始化 图片
         */
        initCanvasBackground: function initCanvasBackground() {
            const _this = this;

            // 初始化 图片
            let background_ctx = this.$refs.captchasliderbackground.getContext('2d');
            let block_ctx = this.$refs.captchasliderblock.getContext('2d');
            var imgElement = document.createElement('img');
            imgElement.onload = function() {
                background_ctx.drawImage(imgElement, 0, 0, _this.sliderWidth, _this.sliderHeight);
                block_ctx.drawImage(imgElement, 0, 0, _this.sliderWidth, _this.sliderHeight);
            };

            imgElement.src = 'https://ycpd-assets.oss-cn-shenzhen.aliyuncs.com/ycpd/component/captcha-slider/picture/canvas%20(' + this.creatRandomBy(1, 20) + ').jpg?x-oss-process=image/resize,m_fill,w_300,h_150,limit_0/auto-orient,0/quality,q_100';
        },

        /**
         * 生成随机数的方法
         * @param {number} min 下限
         * @param {number} max 上限
         * @return {number} 基于 min ~ max 之间随机数
         */
        creatRandomBy: function creatRandomBy(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * 初始化 Canvas
         */
        initCanvas: function initCanvas() {
            const _this = this;

            let objective_ctx = this.$refs.captchasliderobjective.getContext('2d');
            let block_ctx = this.$refs.captchasliderblock.getContext('2d');
            let blockshadow_ctx = this.$refs.captchasliderblockshadow.getContext('2d');

            var PI = Math.PI;
            var block_width = 42;
            var block_radius = 10;

            // 初始化 Y轴坐标
            var min_y_coordinate = block_radius * 2 + 15;
            var max_y_coordinate = this.sliderHeight - block_width;
            var random_y_coordinate = this.creatRandomBy(min_y_coordinate, max_y_coordinate);


            // 初始化 Y轴坐标
            var min_x_coordinate = block_width + (block_radius * 2) + 15;
            var max_x_coordinate = this.sliderWidth - block_width - (block_radius * 2) - 15;
            this.target_x_axis = this.creatRandomBy(min_x_coordinate, max_x_coordinate);
            var random_x_coordinate = this.target_x_axis;

            /**
             * 绘制拼图的方法
             */
            function drawpuzzle(ctx, puzzle_width, puzzle_radius, x_coordinate, y_coordinate) {
                ctx.moveTo(x_coordinate, y_coordinate);
                ctx.lineTo(x_coordinate + puzzle_width / 2, y_coordinate);
                ctx.arc(x_coordinate + puzzle_width / 2, y_coordinate-puzzle_radius+2,  puzzle_radius, 0, 2*PI);
                ctx.lineTo(x_coordinate + puzzle_width / 2, y_coordinate);
                ctx.lineTo(x_coordinate + puzzle_width, y_coordinate);
                ctx.lineTo(x_coordinate + puzzle_width, y_coordinate +puzzle_width / 2);
                ctx.arc(x_coordinate + puzzle_width + puzzle_radius - 2, y_coordinate +puzzle_width / 2, puzzle_radius, 0, 2*PI);
                ctx.lineTo(x_coordinate + puzzle_width, y_coordinate +puzzle_width / 2);
                ctx.lineTo(x_coordinate + puzzle_width, y_coordinate +puzzle_width);
                ctx.lineTo(x_coordinate, y_coordinate + puzzle_width);
                ctx.lineTo(x_coordinate, y_coordinate);
            }
    
            /**
             * 绘制目标位置拼图
             */
            function drawObjective() {
                objective_ctx.beginPath();
                drawpuzzle(objective_ctx, block_width, block_radius, random_x_coordinate, random_y_coordinate);
                objective_ctx.fillStyle = '#fff';
                objective_ctx.fill();
            }

            /**
             * 绘制滑块
             */
            function drawBlock() {
                block_ctx.beginPath();
                drawpuzzle(block_ctx, block_width, block_radius, random_x_coordinate, random_y_coordinate);
                block_ctx.clip();
            }

            /**
             * 绘制滑块的阴影
             */
            function drawBlockshadow() {
                blockshadow_ctx.beginPath();
                blockshadow_ctx.shadowBlur = 20;
                blockshadow_ctx.shadowColor = "#fff";
                drawpuzzle(blockshadow_ctx, block_width, block_radius, random_x_coordinate, random_y_coordinate);
                blockshadow_ctx.fillStyle = '#fff';
                blockshadow_ctx.fill();
            }

            // 开始绘制 canvas
            drawObjective();
            drawBlock();
            drawBlockshadow();
            this.initNumerical(); // 初始化 数值
        },

        /**
         * 初始化 拖动
         */
        initSliderDrag: function initSliderDrag() {
            var _this = this;

            /**
             * 判断是否移动设备
             */
            var isMobiler = (function () {
                var isMobile = false;
            
                var myWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth;
            
                if (myWidth <= 768) { // 保底策略
                    isMobile = true;
                }
            
                ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod'].map(function (terminal) {
                    if (window.navigator.userAgent.indexOf(terminal) > 0) {
                    isMobile = true;
                    }
                    return terminal;
                })
            
                return isMobile
            })();

            // 位移量
            var originX = 0;
            var originY = 0;
            var moveX = 0;
            var moveY = 0;

            // 定位成功
            var isMatch = false;

            /**
             * 拖动位置
             */
            var dragLocationModifier = function () {
                // 删除文字
                _this.dragText = '';

                // 添加激活状态
                _this.dragHandleIcon = 'active';

                _this.my_x_axis = moveX;
                _this.targetLeftStyle = _this.my_x_axis - _this.target_x_axis;
                _this.draghandleleft = moveX;
                _this.dragmaskwidth = moveX;
            }

            var handleMouseMove = function (event) {
                // 位移量
                var mouseOffset = 0;
                if (isMobiler) { // 兼容移动端
                    mouseOffset = event.changedTouches[0].clientX - originX;
                } else {
                    mouseOffset = event.x - originX
                }

                // 移动到目标 范围
                if (
                    mouseOffset > 0 &&  // 不能负数
                    mouseOffset < (_this.sliderWidth -  62) // 不能超过
                ) {
                    moveX = mouseOffset;
                    moveY = event.y - originY;
                }

                // 匹配目标
                if (
                    mouseOffset >= (_this.target_x_axis - _this.matchOffset) && // 偏差
                    mouseOffset <= (_this.target_x_axis + _this.matchOffset)
                ) {
                    isMatch = true;
                } else {
                    isMatch = false;
                }

                dragLocationModifier();
            };

            var handleMouseEnd = function handleMouseEnd() {

                if (isMatch) { // 成功
                    _this.dragHandleIcon = 'succeed';
                    
                    _this.$emit('resolve');
                } else {
                    _this.dragHandleIcon = 'failure';

                    setTimeout(function() {
                        _this.initNumerical.call(_this);
                    }, 1000);
                }

                if (isMobiler) { // 兼容移动端
                    window.removeEventListener('touchmove', handleMouseMove);
                    window.removeEventListener('touchend', handleMouseEnd);
                } else {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseEnd);
                }
            };

            if (isMobiler) { // 兼容移动端
                this.$refs.draghandle.addEventListener('touchstart', function (event) {
                    // 原始坐标
                    originX = event.changedTouches[0].clientX;
                    originY = event.changedTouches[0].clientY;
            
                    window.addEventListener('touchmove', handleMouseMove);
                    window.addEventListener('touchend', handleMouseEnd);
                }); 
            } else {
                this.$refs.draghandle.addEventListener('mousedown', function (event) {
                    // 原始坐标
                    originX = event.x;
                    originY = event.y;
            
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseEnd);
                }); 
            }
        }

    }
}

</script>

<style scoped lang="less">
@black1: #303133;
@black2: #606266;
@black3: #909399;
@black4: #C0C4CC;

.captcha-slider {
    // 拼图
    .captcha-slider-content {
        position: relative;

        .captcha-slider-position {
            position: absolute;
            top: 0px;
            left: 0px;
        }

        // 刷新
        .captcha-slider-refresh {
            position: absolute;
            top: 15px;
            z-index: 2;
            cursor: pointer;

            svg {
                fill: #fff;
            }
        }

        .captcha-slider-refresh:hover {
            svg {
                fill: #F56C6C;
            }
        }
    }

    // 滑块
    .captcha-slider-drag {
        position: relative;
        text-align: center;
        width: 310px;
        height: 40px;
        line-height: 40px;
        margin-top: 15px;
        background: #f7f9fa;
        color: #45494c;
        border: 1px solid #e4e7eb;

        .slider-drag-mask {
            position: absolute;
            left: 0;
            top: 0;
            height: 40px;
            border: 0 solid #1991FA;
            background: #D1E9FE;

            .slider-drag-handle {
                position: absolute;
                top: 0;
                left: 0;
                width: 40px;
                height: 40px;
                background: #fff;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transition: background 0.2s linear;
                
                svg {
                    fill: #606266;
                    transition: fill 0.2s linear;
                }
            }

            .slider-drag-handle:hover {
                background: #1991FA;
                
                svg {
                    fill: #fff;
                }
            }
        }

        .slider-drag-text {
            color: @black2;
            font-size: 16px;
            text-align: center;
            line-height: 40px;
            user-select: none;
            -webkit-user-select: none;
        }
    }

    // 滑块激活
    .slider-drag-activate .slider-drag-mask {
        height: 38px;
        border: 1px solid #1991FA;

        .slider-drag-handle {
            height: 38px;
            top: -1px;
            background: #1991FA;
            border: 1px solid #1991FA;

            svg {
                fill: #fff;
            }
        }
    }

    // 滑块成功
    .slider-drag-succeed .slider-drag-mask {
        height: 38px;
        border: 1px solid #52CCBA;
        background: #D2F4EF;

        .slider-drag-handle {
            height: 38px;
            top: -1px;
            background: #52CCBA;
            border: 1px solid #52CCBA;

            svg {
                fill: #fff;
            }
        }

        .slider-drag-handle:hover {
            background: #52CCBA;
        }
    }
    // 滑块失败
    .slider-drag-failure .slider-drag-mask {
        height: 38px;
        border: 1px solid #f57a7a;
        background: #fce1e1;

        .slider-drag-handle {
            height: 38px;
            top: -1px;
            background: #f57a7a;
            border: 1px solid #f57a7a;

            svg {
                fill: #fff;
            }
        }

        .slider-drag-handle:hover {
            background: #f57a7a;
        }
    }
}


</style>
