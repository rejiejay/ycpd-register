import Vue from 'vue';
import Vuex from 'vuex';

import store from './store/index';
import router from './router';
import Index from './index.vue';

import 'mint-ui/lib/style.min.css'; // mint-ui 样式
import "./components/css/index.less"; // 顶层样式

Vue.config.productionTip = false;

Vue.use(Vuex);

if (process.env.NODE_ENV === 'development' || window.location.origin === 'http://store.demo.ichebaoyang.com') { // 如果是测试环境, 则生成控制台
    require.ensure([], require => { // 异步加载控制台
        let VConsole = require('vconsole');

        let defaultPlugins = ['system', 'network', 'element', 'storage'];

        // 本地测试不需要 system 输出
        if (window.location.host === 'localhost:8000') { 
            defaultPlugins = ['network', 'element', 'storage']
        }

        new VConsole({
            defaultPlugins: defaultPlugins
        });
    });
}

window.myVue = new Vue({
    el: '#app',
    store: store,
    components: { Index },
    template: '<Index/>',
    router,
});
