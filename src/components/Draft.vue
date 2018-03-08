<template>
    <div class="row">
        <div class="col-lg-12" v-if="plan_draft.length > 0">
            <section class="panel draft">
                <header class="panel-heading text-primary">
                    使用草稿填充表单 (点击将会使用草稿数据覆盖现有表单数据)
                </header>
                <div class="panel-body">
                    <div class="form-horizontal tasi-form">
                        <div class="form-group">
                            <!--<label class="col-lg-3 col-sm-4 control-label">点击将会使用草稿数据覆盖现有表单数据</label>-->
                            <div class="col-lg-12">
                                <div class="radios-inline">
                                    <label class="label_radio" v-for="item in plan_draft">
                                        <span  @click="setDraftDataToCurrentFormData(item)">
                                            草稿：{{item.name}}
                                        </span>
                                        <i class="icon icon-remove delete" @click="deleteDraft(item.id, item.name)"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import {deepConvertBooleanToNumber,deepConvertStringToBoolean, deepConvertStringToBooleanAndNumber} from  '../common/common';
    import api from '../common/api'

    export default {
        data: function () {
            return {
                plan_draft: []
            }
        },
        mounted: function () {
            this.getAllPlanDraft();
        },
        methods: {
            getAllPlanDraft: function () {
                api.getAllPlanDraft().then(
                    res => {
                        let data = res.data;
                        deepConvertStringToBooleanAndNumber(data);
                        this.plan_draft = data;
                    },
                    p => {

                    }
                )
            },
            setDraftDataToCurrentFormData: function (draft_data) {
                let data = $.extend(true,{},draft_data.content);
                this.$set(this.$root.$data.form_data, 'base_type', data.base_type);

                for(let n in this.$root.$data.form_data.task_data) {
                    this.$set(this.$root.$data.form_data.task_data, n, data.task_data[n]);
                }
            },
            deleteDraft: function (id,name) {
                if(!(parseInt(id) > 0)) {
                    new PNotify({
                        text: 'ID填写错误！',
                        type: 'warning',
                    });
                    return false;
                }

                let self = this;
                BootstrapDialog.confirm({
                    title: '草稿删除后不可恢复',
                    message: '确定删除草稿:' + name + '?',
                    type: BootstrapDialog.TYPE_WARNING,
                    closable: false,
                    draggable: true,
                    btnCancelLabel: '取消',
                    btnOKLabel: '确认',
                    btnOKClass: 'btn-warning',
                    callback: function(result) {
                        if(result) {
                            api.getDeleteDraft(id).then(
                                res => {
                                    new PNotify({
                                        text: '您已经成功删除草稿：' + name,
                                        type: 'success',
                                    });

                                    for(let n in self.plan_draft) {
                                        if(self.plan_draft[n].id === id) {
                                            self.plan_draft.splice(n, 1)
                                        }
                                    }
                                },
                                p => {

                                }
                            )
                        }
                    }
                });


            }
        }
    }
</script>

<style>

</style>