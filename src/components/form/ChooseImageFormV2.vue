<template>
    <!--选择图片 开始-->
    <div class="form-group">
        <label class="col-lg-2 control-label">
            <strong>{{title_name}}</strong>
        </label>
        <div class="col-lg-10">
            <div class="choose-image add-store">
                <template v-for="(img_url, n) in base_data.images">
                    <a href="javascript:void(0)" class="mr5" v-if="img_url" @click="delete_img(n)">
                        <img :src="img_url" class="img-thumbnail animated fadeIn" alt="点击删除">
                        <p>
                            <i class="icon icon-times-circle color-red"></i>
                            <span class="small">点击删除</span>
                        </p>
                    </a>
                </template>
                <template v-if="base_data.images.length < base_data.max_img_num">
                    <a class="mr5" :href="'#' + id" data-toggle="modal">
                        <img v-bind:src="default_image" alt="默认图片" class="img-thumbnail">
                        <p>选择图片</p>
                    </a>
                </template>
            </div>
            <input hidden v-if="vTag" type="text" v-model="current_image_data_length" name="current_image_data_length" v-validate="'current_image_data_length'">
            <hr>
            <div class="text-danger" v-if="errors.has('current_image_data_length')">
                <i class="icon icon-times-circle color-red"></i>
                {{errors.first('current_image_data_length')}}
            </div>
            <template v-if="description && !errors.has('current_image_data_length')">
                <div class="help-block text-info">
                    <i class="icon icon-info-circle"></i>
                    <span v-html="description"></span>
                </div>
            </template>
        </div>
        <!-- Modal -->
        <ChooseProductImg :base_data="base_data" :id="id" :other_params="other_params"></ChooseProductImg>
        <!-- modal -->
    </div>
    <!--选择图片 结束-->
</template>

<script>
    import ChooseProductImg from '../modal/ChooseProductImg.vue'
    import DefaultImg from  '../../../static/img/default.png'

    export default {
        components: {
            ChooseProductImg,
        },
        data () {
            return {
                root: this.$root,
                default_image: DefaultImg,
                alternative_images: {
                    selected: '',
                    name: 'ChooseProductImg' + Math.ceil(Math.random() * 10000000),
                    isRadio: true,
                    options: []
                },
                veeValidateTag: false,
            }
        },
        computed: {
            current_image_data_length: function () {
                return this.base_data.images.length;
            },
            vTag: function () {
                return this.veeValidateTag
            }
        },
        props: {
            id: {
              required: true,
            },
            title_name: {
                required: true,
                default: '商品主图'
            },
            base_data: {
                required: true,
                default: {
                    min_img_num: 1,
                    max_img_num: 2,     //这几个是必须要从上面传来
                    images: [],             //选中图片列表
                    alternative_images: []  //备选图片列表
                }
            },
            other_params: {
                default: {}
            },
            description: {
                default: '请上传图片尺寸为800x800以内，且文件不能大于2M，格式为：jpg、png；上传的主图请避免与其他店铺商家的主图相似，以便保证接单侠能进入正确的店铺并完成任务。'
            },

        },
        watch: {
            current_image_data_length: function (val, old) {
                this.$validator.validate('current_image_data_length', val);
            }
        },
        mounted: function () {
            let self = this;
            const validate = {
                messages: {
                    zh_CN:(field, args) => '请最少选择' + this.base_data.min_img_num + '张, 最多选择'+ this.base_data.max_img_num +'张'+ this.title_name,
                },
                validate: (value, args) => {
                    return !(this.current_image_data_length < self.base_data.min_img_num || this.current_image_data_length > self.base_data.max_img_num);
                }
            };
            this.$validator.extend('current_image_data_length',validate)
            this.veeValidateTag = true;
        },
        methods: {
            delete_img: function (n) {
                this.base_data.images.splice(n, 1);
            },
        }
    }
</script>