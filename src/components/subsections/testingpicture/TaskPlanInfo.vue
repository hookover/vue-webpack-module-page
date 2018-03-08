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
            <strong>设置参与测图人数</strong>
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
          <div class="col-lg-10 col-lg-offset-2 clearfix">
            <div class="help-block text-info">
              <i class="icon icon-info-circle"></i>
              我们会在尽可能短的时间内完成测图任务，暂不支持自定义完成时间。
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
                    first_day: 120,    //首日执行数量
                    day_length: 1,   //执行天数
                    increase: false,   //增长
                    increase_num: 0, //日增长人数
                    begin_time: moment().format('YYYY-MM-DD HH:mm'),    //开始时间
                },
                init_data: {
                    keywords: [],
                },
            }
        },
        created: function () {
            this.$set(this.task_data, 'task_plan_info', this.task_plan_info);
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
                    val = 120;
                }
                val = val > 120 ? val : 120;
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
        },
        computed:{

        },
        validators: {
            'task_plan_info.first_day': function(value) {
                return this.Validator.value(value).required('参与测图人数不能为空！').integer('输入类型必须是数字！');
            },
            'task_plan_info.begin_time': function(value) {
                return this.Validator.value(value).required('计划开始时间不能为空！');
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
        }
    }
</script>

<style>

</style>
