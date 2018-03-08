<template>
    <!-- Modal -->
    <div class="modal fade" :id="id" tabindex="-1" role="dialog" :aria-labelledby="id" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">请选择图片</h4>
                </div>
                <div class="modal-body">
                    <div class="choose_product_img">
                        <template v-for="option in base_data.alternative_images">
                            <label class="animated fadeIn">
                                <template v-if="imageIsChecked(option.value)">
                                    <i class="icon icon-check-circle s16 color-green checked"></i>
                                </template>
                                <img :src="option.img" alt="" class="img-thumbnail" v-if="option.img"
                                     :value="option.value" @click="toggleImage">
                                <!--<img :src="option.img" alt="" class="img-thumbnail" v-if="option.img" :value="(option.path ? option.path : option.value)" @click="toggleImage">-->
                                <!--<input type="radio" :value="option.value" v-model="selected">-->
                                <!--{{option.title}}-->
                            </label>
                        </template>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-warning" type="button">完成选择</button>
                    <template
                            v-if="(typeof base_data.alternative_images !== Array) || (base_data.alternative_images.length === 0)">
                        <a href="javascript:void(0)" class="btn btn-success fileinput-button pull-left">
                            <i class="icon icon-plus"></i>
                            <span>上传图片...</span>
                            <!-- The file input field used as target for the file upload widget -->
                            <input class="prodcut-photo-upload" type="file" name="image" multiple>
                        </a>
                    </template>
                </div>
            </div>
        </div>
    </div>
    <!-- modal -->
</template>

<script>
    import '../../common/common'
    import {lessIE9} from '../../common/common'

    export default({
        data:  function () {
            return {}
        },
        props: {
            id:        {
                default: 'ChooseProductImg' + (Math.random() * 100000 + '').split('.')[0]
            },
            name:      {
                default: 'ChooseProductImg' + (Math.random() * 100000 + '').split('.')[0]
            },
            base_data: {
                required: true,
                default:  {
                    images:             [],
                    alternative_images: []
                }
            },
            other_params: {
                default: {}
            },
        },

        mounted: function () {
            let _self = this;
            let params = {
                space:        'business',
                is_temporary: 2,
                less_ie9:     lessIE9() ? 1 : 0,
                _token:       $('meta[name="csrf-token"]').attr('content'),
            };
            if(!$.isEmptyObject(this.other_params)) {
                params = $.extend({}, params, this.other_params)
            }

            $('.prodcut-photo-upload').fileupload({
                url:              '/upload',
                dataType:         'json',
                acceptFileTypes:  /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize:      2 * 1024 * 1024,
                minFileSize:      10,
                maxNumberOfFiles: 20,
                messages:         {
                    maxFileSize:      '单个图片文件的大小不能超过2M',
                    acceptFileTypes:  '您只能上传图片类型的文件',
                    minFileSize:      '单次最多上传10个文件',
                    maxNumberOfFiles: '最多上传20个文件',
                },
                formData:         params,
                done:             function (e, data) {
                    data = (typeof data.result[0] !== 'undefined' && (data.result[0].hasOwnProperty('body'))) ? data.result[0].body.innerHTML : data.result;
                    if (typeof data !== 'object') {
                        data = JSON.parse(data);
                    }
                    if (data.result === true) {
                        _self.base_data.alternative_images.push({
                            title: '',
                            value: data.path,
                            img:   data.path,
                            path:  data.path,
                        });
                    } else {
                        new PNotify((data.message) ? data.message : "服务器错误，请刷新后重试或联系客服人员！");
                    }
                },
                fail:             function (e, x) {
                    new PNotify({
                        title: '错误提示!',
                        text:  '图片上传错误，请稍后再试',
                        type:  'error',
                    });
                },
                always:           function (a, b) {

                }
            }).on('fileuploadprocessalways', function (e, data) {
                let currentFile = data.files[data.index];
                if (data.files.error && currentFile.error) {
                    new PNotify({
                        title: '错误提示!',
                        text:  currentFile.error,
                        type:  'error',
                    });
                }
            }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
        },
        methods: {
            _inArray:       function (val, arr) {
                return $.inArray(val, arr) !== -1
            },
            imageIsChecked: function (img_url) {
                if (this._inArray(img_url, this.base_data.images) === true) {
                    return true;
                }
                return false;
            },
            toggleImage:    function (event) {
                let url = $(event.target).attr('value');
                if (this.imageIsChecked(url)) {
                    this.base_data.images.splice($.inArray(url, this.base_data.images), 1);
                } else {
                    if (this.base_data.images.length < this.base_data.max_img_num) {
                        this.base_data.images.push(url);
                    } else {
                        new PNotify({
                            title: '提示',
                            text:  '最多选择' + this.base_data.max_img_num + '张图片，若需要选择此图片，请取消其它图片的选择。',
                            type:  'warning',
                        })
                    }
                }
            }
        }
    });


</script>
