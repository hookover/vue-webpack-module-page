<template>
  <div>
    <!--填写商品信息-->
    <ProductInfo></ProductInfo>

    <!--设置任务计划信息-->
    <TaskPlanInfo></TaskPlanInfo>

    <!--填写访客搜索的关键词及数量占比-->
    <KeyWordSetting></KeyWordSetting>

    <!--流量统计及优化选项-->
    <StatisticsAndOptimization
            :base_prices="root.server_data.prices"
            :optimization_options="root.server_data.optimize_service_items"
            base_prices_key="zhitong_cart">
    </StatisticsAndOptimization>

    <!--选择增值服务-->
    <ValueAddedServices></ValueAddedServices>

    <!--提交确认-->
    <DoneButton></DoneButton>
  </div>
</template>

<script>
    import BaseTypeSelector from './BaseTypeSelector.vue'
    import ProductInfo from './subsections/ProductInfo.vue'
    import KeyWordSetting from './subsections/KeyWordSetting.vue'
    import TaskPlanInfo from './subsections/TaskPlanInfo.vue'
    import StatisticsAndOptimization from './subsections/StatisticsAndOptimization.vue'
    import ValueAddedServices from './subsections/ValueAddedServices.vue'
    import DoneButton from './subsections/DoneButton.vue'

    export default {
        components: {
            BaseTypeSelector,
            ProductInfo,
            KeyWordSetting,
            TaskPlanInfo,
            StatisticsAndOptimization,
            ValueAddedServices,
            DoneButton
        },
        data: function () {
            return {
                form_data: this.$root.$data.form_data,
                task_data: {},
                root: this.$root
            }
        },
        created: function () {
            this.$set(this.$root.$data.form_data,'task_data',{});
        },
        mounted: function () {
            this.$set(this.root.logs, 'errors', []);
        },
        watch: {
            //更新到根组件
            task_data: {
                handler: function (val, old) {
                    this.$set(this.form_data, 'task_data', val);
                },
                deep: true
            },
            //根数据更新到我
            'form_data.task_data': {
                handler: function (val, old) {
                    this.$set(this.$data, 'task_data', val);
                },
                deep: true
            },
        },
    }
</script>
