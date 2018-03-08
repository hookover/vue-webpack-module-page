<template>
  <!--计划执行信息 开始-->
  <div class="task-plan-section">
      <h4 @click="section_open===true ? section_open = false : section_open = true">
        任务计划配置
        <i class="icon"
           :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
      </h4>
      <blockquote v-show="section_open">
      <div class="form-horizontal tasi-form add-store" role="form">
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>快捷选择计划类型</strong>
          </label>
          <div class="col-lg-10">
            <div class="radios-inline">
              <template v-for="(option,n) in init_data.product_type.list">
                <label class="label_radio">
                  <input :name="init_data.product_type.name" :value="option.value" type="radio" v-model="task_plan_info.product_type" @click="chooseProductType(option)">
                  {{option.text}}
                </label>
              </template>
              <label class="label_radio s14">
                <i class="icon icon-eye text-success"></i>
                <span class="text-primary" @click="showPlanRecommend">查看专业建议</span>
              </label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>首日关键词搜索数量</strong>
          </label>
          <div class="col-lg-6" :class="{'has-error': validation.hasError('task_plan_info.first_day'), 'has-success': validation.isPassed('task_plan_info.first_day')}">
            <div>
              <input v-model.lazy.trim.num="task_plan_info.first_day" class="form-control per50 inline-block" type="text" id="focus_task_plan_first_day">
              <span class="ml10 mt5">必须为10的整数倍</span>
            </div>
            <div class="help-block text-danger" v-if="validation.hasError('task_plan_info.first_day')">
              <i class="icon icon-times-circle color-red"></i>
              {{ validation.firstError('task_plan_info.first_day') }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>任务执行天数</strong>
          </label>
          <div class="col-lg-6" :class="{'has-error': validation.hasError('task_plan_info.day_length'), 'has-success': validation.isPassed('task_plan_info.day_length')}">
            <div>
              <input class="form-control per50 inline-block" v-model.lazy.trim.num="task_plan_info.day_length" type="text" id="focus_task_plan_day_length">
              <span class="ml10 mt5">天</span>
            </div>
            <div class="help-block text-danger" v-if="validation.hasError('task_plan_info.day_length')">
              <i class="icon icon-times-circle color-red"></i>
              {{ validation.firstError('task_plan_info.day_length') }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>任务开始时间</strong>
          </label>
          <div class="col-lg-6" :class="{'has-error': validation.hasError('task_plan_info.begin_time'), 'has-success': validation.isPassed('task_plan_info.begin_time')}">
            <div>
              <input :value="task_plan_info.begin_time" class="form-control task-plan-info-date-picker inline-block per50" type="text">
              <a href="javascript:void(0)" class="text-primary mt5 ml10">
                <span class="popovers" data-original-title="提示" data-content="我们将根据设置的任务执行天数自动计算结束时间，结束时间为结束当天的23点59分。" data-placement="top" data-trigger="hover">任务结束时间？</span>
              </a>
            </div>
            <div class="help-block text-danger" v-if="validation.hasError('task_plan_info.begin_time')">
              <i class="icon icon-times-circle color-red"></i>
              {{ validation.firstError('task_plan_info.begin_time') }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>每日增长关键词搜索量</strong>
          </label>
          <div class="col-lg-6">
            <div>
              <div class="radios-inline inline-block mt5">
                <label class="label_radio"><input name="incremental" v-model="task_plan_info.increase" :value="false" type="radio">不增长</label>
                <label class="label_radio"><input name="incremental" v-model="task_plan_info.increase" :value="true" type="radio">增长</label>
              </div>
              <div class="inline-block" v-if="task_plan_info.increase === true" :class="{'has-error': validation.hasError('task_plan_info.increase_num'), 'has-success': validation.isPassed('task_plan_info.increase_num')}">
                <input type="text" v-model.lazy.trim.num="task_plan_info.increase_num" class="form-control inline-block per40" id="focus_task_plan_increase_num">
                <span class="ml5">访客</span>
              </div>
            </div>
            <div class="help-block text-danger" v-if="validation.hasError('task_plan_info.increase_num')">
              <i class="icon icon-times-circle color-red"></i>
              {{ validation.firstError('task_plan_info.increase_num') }}
            </div>
          </div>
        </div>
      </div>
    </blockquote>
  </div>
  <!--计划执行信息 结束-->
</template>

<script>
    import {formatDate} from '../../common/date.js';
    export default {
        data () {
            return {
                section_open: true,
                task_data: this.$parent.$data.task_data,
                root: this.$root,
                task_plan_info: {
                    product_type: 1,  //商品类型
                    first_day: 60,    //首日执行数量
                    day_length: 15,   //执行天数
                    increase: true,   //增长
                    increase_num: 10, //日增长人数
                    begin_time: formatDate((new Date()),'yyyy-MM-dd hh:mm'),    //开始时间
                },
                init_data: {
                    keywords: [],
                    product_type: {
                        name: '_product_type',
                        list: [
                            {
                                text: '新店新品',
                                value: '1',
                                more: {
                                    first_day: 60,
                                    day_length: 15,
                                }
                            },
                            {
                                text: '老店新品',
                                value: '2',
                                more: {
                                    first_day: 120,
                                    day_length: 15,
                                }
                            },
                            {
                                text: '爆款',
                                value: '3',
                                more: {
                                    first_day: 640,
                                    day_length: 14,
                                }
                            },
                            {
                                text: '小爆款',
                                value: '4',
                                more: {
                                    first_day: 240,
                                    day_length: 14,
                                }
                            },
                            {
                                text: '长线持续优化',
                                value: '5',
                                more: {
                                    first_day: 60,
                                    day_length: 90,
                                }
                            },
                            {
                                text: '超长线打造爆品旗舰店',
                                value: '6',
                                more: {
                                    first_day: 60,
                                    day_length: 180,
                                }
                            },
                        ]
                    }
                },
            }
        },
        created: function () {
            this.$set(this.task_data, 'task_plan_info', this.task_plan_info);
        },
        mounted: function () {
            this.$nextTick(function(){
                $('.task-plan-info-date-picker').datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd hh:ii",
                    autoclose: true,
                    todayBtn: true,
                    startDate: (new Date()),
                    minuteStep: 10
                });
                let _self = this;
                $('.task-plan-info-date-picker').on('change', function () {
                    _self.$set(_self.task_plan_info, 'begin_time', $(this).val());
                    let cur = new Date();
                    let time = new Date($(this).val());
                    if(cur > time) {
                        _self.$set(_self.task_plan_info, 'begin_time', formatDate(cur,'yyyy-MM-dd hh:mm'));
                    }
                });
            });
        },
        watch: {
            //更新到根组件
            task_plan_info: {
                handler: function (val, old) {
                    this.$set(this.task_data, 'task_plan_info', val);
                    this.validate();
                },
                deep: true
            },
            //根数据更新到我
            'task_data.task_plan_info': {
                handler: function (val, old) {
                    this.$set(this.$data, 'task_plan_info', val);
                },
                deep: true
            },
            'task_plan_info.increase': function (val, old) {
                if(val === false) {
                    this.task_plan_info.increase_num = 0;
                } else {
                    this.task_plan_info.increase_num = 10;
                }
            },
            'task_plan_info.first_day': function (val, old) {
                val = Math.round(val / 10) * 10;
                if(isNaN(val)) {
                    val = 10;
                }
                val = val > 0 ? val : 10;
                this.$set(this.task_plan_info, 'first_day', val);

                //优化每日增长访客量
                this.$set(this.task_plan_info, 'increase_num', val / 6);
            },
            'task_plan_info.day_length': function () {
                this.task_plan_info.day_length = Math.round(this.task_plan_info.day_length);
                if(!(this.task_plan_info.day_length > 0)) {
                    this.task_plan_info.day_length = 1;
                }
            },
            'task_plan_info.increase_num': function (val,old) {
                if((this.task_plan_info.increase === true && val < 10) || isNaN(val)) {
                    val = 10;
                }
                val = Math.round(val / 10 ) * 10;
                this.$set(this.task_plan_info, 'increase_num', val);
            },
        },
        computed:{

        },
        validators: {
            'task_plan_info.first_day': function(value) {
                return this.Validator.value(value).required('首日到店访客数不能为空！').integer('输入类型必须是数字！');
            },
            'task_plan_info.day_length': function(value) {
                return this.Validator.value(value).required('执行天数不能为空！').integer('输入类型必须是数字！').greaterThan(0,'执行天数必须大于1天');
            },
            'task_plan_info.begin_time': function(value) {
                return this.Validator.value(value).required('计划开始时间不能为空！');
            },
            'task_plan_info.increase_num': function (increase_num) {
                if(this.task_plan_info.increase === false) {
                    return;
                }
                return this.Validator.value(increase_num).required('访客数量不能为空！').integer('输入类型必须是数字！');
            }
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
            chooseProductType: function (option) {
                this.task_plan_info.first_day = option.more.first_day;
                this.task_plan_info.day_length = option.more.day_length;
            },
//            显示专业建议
            showPlanRecommend: function () {
                BootstrapDialog.show({
                    title: '流量导入速度建议',
                    message: '<div>'+
                             '<h5 class="text-danger">新店新品</h5>'+
                             '<div>前7天建议商品每日至少新增<span class="text-danger">20-300</span>个访客；<span class="text-danger">7</span>天稳定之后，建议增长到每日<span class="text-danger">160-1000</span>个访客；以下发布的任务数量仅做参考，可以根据店铺实际情况自行修改 (不应低于<span class="text-danger">20</span>访客)</div>' +

                             '<h5 class="text-danger">老店新品</h5>'+
                             '<div>前7天建议商品每日至少新增<span class="text-danger">160-1000</span>个访客；<span class="text-danger">7</span>天稳定之后，建议增长到每日<span class="text-danger">300-2000</span>个访客；以下发布的任务数量仅做参考，可以根据店铺实际情况自行修改 (不应低于<span class="text-danger">20</span>访客)</div>' +

                             '<h5 class="text-danger">爆款</h5>'+
                             '<div>建议首日新增300-2000个收藏和加购<span class="text-danger">300-2000</span>个访客；以下发布的任务数量仅做参考，可以根据店铺实际情况自行修改 (不应低于<span class="text-danger">20</span>访客)</div>' +

                             '<h5 class="text-danger">小爆款</h5>'+
                             '<div>建议首日新增160-1000个收藏和加购<span class="text-danger">160-1000</span>个访客；以下发布的任务数量仅做参考，可以根据店铺实际情况自行修改 (不应低于<span class="text-danger">20</span>访客)</div>' +

                             '</div>'
                });
            }
        }
    }
</script>

<style>

</style>
