<template>
  <!--填写访客入店的关键词及数量占比 开始-->
  <div class="task-plan-section">
      <h4 @click="section_open===true ? section_open = false : section_open = true">
        填写淘口令
        <i class="icon"
           :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
      </h4>
      <blockquote v-show="section_open">
      <div class="form-horizontal add-store" role="form">
        <template v-for="(keyword, n) in keywords">
          <div class="form-group">
            <label class="col-lg-2 control-label">
              <strong>
                淘口令 {{n + 1}}
                <template v-if="(n == 0) && !keyword.value">
                  <span class="text-danger">*</span>
                </template>
              </strong>
            </label>
            <div class="col-lg-10">
             <div :class="{'has-error': validation.hasError('keywords'), 'has-success': validation.isPassed('keywords')}">
               <input :id="('_keyword_focus_' + n)" class="form-control per50 minw5 inline-block" @keyup="enterToNextKeyword" v-model.trim="keyword.value" placeholder="请输入淘口令" type="text">
               <span class="mt5 ml5">
                 <a href="javascript:void(0);" class="text-primary" @click="clearKeyword(keyword)">
                  <i class="icon icon-remove"></i>清空
                </a>
              </span>
               <template v-if="max_keyword_num > 1">
                 <label class="control-label ml20">数量占比</label>
                 <select v-model.trim="keyword.more.proportion" class="form-control per10 minw70 inline-block" @change="checkKeywordProportion">
                   <option v-for="option in select_proportions.list" v-bind:value="option.value">
                     {{ option.name }}
                   </option>
                 </select>
               </template>

               <template v-if="(n == 0) && keywords.length < max_keyword_num">
                 <a class="ml10 text-primary" href="javascript:void(0);" @click="addKeyword"><i class="icon icon-plus"></i> 添加淘口令</a>
               </template>
               <template v-if="n != 0">
                 <a class="ml10 text-danger" href="javascript:void(0);" @click="deleteKeyword(keyword)"><i class="icon icon-remove"></i> 删除淘口令</a>
               </template>
             </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-lg-10 col-lg-offset-2">
              <template v-if="n == (keywords.length -1)">
                <div class="help-block text-danger" v-if="validation.hasError('keywords')">
                  <i class="icon icon-times-circle color-red"></i>
                  {{ validation.firstError('keywords') }}
                </div>
                <template v-if="already_keyword_num">
                  <div class="help-block text-info">
                    <i class="icon icon-info-circle"></i>
                    您已填写{{already_keyword_num}}个淘口令，您还可以添加并填写{{max_keyword_num - already_keyword_num}}个淘口令
                  </div>
                </template>
                <div class="help-block text-info">
                  <i class="icon icon-info-circle"></i>
                  该淘口令是指商品参加聚划算开团提醒页面的淘口令，而不是商品详情页的淘口令
                </div>
              </template>
            </div>
          </div>
        </template>
        <hr>
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>各淘口令访客总量</strong>
          </label>
          <div class="col-lg-10">
            <table class="table table-bordered table-hover">
              <tbody>
              <tr>
                <th>淘口令</th>
                <template v-for="option in compute_keywords">
                  <td>{{option.name}}</td>
                </template>
                <template v-if="compute_keywords.length === 0">
                  <td class="text-left">请先填写淘口令</td>
                </template>
              </tr>
              <tr>
                <th>访客数量</th>
                <template v-for="option in compute_keywords">
                  <td>{{option.total}}</td>
                </template>
                <template v-if="compute_keywords.length === 0">
                  <td class="text-left">请先填写淘口令</td>
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
              请务必保证您设置的淘口令信息都为该任务商品的淘口令；若填写与任务商品无关的淘口令信息会导致访客进店不足，进而影响您的任务完成情况。
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
                task_data: this.$parent.$data.task_data,
                root: this.$root,
                keywords: [
                    {
                        id: 0,
                        value: '',
                        more: {
                            proportion: 100,
                        }
                    }
                ],
                select_proportions: {
                    name: '_select_proportions',
                    list: [
                        {
                            name: '10%',
                            value: 10
                        },
                        {
                            name: '20%',
                            value: 20
                        },
                        {
                            name: '30%',
                            value: 30
                        },
                        {
                            name: '40%',
                            value: 40
                        },
                        {
                            name: '50%',
                            value: 50
                        },
                        {
                            name: '60%',
                            value: 60
                        },
                        {
                            name: '70%',
                            value: 70
                        },
                        {
                            name: '80%',
                            value: 80
                        },
                        {
                            name: '90%',
                            value: 90
                        },
                        {
                            name: '100%',
                            value: 100
                        },
                    ]
                },
            };
        },
        props: {
            max_keyword_num: {  //5个关键词
                default: 1,
            }
        },
        created: function () {
            this.$set(this.task_data, 'keywords', this.keywords);
        },
        watch: {
            //更新到根组件
            keywords: {
                handler: function (val, old) {
                    this.$set(this.task_data, 'keywords', val);
                    this.validate();
                },
                deep: true
            },
            //根数据更新到我
            'task_data.keywords': {
                handler: function (val, old) {
                    this.$set(this.$data, 'keywords', val);
                },
                deep: true
            },
        },
        computed: {
            already_keyword_num: function () {
                let num = 0;
                for(let i = 0; i < this.keywords.length; ++i) {
                    if(this.keywords[i].value) {
                        num ++;
                    }
                }
                return num;
            },
            compute_keywords: function () {
                let datas = [];
                for(let i in this.keywords) {
                    let keyword = this.keywords[i];
                    if((typeof keyword.value) === 'string') {
                        let match_keyword= keyword.value.match(/￥[^\￥]*￥/g);
                        if($.trim(keyword.value) !== '' &&  match_keyword !== null && match_keyword.length > 0) {
                            datas.push({
                                name:  match_keyword.toString(),
                                proportion: keyword.more.proportion / 100,
                            });
                        }
                    }
                }
                for(let k in datas) {
                    if(this.task_data.task_plan_info.increase) {
                        datas[k]['total'] = computedStepData(this.task_data.task_plan_info.first_day, this.task_data.task_plan_info.increase_num, this.task_data.task_plan_info.day_length) * datas[k].proportion
                    } else {
                        datas[k]['total'] = this.task_data.task_plan_info.first_day * this.task_data.task_plan_info.day_length * datas[k].proportion;
                    }
                }
                return datas;
            },
        },
        validators: {
            'keywords': function (arr) {
                return this.Validator.custom(function () {
                    if($.trim(arr[0].value) === '') {
                        return '第一个淘口令必须填写！'
                    }
                    for (let n in arr) {
                        if($.trim(arr[n].value) === ''){
                            return '第'+ (parseInt(n)+1) + '个淘口令未填写完整，若不需要请将其删除掉';
                        }
                        if((typeof arr[n].value) === 'string') {
                            let obj = (arr[n].value).match(/￥[^\￥]*￥/g);
                            if(obj === null || obj.length !== 1){
                                return '第' + (parseInt(n)+1) + '个淘口令格式错误, 请提供包含有以￥开头和结尾的口令'
                            }
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
            clearKeyword: function (keyword) {
                keyword.value = '';
                keyword.more =  {
                    sort_by: '',
                        filters: [],
                        price_range: {
                        min: '',
                            max: ''
                    },
                    proportion: 20,
                        distribution_zone: '',
                        product_class: ''
                }
            },
            addKeyword: function () {
                if(this.keywords.length < this.max_keyword_num) {
                    this.keywords.push({
                        id: this.keywords.length,
                        value: '',
                        more: {
                            sort_by: '',
                            filters: [],
                            price_range: {
                                min: '',
                                max: ''
                            },
                            proportion: 20,
                            distribution_zone: '',
                            product_class: ''
                        }
                    });
                    this.resetKeywordProportion();
                    let _self = this;
                    setTimeout(function () {
                        $('#_keyword_focus_' + (_self.keywords.length - 1)).focus();
                    },200)
                } else {
                    new PNotify({
                        title: '敬告',
                        text: '该任务计划最多可以设置'+this.max_keyword_num+'个淘口令！',
                        type: 'warning',
                    });
                }
            },
            enterToNextKeyword: function (event) {
                if(event.which === 13){
                    this.addKeyword();
                }
            },
            deleteKeyword: function (keyword) {
                this.keywords.splice($.inArray(keyword, this.keywords), 1);
                this.resetKeywordProportion();
            },
            resetKeywordProportion: function () {
                let proportion = parseInt(10 / this.keywords.length) * 10;
                let lastProportion = proportion + (100 - proportion * this.keywords.length);

                for(let i=0; i < this.keywords.length; ++i) {
                    if((i+1) === this.keywords.length) {
                        this.keywords[i].more.proportion = lastProportion;
                    } else {
                        this.keywords[i].more.proportion = proportion;
                    }
                }
            },
            checkKeywordProportion: function () {
                let proportion = 0;
                for(let i in this.keywords) {
                    proportion = proportion + parseInt(this.keywords[i].more.proportion);
                }
                if(proportion > 100) {
                    this.resetKeywordProportion();
                    new PNotify({
                        title: '敬告',
                        text: '淘口令总占比超过100%，已自动调整！',
                        type: 'info',
                    });
                }
                if(this.keywords.length === 1) {
                    this.resetKeywordProportion();
                }
            },
            computedStepData: computedStepData,
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
