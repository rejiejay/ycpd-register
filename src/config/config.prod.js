// 生产环境配置
module.exports = {

    url: {
        origin1: 'http://picc.hotgz.com', // 请求源(服务器地址)
        origin2: 'http://ycpdapi.hotgz.com', // 请求源(服务器地址)
        
        wxappid: {
            ycpd: 'wx69b29a9a280c57d9', // 养车频道（YCPD微信公众号）
        },
    
        location: {
            ycpd: 'http://picc.hotgz.com/wx20/index.html', // 养车频道 地址
        },
        
        // 车辆品牌车系以及短信验证码
        carBrandSeriesCode: '/wx/Handler.ashx',
        
        // 获取手机验证码
        getMobileCode: 'http://ycpdapi.hotgz.com/Customer/GetVerifyCode',
        
        // 通过VIN查询公众接口获取车型列表
        getCarModelByVin: 'http://ycpdapi.hotgz.com/Customer/GetCarModelByVin',
        
        // 车主注册
        register: 'http://ycpdapi.hotgz.com/Customer/Register',
        
        // 初始化微信JS-SDK
        getWxConfig: 'http://picc.hotgz.com/wx/apiHandler.ashx',
        
        // 获取车主的车辆信息
        getCarList: 'http://ycpdapi.hotgz.com/Customer/GetCarList',

        // 获取人机验证码
        getMachineCode: 'http://ycpdapi.hotgz.com/Customer/GetVCodeImage',

        // 校验验证码与手机号是否正确
        checkVerifyCode: 'http://ycpdapi.hotgz.com/Customer/CheckVerifyCode',
        
        // 添加/编辑车主汽车
        saveCar: 'http://ycpdapi.hotgz.com/Customer/SaveCar',

        // 删除车主汽车
        deleteCar: 'http://ycpdapi.hotgz.com/Customer/DeleteCar',

        //跳转优惠加油列表
        getStationHandler: `http://${window.location.host}/wx/Handler.ashx`,
    }
};
