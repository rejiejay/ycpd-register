// 共同配置
module.exports = {
    /**
     * 微信 url 链接 附带 code 地址 复用的方法
     * @param {string} redirect_uri 需要加密的URL
     * @param {string} appid 公众号的appid
     */
    initUrlWidthWxCodeBy: function initUrlWidthWxCodeBy(redirect_uri, appid) {
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${window.encodeURIComponent(redirect_uri)}&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect`
    },

    /**
     * 养车频道 url 链接 附带 code
     */
    YcpdUrlWidthWxCode: function YcpdUrlWidthWxCode() {
        return this.initUrlWidthWxCodeBy(this.location.ycpd, this.wxappid.ycpd);
    },
};
