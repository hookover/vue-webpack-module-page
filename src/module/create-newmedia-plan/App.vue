<template>
    <div>
        <section class="panel">
            <div class="panel-body">
                <TypeSelect></TypeSelect>
                <Plan></Plan>
                <AutoRendering></AutoRendering>
                <Bill :money="store_data.total_money" submit_function="bill"></Bill>
            </div>
        </section>
    </div>
</template>
<script>
    import TypeSelect  from './components/TypeSelect.vue'
    import Plan  from './components/Plan.vue'
    import AutoRendering  from './components/AutoRendering.vue'
    import Bill  from './components/Bill.vue'
    import api from '../../common/api'
    import * as _ from '../../utils/tool'

    import {mapActions, mapGetters, mapState} from 'vuex'

    export default {
        components: {
            TypeSelect,
            Plan,
            Bill,
            AutoRendering,
        },
        computed:   {
            ...mapGetters({
                store_data: 'getData',
            }),
        },
        methods: {
            ...mapActions({
                updateData: 'updateData'
            }),
            bill: function () {
                let self = this;
                _.checkVeeValidate(this);
                setTimeout(function () {
                    if (self.store_data.errors.length > 0) {
                        for(let n in self.store_data.errors) {
                            new PNotify({
                                text:     '表单填写错误：' + self.store_data.errors[n],
                                type:     'error',
                                addclass: "stack-modal",
//                                delay:    3000,
                            });
                        }
                        return false;
                    }
//                    let params = $.extend(true, {}, self.store_data);

                    let params = {
                        platform_id: self.store_data.platform_id,
                        source_type: self.store_data.task_id,
                        start_at:    self.store_data.date_range.from,
                        end_at:      self.store_data.date_range.to,
                        total_count: self.store_data.number,
                        expedite:    self.store_data.expedite,
                        content:     self.store_data.content,

                        total_money:         self.store_data.total_money,
                        use_account_balance: (self.store_data.use_account_balance ? 1 : 0),
                        coupon_id:           self.store_data.coupon_id,
                    };

                    api.postNewMediaPlan(params).then(
                        res => {
                            //状态为2,支付并发布成功！
                            if (res.hasOwnProperty('pay_status') && parseInt(res.pay_status) === 2) {
                                BootstrapDialog.show({
                                    title:    '提示信息',
                                    message:  res.message ? res.message : '恭喜，您已经成功发布任务计划！',
                                    closable: false,
                                    type:     BootstrapDialog.TYPE_SUCCESS,
                                    buttons:  [
                                        {
                                            label:    '关闭',
                                            action:   function (dialogRef) {
                                                dialogRef.close();
                                            }
                                        },
                                        {
                                            label:    '返回任务计划列表',
                                            cssClass: 'btn-success',
                                            action:   function () {
                                                window.location.href = '/new-media-plan/manage'
                                            }
                                        }
                                    ]
                                })
                            }
                            //状态为1,发布成功，但还需要支付尾款
                            if (res.hasOwnProperty('pay_status') && parseInt(res.pay_status) === 1) {
                                BootstrapDialog.show({
                                    title:    '提示信息',
                                    message:  res.message ? res.message : '任务计划创建成功，立即支付任务计划尾款？',
                                    closable: false,
                                    type:     BootstrapDialog.TYPE_SUCCESS,
                                    buttons:  [
                                        {
                                            label:    '关闭',
                                            action:   function (dialogRef) {
                                                dialogRef.close();
                                            }
                                        },
                                        {
                                            label:    '立即支付',
                                            cssClass: 'btn-success',
                                            action:   function () {
                                                window.location.href = '/finance?order_id=' + res.order_id
                                            }
                                        }
                                    ]
                                })
                            }
                        },
                        o => {

                        }
                    );

                }, 300)

            }
        }
    }
</script>