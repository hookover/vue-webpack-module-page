<template>
    <!--填写商品信息 开始-->
    <div class="task-plan-section">
        <h4 @click="section_open===true ? section_open = false : section_open = true">
            填写商品信息
            <i class="icon"
               :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
        </h4>
        <blockquote v-show="section_open">
            <div class="form-horizontal tasi-form" role="form">
                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>淘抢购商品活动链接</strong>
                    </label>
                    <div class="col-lg-7"
                         :class="{'has-error': validation.hasError('product_info.url'), 'has-success': validation.isPassed('product_info.url')}">
                        <div class="input-group">
                            <input v-model="product_info.url" placeholder="请输入以http://或https://开头的商品网址"
                                   class="form-control" type="url" @change="getProductInfo">
                            <span class="input-group-btn">
                <a type="button" class="btn btn-primary ladda-button loadding-product-info-by-ajax"
                   data-style="expand-right" @click="getProductInfo(true)">
                  <i class="icon-magic"></i>
                  抓取宝贝信息
                </a>
              </span>
                        </div>
                        <div class="help-block text-danger" v-if="validation.hasError('product_info.url')">
                            <i class="icon icon-times-circle color-red"></i>
                            {{ validation.firstError('product_info.url') }}
                        </div>
                    </div>
                    <div class="col-lg-10 col-lg-offset-2 clearfix">
                        <div class="help-block text-info" v-if="validation.isPassed('product_info.url')">
                            <i class="icon icon-info-circle"></i>
                            程序会尝试自动抓取商品信息，若抓取失败，请手动填写
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>淘抢购商品名称</strong>
                    </label>
                    <div class="col-lg-7"
                         :class="{'has-error': validation.hasError('product_info.title'), 'has-success': validation.isPassed('product_info.title')}">
                        <input v-model="product_info.title" placeholder="请输入商品名称" class="form-control" type="text">
                        <div class="help-block text-danger" v-if="validation.hasError('product_info.title')">
                            <i class="icon icon-times-circle color-red"></i>
                            {{ validation.firstError('product_info.title') }}
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>店铺名称</strong>
                    </label>
                    <div class="col-lg-7"
                         :class="{'has-error': validation.hasError('product_info.store_name'), 'has-success': validation.isPassed('product_info.store_name')}">
                        <input v-model="product_info.store_name" placeholder="请输入店铺名称" class="form-control" type="text">
                        <div class="help-block text-danger" v-if="validation.hasError('product_info.store_name')">
                            <i class="icon icon-times-circle color-red"></i>
                            {{ validation.firstError('product_info.store_name') }}
                        </div>
                    </div>
                </div>

                <!--选择图片-->
                <ChooseImageForm id="choose_img" :base_data="product_info" title_name="商品主图"></ChooseImageForm>
                <!--选择图片-->

                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>淘抢购商品所在场次</strong>
                    </label>
                    <div class="col-lg-6"
                         :class="{'has-error': validation.hasError('product_info.begin_time'), 'has-success': validation.isPassed('product_info.begin_time')}">
                        <div>
                            <input :value="product_info.begin_time"
                                   class="form-control juhuansuan-begin-time-picker inline-block per50" type="text">
                            <span class="ml10">方便接单侠筛选商品</span>
                        </div>
                        <div class="help-block text-danger" v-if="validation.hasError('product_info.begin_time')">
                            <i class="icon icon-times-circle color-red"></i>
                            {{ validation.firstError('product_info.begin_time') }}
                        </div>
                    </div>
                </div>

            </div>
        </blockquote>
    </div>
    <!--填写商品信息 结束-->
</template>

<script>
    import {formatDate} from '../../../common/date.js';
    import ChooseImageForm from '../../form/ChooseImageForm.vue'
    export default {
        components: {
            ChooseImageForm
        },
        data () {
            return {
                section_open: true,
                task_data:    this.$parent.$data.task_data,
                root:         this.$root,
                product_info: {
                    url:                '',
                    title:              '',
                    max_img_num:        2,   //商品主图最多2个
                    min_img_num:        1,   //商品主图最少1个
                    store_name:         '',
                    begin_time:         '',
                    price:              {
                        pc:     '',
                        mobile: ''
                    },
                    images:             [],             //选中图片列表
                    alternative_images: []  //备选图片列表
                },
            }
        },
        created:    function () {
            this.$set(this.task_data, 'product_info', this.product_info);
        },
        mounted:    function () {
            this.$nextTick(function () {
                $('.juhuansuan-begin-time-picker').datetimepicker({
                    language:   "zh-CN",
                    format:     "yyyy-mm-dd hh:ii",
                    autoclose:  true,
                    todayBtn:   true,
                    startDate:  (new Date()),
                    minuteStep: 10
                });
                let _self = this;
                $('.juhuansuan-begin-time-picker').on('change', function () {
                    _self.$set(_self.product_info, 'begin_time', $(this).val());
                    let cur  = new Date();
                    let time = new Date($(this).val());
                    if (cur > time) {
                        _self.$set(_self.product_info, 'begin_time', formatDate(cur, 'yyyy-MM-dd hh:mm'));
                    }
                });
            });
        },
        watch:      {
            //更新到根组件
            product_info:             {
                handler: function (val, old) {
                    this.$set(this.task_data, 'product_info', val);
                },
                deep:    true
            },
            //根数据更新到我
            'task_data.product_info': {
                handler: function (val, old) {
                    for (let n in val) {
                        this.$set(this.$data.product_info, n, val[n]);
                    }
                },
                deep:    true
            },
        },
        validators: {
            'product_info.url':        function (value) {
                return this.Validator.value(value).required('商品URL地址不能为空！').url('请输入以http或https开头的URL地址，请重新输入');
            },
            'product_info.title':      function (value) {
                return this.Validator.value(value).required('商品标题不能为空！');
            },
            'product_info.store_name': function (value) {
                return this.Validator.value(value).required('店铺名称不能为空！');
            },
            'product_info.begin_time': function (value) {
                return this.Validator.value(value).required('聚划算开始时间不能为空！');
            },
        },
        methods:    {
            validate:       function () {
                this.$validate().then(function (success) {
                    if (!success) {
                        this.root.form_data.is_validate = false;
                        this.root.logs.errors.push(this.validation.errors);
                    }
                }.bind(this));
            },
            validateReset:  function () {
                this.validation.reset();
            },
            _inArray:       function (val, arr) {
                return $.inArray(val, arr) !== -1
            },
            getProductInfo: function (showMsg) {
                if (this.validation.isPassed('product_info.url')) {
                    //重置图片列表数据
                    this.product_info.alternative_images = [];
                    this.product_info.images             = [];

                    let _self     = this;
                    let post_data = {
                        platform: this.root.form_data.base_type.platform,
                        url:      this.product_info.url,
                        _token:   $('meta[name="csrf-token"]').attr('content'),
                    };
                    let l         = $('.loadding-product-info-by-ajax').ladda();
                    l.ladda('start');
                    $.ajax({
                        url:      '/get_ecommerce_product_info',
                        type:     'post',
                        datatype: 'json',
                        data:     post_data,
                        success:  function (res) {
                            if (res.result === true) {
                                _self.product_info.title        = res.title;
                                _self.product_info.store_name   = res.store_name;
                                _self.product_info.price.pc     = res.price.pc;
                                _self.product_info.price.mobile = res.price.mobile;
                                for (let i = 0; i < res.cover.length; ++i) {
                                    _self.product_info.alternative_images.push({
                                        title: '',
                                        value: res.cover[i],
                                        img:   res.cover[i],
                                    });
                                }
                                new PNotify({
                                    title: '恭喜',
                                    text:  '商品信息已获取成功，请选择使用',
                                    type:  'success',
                                });
                            } else {
                                new PNotify({
                                    title: '提示',
                                    text:  res.message ? res.message : '抓取商品信息失败，请手动补全商品信息',
                                    type:  'info',
                                });
                            }
                        },
                        error:    function () {
                            if (showMsg === true) {
                                new PNotify({
                                    title: '错误',
                                    text:  '服务器错误，请稍后再试！',
                                    type:  'error',
                                });
                            }
                        },
                        complete: function () {
                            setTimeout(function () {
                                l.ladda('stop');
                            }, 200)
                        }
                    });
                } else {
                    if (showMsg === true) {
                        new PNotify({
                            title: '错误',
                            text:  '未填写商品连接URL，或者填写的URL不正确',
                            type:  'error',
                        });
                    }
                }

            }
        }
    }
</script>