<template>
  <!--设置选图规则 开始-->
  <div class="task-plan-section">
      <h4 @click="section_open===true ? section_open = false : section_open = true">
        设置选图规则
        <i class="icon"
           :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
      </h4>
      <blockquote v-show="section_open">
      <div class="form-horizontal add-store" role="form">

        <template v-for="(keyword, n) in testing_picture.data">
          <div class="form-group">
            <label class="col-lg-2 control-label">
              <strong>
                选图规则 {{n + 1}}
                <template v-if="(n == 0) && !keyword.value">
                  <span class="text-danger">*</span>
                </template>
              </strong>
            </label>
            <div class="col-lg-10">

              <div :class="{'has-error': validation.hasError('testing_picture.data'), 'has-success': validation.isPassed('testing_picture.data')}">
                <template v-if="alternative_images_length > 0">
                  <select class="form-control per30 minw80 inline-block" v-model="keyword.value">
                    <template v-for="option in select_rules.options" >
                      <template v-if="!curInSelect(option.value) || keyword.value === option.value">
                        <option :value="option.value" v-if="option.required <= alternative_images_length">{{option.name}}</option>
                      </template>
                    </template>
                  </select>
                </template>
                <template v-if="alternative_images_length === 0">
                  <select class="form-control per30 minw80 inline-block">
                    <option value="#" selected>请先上传图片后，再在此选择规则....</option>
                  </select>
                </template>

                <template v-if="alternative_images_length > 0">
                  <template v-if="(n == 0) && testing_picture.data.length < max_keyword_num">
                    <a class="ml10 text-primary" href="javascript:void(0);" @click="addKeyword"><i class="icon icon-plus"></i> 添加规则</a>
                  </template>
                  <template v-if="n != 0">
                    <a class="ml10 text-danger" href="javascript:void(0);" @click="deleteKeyword(keyword)"><i class="icon icon-remove"></i> 删除规则</a>
                  </template>
                </template>

              </div>
            </div>
          </div>
        </template>
        <div class="form-group">
          <div class="col-lg-10 col-lg-offset-2">
            <div class="help-block text-danger" v-if="validation.hasError('testing_picture.data')">
              <i class="icon icon-times-circle color-red"></i>
              {{ validation.firstError('testing_picture.data') }}
            </div>
            <div class="help-block text-info">
              <i class="icon icon-info-circle"></i>
              您可以添加{{max_keyword_num}}个选图规则
            </div>
          </div>
        </div>


        <hr>
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>规则信息及费用</strong>
          </label>
          <div class="col-lg-10">
            <table class="table table-bordered table-hover">
              <tbody>
              <!--<tr>-->
                <!--<th>规则序号</th>-->
                <!--<template v-for="option in compute_keywords">-->
                  <!--<td>{{option.value}}</td>-->
                <!--</template>-->
                <!--<template v-if="compute_keywords.length === 0">-->
                  <!--<td class="text-left">请先选择规则</td>-->
                <!--</template>-->
              <!--</tr>-->
              <tr>
                <th>规则名称</th>
                <template v-for="option in compute_keywords">
                  <td>{{option.name}}</td>
                </template>
                <template v-if="compute_keywords.length === 0">
                  <td class="text-left">请先选择规则</td>
                </template>
              </tr>
              <tr>
                <td colspan="10" class="text-right text-danger">
                  <span class="text-danger pull-right">费用计算：{{total_num}} x {{base_price}} = {{Number(compute_price).toFixed(2)}}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </blockquote>
  </div>
  <!--设置选图规则 结束-->
</template>

<script>
    import DistributionZoneModal from '../../modal/DistributionZoneModal.vue'
    import {computedStepData} from '../../../common/computeStep';
    export default {
        components: {
            DistributionZoneModal
        },
        data () {
            return {
                section_open: true,
                task_data: this.$parent.$data.task_data,
                root: this.$root,
                testing_picture: {
                    prices: {
                        testing_picture: {
                            value: 0,
                            valid: true,
                        },
                    },
                    data: [
                        {
                            id: 0,
                            value: '',
                        }
                    ]
                },
                select_rules: {
                    options: [
                        {
                            name: '选择一张最适合的',
                            value: 1,
                            required: 1,
                        },
                        {
                            name: '选择两张最适合的',
                            value: 2,
                            required: 2,
                        },
                        {
                            name: '选择三张最适合的',
                            value: 3,
                            required: 3,
                        },
                        {
                            name: '选择四张最适合的',
                            value: 4,
                            required: 4,
                        },
                        {
                            name: '选择五张最适合的',
                            value: 5,
                            required: 5,
                        },
                        {
                            name: '选择一张最差的',
                            value: 6,
                            required: 1,
                        },
                        {
                            name: '选择两张最差的',
                            value: 7,
                            required: 2,
                        },
                        {
                            name: '选择三张最差的',
                            value: 8,
                            required: 3,
                        },
                        {
                            name: '选择四张最差的',
                            value: 9,
                            required: 4,
                        },
                        {
                            name: '选择五张最差的',
                            value: 10,
                            required: 5,
                        },
                    ]
                }
            };
        },
        props: {
            max_keyword_num: {  //5个关键词
                default: 1,
            },
            base_prices: {
                required: true,
                default: {}
            }
        },
        created: function () {
            this.$set(this.task_data, 'testing_picture', this.testing_picture);
        },
        mounted: function () {

        },
        watch: {
            //更新到根组件
            testing_picture: {
                handler: function (val, old) {
                    this.$set(this.task_data, 'testing_picture', val);
                    this.validate();
                },
                deep: true
            },
            //根数据更新到我
            'task_data.testing_picture': {
                handler: function (val, old) {
                    this.$set(this.$data, 'testing_picture', val);
                },
                deep: true
            },
            'task_data.product_info.images': {
                handler: function (val, old) {
                    if(val.length < this.testing_picture.data.length) {
                        if(this.testing_picture.data.length === 1) {
                            this.testing_picture.data = [
                                {
                                    id: 0,
                                    value: '',
                                }
                            ]
                        } else {
                            this.testing_picture.data.splice((this.testing_picture.data.length - 1),1)
                        }
                    }
                },
                deep: true
            }
        },
        computed: {
            alternative_images_length: function(){
                return this.task_data.product_info.images.length;
            },
            already_keyword_num: function () {
                let num = 0;
                for(let i = 0; i < this.testing_picture.data.length; ++i) {
                    if(this.testing_picture.data[i].value) {
                        num ++;
                    }
                }
                return num;
            },
            base_price: function () {
                if(this.base_prices.hasOwnProperty('testing_picture')) {
                    return this.base_prices['testing_picture'].business_price;
                }
                return 0;
            },
            total_num: function () {
                return this.task_data.task_plan_info.first_day;
            },
            compute_price: function () {
                let price = (this.base_price) * this.total_num;
                this.testing_picture.prices.testing_picture.value = price;
                return price;
            },
            compute_keywords: function () {
                let tmp_arr = [];
                for(let n in this.testing_picture.data) {
                    let keyword = this.testing_picture.data[n];
                    if(keyword.value !== '') {
                        for(let k in this.select_rules.options) {
                            let option = this.select_rules.options[k];
                            if(keyword.value === option.value) {
                                tmp_arr.push({
                                    name: option.name,
                                    value: keyword.value
                                });
                            }
                        }
                    }
                }
                return tmp_arr;
            }
        },
        validators: {
            'testing_picture.data': function (arr) {
                return this.Validator.custom(function () {
                    if($.trim(arr[0].value) === '') {
                        return '必须选择一个测图规则！'
                    }
                    for(let n in arr) {
                        if($.trim(arr[n].value) === ''){
                            return '第'+ (parseInt(n)+1) + '个选图规则未填写完整，若不需要请将该选项删除掉';
                        }
                    }
                });
            },
        },
        methods: {
            validate: function() {
                this.$validate().then(function(success) {
                    if (!success) {
                        this.root.form_data.is_validate = false;
                        this.root.logs.errors.push(this.validation.errors);
                    }
                }.bind(this));
            },
            curInSelect: function (val) {
                for(let n in this.testing_picture.data) {
                    if(this.testing_picture.data[n].value === val) {
                        return true;
                    }
                }
                return false;
            },
            addKeyword: function () {
                if(this.testing_picture.data.length < this.max_keyword_num) {
                    this.testing_picture.data.push({
                        id: this.testing_picture.data.length,
                        value: '',
                    });
                    let _self = this;
                    setTimeout(function () {
                        $('#_keyword_focus_' + (_self.testing_picture.data.length - 1)).focus();
                    },200)
                }
            },
            deleteKeyword: function (keyword) {
                this.testing_picture.data.splice($.inArray(keyword, this.testing_picture.data), 1);
            },
            computedStepData: computedStepData,
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
