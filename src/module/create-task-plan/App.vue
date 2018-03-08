<template>
  <div>
    <!--选择草稿-->
    <Draft></Draft>

    <section class="panel">
      <div class="panel-body">

        <!--<div style="position: fixed; bottom: 200px;left: 20px;">-->
        <!--<a href="javascript:void(0)" class="btn btn-warning" @click="debug">测试数据</a>-->
        <!--<a href="javascript:void(0)" class="btn btn-primary" @click="validator">验证数据</a>-->
        <!--<a href="javascript:void(0)" class="btn btn-success" @click="clearStorage">刪除數據</a>-->
        <!--</div>-->

        <!--快照-->
        <IsSnapshots></IsSnapshots>

        <!--选择平台、店铺流量类型-->
        <BaseTypeSelector></BaseTypeSelector>

        <template v-if="task_type == 101 || task_type == 201">
          <!--发布常规任务-->
          <ConventionalTask></ConventionalTask>
        </template>

        <template v-if="task_type == 102 || task_type == 202">
          <!--发布聚划算任务-->
          <JuHuaSuanTask></JuHuaSuanTask>
        </template>

        <template v-if="task_type == 103 || task_type == 203">
          <!--发布淘抢购任务-->
          <TaoQiangGouTask></TaoQiangGouTask>
        </template>

        <template v-if="task_type == 104 || task_type == 204">
          <!--发布淘口令任务-->
          <TaoKouLingTask></TaoKouLingTask>
        </template>


        <template v-if="task_type == 105 || task_type == 205">
          <!--发布粉丝回访-->
          <FansRollbackTask></FansRollbackTask>
        </template>

        <template v-if="task_type == 106 || task_type == 206">
          <!--发布测图任务-->
          <TestingPictureTask></TestingPictureTask>
        </template>


        <template v-if="task_type == 107 || task_type == 207">
          <!--发布直通车任务-->
          <ZhiTongCartTask></ZhiTongCartTask>
        </template>


        <!--京东 开始 -->
        <template v-if="task_type == 301">
          <!--发布京东常规任务-->
          <JDConventionalTask></JDConventionalTask>
        </template>

        <template v-if="task_type == 302">
          <!--发布京东快车任务-->
          <JDKuaiCheTask></JDKuaiCheTask>
        </template>
        <!--京东 结束-->

      </div>
    </section>
  </div>
</template>

<script>
    // 快照
    import IsSnapshots from '../../components/IsSnapshots.vue'
    // 草稿
    import Draft from '../../components/Draft.vue'
    //    淘宝天猫
    import BaseTypeSelector  from '../../components/BaseTypeSelector.vue'
    import ConventionalTask from '../../components/ConventionalTask.vue'
    import JuHuaSuanTask  from '../../components/JuHuaSuanTask.vue'
    import TaoQiangGouTask  from '../../components/TaoQiangGouTask.vue'
    import TaoKouLingTask  from '../../components/TaoKouLingTask.vue'
    import FansRollbackTask  from '../../components/FansRollbackTask.vue'
    import TestingPictureTask  from '../../components/TestingPictureTask.vue'
    import ZhiTongCartTask  from '../../components/ZhiTongCartTask.vue'

    //    京东
    import JDConventionalTask  from '../../components/JDConventionalTask.vue'
    import JDKuaiCheTask from '../../components/JDKuaiCheTask.vue'


    export default {
        components: {
            BaseTypeSelector,     //平台选择，店铺选择，任务选择
            ConventionalTask,     //常规任务
            JuHuaSuanTask,        //聚划算任务
            TaoQiangGouTask,      //淘抢购
            TaoKouLingTask,       //淘口令
            FansRollbackTask,     //粉丝回访
            TestingPictureTask,   //测图
            ZhiTongCartTask,      //直通车任务
            JDConventionalTask,   //京东常规
            JDKuaiCheTask,        //京东快车
            IsSnapshots,          //快照
            Draft,                //草稿
        },
        data: function () {
            return {
                form_data: this.$root.$data.form_data,
            }
        },
        computed: {
            task_type: function () {
                return this.form_data.base_type.task_type;
            },
        },
        methods: {
            debug: function () {
                console.log(this.$root.$data.form_data)
                console.log(this.$root.$data)
            },
            clearStorage: function () {
                for(let i=0;i<localStorage.length;i++){
                    console.log('delete:' + localStorage.key(i))
                    localStorage.removeItem(localStorage.key(i))
                }
            },

            /**
             * 递归执行所有子组件的验证器
             */
            validator: function () {
                for(let i in this.$root.$refs) {
                    this.deepValidator(this.$root.$refs[i])
                }
            },
            /**
             * 递归执行子组件的validate方法，可在validate方法中写表单验证函数
             * @param component
             */
            deepValidator: function (component) {
                if(component.hasOwnProperty('validate')) {
                    if(typeof component.validate === 'function') {
                        component.validate();
                    }
                }
                if( component.hasOwnProperty('$children') ) {
                    if(component.$children instanceof Array) {
                        for(let i in component.$children) {
                            this.deepValidator(component.$children[i])
                        }
                    }
                }
            },
        }
    }
</script>
