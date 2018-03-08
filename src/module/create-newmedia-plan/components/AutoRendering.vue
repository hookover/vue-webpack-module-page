<template>
    <div class="task-plan-section" v-if="task_info && task_info.hasOwnProperty('elements') && task_info.elements.length > 0">
        <h4 @click="section_open===true ? section_open = false : section_open = true">
            填写任务信息
            <i class="icon"
               :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
        </h4>
        <blockquote v-show="section_open">
            <div class="form-horizontal tasi-form add-store">
                <template v-for="element in task_info.elements">

                    <div class="form-group"  v-if="element.input_type !== 'image'">
                        <label class="col-lg-2 control-label">
                            <strong>{{element.name}}</strong>
                        </label>
                        <div class="col-lg-6" v-show="store_data.content.hasOwnProperty(element.key)">
                            <input :placeholder="element.placeholder" :name="element.key" v-validate="element.verify_rule" v-model="store_data.content[element.key]" class="form-control inline-block" type="text" v-if="element.input_type === 'text' || element.input_type === 'url'">
                            <textarea rows="3" class="form-control" :name="element.key" v-validate="element.verify_rule" v-model="store_data.content[element.key]" :placeholder="element.placeholder" v-if="element.input_type === 'textarea'"></textarea>

                            <div class="help-block" v-if="element.help_tips && !errors.has(element.key)">
                                {{element.help_tips}}
                            </div>
                            <div class="help-block text-danger" v-show="errors.has(element.key)">
                                <i class="icon icon-times-circle color-red"></i>
                                {{ errors.first(element.key) }}
                            </div>
                        </div>
                    </div>

                    <template  v-if="element.input_type === 'image' && store_data.content[element.key]">
                        <!--选择图片-->
                        <ChooseImageForm :other_params="{watermark: 1}" :id="element.key" :base_data="store_data.content[element.key]" :description="element.help_tips"
                                         :title_name="element.name"></ChooseImageForm>
                        <!--选择图片-->
                    </template>
                </template>

                <div class="form-group no-border">
                    <label class="col-lg-2 control-label">
                        <strong>放单时间</strong>
                    </label>
                    <div class="col-lg-8">
                        <s-datetime :date_range="store_data.date_range"></s-datetime>
                        <div class="help-block text-info">
                            <i class="icon icon-info-circle"></i>
                            我们将在您设置的时间范围内开放任务
                        </div>
                    </div>
                </div>
            </div>
        </blockquote>
    </div>
</template>
<script>
//    http://vee-validate.logaretm.com/#available-rules
    import {mapActions, mapGetters, mapState} from 'vuex'
    import ChooseImageForm from '../../../components/form/ChooseImageFormV2.vue'
    import * as _ from '../../../utils/tool'

    export default {
        data: function () {
            return {
                section_open: true,
            }
        },
        components: {
            ChooseImageForm,
            's-datetime': IVDateTimeinput,
        },
        computed: {
            ...mapGetters({
                store_data: 'getData',
                task_info: 'getCurrentNewMediaTaskInfo',
            })
        },
        watch: {
            'task_info': {
                deep: true,
                handler: function () {
                    this.init_form_data();
                }
            }
        },
        created: function () {

        },
        mounted: function () {

        },
        methods: {
            ...mapActions({
                store_data: 'getData',
                updateData: 'updateData',
            }),
            convertVeeTag: function(key){
                return _.convertVeeTag(key);
            },
            init_form_data: function () {
                if(!this.task_info || !this.task_info.hasOwnProperty('elements')) {
                    return false;
                }
                let data = {};
                let dic_attributes = {};
                for(let n in this.task_info.elements) {
                    if(this.task_info.elements[n].input_type === 'image') {
                        let rule = this.task_info.elements[n].verify_rule;
                        rule = rule ? rule : '';
                        let min = rule.match(/min_value:(\d+)/) ? rule.match(/min_value:(\d+)/)[1] : 0;
                        let max = rule.match(/max_value:(\d+)/) ? rule.match(/max_value:(\d+)/)[1] : 2;

                        data[this.task_info.elements[n].key] = {
                            min_img_num:        parseInt(min),     //最少选一个
                            max_img_num:        parseInt(max),     //最多选2个
                            images:             [],    //选中图片列表
                            alternative_images: []     //备选图片列表
                        }
                    }

                    if(this.task_info.elements[n].input_type !== 'image') {
                        data[this.task_info.elements[n].key] = this.task_info.elements[n].default_value
                    }

                    dic_attributes[this.task_info.elements[n].key] = this.task_info.elements[n].name
                }

                const dictionary = {
                    zh_CN: {
                        attributes:dic_attributes
                    }
                };

                this.$validator.localize(dictionary);

                this.updateData({content: data});
            },
        }
    }
</script>