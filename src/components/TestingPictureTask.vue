<template>
  <div>
    <!--填写商品信息-->
    <ProductInfo></ProductInfo>

    <!--任务计划-->
    <TaskPlanInfo></TaskPlanInfo>

    <!--测图专用-->
    <TestingPictureSetting max_keyword_num="2"  :base_prices="root.server_data.prices"></TestingPictureSetting>

    <!--增值服务-->
    <ValueAddedServices></ValueAddedServices>

    <!--提交确认-->
    <DoneButton></DoneButton>
  </div>
</template>

<script>
    import ProductInfo from './subsections/testingpicture/ProductInfo.vue'
    import TaskPlanInfo from './subsections/testingpicture/TaskPlanInfo.vue'
    import ValueAddedServices from './subsections/testingpicture/ValueAddedServices.vue'
    import TestingPictureSetting from './subsections/testingpicture/TestingPictureSetting.vue'
    import DoneButton from './subsections/DoneButton.vue'

    export default {
        components: {
            ProductInfo,
            TaskPlanInfo,
            TestingPictureSetting,
            DoneButton,
            ValueAddedServices
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
