<template>
  <!--流量统计及优化选项 开始-->
  <div class="task-plan-section">
    <h4 @click="section_open===true ? section_open = false : section_open = true">
      基础优化操作统计及深度优化服务选项
      <i class="icon"
         :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
    </h4>
    <blockquote v-show="section_open">
      <div class="form-horizontal add-store">
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>基础优化操作统计</strong>
          </label>
          <div class="col-lg-10">
            <table class="table table-bordered table-hover">
              <thead>
              <tr>
                <th>执行天数</th>
                <th>首日基础操作数量</th>
                <th>每日增长量</th>
                <th>总基础操作数量</th>
                <th>费用(总基础操作数量x单价)</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  {{task_plan.day_length}}
                  <a @click="focus('focus_task_plan_day_length')" href="javascript:void(0)" class="tooltips" data-placement="top" data-toggle="tooltip" data-original-title="这里展示的是任务计划设置结果，您可以通过调整任务计划的参数进行修改，点我返回">
                    <i class="icon icon-pencil text-primary"></i>
                  </a>
                </td>
                <td>
                  {{task_plan.first_day}}
                  <a @click="focus('focus_task_plan_first_day')" href="javascript:void(0)" class="tooltips" data-placement="top" data-toggle="tooltip" data-original-title="这里展示的是任务计划设置结果，您可以通过调整任务计划的参数进行修改，点我返回">
                    <i class="icon icon-pencil text-primary"></i>
                  </a>
                </td>
                <td>
                  {{task_plan.increase_num}}
                  <a @click="focus('focus_task_plan_increase_num')" href="javascript:void(0)" class="tooltips" data-placement="top" data-toggle="tooltip" data-original-title="这里展示的是任务计划设置结果，您可以通过调整任务计划的参数进行修改，点我返回">
                    <i class="icon icon-pencil text-primary"></i>
                  </a>
                </td>
                <td>{{visitors}}</td>
                <td>
                <span class="text-danger">
                  <!--{{computedStepData(task_plan.first_day, task_plan.increase_num, task_plan.day_length)}}-->
                  {{visitors}}
                  x
                  {{optimization.price_allocation.base_action_price}}
                  = {{ Number(flow_price).toFixed(2) }}云币
                </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>优化服务项</strong>
          </label>
          <div class="col-lg-10">
            <DepthOptimization :in_data="optimization" :table_header="init_data.optimization_table_header"></DepthOptimization>

            <div class="help-block text-info">
              <i class="icon icon-info-circle"></i>
              优化项是在基础操作优化基础上的深度优化服务，合理使用优化项服务可以让您的产品获得更好的排名，推荐使用。若不使用深度优化服务，可以将[该操作占基础操作占比例]置为0%。
            </div>
          </div>
        </div>
      </div>

    </blockquote>
  </div>
  <!--流量统计及优化选项 结束-->
</template>

<script>
    import DepthOptimization from '../subsections/DepthOptimization.vue'
    import {computedStepData} from '../../common/computeStep';
    import {scrollFocus} from '../../common/common';

    export default {
        components: {
            DepthOptimization,
        },
        data () {
            return {
                section_open: true,
                task_data: this.$parent.$data.task_data,
                form_data: this.$root.$data.form_data,
                root: this.$root,
                optimization: {
                    prices: {
                        optimization: {//操作项
                            valid: true,
                            value: 0
                        },
                        flow: {//流量费用
                            valid: true,
                            value: 0
                        },
                    },
                    price_allocation: {
                        base_action_price: 0,
                        optimization_options: [
//                            {
//                                name: '收藏商品',
//                                id: 1,
//                                proportion: 30,
//                                proportion_changeable: true,
//                                increase: true,
//                                increase_changeable: true,
//                                price: 0.5,
//                            },
                        ]
                    }
                },
                init_data: {
                    optimization_table_header: [
                        {
                            title: '优化操作项',
                        },
                        {
                            title: '执行天数',
                            css: 'hidden-phone hidden-xs hidden-sm'
                        },
                        {
                            title: '该操作占关键词搜索比例',
                        },
                        {
                            title: '首日数量',
                            css: 'hidden-phone hidden-xs hidden-sm'
                        },
                        {
                            title: '选择是否每日增长',
                        },
                        {
                            title: '每日增量',
                            css: 'hidden-phone hidden-xs hidden-sm'
                        },
                        {
                            title: '累计优化数量',
                        },
                        {
                            title: '费用（操作量X优化项单价）',
                        },
                    ]
                },
            }
        },
        props: {
            optimization_options: {
                required: true,
                default: [
//                    {
//                        name: '收藏商品',
//                        id: 1,
//                        proportion: 30,
//                        proportion_changeable: true,
//                        increase: true,
//                        increase_changeable: true,
//                        price: 0.5,
//                    },
                ]
            },
            base_prices: {
                required: true,
                default: {}
            },
            base_prices_key: {
                required: true,
            }
        },
        created: function () {
            this.$set(this.task_data, 'optimization', this.optimization);
            this.loadOptimizationOptions(this.optimization_options);
            this.loadBasePrice(this.base_prices, this.base_prices_key);
        },
        mounted: function () {

        },
        watch: {
            //更新到根组件
            optimization: {
                handler: function (val, old) {
                    this.$set(this.task_data, 'optimization', val);
                },
                deep: true
            },
            //根数据更新到我
            'task_data.optimization': {
                handler: function (val, old) {
                    this.$set(this.$data, 'optimization', val);
                },
                deep: true
            },
            'optimization_options': { //更新优化选项
                handler: function (val, old) {
                    this.loadOptimizationOptions();
                },
                deep: true
            },
            'base_prices': {  //更新基本操作价格
                handler: function (val, old) {
                    this.loadBasePrice();
                },
                deep: true
            },
        },
        computed: {
            task_plan: function () {
                return this.task_data.task_plan_info;
            },
            visitors: function () {
               return this.computedStepData(this.task_plan.first_day, this.task_plan.increase_num, this.task_plan.day_length)
            },
            flow_price: function () {
                let cost =  this.visitors * this.optimization.price_allocation.base_action_price;

                this.$set(this.optimization.prices.flow, 'value', cost);

                return cost;
            },
        },
        validators: {

        },
        methods: {
            computedStepData: computedStepData,
            focus:function (id) {
                scrollFocus(id,5);
            },
            validate: function() {
                this.$validate().then(function(success) {
                    if (!success) {
                        this.root.form_data.is_validate = false;
                        this.root.logs.errors.push(this.validation.errors);
                    }
                }.bind(this));
            },
            loadOptimizationOptions: function () {
                let tmp_optimization_options =[];
                let arr = this.optimization_options;
                for(let n in arr) {
                    let obj = arr[n];
                    tmp_optimization_options.push({
                        name: obj.name,
                        id: obj.id,
                        proportion: obj.proportion,
                        proportion_changeable: (obj.proportion_changeable ? true : false),
                        increase: (obj.increase ? true : false),
                        increase_changeable: (obj.increase_changeable ? true : false),
                        price: obj.business_price,
                    })
                }
                this.$set(this.optimization.price_allocation, 'optimization_options', tmp_optimization_options);
            },
            loadBasePrice: function (){
                let base_prices = this.base_prices;
                let key = this.base_prices_key;
                if(typeof base_prices === 'object') {
                    if(base_prices.hasOwnProperty(key)) {
                        this.$set(this.optimization.price_allocation, 'base_action_price', base_prices[key].business_price);
                    }
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
