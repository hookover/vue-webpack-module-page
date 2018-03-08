<template>
    <div>
        <!--提交确认 开始-->
        <div class="task-plan-section done mt50">
            <hr>
            <div class="form-group row">
                <div class="col-lg-10 col-lg-offset-2 text-right row">
                    <div class="col-lg-6 col-lg-offset-6 col-md-8 col-md-offset-4 cost-module pt30 pb30"
                         style="background: rgba(0,0,0,0.025)">
                        <div class="row">
                            <div class="col-xs-6 text-left">
                                <label class="control-label">总合计费用 :</label>
                            </div>
                            <div class="col-xs-6 text-right">
                                <span class="s16">{{Number(cost).toFixed(2)}}</span>云币
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
                            <a href="javascript:void(0)" class="btn btn-primary btn-lg" @click="saveDraft">
                                <i class="icon icon-floppy-o"></i>
                                保存草稿
                            </a>
                            <a href="javascript:void(0)" class="btn btn-danger btn-lg" @click="release">
                                <i class="icon icon-check"></i>
                                立即发布您的推广计划
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {scrollFocus} from  '../../common/common';
    import {deepConvertBooleanToNumber, deepConvertStringToBoolean} from  '../../common/common';
    import {computeAllCost} from '../../common/common';
    import api from '../../common/api'

    export default {
        components: {},
        data () {
            return {
                task_data:      this.$parent.$data.task_data,
                root:           this.$root,
                root_form_data: this.$root.$data.form_data,
                pay_info:       {
                    total_price:         0,             //订单总金额（余额、优惠抵扣前金额）
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
                }
            }
        },
        created:    function () {
            this.$set(this.root_form_data, 'pay_info', this.pay_info);
        },
        computed:   {
            //总金额
            cost:                function () {
                let cost                                  = computeAllCost(this.task_data);
                this.root.form_data.base_type.total_price = cost;
                this.pay_info.total_price                 = cost;

                return cost;
            },
            //可使用折扣码抵扣的钱
            discount_code_money: function () {
                let money = 0;
                if (this.pay_info.discount && this.pay_info.discount_code) {
                    if ((this.cost - this.pay_info.discount) > 0) {
                        money = this.pay_info.discount
                    } else {
                        money = this.cost;
                    }
                }
                return Number(money);
            },
            //可使用优惠卷抵扣的金额
            coupon_offer_money:  function () {
                let money = 0;
                if (this.coupon_offer > 0) {
                    if ((this.cost - this.discount_code_money - this.coupon_offer) > 0) {
                        money = this.coupon_offer
                    } else {
                        money = this.cost - this.discount_code_money
                    }
                }

                return Number(money)
            },
            //可使用账户余额抵扣的钱
            balance_deductible:  function () {
                let money = 0;
                if (this.pay_info.use_account_balance === true) {
                    if ((this.cost - this.discount_code_money - this.coupon_offer_money - this.pay_info.account_balance) > 0) {
                        money = this.pay_info.account_balance;
                    } else {
                        money = this.cost - this.discount_code_money - this.coupon_offer_money
                    }
                }

                return Number(money);
            },

            //当前选择的优惠卷最大可抵扣金额
            coupon_offer: function () {
                let coupon_offer = 0;
                if (this.pay_info.coupon_code_obj.hasOwnProperty('id')) {
                    //订单价格必须大于优惠卷限制价格
                    if (this.pay_info.total_price > this.pay_info.coupon_code_obj.amount) {
                        //满减
                        if (this.pay_info.coupon_code_obj.subtraction > 0) {
                            coupon_offer = this.pay_info.coupon_code_obj.subtraction
                        }
                        //满折
                        if (this.pay_info.coupon_code_obj.discount > 0) {
                            coupon_offer = this.pay_info.total_price * (this.pay_info.coupon_code_obj.discount);
                        }
                    }
                }
                return coupon_offer;
            },
            amount:       function () {
                let amount = this.cost - this.discount_code_money - this.coupon_offer_money - this.balance_deductible;

                this.$set(this.pay_info, 'amount', amount);
                return Number(amount);
            }
        },
        watch:      {
            //更新到根组件
            pay_info:                  {
                handler: function (val, old) {
                    this.$set(this.root_form_data, 'pay_info', val);
                },
                deep:    true
            },
            //根数据更新到我
            'root_form_data.pay_info': {
                handler: function (val, old) {
                    this.$set(this.$data, 'pay_info', val);
                },
                deep:    true
            },
            'pay_info.coupon_id':      function (val, old) {
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
        mounted:    function () {
            this.getAllCoupons();
            this.getProfile();
        },
        methods:    {
            deepValidator: function (component) {
                if (component.hasOwnProperty('validate')) {
                    if (typeof component.validate === 'function') {
                        component.validate();
                    }
                }
                if (component.hasOwnProperty('$children')) {
                    if (component.$children instanceof Array) {
                        for (let i in component.$children) {
                            this.deepValidator(component.$children[i])
                        }
                    }
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
            //发布计划
            release:       function () {
                this.validator();
                let _self     = this;
                //拷贝一份数据
                let post_data = $.extend(true, {}, this.root.form_data);
                //将bool类型转为1和0
                deepConvertBooleanToNumber(post_data);
                setTimeout(function () {
                    //验证器采用的是回调验证赋值，所以我需要等一点时间再验证提交
                    if (_self.root.form_data.is_validate === true) {
                        $.ajax({
                            url:      '/task-plan/ecommerce/add',
                            type:     'post',
                            data:     post_data,
                            datatype: 'json',
                            success:  function (res) {
                                if (res.result === true) {
                                    //状态为2,支付并发布成功！
                                    if(res.hasOwnProperty('pay_status') && parseInt(res.pay_status) === 2) {
                                        BootstrapDialog.show({
                                            title: '提示信息',
                                            message: res.message ? res.message : '恭喜，您已经成功发布任务计划！',
                                            closable:        false,
                                            type:            BootstrapDialog.TYPE_SUCCESS,
                                            buttons: [{
                                                label:    '返回任务计划列表',
                                                cssClass: 'btn-success',
                                                action:   function () {
                                                   window.location.href = '/task-plan/ecommerce/manage'
                                                }
                                            }]
                                        })
                                    }
                                    //状态为1,发布成功，但还需要支付尾款
                                    if(res.hasOwnProperty('pay_status') && parseInt(res.pay_status) === 1) {
                                        BootstrapDialog.show({
                                            title: '提示信息',
                                            message: res.message ? res.message : '任务计划创建成功，立即支付计划费用？',
                                            closable:        false,
                                            type:    BootstrapDialog.TYPE_WARNING,
                                            buttons: [{
                                                label:    '立即支付',
                                                cssClass: 'btn-danger',
                                                action:   function () {
                                                    window.location.href = '/finance?order_id=' + res.order_id
                                                }
                                            }]
                                        })
                                    }

                                } else {
                                    new PNotify({
                                        title: '失败',
                                        text:  res.message,
                                        type:  'warning',
                                        addclass: "stack-modal",
                                    });
                                }
                            }
                        })
                    } else {
                        new PNotify({
                            title: '错误',
                            text:  '您还有未填写完整的选项，请先填写完整！！！',
                            type:  'error',
                        });
                    }
                }, 300)
            },
            //保存草稿
            saveDraft:     function () {
                let _self = this;
                BootstrapDialog.show({
                    title:   '输入草稿名称',
                    message: '请输入草稿名称: <input id="save_draft_input_id" type="text" class="form-control">',
                    buttons: [{
                        label:    '确认保存',
                        cssClass: 'btn-info',
                        action:   function (dialogRef) {
                            let data      = dialogRef.getModalBody().find('input').val();
                            let post_data = {
                                name:          data,
                                plan_type:     1,
                                template_type: 1,
                                data:          _self.root.form_data,
                                _token:        CONSTANT._token
                            };
                            $.ajax({
                                url:      '/task-plan-template/add',
                                type:     'post',
                                data:     post_data,
                                datatype: 'json',
                                success:  function (res) {
                                    if (res.result === true) {
                                        new PNotify({
                                            title: '恭喜',
                                            text:  res.message ? res.message : '已成功提交数据到服务器',
                                            type:  'success',
                                        });
                                    } else {
                                        new PNotify({
                                            title: '失败',
                                            text:  res.message,
                                            type:  'warning',
                                        });
                                    }
                                },
                                error:    function () {
                                    new PNotify({
                                        title: '失败',
                                        text:  '保存草稿异常，请稍后再试！',
                                        type:  'warning',
                                    });
                                }
                            });
                            dialogRef.close();
                        }
                    }]
                });
                scrollFocus('save_draft_input_id', 500);
            },
            /**
             * 递归执行所有子组件的验证器
             */
            validator:     function () {
                for (let i in this.$root.$refs) {
                    this.deepValidator(this.$root.$refs[i])
                }
            },
            /**
             * 递归执行子组件的validate方法，可在validate方法中写表单验证函数
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

                if (this.pay_info.total_price > coupon.amount) {
                    return true;
                }

                return false;
            },

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
