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
            <strong>商品链接(用于抓取图片，可不写)</strong>
          </label>
          <div class="col-lg-7">
            <div class="input-group">
              <input v-model="product_info.url" placeholder="请输入以http://或https://开头的商品网址" class="form-control" type="url" @change="getProductInfo">
              <span class="input-group-btn">
                <a type="button" class="btn btn-primary ladda-button loadding-product-info-by-ajax" data-style="expand-right" @click="getProductInfo(true)">
                  <i class="icon-magic"></i>
                  抓取宝贝信息
                </a>
              </span>
            </div>
          </div>
          <div class="col-lg-10 col-lg-offset-2 clearfix">
            <div class="help-block text-info">
              <i class="icon icon-info-circle"></i>
              此处可不填写（填写URL程序会尝试自动抓取部分商品信息）
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>商品标题</strong>
          </label>
          <div class="col-lg-7">
            <input v-model="product_info.title" placeholder="请输入商品名称" class="form-control" type="text">
            <div class="help-block text-info">
              <i class="icon icon-info-circle"></i>
              可不填写（填写可以让接单侠更好的理解产品，从而选择更合适的产品图片）
            </div>
          </div>
        </div>
        <!--选择图片-->
        <ChooseImageForm
                id="choose_img"
                :base_data="product_info"
                title_name="待测试图片"
                description="请上传图片尺寸为800x800以内，且文件不能大于2M，格式为：jpg、png；<br/><i class='ml15'></i>最少上传3张图片，最多上传10张图片！">
        </ChooseImageForm>
        <!--选择图片-->
      </div>
    </blockquote>
  </div>
  <!--填写商品信息 结束-->
</template>

<script>
    import ChooseImageForm from '../../form/ChooseImageForm.vue'
    export default {
        components: {
            ChooseImageForm
        },
        data () {
            return {
                section_open: true,
                task_data: this.$parent.$data.task_data,
                root: this.$root,
                product_info: {
                    url: '',
                    max_img_num: 10,
                    min_img_num: 3,
                    title: '',
                    store_name: '',
                    price: {
                        pc: '',
                        mobile: ''
                    },
                    images: [],             //选中图片列表
                    alternative_images: []  //备选图片列表
                },
            }
        },
        created: function () {
            this.$set(this.task_data, 'product_info', this.product_info);
        },
        watch: {
            //更新到根组件
            product_info: {
                handler: function (val, old) {
                    this.$set(this.task_data, 'product_info', val);
                },
                deep: true
            },
            //根数据更新到我
            'task_data.product_info': {
                handler: function (val, old) {
                    for(let n in val) {
                        this.$set(this.$data.product_info, n, val[n]);
                    }                },
                deep: true
            },
        },
        validators: {
            'product_info.url': function(value) {
                let _self = this;
                return this.Validator.custom(function () {
                    if(value !== '') {
                        let res = _self.Validator.value(value).url('请输入以http或https开头的URL地址，请重新输入');
                    }
                });
            },
        },
        methods: {
            _inArray: function (val, arr) {
                return $.inArray(val, arr) !== -1
            },
            getProductInfo: function (showMsg) {
                if(this.validation.isPassed('product_info.url')) {
                    //重置图片列表数据
                    this.product_info.alternative_images = [];
                    this.product_info.images = [];

                    let _self = this;
                    let post_data = {
                        platform: this.root.form_data.base_type.platform,
                        url: this.product_info.url,
                        _token: $('meta[name="csrf-token"]').attr('content'),
                    };
                    let l = $( '.loadding-product-info-by-ajax' ).ladda();
                    l.ladda( 'start' );
                    $.ajax({
                        url: '/get_ecommerce_product_info',
                        type: 'post',
                        datatype: 'json',
                        data: post_data,
                        success: function (res) {
                            if(res.result === true) {
                                _self.product_info.title = res.title;
                                _self.product_info.store_name = res.store_name;
                                _self.product_info.price.pc = res.price.pc;
                                _self.product_info.price.mobile = res.price.mobile;
                                for(let i = 0; i < res.cover.length; ++i) {
                                    _self.product_info.alternative_images.push({
                                        title: '',
                                        value: res.cover[i],
                                        img: res.cover[i],
                                    });
                                }
                                new PNotify({
                                    title: '恭喜',
                                    text: '商品信息已获取成功，请选择使用',
                                    type: 'success',
                                });
                            } else {
                                new PNotify({
                                    title: '提示',
                                    text: res.message ? res.message : '抓取商品信息失败，请手动补全商品信息',
                                    type: 'info',
                                });
                            }
                        },
                        error: function () {
                            if(showMsg === true) {
                                new PNotify({
                                    title: '错误',
                                    text: '服务器错误，请稍后再试！',
                                    type: 'error',
                                });
                            }
                        },
                        complete: function () {
                            setTimeout(function () {
                                l.ladda( 'stop' );
                            },200)
                        }
                    });
                } else {
                    if(showMsg === true) {
                        new PNotify({
                            title: '错误',
                            text: '未填写商品连接URL，或者填写的URL不正确',
                            type: 'error',
                        });
                    }
                }

            }
        }
    }
</script>