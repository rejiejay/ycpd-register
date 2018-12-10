import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    /**
     * 注册
     * 因为有持久化的需求 所以需要携带openid的
     * @param {String} customerid 养车频道 用户openid o9rEN0_rX4ySFsIbKi5MBL8YGnAg
     */
    {
        path: '/index/:openid',
        component: () => import('@/views/register/index'),
        children: [
            {
                path: 'index',
                alias: ['/'],
                name: 'register-main',
                component: () => import('@/views/register/register'),
                meta: { title: '注册' },
            }, {
                path: 'agreement',
                name: 'agreement',
                component: () => import('@/views/register/agreement'),
                meta: { title: '养车频道用户服务协议' },
            },
        ],
    },

    /**
     * 我的车辆列表
     * 目前 只有两个地方会跳转到这里来， 
     * 第一个地方是 车主入口 http://svn.hotgz.com:3390/svn/YCPD_Designer/主站点前端/车主端
     * 第二个地方是 车主入口预约 http://svn.hotgz.com:3390/svn/YCPD_Designer/其他项目前端/车主入口预约
     * @param {String} customerid 养车频道 用户标识 180910010001949590
     * @param {String} openid 养车频道 用户openid o9rEN0_rX4ySFsIbKi5MBL8YGnAg
     * @param {String} yuyue 有一个需求是从哪里来，然后跳转到哪里去，所以这里有一个预约
     * @param {String} name 这是名称
     */
    {
        path: '/mycar/:customerid/:openid',
        component: () => import('@/views/mycar'),
        meta: { title: '我的车辆' },
    }, 

    /**
     * 完善车辆信息
     * @param {String} pageType 页面状态 register editor creater
     */
    {
        path: '/supplement/:pageType',
        component: () => import('@/views/supplement'),
        meta: { title: '车辆信息' },
    }
];

let router = new Router({
    // mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) { // 路由发生变化修改页面 title
        document.title = to.meta.title;
    }

    next();
});

export default router;
