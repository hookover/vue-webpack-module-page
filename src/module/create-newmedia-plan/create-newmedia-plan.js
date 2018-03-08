import '../../assets/js/custom_small_validator';
import '../../assets/js/VeeValidate';

import App from './App'
import store from '../../vuex/store'


Vue.config.productionTip = false;

//初始化token
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

new Vue({
    store,
    el:         '#app',
    template:   '<App ref="create-wechat-plan"/>',
    components: {App}
});