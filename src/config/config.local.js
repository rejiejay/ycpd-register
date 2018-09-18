// 测试环境配置
module.exports = {

    url: {
        origin1: 'http://store.demo.ichebaoyang.com', // 请求源(服务器地址)
        origin2: 'http://api.demo.hotgz.com', // 请求源(服务器地址)

        // 车辆品牌车系以及短信验证码
        carBrandSeriesCode: 'http://store.demo.ichebaoyang.com/wx/Handler.ashx',

        /**
         * 获取手机验证码
         * http://api.demo.hotgz.com/ 找不到与请求 URI“http://localhost:85/Customer/GetVerifyCode”匹配的 HTTP 资源。
         * http://store.demo.ichebaoyang.com/ 应用程序“YCPD_WX_JSZX”中的服务器错误, 暂时用下面这个
         */
        getMobileCode: 'http://api.demo.hotgz.com/Customer/GetVerifyCode',

        // 通过VIN查询公众接口获取车型列表
        getCarModelByVin: 'http://api.demo.hotgz.com/Customer/GetCarModelByVin',

        // 车主注册
        register: 'http://api.demo.hotgz.com/Customer/Register',

        // 初始化微信JS-SDK
        getWxConfig: 'http://store.demo.ichebaoyang.com/wx/apiHandler.ashx',

        // 获取车主的车辆信息
        getCarList: 'http://api.demo.hotgz.com/Customer/GetCarList',

        // 获取人机验证码
        getMachineCode: 'http://api.demo.hotgz.com/Customer/GetVCodeImage',

        // 校验验证码与手机号是否正确
        checkVerifyCode: 'http://api.demo.hotgz.com/Customer/CheckVerifyCode',

        // 添加/编辑车主汽车
        saveCar: 'http://api.demo.hotgz.com/Customer/SaveCar',

        // 删除车主汽车
        deleteCar: 'http://api.demo.hotgz.com/Customer/DeleteCar',
    }
};
