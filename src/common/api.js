import axios from 'axios'
import qs from 'qs'

// axios 配置
axios.defaults.timeout = 15000;
axios.defaults.baseURL = '/';
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.headers['X-Requested-With'] = "XMLHttpRequest"; //这是一个ajax请求
axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name="csrf-token"]').attr('content');


//传参序列化
axios.interceptors.request.use((config) => {
    config.data = qs.stringify(config.data);
    //if(config.method  === 'post'){
    //    config.data = qs.stringify(config.data);
    //}
    return config;
},(error) =>{
    new PNotify({
        title: '敬告',
        text: '错误的传参',
        type: 'warning',
    });

    return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use((res) =>{
    if(res.data.hasOwnProperty('result')) {
        if(!res.data.result){
            if(res.data.hasOwnProperty('code') && res.data.code === 200002) {
                new PNotify({
                    title: '敬告',
                    text: res.data.message,
                    type: 'warning',
                });
                return;
            }

            new PNotify({
                title: '敬告',
                text: (res.data.hasOwnProperty('message') ? res.data.message : '-101 网络错误，请稍后再试或联系客服'),
                type: 'warning',
            });
            return Promise.reject(res);
        }
        return res;
    } else {
        new PNotify({
            title: '敬告',
            text: (res.data.hasOwnProperty('message') ? res.data.message : '数据返回异常，请稍后再试或联系客服'),
            type: 'warning',
        });
    }
}, (error) => {

    new PNotify({
        text: ('网络异常,请稍后再试或联系管理员'),
        type: 'warning',
    });
    return Promise.reject(error);
});

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
              .then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        })
              .catch((error) => {
            reject(error)
        })
    })
}
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
              .then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        })
              .catch((error) => {
            reject(error)
        })
    })
}

export function objToHttpParams(params) {
    if(params && !$.isEmptyObject(params)) {
        let str = '';
        for(let n in params) {
            str += n +'=' + params[n] +'&'
        }

        return '?' + str.substring(0, str.lastIndexOf('&'));
    }
    return '';
}

export default {
    /**
     * 获取任务列表
     */
    getAuditList(params) {
        return get('/task/get-audit-list'+ objToHttpParams(params))
    },

    /**
     * 审核通过
     */
    postAuditpass(id) {
        return post('/task/pass', { id: id })
    },
    /**
     * 审核失败
     */
    postAuditReject(id) {
        return post('/task/reject', { id: id })
    },
    /**
     * 获取折扣卷
     */
    getAllCoupons() {
        return get('/coupon/list')
    },
    /**
     * 获取草稿数据
     * @returns {*}
     */
    getAllPlanDraft() {
        return get('/task-plan-template/all')
    },
    getDeleteDraft(id) {
        return get('/task-plan-template/delete/' + parseInt(id))
    },
    getUserProfile() {
        return get('/user/profile')
    },
    //新媒体任务相关
    //获取任务平台
    getPlatform(params) {
        return get('/new-media-platform/search' + objToHttpParams(params))
    },
    //获取任务类型
    getTaskTypes(params) {
        return get('/new-media-source-type/search' + objToHttpParams(params))
    },
    postNewMediaPlan(params) {
        return post('/new-media-plan/add', params)
    },
    postNewMediaTaskPass(params) {
        return post('/new-media-task/pass', params)
    },
    postNewMediaTaskNotPass(params) {
        return post('/new-media-task/reject', params)
    },
    getSearchNewMediaPlan(params) {
        return get('/new-media-task/search' + objToHttpParams(params))
    },
    getNewMediaPlanStatusCountNumber(id) {
        return get('/new-media-task/get-count-group-by-status/' + id)
    }
}
