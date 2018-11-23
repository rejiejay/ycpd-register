/**
 * 使用 微信 && 百度 && HTML5 进行定位
 */
import initJSSDK from './initJSSDK.js'; // 请求地址
import { Indicator } from 'mint-ui'; // mint-ui 组件

/**
 * 使用 微信 进行定位
 */
let getWxLocation = function getWxLocation() {
    return new Promise((resolve, reject) => {
        initJSSDK(['getLocation', 'openLocation'])
        .then(
            () => {
                wx.getLocation({
                    type: 'wgs84',
            
                    success(res) {
                        resolve({
                            longitude: res.longitude,
                            latitude: res.latitude,
                        });
                    },
    
                    fail(res) {
                        reject("微信获取地理位置信息失败：" + res.errMsg);
                    },
    
                    cancel() {
                        reject("微信获取地理位置信息被取消");
                    }
                });
                
                // 5秒超时
                setTimeout(function () {
                    reject('微信获取地理位置信息超时!');
                }, 5000);
            }, 
            error => reject(error)
        )
    });
}

/**
 * 百度坐标系 (BD-09) 转 WGS84坐标系
 * 即 百度 转 国际标准，谷歌国外地图、osm地图、微信
 * @param {Number} longitude 百度坐标 经度
 * @param {Number} latitude 百度坐标 纬度
 */
let baiMaptoWGS84 = function baiMaptoWGS84(longitude, latitude) {
    /**
     * Created by Wandergis on 2015/7/8.
     * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
     */

    //定义一些常量
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;

    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    function bd09togcj02(bd_lon, bd_lat) {
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat]
    }

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    function gcj02tobd09(lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    }

    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    function wgs84togcj02(lng, lat) {
        if (out_of_china(lng, lat)) {
            return [lng, lat]
        }
        else {
            var dlat = transformlat(lng - 105.0, lat - 35.0);
            var dlng = transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [mglng, mglat]
        }
    }

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    function gcj02towgs84(lng, lat) {
        if (out_of_china(lng, lat)) {
            return [lng, lat]
        }
        else {
            var dlat = transformlat(lng - 105.0, lat - 35.0);
            var dlng = transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [lng * 2 - mglng, lat * 2 - mglat]
        }
    }

    function transformlat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    }

    function transformlng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    }

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    function out_of_china(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }

    /**
     * 百度坐标 转换为 GCJ-02
     */
    let myGCJ02 = bd09togcj02(longitude, latitude);
    let GCJlongitude = myGCJ02[0]; // GCJ-02坐标系 经度
    let GCJlatitude = myGCJ02[1]; // GCJ-02坐标系 纬度

    /**
     * GCJ-02坐标 转换为 WGS84
     */
    let myWGS84 = gcj02towgs84(GCJlongitude, GCJlatitude);

    return {
        longitude: myWGS84[0], // WGS84坐标系 经度
        latitude: myWGS84[1], // WGS84坐标系 纬度
    }
}

/**
 * 使用 百度 进行定位
 * @param {Function} resolve 表示解决
 * @param {Function} reject 表示失败
 * @param {Object} self this
 */
let getBMapLocation = function getBMapLocation(resolve, reject, self) {
    new BMap.Geolocation()
    .getCurrentPosition(function (res) {
        // 判断百度定位 是否成功
        if( this.getStatus() == BMAP_STATUS_SUCCESS ) {
            
            /**
             * 百度定位 成功
             */
            Indicator.close(); // 关闭提示信息
            
            // 转换坐标系
            let myLocation = baiMaptoWGS84(res.point.lng, res.point.lat);
            saveLocation(myLocation, self); // 存储 百度定位成功的坐标
            resolve(myLocation); // 整个项目 返回成功
        } else {

            /**
             * 百度定位 失败
             * 使用 HTML5 进行定位
             */
            console.error('百度获取位置信息失败, 原因:' + this.getStatus()); // 打印错误信息
            getHtml5Location(resolve, reject, self);
        }
    });
}

/**
 * 使用 HTML5 进行定位
 * @param {Function} resolve 表示解决
 * @param {Function} reject 表示失败
 * @param {Object} self this
 */
let getHtml5Location = function getHtml5Location(resolve, reject, self) {
    window.navigator.geolocation.getCurrentPosition(
        res => {
            /**
             * HTML5定位 成功
             */
            Indicator.close(); // 关闭提示信息

            let html5Position = {
                longitude: res.coords.longitude,
                latitude: res.coords.latitude,
            }

            saveLocation(html5Position, self); // 存储 微信定位成功的坐标
            resolve(html5Position);
        },

        error => {
            /**
             * HTML5定位 失败
             */
            Indicator.close(); // 关闭提示信息

            console.error('HTML5获取位置信息失败, 原因:' + JSON.stringify(error)); // 打印错误信息
            reject('定位失败, 请打开手机应用权限设置. 开启定位服务.');
        }
    );
}

/**
 * 位置信息 (复用)
 * 1. 存储到 window.localStorage
 * 2. 设置 localStorage 失效时间
 * 3. 存储到 vuex
 * @param {Object} position longitude latitude
 * @param {Object} self this
 */
let saveLocation = function saveLocation(position, self) {
    // 存储到 window.localStorage
    localStorage.setItem('longitude', position.longitude);
    localStorage.setItem('latitude', position.latitude);

    // 设置 失效时间
    localStorage.setItem('getPositionTime', new Date().getTime());

    // 存储到 vuex
    self.$store.commit('initLocation', {
        state: true,
        latitude: position.latitude,
        longitude: position.longitude,
        cityname: '深圳' // 默认深圳
    });
}

/**
 * 使用 微信 && 百度 && HTML5 进行定位
 * @param {boolean} isRefresh 是否强制刷新定位
 */
let html5WxBMapLocation = function html5WxBMapLocation(self, isRefresh) {
    return new Promise((resolve, reject) => {
        /**
         * 1. 判断是否 离线缓存了位置信息
         * 2. 并且 判断缓存位置信息 是否 有效 (2小时失效)
         * 3. 并且 判断缓存位置信息 是否 不需要强制刷新定位
         */
        if (window.localStorage && window.localStorage.longitude && window.localStorage.latitude && parseInt(localStorage.getPositionTime) < (new Date().getTime() + 7200000) && !isRefresh) {
            /**
             * 已缓存位置信息
             * 则 存储到 vuex
             */
            let myPosition = { longitude: window.localStorage.longitude, latitude: window.localStorage.latitude }
            self.$store.commit('initLocation', { 
                state: true,
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
                cityname: '深圳' // 默认深圳
            });

            resolve(myPosition);
        } else {
            /**
             * 判断是否本地坏境
             * 如果是本地环境, 定位是失败的, 返回假数据
             */
            if (window.location.hostname === 'localhost') {

                resolve({ longitude: 114.059560, latitude: 22.542860 });
            } else {

                // 开始获取定位
                Indicator.open('正在获取定位...'); // 开启提示信息

                /**
                 * 使用微信进行定位
                 */
                getWxLocation()
                .then(
                    wxPosition => {
                        /**
                         * 微信定位 成功
                         */
                        Indicator.close(); // 关闭提示信息

                        saveLocation(wxPosition, self); // 存储 微信定位成功的坐标
                        resolve(wxPosition); // 整个项目 返回成功
                    },
                    error => {
                        /**
                         * 微信定位 失败
                         */
                        console.error(error); // 打印错误信息
                        getBMapLocation(resolve, reject, self); // 使用百度定位
                    }
                );
            }
        }
    });
}

export default html5WxBMapLocation;
