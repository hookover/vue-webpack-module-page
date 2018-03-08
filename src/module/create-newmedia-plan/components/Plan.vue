<template>
    <div class="task-plan-section">
        <h4 @click="section_open===true ? section_open = false : section_open = true">
            计划信息
            <i class="icon"
               :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
        </h4>
        <blockquote v-show="section_open">
            <div class="form-horizontal tasi-form add-store">

                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>单价</strong>
                    </label>
                    <div class="col-lg-6">
                            <span class="form-control-static s16">
                                <span class="small">￥</span>
                                {{store_data.task_price}}
                            </span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>任务数量</strong>
                    </label>
                    <div class="col-lg-6"
                         :class="{'has-error': errors.has('number')}">
                        <div>
                            <input v-model="number" class="form-control per50 inline-block"
                                   name="number"
                                   v-validate="'required|numeric|min_value:1'"
                                   type="text">
                            <span class="ml10 mt5">件</span>
                        </div>
                        <div class="help-block text-danger" v-show="errors.has('number')">
                            <i class="icon icon-times-circle color-red"></i>
                            {{ errors.first('number') }}
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>置顶加价</strong>
                    </label>
                    <div class="col-lg-6"
                         :class="{'has-error': errors.has('expedite')}">
                        <div>
                            <input v-model="expedite" class="form-control per50 inline-block"
                                   name="expedite"
                                   v-validate="'required|min_value:0'"
                                   type="text">
                            <span class="ml10 mt5"><span class="small">￥</span> / 件 <span
                                    class="color-red s12">加急置顶</span></span>
                        </div>
                        <div class="help-block text-danger" v-show="errors.has('expedite')">
                            <i class="icon icon-times-circle color-red"></i>
                            {{ errors.first('expedite') }}
                        </div>
                        <div class="help-block" v-show="!errors.has('expedite')">
                            急件请加价置顶以保证时效
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>总价</strong>
                    </label>
                    <div class="col-lg-6">
                        <p class="form-control-static">
                            <span class="small">￥</span>
                            {{total_money}}
                        </p>
                    </div>
                </div>
            </div>
        </blockquote>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import {Validator} from 'vee-validate'
    import * as _ from '../../../utils/tool'

    export default {
        data: function () {
            return {
                section_open: true,
            }
        },
        computed: {
            ...mapGetters({
                store_data: 'getData',
            }),
            number:      {
                get: function () {
                    return this.store_data.number
                },
                set: function (v) {
                    this.updateData({number: v})
                }
            },
            expedite:    {
                get: function () {
                    return this.store_data.expedite
                },
                set: function (v) {
                    this.updateData({expedite: v})
                }
            },
            total_money: function () {
                let task_price = isNaN(parseFloat(this.store_data.task_price)) ? 0 : parseFloat(this.store_data.task_price);
                let expedite = isNaN(parseFloat(this.store_data.expedite)) ? 0 : parseFloat(this.store_data.expedite);
                let number = isNaN(parseInt(this.store_data.number)) ? 0 : parseInt(this.store_data.number);

                let total_money = (task_price + expedite) * number;
                this.updateData({total_money: total_money});
                return Number(total_money).toFixed(2);
            },
        },
        methods:  {
            ...mapActions({
                updateData: 'updateData'
            }),
            convertVeeTag: function (key) {
                return _.convertVeeTag(key);
            },
        },
        mounted:  function () {
            const dictionary = {
                zh_CN: {
                    attributes: {
                        number:   '任务数量',
                        expedite: '置顶加价'
                    }
                }
            };

            this.$validator.localize(dictionary);
        }
    }
</script>