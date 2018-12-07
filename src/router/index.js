import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    /**
     * 注册
     * 因为有持久化的需求
     */
    {
        path: '/index/:openid', // 微信 用户标识 o9rEN0_rX4ySFsIbKi5MBL8YGnAg
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
     * @param {String} customerid 养车频道 用户标识 180910010001949590
     */
    {
        path: '/mycar/:customerid/:yuyue/:openId/:name',
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
