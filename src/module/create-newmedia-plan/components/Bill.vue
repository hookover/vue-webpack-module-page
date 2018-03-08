<template>
    <div class="task-plan-section done mt50">
        <hr>
        <div class="form-group row">
            <div class="col-lg-10 text-right">
                <div class="col-lg-8 cost-module pt30 pb30"
                     style="background: rgba(0,0,0,0.025)">
                    <div class="row">
                        <div class="col-xs-6 text-left">
                            <label class="control-label">总合计费用 :</label>
                        </div>
                        <div class="col-xs-6 text-right">
                            <span class="s16">{{Number(money).toFixed(2)}}</span>云币
                        </div>
                    </div>

                    <!--优惠折扣码-->
                    <!--<div class="row">-->
                    <!--<div class="col-xs-6 text-left">-->
                    <!--<label class="control-label">优惠折扣码 :</label>-->
                    <!--</div>-->
                    <!--<div class="col-xs-6 text-right">-->
                    <!--<div class="input-group">-->
                    <!--<input type="text" class="form-control" v-model="pay_info.discount_code">-->
                    <!--<span class="input-group-btn">-->
                    <!--<button class="btn btn-danger" @click="discountCode">确认</button>-->
                    <!--</span>-->
                    <!--</div>-->

                    <!--<small>-->
                    <!--<template v-if="pay_info.discount_code !== ''">-->
                    <!--<template v-if=" pay_info.discount > 0">-->
                    <!--<span class="color-red">-->
                    <!--抵扣 -{{pay_info.discount.toFixed(2)}}云币-->
                    <!--</span>-->
                    <!--</template>-->
                    <!--<template v-if="pay_info.discount <= 0 || !pay_info.discount">-->
                    <!--{{init_data.message.discount}}-->
                    <!--</template>-->
                    <!--</template>-->
                    <!--</small>-->
                    <!--</div>-->
                    <!--</div>-->

                    <div class="row">
                        <div class="col-xs-6 text-left">
                            <label class="control-label">优惠卷:</label>
                        </div>
                        <div class="col-xs-6 text-right">
                            <select class="form-control" :class="{'color-red': (init_data.coupons.length > 0)}"
                                    v-model="pay_info.coupon_id">
                                <template v-if="init_data.coupons.length <= 0">
                                    <option value="">您暂无可用的优惠卷</option>
                                </template>
                                <template v-if="init_data.coupons.length > 0">
                                    <option value="">请选择优惠卷</option>
                                    <template v-for="(coupon, n)  in init_data.coupons">
                                        <option :disabled="!couponIsValid(n)" :value="coupon.id">
                                            {{coupon.name}}
                                        </option>
                                    </template>
                                </template>
                            </select>
                            <small class="color-red">
                                <template v-if="coupon_offer > 0">
                                    抵扣 -{{Number(coupon_offer).toFixed(2)}}云币
                                </template>
                            </small>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-xs-6 text-left">
                            <label class="control-label">是否使用余额抵扣 :</label>
                        </div>
                        <div class="col-xs-6 text-right">
                            <label style="font-weight: 300;">
                                <input v-model="pay_info.use_account_balance" type="checkbox"> 使用余额抵扣
                            </label>
                            <template v-if="pay_info.use_account_balance">
                                <p>账户可用余额： {{Number(pay_info.account_balance).toFixed(2)}}云币</p>
                                <small class="color-red"
                                       v-if="pay_info.use_account_balance && pay_info.account_balance > 0">
                                    抵扣 -{{Number(balance_deductible).toFixed(2)}}云币
                                </small>
                            </template>
                        </div>
                    </div>

                    <div class="price">
                        实际应付额：
                        <span class="num text-warning s38">{{Number(amount).toFixed(2)}}</span>云币
                    </div>
                    <!--<p class="color-red">一分投入，十分回报</p>-->

                    <div>
                        <a href="javascript:void(0)" class="btn btn-danger btn-lg" @click="release">
                            <i class="icon icon-check"></i>
                            立即发布您的推广计划
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../../common/api'
    import {mapActions, mapGetters, mapState} from 'vuex'

    export default {
        props: {
            money: {                //订单总金额
                required: true,
                type: Number
            },
            submit_function: {      //点击发布计划时执行的函数
                required: true,
            }
        },
        data: function () {
            return {
                pay_info:       {
                    discount:            0,             //折扣码最大可抵扣金额
                    discount_code:       '',            //折扣码
                    coupon_id:           '',            //优惠卷ID
                    coupon_code_obj:     {},            //为了恢复数据给的变量
                    use_account_balance: false,         //是否使用账户余额抵扣
                    account_balance:     0,             //账户可用余额
                    amount:              0,             //实际需支付金额
                },
                init_data:      {
                    message: {
                        discount: ''
                    },
                    coupons: [
//                        {
//                            id: 1,
//                            name: '无门槛减10元',
//                            amount: 0,        //满0元
//                            subtraction: 10,  //减10元
//                            discount: 0,      //折扣0
//                        },
//                        {
//                            id: 2,
//                            name: '满100元减20元',
//                            amount: 100,      //满100元
//                            subtraction: 20,  //减20元
//                            discount: 0,
//                        },
//                        {
//                            id: 3,
//                            name: '满1000元打9折',
//                            amount: 1000,
//                            subtraction: 0,
//                            discount: 0.1,
//                        },
//                        {
//                            id: 4,
//                            name: '9折优惠',
//                            amount: 0,
//                            subtraction: 0,
//                            discount: 0.1,
//                        },
                    ]
                },
                validate_status: false,
            }
        },
        mounted: function () {
            this.getAllCoupons();
            this.getProfile();
        },
        watch: {
            'pay_info.use_account_balance': function (val, old) {
                this.updateData({use_account_balance: val})
            },
            'pay_info.coupon_id':      function (val, old) {
                this.updateData({coupon_id: val})
                if (this.pay_info.coupon_id !== '') {
                    for (let n in this.init_data.coupons) {
                        if (this.init_data.coupons[n].id === parseInt(this.pay_info.coupon_id)) {
                            this.$set(this.pay_info, 'coupon_code_obj', $.extend(true, {}, this.init_data.coupons[n]))
                        }
                    }
                } else {
                    this.pay_info.coupon_code_obj = {};
                }
            },
            'pay_info.discount_code':  function (val, old) {
                this.pay_info.discount = 0;
            }
        },
        computed: {
            ...mapGetters({
                store_data: 'getData',
            }),
            //可使用折扣码抵扣的钱
            discount_code_money: function () {
                let money = 0;
                if (this.pay_info.discount && this.pay_info.discount_code) {
                    if ((this.money - this.pay_info.discount) > 0) {
                        money = this.pay_info.discount
                    } else {
                        money = this.money;
                    }
                }
                return Number(money);
            },
            //可使用优惠卷抵扣的金额
            coupon_offer_money:  function () {
                let money = 0;
                if (this.coupon_offer > 0) {
                    if ((this.money - this.discount_code_money - this.coupon_offer) > 0) {
                        money = this.coupon_offer
                    } else {
                        money = this.money - this.discount_code_money
                    }
                }

                return Number(money)
            },
            //可使用账户余额抵扣的钱
            balance_deductible:  function () {
                let money = 0;
                if (this.pay_info.use_account_balance === true) {
                    if ((this.money - this.discount_code_money - this.coupon_offer_money - this.pay_info.account_balance) > 0) {
                        money = this.pay_info.account_balance;
                    } else {
                        money = this.money - this.discount_code_money - this.coupon_offer_money
                    }
                }
                return Number(money);
            },

            //当前选择的优惠卷最大可抵扣金额
            coupon_offer: function () {
                let coupon_offer = 0;
                if (this.pay_info.coupon_code_obj.hasOwnProperty('id')) {
                    //订单价格必须大于优惠卷限制价格
                    if (this.money > this.pay_info.coupon_code_obj.amount) {
                        //满减
                        if (this.pay_info.coupon_code_obj.subtraction > 0) {
                            coupon_offer = this.pay_info.coupon_code_obj.subtraction
                        }
                        //满折
                        if (this.pay_info.coupon_code_obj.discount > 0) {
                            coupon_offer = this.money * (this.pay_info.coupon_code_obj.discount);
                        }
                    }
                }
                return coupon_offer;
            },
            amount:       function () {
                let amount = this.money - this.discount_code_money - this.coupon_offer_money - this.balance_deductible;

                this.$set(this.pay_info, 'amount', amount);
                return Number(amount);
            }
        },
        methods: {
            ...mapActions({
                updateData: 'updateData'
            }),
            release: function () {
                if(typeof this.$parent[this.submit_function] === 'function') {
                    return this.$parent[this.submit_function].apply(this.submit_function, this.$data);
                } else {
                    new PNotify({
                        text: '没有下单回调方法，请联系管理员！',
                        type: 'warning'
                    });
                }

            },

            getProfile:    function () {
                api.getUserProfile().then(
                    res => {
                        this.pay_info.account_balance = res.data.money
                    },
                    p => {

                    }
                )
            },
            getAllCoupons: function () {
                api.getAllCoupons().then(
                    res => {
                        this.init_data.coupons = res.data;
                    },
                    p => {

                    }
                )
            },
            /**
             * @param component
             */
            discountCode:  function (event) {
                if (this.pay_info.discount_code !== '') {
                    this.init_data.message.discount = '';
                    this.pay_info.discount          = 0;
                    let loading                     = $(event.target).ladda();
                    loading.ladda('start');

                    //ajax操作
                    let _self = this;
                    setTimeout(function () {
                        if (_self.pay_info.discount_code === 'testaabbccdd') {
                            _self.pay_info.discount = 10000;
                        } else if (_self.pay_info.discount_code === 'test') {
                            _self.pay_info.discount = 100;
                        } else {
                            _self.init_data.message.discount = '无效的优惠码！'
                        }

                        loading.ladda('stop');
                    }, 2000);
                }
            },
            couponIsValid: function (index) {
                let coupon = this.init_data.coupons[index];

                if (this.money > coupon.amount) {
                    return true;
                }

                return false;
            },
        }
    }
</script>