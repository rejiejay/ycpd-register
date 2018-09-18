/**
 * 单一状态树 唯一数据源 (SSOT)
 */

let state = {
    openid: false, // 微信对应用户身份的 openid
    customerid: '', // 养车频道 对应用户身份的 id
    carid: '', // 养车频道 对应用户身份的 车辆 id
    city: '', // 对应用户身份所在城市

    mobile: '', // 养车频道 对应用户身份的 电话号码
    verifyCode: '', // 注册 用户使用 验证码
};

export default state
