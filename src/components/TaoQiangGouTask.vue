<template>
  <div>
    <!--填写商品信息-->
    <ProductInfo></ProductInfo>

    <!--任务计划-->
    <TaskPlanInfo></TaskPlanInfo>

    <!--口令设置-->
    <KouLingSetting></KouLingSetting>

    <!--优化操作项-->
    <StatisticsAndOptimization
            :base_prices="root.server_data.prices"
            :optimization_options="root.server_data.optimize_service_items"
            base_prices_key="taoqianggou">
    </StatisticsAndOptimization>

    <!--选择增值服务-->
    <ValueAddedServices></ValueAddedServices>

    <!--提交确认-->
    <DoneButton></DoneButton>
  </div>
</template>

<script>
    import BaseTypeSelector from './BaseTypeSelector.vue'
    import KouLingSetting from './subsections/KouLingSetting.vue'
    import ProductInfo from './subsections/taoqianggou/ProductInfo.vue'
    import TaskPlanInfo from './subsections/taoqianggou/TaskPlanInfo.vue'
    import StatisticsAndOptimization from './subsections/StatisticsAndOptimization.vue'
    import ValueAddedServices from './subsections/ValueAddedServices.vue'
    import DoneButton from './subsections/DoneButton.vue'

    export default {
        components: {
            BaseTypeSelector,
            ProductInfo,
            TaskPlanInfo,
            KouLingSetting,
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
