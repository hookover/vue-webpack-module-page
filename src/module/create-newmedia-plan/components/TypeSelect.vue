<template>
    <div class="task-plan-section">
        <h4 @click="section_open===true ? section_open = false : section_open = true">
            基本选项
            <i class="icon"
               :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
        </h4>
        <blockquote v-show="section_open">
            <div class="form-horizontal tasi-form add-store">
                <div class="form-group">
                    <label class="col-lg-2 control-label">
                        <strong>选择任务平台</strong>
                    </label>
                    <div class="col-lg-10">
                        <div class="radios-inline">
                            <label class="label_radio" v-for="(checkbox, n) in store_data.platforms">
                                <input :value="checkbox.id" v-model="platform_id" type="radio">
                                <img v-bind:src="checkbox.logo" :alt="checkbox.name">
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-group" v-if="platform_id">
                    <label class="col-lg-2 control-label">
                        <strong>任务类型</strong>
                    </label>

                    <div class="col-lg-10">
                        <div class="radios-inline">
                            <template v-for="o in store_data.task_types">
                                <template v-if="taskTypeBelongCurrentPlatform(o.id, o.platform_id)">
                                    <label class="label_radio">
                                        <input :value="o.id" type="radio" v-model="task_id">
                                        {{o.name}}
                                    </label>
                                </template>
                            </template>
                        </div>

                        <template v-if="current_task_type_info !== false && current_task_type_info.description">
                            <div class="help-block text-info animated fadeIn">
                                <i class="icon icon-info-circle"></i>
                                <span v-html="current_task_type_info.description"></span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </blockquote>
    </div>
</template>
<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import api from '../../../common/api'

    export default {
        data:     function () {
            return {
                section_open: true,
            }
        },
        watch: {
            platform_id: function (id, old) {
                if(this.store_data.task_types.length > 0) {
                    for(let n in this.store_data.task_types) {
                        if(this.store_data.task_types[n].platform_id === id) {
                            this.task_id = this.store_data.task_types[n].id;
                            break;
                        }
                    }
                }
            },
            'task_id': function (id, old) {
                for(let n in this.store_data.task_types) {
                    if(parseInt(id) === this.store_data.task_types[n].id) {
                        this.updateData({task_price: this.store_data.task_types[n].business_price})
                    }
                }
            }
        },
        mounted: function () {
            api.getPlatform().then(
                res => {
                    if(res.hasOwnProperty('data') && res.data.length > 0) {
                        this.store_data.platforms = res.data;
                        this.platform_id = res.data[0].id;
                    }
                },
                o => {
                    //演示数据，删除下面代码
                    let res = {"result":true,"input":{"id":"","name":"","logo":"","description":"","status":"","order_number":"","created_at":"","updated_at":""},"data":[{"id":10,"name":"\u5fae\u4fe1","logo":"http:\/\/www.shangtuiyun.com\/backend\/dist\/images\/newmedia-type-logo\/weixin.png","description":"\u5fae\u4fe1\u5237\u7968\u3001\u5fae\u4fe1\u70b9\u8d5e\u3001\u96c6\u8d5e\u3001\u8f6c\u53d1\u3001\u52a0\u5173\u6ce8\uff0c\u5404\u79cd\u73a9\u6cd5\u4efb\u4f60\u64cd\u63a7\u3002"},{"id":20,"name":"\u5fae\u535a","logo":"http:\/\/img.t.sinajs.cn\/t6\/style\/images\/global_nav\/WB_logo.png","description":"\u5173\u6ce8\u6da8\u7c89\u3001\u8bc4\u3001\u8d5e\u3001\u8f6c\u53d1\uff0c\u5206\u5206\u949f\u53d8\u8eab\u8a00\u8bba\u9886\u8896\u3002"}]};
                    this.store_data.platforms = res.data;
                    this.platform_id = res.data[0].id;
                }
            );

            api.getTaskTypes().then(
                res => {
                    if(res.hasOwnProperty('data') && res.data.length > 0) {
                        this.store_data.task_types = res.data;
                        this.task_id = res.data[0].id;
                    }
                },
                o => {
                    //演示数据格式，删除下面代码
                    let res = {"result":true,"input":{"id":"","platform_id":"","name":"","logo":"","description":"","example_url":"","operation_tips":"","business_price":"","worker_price":"","need_images":"","status":"","order_number":"","created_at":"","updated_at":""},"data":[{"id":102,"platform_id":10,"name":"MP\u76f4\u6295","description":"\u5fae\u4fe1\u516c\u4f17\u53f7\u91cc\u9762\u5c31\u53ef\u4ee5\u521b\u5efa\u81ea\u5e26\u7684mp\u6295\u7968\u3002\u4e3b\u8981\u662f\u80fd\u8fc7\u6295\u7968\u6765\u589e\u52a0\u4eba\u6c14\u3002\u8ba9\u53c2\u4e0e\u7684\u9009\u624b\u62c9\u4eba\u7ed9\u81ea\u5df1\u6295\u7968\uff0c\u8fd9\u6837\u5b50\u6295\u7968\u7684\u4eba\u5c31\u4f1a\u77e5\u9053\u6709\u8fd9\u4e48\u4e00\u4e2a\u516c\u4f17\u53f7\u3002","operation_tips":null,"business_price":"0.20000","elements":[{"id":6,"platform_id":10,"source_type":102,"name":"\u516c\u4f17\u53f7","input_type":"text","key":"weixin","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u516c\u4f17\u53f7\u6709\u52a9\u4e8e\u63d0\u9ad8\u5408\u683c\u7387","help_tips":"\u5982\uff1a\u5173\u6ce8\u516c\u4f17\u53f7\"\u5546\u63a8\u4e91\"\uff0c\u5e76\u56de\u590d8","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":7,"platform_id":10,"source_type":102,"name":"\u88ab\u6295\u4eba","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u88ab\u6295\u4eba\u6216\u88ab\u6295\u7f16\u53f7","help_tips":"\u5982\uff1a8\u53f7\u9009\u624b \u9f99\u5c0f\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":8,"platform_id":10,"source_type":102,"name":"\u8fde\u63a5","input_type":"url","key":"target_url","description":"","default_value":"","placeholder":"\u6295\u7968\u8fde\u63a5","help_tips":"\u5982\uff1ahttp:\/\/example.com\/toupiao","example_url":"","verify_rule":"url","verify_fail_message":"","verify_success_message":""},{"id":9,"platform_id":10,"source_type":102,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u76f4\u6295 \u4e0a\u4f20\u52fe\u9009\u56fe\u548c\u5df2\u9009\u56fe","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":10,"platform_id":10,"source_type":102,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":101,"platform_id":10,"name":"\u5173\u6ce8\u6295\u7968","description":"\u5173\u6ce8\u6307\u5b9a\u516c\u4f17\u53f7\u4e4b\u540e\u6295\u7968\u3002","operation_tips":null,"business_price":"0.22000","elements":[{"id":1,"platform_id":10,"source_type":101,"name":"\u516c\u4f17\u53f7","input_type":"text","key":"weixin","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u516c\u4f17\u53f7\u6709\u52a9\u4e8e\u63d0\u9ad8\u5408\u683c\u7387","help_tips":"\u5982\uff1a\u5173\u6ce8\u516c\u4f17\u53f7\"\u5546\u63a8\u4e91\"\uff0c\u5e76\u56de\u590d8","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":2,"platform_id":10,"source_type":101,"name":"\u88ab\u6295\u4eba","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u88ab\u6295\u4eba\u6216\u88ab\u6295\u7f16\u53f7","help_tips":"\u5982\uff1a8\u53f7\u9009\u624b \u9f99\u5c0f\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":3,"platform_id":10,"source_type":101,"name":"\u8fde\u63a5","input_type":"url","key":"target_url","description":"","default_value":"","placeholder":"\u6295\u7968\u8fde\u63a5","help_tips":"\u5982\uff1ahttp:\/\/example.com\/toupiao","example_url":"","verify_rule":"url","verify_fail_message":"","verify_success_message":""},{"id":4,"platform_id":10,"source_type":101,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u76f4\u6295 \u4e0a\u4f20\u52fe\u9009\u56fe\u548c\u5df2\u9009\u56fe","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":5,"platform_id":10,"source_type":101,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""},{"id":36,"platform_id":10,"source_type":101,"name":"\u6587\u7ae0\u8fde\u63a5","input_type":"url","key":"target_url","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u6587\u7ae0\u8fde\u63a5\u5730\u5740","help_tips":"\u5982\uff1ahttp:\/\/example.com\/article\/1","example_url":"","verify_rule":"url","verify_fail_message":"","verify_success_message":""}]},{"id":113,"platform_id":10,"name":"\u5173\u6ce8\u516c\u4f17\u53f7","description":"","operation_tips":"","business_price":"0.20000","elements":[{"id":45,"platform_id":10,"source_type":113,"name":"\u516c\u4f17\u53f7\/\u4e2a\u4eba\u53f7","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u516c\u4f17\u53f7\u6216\u4e2a\u4eba\u53f7","help_tips":"\u5982\uff1a\u5173\u6ce8\u516c\u4f17\u53f7 \u5546\u63a8\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":46,"platform_id":10,"source_type":113,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1\uff08\u5c3d\u91cf\u8ba9\u63a5\u5355\u4fa0\u7406\u89e3\u60a8\u7684\u610f\u56fe\uff09","help_tips":"\u5982\uff1a\u8bf7\u626b\u7801\u5173\u6ce8\u5bf9\u5e94\u516c\u4f17\u53f7\uff0c\u5173\u6ce8\u540e\u622a\u56fe","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":47,"platform_id":10,"source_type":113,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u516c\u4f17\u53f7\u4e8c\u7ef4\u7801\u6216\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":103,"platform_id":10,"name":"\u6ce8\u518c\u6295\u7968","description":"\u82e5\u9700\u8981\u624b\u673a\u6ce8\u518c\uff0c\u8bf7\u52a0\u4ef7\u54e6","operation_tips":null,"business_price":"0.40000","elements":[{"id":11,"platform_id":10,"source_type":103,"name":"\u516c\u4f17\u53f7","input_type":"text","key":"weixin","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u516c\u4f17\u53f7\u6709\u52a9\u4e8e\u63d0\u9ad8\u5408\u683c\u7387","help_tips":"\u5982\uff1a\u5173\u6ce8\u516c\u4f17\u53f7\"\u5546\u63a8\u4e91\"\uff0c\u5e76\u56de\u590d8","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":12,"platform_id":10,"source_type":103,"name":"\u88ab\u6295\u4eba","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u88ab\u6295\u4eba\u6216\u88ab\u6295\u7f16\u53f7","help_tips":"\u5982\uff1a8\u53f7\u9009\u624b \u9f99\u5c0f\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":13,"platform_id":10,"source_type":103,"name":"\u8fde\u63a5","input_type":"url","key":"target_url","description":"","default_value":"","placeholder":"\u6295\u7968\u8fde\u63a5","help_tips":"\u5982\uff1ahttp:\/\/example.com\/toupiao","example_url":"","verify_rule":"url","verify_fail_message":"","verify_success_message":""},{"id":14,"platform_id":10,"source_type":103,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u76f4\u6295 \u4e0a\u4f20\u52fe\u9009\u56fe\u548c\u5df2\u9009\u56fe","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":15,"platform_id":10,"source_type":103,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":104,"platform_id":10,"name":"\u7b2c\u4e09\u65b9\u76f4\u6295","description":null,"operation_tips":null,"business_price":"0.14000","elements":[{"id":16,"platform_id":10,"source_type":104,"name":"\u88ab\u6295\u4eba","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u88ab\u6295\u4eba\u6216\u88ab\u6295\u7f16\u53f7","help_tips":"\u5982\uff1a8\u53f7\u9009\u624b \u9f99\u5c0f\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":17,"platform_id":10,"source_type":104,"name":"\u8fde\u63a5","input_type":"url","key":"target_url","description":"","default_value":"","placeholder":"\u6295\u7968\u8fde\u63a5","help_tips":"\u5982\uff1ahttp:\/\/example.com\/toupiao","example_url":"","verify_rule":"url","verify_fail_message":"","verify_success_message":""},{"id":18,"platform_id":10,"source_type":104,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u76f4\u6295 \u4e0a\u4f20\u52fe\u9009\u56fe\u548c\u5df2\u9009\u56fe","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":19,"platform_id":10,"source_type":104,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":204,"platform_id":10,"name":"\u5fae\u5546\u52a0\u597d\u53cb","description":"\u65e0\u9700\u60a8\u518d\u4e00\u4e2a\u4e2a\u7684\u52a0\u9644\u8fd1\u7684\u4eba\u4e86\uff0c\u771f\u5b9e\u5fae\u4fe1\u7528\u6237\u4e3b\u52a8\u52a0\u60a8\uff0c\u8ba9\u5fae\u4fe1\u53d8\u6210\u60a8\u5fae\u5546\u5e7f\u544a\u5e73\u53f0\uff0c\u60a8\u8981\u505a\u7684\u4ec5\u4ec5\u662f\u9009\u5bf9\u5fae\u5546\u4ea7\u54c1\uff0c\u7136\u540e\u9759\u9759\u5730\u7b49\u5f85\u8f6c\u5316\u3002","operation_tips":null,"business_price":"0.50000","elements":[{"id":42,"platform_id":10,"source_type":204,"name":"\u5fae\u5546\u5fae\u4fe1\u53f7","input_type":"text","key":"weixin","description":null,"default_value":null,"placeholder":"\u8bf7\u786e\u4fdd\u60a8\u8f93\u5165\u7684\u5fae\u4fe1\u53f7\u6b63\u786e\u65e0\u8bef","help_tips":"\u63d0\u793a\uff1a\u8bf7\u8f93\u5165\u60a8\u8981\u63a8\u5e7f\u7684\u5fae\u5546\u5fae\u4fe1\u53f7","example_url":null,"verify_rule":"required","verify_fail_message":null,"verify_success_message":null},{"id":43,"platform_id":10,"source_type":204,"name":"\u63cf\u8ff0","input_type":"text","key":"description","description":null,"default_value":null,"placeholder":null,"help_tips":"\u5982\uff1a\u8bf7\u5fae\u4fe1\u641c\u7d22\u6dfb\u52a0\u597d\u53cb\uff1a\u201cxxx\u201d\uff0c7\u5929\u5185\u4e0d\u53ef\u5220\u9664\uff0c\u8be5\u4fe1\u606f\u5c06\u539f\u6587\u5c55\u793a\u7ed9\u63a5\u5355\u4fa0\u3002","example_url":null,"verify_rule":"required","verify_fail_message":null,"verify_success_message":null},{"id":44,"platform_id":10,"source_type":204,"name":"\u6210\u529f\u5b9e\u4f8b\u56fe\u7247","input_type":"image","key":"success_image","description":null,"default_value":null,"placeholder":null,"help_tips":"\u8be5\u56fe\u7247\u7528\u4e8e\u63d0\u793a\u63a5\u5355\u4fa0\u64cd\u4f5c\u6210\u529f\u7684\u622a\u56fe\u6837\u4f8b\u3002","example_url":null,"verify_rule":"min:1|max:3","verify_fail_message":null,"verify_success_message":null}]},{"id":110,"platform_id":10,"name":"\u670b\u53cb\u5708\u96c6\u8d5e","description":"\u4e00\u822c\u662f\u6307\u5b9a\u670b\u53cb\u5708\u91cc\u9762\u7684\u7b2c1\u6761\u6216\u8005\u7b2c2\u6761\u5185\u5bb9\uff0c\u8ba9\u597d\u53cb\u70b9\u8d5e\u3002\u8be5\u4efb\u52a1\u9700\u8981\u5148\u52a0\u81ea\u5df1\u4e3a\u597d\u53cb\uff0c\u7136\u540e\u70b9\u8d5e\u3002","operation_tips":null,"business_price":"0.60000","elements":[{"id":20,"platform_id":10,"source_type":110,"name":"\u516c\u4f17\u53f7\/\u4e2a\u4eba\u53f7","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u516c\u4f17\u53f7\u6216\u4e2a\u4eba\u53f7","help_tips":"\u5982\uff1a\u5173\u6ce8\u516c\u4f17\u53f7 \u5546\u63a8\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":21,"platform_id":10,"source_type":110,"name":"\u6587\u7ae0\u5730\u5740","input_type":"text","key":"article_address","description":"","default_value":"","placeholder":"\u53ef\u5199\u6587\u7ae0\u8fde\u63a5\u6216\u6587\u7ae0\u4f4d\u7f6e","help_tips":"\u5982\uff1ahttp:\/\/example.com\/article\/1 \u6216 \u670b\u53cb\u5708\u7b2c\u4e00\u7bc7\u6587\u7ae0","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":22,"platform_id":10,"source_type":110,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u8f6c\u53d1\u670b\u53cb\u5708\u7b2c\u4e00\u7bc7\u6587\u7ae0\uff0c\u5728\u81ea\u5df1\u670b\u53cb\u5708\u622a\u56fe","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":23,"platform_id":10,"source_type":110,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":111,"platform_id":10,"name":"\u6587\u7ae0\u8bc4\u8bba","description":null,"operation_tips":null,"business_price":"0.25000","elements":[{"id":24,"platform_id":10,"source_type":111,"name":"\u516c\u4f17\u53f7\/\u4e2a\u4eba\u53f7","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u516c\u4f17\u53f7\u6216\u4e2a\u4eba\u53f7","help_tips":"\u5982\uff1a\u5173\u6ce8\u516c\u4f17\u53f7 \u5546\u63a8\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":25,"platform_id":10,"source_type":111,"name":"\u6587\u7ae0\u5730\u5740","input_type":"text","key":"article_address","description":"","default_value":"","placeholder":"\u53ef\u5199\u6587\u7ae0\u8fde\u63a5\u6216\u6587\u7ae0\u4f4d\u7f6e","help_tips":"\u5982\uff1ahttp:\/\/example.com\/article\/1 \u6216 \u670b\u53cb\u5708\u7b2c\u4e00\u7bc7\u6587\u7ae0","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":26,"platform_id":10,"source_type":111,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u586b\u5199\u8bc4\u8bba\u5185\u5bb9\u201cxxx..\u201d | \u81ea\u5df1\u7f16\u5199\u8d5e\u7f8e\u8bc4\u8bba","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":27,"platform_id":10,"source_type":111,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":112,"platform_id":10,"name":"\u8f6c\u53d1\u670b\u53cb\u5708","description":null,"operation_tips":null,"business_price":"0.25000","elements":[{"id":28,"platform_id":10,"source_type":112,"name":"\u516c\u4f17\u53f7\/\u4e2a\u4eba\u53f7","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u516c\u4f17\u53f7\u6216\u4e2a\u4eba\u53f7","help_tips":"\u5982\uff1a\u5173\u6ce8\u516c\u4f17\u53f7 \u5546\u63a8\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":29,"platform_id":10,"source_type":112,"name":"\u6587\u7ae0\u5730\u5740","input_type":"text","key":"article_address","description":"","default_value":"","placeholder":"\u53ef\u5199\u6587\u7ae0\u8fde\u63a5\u6216\u6587\u7ae0\u4f4d\u7f6e","help_tips":"\u5982\uff1ahttp:\/\/example.com\/article\/1 \u6216 \u670b\u53cb\u5708\u7b2c\u4e00\u7bc7\u6587\u7ae0","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":30,"platform_id":10,"source_type":112,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1\uff08\u5c3d\u91cf\u8ba9\u63a5\u5355\u4fa0\u7406\u89e3\u60a8\u7684\u610f\u56fe\uff09","help_tips":"\u5982\uff1a\u590d\u5236\u4ee5\u4e0b\u5185\u5bb9\u5230\u81ea\u5df1\u7684\u670b\u53cb\u5708\uff1axxx\u83b7\u5f97\u672c\u5e74\u5ea6\u51a0\u519b | \u8f6c\u53d1\u6211\u670b\u53cb\u5708\u7b2c\u4e00\u7bc7\u6587\u7ae0","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":31,"platform_id":10,"source_type":112,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":201,"platform_id":20,"name":"\u5173\u6ce8\u6da8\u7c89","description":null,"operation_tips":null,"business_price":"0.20000","elements":[{"id":32,"platform_id":20,"source_type":201,"name":"\u88ab\u5173\u6ce8\u5fae\u535a\u53f7","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6b63\u786e\u7684\u5fae\u535a\u8d26\u53f7","help_tips":"\u5982\uff1a\u5fae\u535a\u8d26\u53f7 \u5546\u63a8\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":33,"platform_id":10,"source_type":201,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u8bf7\u5173\u6ce8\u5fae\u535a \u5546\u63a8\u4e91","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":34,"platform_id":10,"source_type":201,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":202,"platform_id":20,"name":"\u9876\u8d34","description":null,"operation_tips":null,"business_price":"0.20000","elements":[{"id":35,"platform_id":20,"source_type":202,"name":"\u5fae\u535a\u53f7","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6587\u7ae0\u6240\u5728\u5fae\u535a\u8d26\u53f7","help_tips":"\u5982\uff1a\u5fae\u535a \u5546\u63a8\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":37,"platform_id":10,"source_type":202,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u8bf7\u70b9\u8d5e\u8be5\u6587\u7ae0","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":38,"platform_id":10,"source_type":202,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]},{"id":203,"platform_id":20,"name":"\u8f6c\u53d1","description":null,"operation_tips":null,"business_price":"0.25000","elements":[{"id":39,"platform_id":20,"source_type":203,"name":"\u5fae\u535a\u53f7","input_type":"text","key":"target_user","description":"","default_value":"","placeholder":"\u6587\u7ae0\u6240\u5728\u5fae\u535a\u8d26\u53f7","help_tips":"\u5982\uff1a\u5fae\u535a \u5546\u63a8\u4e91","example_url":"","verify_rule":"required","verify_fail_message":"","verify_success_message":""},{"id":40,"platform_id":10,"source_type":203,"name":"\u63cf\u8ff0","input_type":"textarea","key":"description","description":"","default_value":"","placeholder":"\u63cf\u8ff0\u4e00\u4e0b\u60a8\u7684\u4efb\u52a1","help_tips":"\u5982\uff1a\u8bf7\u8f6c\u53d1\u8be5\u6587\u7ae0\u5e76\u622a\u56fe","example_url":"","verify_rule":"","verify_fail_message":"","verify_success_message":""},{"id":41,"platform_id":10,"source_type":203,"name":"\u6210\u529f\u6837\u4f8b\u56fe\u7247","input_type":"image","key":"example_image","description":"","default_value":"","placeholder":"","help_tips":"\u8bf7\u4e0a\u4f20\u6210\u529f\u540e\u7684\u6837\u4f8b\u622a\u56fe","example_url":"","verify_rule":"min_value:0|min_value:2","verify_fail_message":"","verify_success_message":""}]}]};
                    this.store_data.task_types = res.data;
                    this.task_id = res.data[0].id;
                }
            )
        },
        computed: {
            ...mapGetters({
                store_data: 'getData',
                current_task_type_info: 'getCurrentNewMediaTaskInfo',
            }),
            platform_id:{
                get: function () {
                    return this.store_data.platform_id
                },
                set: function (v) {
                    this.updateData({platform_id: parseInt(v)})
                }
            },
            task_id:{
                get: function () {
                    return this.store_data.task_id
                },
                set: function (v) {
                    this.updateData({task_id: parseInt(v)})
                }
            },
        },
        methods:  {
            ...mapActions({
                updateData: 'updateData'
            }),
            taskTypeBelongCurrentPlatform: function (id, platform_id) {
                if (parseInt(platform_id) === parseInt(this.platform_id)) {
                    return true;
                }
                return false;
            },
        }
    }
</script>