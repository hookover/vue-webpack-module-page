<template>
    <!--填写访客入店的关键词及数量占比 开始-->
    <div class="task-plan-section">
        <h4 @click="section_open===true ? section_open = false : section_open = true">
            填写访客搜索的关键词及数量占比
            <i class="icon"
               :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
        </h4>
        <blockquote v-show="section_open">
            <div class="form-horizontal add-store" role="form">
                <template v-for="(keyword, n) in keywords">
                    <div class="form-group">
                        <label class="col-lg-2 control-label">
                            <strong>
                                关键词 {{n + 1}}
                                <template v-if="(n == 0) && !keyword.value">
                                    <span class="text-danger">*</span>
                                </template>
                            </strong>
                        </label>
                        <div class="col-lg-10">
                            <div :class="{'has-error': validation.hasError('keywords'), 'has-success': validation.isPassed('keywords')}">
                                <input :id="('_keyword_focus_' + n)" class="form-control per30 minw5 inline-block"
                                       v-model.trim="keyword.value" @keyup="enterToNextKeyword" placeholder="请输入关键词"
                                       type="text">
                                <span class="mt5 ml5">
                <a href="javascript:void(0);" class="text-primary popovers"
                   @click="toggleAdvanced('toggle_advanced_'+n, $event)" data-original-title="提示"
                   data-content="高级选项并不是必填选项。但填写高级选项可以让接单侠更好的找到您的宝贝。" data-placement="top" data-trigger="hover">
                  <i class="icon icon-angle-double-down color-green-dark"></i>
                  高级选项
                </a>
                <span class="m5"></span>
                <a href="javascript:void(0);" class="text-primary" @click="clearKeyword(keyword)">
                  <i class="icon icon-remove"></i>清空
                </a>
              </span>
                                <label class="control-label ml20">数量占比</label>
                                <select v-model.trim="keyword.more.proportion"
                                        class="form-control per10 minw70 inline-block" @change="checkKeywordProportion">
                                    <option v-for="option in select_proportions.list" v-bind:value="option.value">
                                        {{ option.name }}
                                    </option>
                                </select>
                                <template v-if="(n == 0) && keywords.length < keyword_num">
                                    <a class="ml10 text-primary" href="javascript:void(0);" @click="addKeyword"><i
                                            class="icon icon-plus"></i> 添加关键词</a>
                                </template>
                                <template v-if="n != 0">
                                    <a class="ml10 text-danger" href="javascript:void(0);"
                                       @click="deleteKeyword(keyword)"><i class="icon icon-remove"></i> 删除关键词</a>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-bind:class="['toggle_advanced_' + n, 'row mb20']" style="display: none;">
                        <div class="col-lg-10 col-lg-offset-2">
                            <div class="form-group">
                                <label class="col-lg-2 col-md-4 control-label">
                                    <strong>排序方式</strong>
                                </label>
                                <div class="col-lg-10 col-md-8">
                                    <div class="radios-inline">
                                        <template v-for="(sort, n) in radio_channel_sort_by">
                                            <label class="label_radio">
                                                <input v-model.trim="keyword.more.sort_by" :value="sort" type="radio">
                                                {{sort}}
                                            </label>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 col-md-4 control-label">
                                    <strong>手机淘宝App搜索列表价格区间</strong>
                                </label>
                                <div class="col-lg-4 col-md-8">
                                    <div class="input-group">
                                        <input @keyup="keyword.more.price_range.min = numberOnly($event)"
                                               @change="verificationMaxAndMin(keyword.more.price_range)"
                                               class="form-control" placeholder="最低价"
                                               v-model.trim="keyword.more.price_range.min" type="text">
                                        <span class="input-group-addon middle-addon">-</span>
                                        <input @keyup="keyword.more.price_range.max = numberOnly($event)"
                                               @change="verificationMaxAndMin(keyword.more.price_range)"
                                               class="form-control" placeholder="最高价"
                                               v-model.trim="keyword.more.price_range.max" type="text">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 col-md-4 control-label">
                                    <strong>发货地</strong>
                                </label>
                                <div class="col-lg-4 col-md-8">
                                    <div class="input-group">
                                        <input class="form-control" v-model.trim="keyword.more.distribution_zone"
                                               placeholder="卖家发货地区" type="text" readonly>
                                        <span class="input-group-btn">
                      <a class="btn btn-default btn-info minw100" :href="('#selected_distribution_zone_keyword' + n)"
                         data-toggle="modal"><i class="icon-map-marker"></i> 选择发货地</a>
                    </span>
                                    </div>
                                    <!-- Modal -->
                                    <DistributionZoneModal :res="keyword.more"
                                                           :id="('selected_distribution_zone_keyword' + n)"></DistributionZoneModal>
                                    <!-- modal -->
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 col-md-4 control-label">
                                    <strong>折扣和服务</strong>
                                </label>
                                <div class="col-lg-8 col-md-8 popovers" data-original-title="提示"
                                     data-content="注意：请商家确认自己的宝贝享有这些折扣和服务，否则会导致接单侠找不到商品，造成流量不足的情况！" data-placement="top"
                                     data-trigger="hover">
                                    <template v-for="(discounts_and_services, n) in checkbox_discounts_and_services">
                                        <label class="checkbox-inline">
                                            <input :value="discounts_and_services" v-model="keyword.more.filters"
                                                   type="checkbox"> {{discounts_and_services}}
                                        </label>
                                    </template>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 col-md-4 control-label">
                                    <strong>商品分类</strong>
                                </label>
                                <div class="col-lg-4 col-md-8">
                                    <input class="form-control" v-model.trim="keyword.more.product_class"
                                           placeholder="如：汽车用品/配件/摩托车" type="text">
                                    <div class="help-block">
                                        请填写宝贝在淘宝设置的实际分类，如：汽车用品/配件/摩托车。
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-2 col-md-4 control-label">
                                    <strong>宝贝位置(大概)</strong>
                                </label>
                                <div class="col-lg-4 col-md-8">
                                    <input class="form-control" v-model.trim="keyword.more.position"
                                           placeholder="如：大概在第1页第5个位置" type="text">
                                    <div class="help-block">
                                        根据关键词、筛选条件得到的商品列表，宝贝大概在哪个位置，如第5个宝贝
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-10 col-lg-offset-2">
                            <template v-if="n === (keywords.length - 1)">
                                <div class="help-block text-danger" v-if="validation.hasError('keywords')">
                                    <i class="icon icon-times-circle color-red"></i>
                                    {{ validation.firstError('keywords') }}
                                </div>
                                <template v-if="already_keyword_num">
                                    <div class="help-block text-info">
                                        <i class="icon icon-info-circle"></i>
                                        您已填写{{already_keyword_num}}个关键词，您还可以添加并填写{{keyword_num - already_keyword_num}}个关键词
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </template>
                <hr>
                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>各关键词访客总量</strong>
                    </label>
                    <div class="col-lg-10">
                        <table class="table table-bordered table-hover">
                            <tbody>
                            <tr>
                                <th>关键词</th>
                                <template v-for="option in init_data.compute_keywords">
                                    <td>{{option.name}}</td>
                                </template>
                                <template v-if="init_data.compute_keywords.length === 0">
                                    <td class="text-left">请先填写关键词</td>
                                </template>
                            </tr>
                            <tr>
                                <th>访客数量</th>
                                <template v-for="option in init_data.compute_keywords">
                                    <td>{{option.total}}</td>
                                </template>
                                <template v-if="init_data.compute_keywords.length === 0">
                                    <td class="text-left">请先填写关键词</td>
                                </template>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-lg-10 col-lg-offset-2">
                        <div class="help-block text-info">
                            <i class="icon icon-info-circle"></i>
                            自然搜索需前50名（直通车前10位），如超出范围会导致失败率过高，建议使用最容易搜索到产品的关键词逐步扩展进行优化。
                        </div>
                    </div>
                </div>
            </div>
        </blockquote>
    </div>
    <!--填写访客入店的关键词及数量占比 结束-->
</template>

<script>
    import DistributionZoneModal from '../modal/DistributionZoneModal.vue'
    import {computedStepData} from '../../common/computeStep';
    export default {
        components: {
            DistributionZoneModal
        },
        data () {
            return {
                section_open: true,
                task_data:    this.$parent.$data.task_data,
                root:         this.$root,
                keyword_num:  5, //5个关键词
                keywords:     [
                    {
                        id:    0,
                        value: '',                //关键词
                        more:  {
                            sort_by:           '',          //按什么排序
                            filters:           [],
                            price_range:       {        //价格区间
                                min: '',
                                max: ''
                            },
                            proportion:        100,      //关键词比重
                            distribution_zone: '',//发货区域
                            product_class:     '',    //产品分类
                            position:          ''          //宝贝大概在哪个位置，如第1页第5个位置
                        }
                    }
                ],

                init_data:                       {
                    compute_keywords: []
                },
                checkbox_discounts_and_services: ['免运费', '天猫', '全球购', '消费者保障', '手机专享', '淘金币抵钱', '货到付款', '7+天退换货', '促销',],
                radio_channel_sort_by:           ['综合排序', '销量优先', '价格从低到高', '价格高从到低', '信用排序',],
                select_proportions:              {
                    list: [
                        {
                            name:  '10%',
                            value: 10
                        },
                        {
                            name:  '20%',
                            value: 20
                        },
                        {
                            name:  '30%',
                            value: 30
                        },
                        {
                            name:  '40%',
                            value: 40
                        },
                        {
                            name:  '50%',
                            value: 50
                        },
                        {
                            name:  '60%',
                            value: 60
                        },
                        {
                            name:  '70%',
                            value: 70
                        },
                        {
                            name:  '80%',
                            value: 80
                        },
                        {
                            name:  '90%',
                            value: 90
                        },
                        {
                            name:  '100%',
                            value: 100
                        },
                    ]
                },
            };
        },
        created:    function () {
            this.$set(this.task_data, 'keywords', this.keywords);
        },
        mounted:    function () {
            this.$nextTick(function () {
                (function (obj) {
                    $('.popovers').popover(); //提示
                })(this);
            });
        },
        watch:      {
            //更新到根组件
            keywords:                   {
                handler: function (val, old) {
                    this.$set(this.task_data, 'keywords', val);
                    this.validate();

                    //计算结果表数据
                    this.computedKeywordsTotal();
                },
                deep:    true
            },
            //根数据更新到我
            'task_data.keywords':       {
                handler: function (val, old) {
                    this.$set(this.$data, 'keywords', val);
                },
                deep:    true
            },
            'task_data.task_plan_info': {
                handler: function (val, old) {
                    this.$set(this.$data, 'task_plan_info', val);
                    //计算结果表数据
                    this.computedKeywordsTotal();
                },
                deep:    true
            },
        },
        computed:   {
            already_keyword_num: function () {
                var num = 0;
                for (var i = 0; i < this.keywords.length; ++i) {
                    if (this.keywords[i].value) {
                        num++;
                    }
                }
                return num;
            }
        },
        validators: {
            'keywords': function (arr) {
                return this.Validator.custom(function () {
                    if ($.trim(arr[0].value) === '') {
                        return '第一个关键词必须填写！'
                    }
                    for (let n in arr) {
                        if ($.trim(arr[n].value) === '') {
                            return '第' + (parseInt(n) + 1) + '个关键词未填写完整，若不需要请将该关键词选项删除掉';
                        }
                    }
                });
            },
        },
        methods:    {
            validate:               function () {
                this.$validate().then(function (success) {
                    if (!success) {
                        this.root.form_data.is_validate = false;
                        this.root.logs.errors.push(this.validation.errors);
                    }
                }.bind(this));
            },
            /**
             * 高级选项
             * @param selecter
             * @param event
             */
            toggleAdvanced:         function (selecter, event) {
                $('.' + selecter).toggle('fast');
                //图标变化
                let i = $(event.target).find('i:first');
                if (i.hasClass('icon-angle-double-down')) {
                    i.attr('class', 'icon icon-angle-double-up color-green-dark')
                } else {
                    i.attr('class', 'icon icon-angle-double-down color-green-dark')
                }
            },
            clearKeyword:           function (keyword) {
                keyword.value = '';
                keyword.more  = {
                    sort_by:           '',
                    filters:           [],
                    price_range:       {
                        min: '',
                        max: ''
                    },
                    proportion:        20,
                    distribution_zone: '',
                    product_class:     ''
                }
            },
            addKeyword:             function () {
                if (this.keywords.length < this.keyword_num) {
                    this.keywords.push({
                        id:    this.keywords.length,
                        value: '',
                        more:  {
                            sort_by:           '',
                            filters:           [],
                            price_range:       {
                                min: '',
                                max: ''
                            },
                            proportion:        20,
                            distribution_zone: '',
                            product_class:     ''
                        }
                    });
                    this.resetKeywordProportion();
                    let _self = this;
                    setTimeout(function () {
                        $('#_keyword_focus_' + (_self.keywords.length - 1)).focus();
                    }, 200)
                } else {
                    new PNotify({
                        title: '敬告',
                        text:  '该任务计划最多可以设置' + this.keyword_num + '个关键词！',
                        type:  'warning',
                    });
                }
            },
            enterToNextKeyword:     function (event) {
                if (event.which === 13) {
                    this.addKeyword();
                }
            },
            deleteKeyword:          function (keyword) {
                this.keywords.splice($.inArray(keyword, this.keywords), 1);
                this.resetKeywordProportion();
            },
            resetKeywordProportion: function () {
                let proportion     = parseInt(10 / this.keywords.length) * 10;
                let lastProportion = proportion + (100 - proportion * this.keywords.length);

                for (let i = 0; i < this.keywords.length; ++i) {
                    if ((i + 1) === this.keywords.length) {
                        this.keywords[i].more.proportion = lastProportion;
                    } else {
                        this.keywords[i].more.proportion = proportion;
                    }
                }
            },
            checkKeywordProportion: function () {
                let proportion = 0;
                for (let i in this.keywords) {
                    proportion = proportion + parseInt(this.keywords[i].more.proportion);
                }
                if (proportion > 100) {
                    this.resetKeywordProportion();
                    new PNotify({
                        title: '敬告',
                        text:  '关键词总占比超过100%，已自动调整！',
                        type:  'info',
                    });
                }
            },
            numberOnly:             function (event) {
                let string = $(event.target).val();
                if (string === '') {
                    return;
                }
                string = amount(string);
//                string = overFormat(string);
                return string;
            },
            verificationMaxAndMin:  function (range) {
                let min = parseFloat($.trim(range.min));
                let max = parseFloat($.trim(range.max));
                if (min !== '' && max !== '') {
                    if (min > max) {
                        this.$set(range, 'max', min);
                        new PNotify({
                            title: '敬告',
                            text:  '最低价不能高于最高价，已自动调整',
                            type:  'info',
                        });
                    }
                }
            },
            computedKeywordsTotal:  function () {
                let datas = [];
                for (let i in this.keywords) {
                    if ($.trim(this.keywords[i].value) !== '') {
                        datas.push({
                            name:       this.keywords[i].value,
                            proportion: this.keywords[i].more.proportion / 100,
                        });
                    }
                }
                for (let k in datas) {
                    if (this.task_data.task_plan_info.increase) {
                        datas[k]['total'] = computedStepData(this.task_data.task_plan_info.first_day, this.task_data.task_plan_info.increase_num, this.task_data.task_plan_info.day_length) * datas[k].proportion
                    } else {
                        datas[k]['total'] = this.task_data.task_plan_info.first_day * this.task_data.task_plan_info.day_length * datas[k].proportion;
                    }
                }
                this.$set(this.init_data, 'compute_keywords', datas);
            },
            computedStepData:       computedStepData,
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
