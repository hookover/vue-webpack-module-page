import Vuex from 'vuex'

let store = new Vuex.Store({
    modules: {}
});

store.registerModule('data', {
    state:     {
        is_loading: false,                 //显示加载中
        data:       {
            platform_id:         0,
            task_id:             0,
            task_price:          0,       //任务单价
            date_range:          {
                from: '',   //start_at
                to:   ''    //end_at
            },
            number:              3000,    //任务数量
            expedite:            0.00,    //加价多少

            content:             {},      //任务信息

            total_money:         0,       //待支付总额
            use_account_balance: false,   //是否使用了余额支付
            coupon_id:           '',      //优惠卷ID

            is_validate:         true,    //是否通过验证
            errors:              [],      //错误内容

            platforms:  [     //任务列表数据
                //{
                //    id:   1,
                //    name: '微信',
                //    logo: '/backend/dist/images/newmedia-type-logo/weixin.png'
                //}
            ],
            task_types: [     //任务类型数据
                //{
                //    id:             1,
                //    name:           '微信直投',
                //    platform_id:    1,
                //    description:    '微信直投，不需关注公众号,直接点击连接投票',
                //    business_price: 0.07,
                //    elements:       [
                //        {
                //            title:               '公众号',
                //            input_type:          'text',
                //            key:                 'public_weixin',
                //            help_tips:           '如：关注公众号"商推云"，并回复8',
                //            default_value:       '',
                //            placeholder:         '正确的公众号有助于提高合格率',
                //            verify_rule:         '',
                //            verify_fail_message: '',
                //            example_url:         '',
                //        }
                //    ],
                //},
            ],
        },
    },
    mutations: {
        updateIsLoading (state, payload) {
            state.is_loading = payload.is_loading
        },
        updateData (state, payload) {
            for (let n in payload) {
                state.data[n] = payload[n]
            }
        },
    },
    actions:   {
        updateIsLoading ({commit}, status) {
            commit('updateIsLoading', {is_loading: status})
        },
        updateData ({commit}, state) {
            commit('updateData', state)
        },
    },
    getters:   {
        getIsLoading: state => state.is_loading,
        getData:      state => state.data,
        getCurrentNewMediaTaskInfo: function (state) {
            if (state.data.platform_id && state.data.task_id) {
                for (let n in state.data.task_types) {
                    if (state.data.task_types[n].id === parseInt(state.data.task_id)) {
                        return state.data.task_types[n]
                    }
                }
            }
            return false;
        }
    }
});

export default store