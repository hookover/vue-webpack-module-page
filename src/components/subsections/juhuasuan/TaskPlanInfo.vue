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
            <strong>首日设置开团提醒数</strong>
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
            <strong>任务开始时间</strong>
          </label>
          <div class="col-lg-6" :class="{'has-error': validation.hasError('task_plan_info.begin_time'), 'has-success': validation.isPassed('task_plan_info.begin_time')}">
            <div>
              <input :value="task_plan_info.begin_time" class="form-control task-plan-info-begin-date-picker inline-block per50" type="text">
            </div>
            <div class="help-block text-danger" v-if="validation.hasError('task_plan_info.begin_time')">
              <i class="icon icon-times-circle color-red"></i>
              {{ validation.firstError('task_plan_info.begin_time') }}
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>任务结束时间</strong>
          </label>
          <div class="col-lg-6" :class="{'has-error': validation.hasError('task_plan_info.end_time'), 'has-success': validation.isPassed('task_plan_info.end_time')}">
            <div>
              <input :value="task_plan_info.end_time" class="form-control task-plan-info-end-date-picker inline-block per50" type="text">
              <span class="ml10">任务结束时间不应晚于聚划算结束时间</span>
            </div>
            <div class="help-block text-danger" v-if="validation.hasError('task_plan_info.end_time')">
              <i class="icon icon-times-circle color-red"></i>
              {{ validation.firstError('task_plan_info.end_time') }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>每日增长开团提醒数量</strong>
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
    import {formatDate} from '../../../common/date';

    export default {
        data () {
            return {
                section_open: true,
                task_data: this.$parent.$data.task_data,
                root: this.$root,
                task_plan_info: {
                    first_day: 60,    //首日执行数量
                    day_length: 2,   //执行天数
                    increase: true,   //增长
                    increase_num: 10, //日增长人数
                    begin_time: moment().format('YYYY-MM-DD HH:mm'),    //开始时间
                    end_time: moment().add(+1,'days').format('YYYY-MM-DD HH:mm')
                },
                init_data: {
                    keywords: [],
                },
            }
        },
        created: function () {
            this.$set(this.task_data, 'task_plan_info', this.task_plan_info);
            this.$set(this.task_plan_info, 'day_length', this.computeDayLength());
        },
        mounted: function () {
            this.$nextTick(function(){
                let _self = this;
                $('.task-plan-info-end-date-picker,.task-plan-info-begin-date-picker').datetimepicker({
                    language: "zh-CN",
                    format: "yyyy-mm-dd hh:ii",
                    autoclose: true,
                    todayBtn: true,
                    startDate: (new Date),
                    minuteStep: 10
                });
                $('.task-plan-info-begin-date-picker').on('change', function () {
                    _self.$set(_self.task_plan_info, 'begin_time', $(this).val());
                    let cur = new Date();
                    let time = new Date($(this).val());
                    if(cur > time) {
                        _self.$set(_self.task_plan_info, 'begin_time', formatDate(cur,'yyyy-MM-dd hh:mm'));
                    }
                });
                $('.task-plan-info-end-date-picker').on('change', function () {
                    _self.$set(_self.task_plan_info, 'end_time', $(this).val());
                    let cur = new Date();
                    let time = new Date($(this).val());
                    if(cur > time) {
                        _self.$set(_self.task_plan_info, 'end_time', formatDate(cur,'yyyy-MM-dd hh:mm'));
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
            'task_plan_info.increase_num': function (val,old) {
                if((this.task_plan_info.increase === true && val < 10) || isNaN(val)) {
                    val = 10;
                }
                val = Math.round(val / 10 ) * 10;
                this.$set(this.task_plan_info, 'increase_num', val);
            },
            'task_plan_info.begin_time': function (val, old) {
               this.$set(this.task_plan_info, 'day_length', this.computeDayLength());
            },
            'task_plan_info.end_time': function (val, old) {
                this.$set(this.task_plan_info, 'day_length', this.computeDayLength());
            }
        },
        computed:{

        },
        validators: {
            'task_plan_info.first_day': function(value) {
                return this.Validator.value(value).required('首日到店访客数不能为空！').integer('输入类型必须是数字！');
            },
            'task_plan_info.begin_time': function(value) {
                return this.Validator.value(value).required('计划开始时间不能为空！');
            },
            'task_plan_info.end_time': function(value) {
                return this.Validator.value(value).required('计划结束时间不能为空！');
            },
            'task_plan_info.increase_num': function (increase_num) {
                if(this.task_plan_info.increase === false) {
                    return;
                }
                return this.Validator.value(increase_num).required('每日增长数量不能为空！').integer('输入类型必须是数字！');
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
            computeDayLength: function () {
                let begin = moment(this.task_plan_info.begin_time, 'YYYY-MM-DD');
                let end = moment(this.task_plan_info.end_time, 'YYYY-MM-DD');

                return end.diff(begin, 'days') + 1;
            },
        }
    }
</script>

<style>

</style>
