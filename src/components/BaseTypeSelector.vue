<template>
  <!--选择平台、店铺流量类型 开始-->
  <div class="task-plan-section">
    <h4 @click="section_open===true ? section_open = false : section_open = true">
      选择平台、店铺流量类型
      <i class="icon"
         :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
    </h4>
    <blockquote v-show="section_open">
      <div class="form-horizontal tasi-form add-store" role="form">
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>选择推广平台</strong>
          </label>
          <div class="col-lg-10">
            <div class="radios-inline">
              <label class="label_radio" v-for="(checkbox, n) in init_data.platforms">
                <input :value="checkbox.value" v-model="base_platform" type="radio" @click="clearPlatformChecked">
                <img v-bind:src="checkbox.logo" :alt="checkbox.name">
              </label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>用户流量类型</strong>
          </label>
          <div class="col-lg-10">
            <label class="checkbox-inline" v-for="(checkbox, n) in init_data.flow_types">
              <input :value="checkbox.value" v-model="base_type.flow_type" type="checkbox" disabled>
              {{checkbox.name}}
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>任务类型</strong>
          </label>

          <div class="col-lg-10">
            <div class="radios-inline">
              <template v-for="obj in init_data.task_types">
                <template v-if="taskTypeBelongCurrentPlatform(obj.value)">
                  <label class="label_radio">
                    <input :value="obj.value" type="radio" v-model="base_task_type" @click="clearChecked">
                    {{obj.name}}
                    <img v-if="obj.is_vip === true" v-bind:src="vip_img" :alt="obj.name" class="maxw40">
                  </label>
                </template>
              </template>
            </div>

            <template v-if="current_task_type_info !== false && current_task_type_info.hasOwnProperty('description')">
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
  <!--选择平台、店铺流量类型 结束-->
</template>

<script>
    import JDImg from '../../static/img/channel_log/redio_jd.png'
    import TaobaoImg from '../../static/img/channel_log/redio_taobao.jpg'
    import TmallImg from '../../static/img/channel_log/redio.tmall.jpg'
    import VIPImg from '../../static/img/vip-1.png'

    export default {
        data () {
            return {
                section_open: true,
                form_data: this.$root.$data.form_data,
                root: this.$root,
                vip_img: VIPImg,
                base_type: {
                    platform: 2,                  //默认选择推广平台
                    task_type: 201,                 //默认任务类型 [常规任务]
                    flow_type: ['pc','mobile'],     //默认用户流量类型
                },
                init_data: {
                    platforms: [
                        {
                            name: '天猫',
                            logo: TmallImg,
                            value: 2,
                            task_types: [201,202,203,204,205,206,207,208,209]
                        },
                        {
                            name: '淘宝',
                            logo: TaobaoImg,
                            value: 1,
                            task_types: [101,102,103,104,105,106,107,108,109]
                        },
                        {
                            name: '京东',
                            logo: JDImg,
                            value: 3,
                            task_types: [301,302]
                        }
                    ],
                    flow_types: [
                        {
                            name: 'PC端（接单侠使用电脑操作）',
                            value: 'pc'
                        },
                        {
                            name: '移动端（接单侠通过手机操作）',
                            value: 'mobile'
                        }
                    ],
                    task_types: [
                        {
                            name: '常规任务',
                            value: 101,
                            description: '买家通过商家提供的关键词，手淘搜索入店，完成浏览、收藏、加购、领取优惠券等等操作；选择此任务类型，任务商品每日的收藏加购率保持稳定，适合大部分类目，推荐选择；',
                        },
                        {
                            name: '聚划算',
                            value: 102,
                            description: '支持聚划算参团商品设置开团提醒，加购，关注店铺、领取优惠券，进宝贝评价页等操作；',
                        },
                        {
                            name: '淘抢购',
                            value: 103,
                            description: '快速提升淘抢购预热阶段宝贝开团提醒人数，积累人气，有效提升宝贝在淘抢购页面的排名； ',
                        },
                        {
                            name: '淘口令',
                            value: 104,
                            description: '买家通过商家分享的淘口令入店，完成浏览、收藏、加购、领取优惠券等等操作； ',
                        },
//                        {
//                            name: '粉丝回访',
//                            value: 105,
//                            description: '粉丝首日通过商家提供的任务关键词进入手机淘宝搜索并找到对应的商品，完成首日的流量,收藏商品, 加购物车等首日任务，次日通过足迹,收藏夹,购物车等渠道进行回访，完成第二天商家设置的任务内容。 ',
//                        },
                        {
                            name: '测图',
                            value: 106,
                            description: '让广大网友选出自认为最让自己心动的图片，测图适用于各种图片，低成本高效率精准测图。<br/><i class="ml15"></i>我们采用随机展示算法和优劣奖惩机制来确保每张图片都是由接单侠认真筛选的结果。',
                        },
                        {
                            name: '直通车',
                            value: 107,
                            description: '关于直通车减少过滤问题: <br/><i class="ml10"></i>1.出价低，排名太靠后，建议在16-20位之前。<br/><i class="ml10"></i>2.展现太低，50-60%的点击率一般都会过滤，建议控制在行业标准的3倍左右。<br/><i class="ml10"></i>3.展示位置在自然搜索后面也会容易被过滤，建议把直通车位置调整到自然搜索前面。<br/><i class="ml10"></i>4.排名点击费用问题，可以适当的卡条件，尽量只卡1-2个条件 <br/><i class="ml10"></i>5.卡条件可以灵活运用，不要一直是卡同个条件，多样化，人性化以上建议仅供参考，由于淘宝判定过滤系统已经升级最高，若有过滤情况，请咨询客服；',
                            is_vip: false,
                        },
//                        {
//                            name: '钻展',
//                            value: 108,
//                            description: '',
//                        },
//                        {
//                            name: '活动',
//                            value: 109,
//                            description: '',
//                        },


                        {
                            name: '常规任务',
                            value: 201,
                            description: '买家通过商家提供的关键词，手淘搜索入店，完成浏览、收藏、加购、领取优惠券等等操作；选择此任务类型，任务商品每日的收藏加购率保持稳定，适合大部分类目，推荐选择；',
                        },
                        {
                            name: '聚划算',
                            value: 202,
                            description: '支持聚划算参团商品设置开团提醒，加购，关注店铺、领取优惠券，进宝贝评价页等操作；',
                        },
                        {
                            name: '淘抢购',
                            value: 203,
                            description: '快速提升淘抢购预热阶段宝贝开团提醒人数，积累人气，有效提升宝贝在淘抢购页面的排名； ',
                        },
                        {
                            name: '淘口令',
                            value: 204,
                            description: '买家通过商家分享的淘口令入店，完成浏览、收藏、加购、领取优惠券等等操作； ',
                        },
//                        {
//                            name: '粉丝回访',
//                            value: 205,
//                            description: '粉丝首日通过商家提供的任务关键词进入手机淘宝搜索并找到对应的商品，完成首日的流量,收藏商品, 加购物车等首日任务，次日通过足迹,收藏夹,购物车等渠道进行回访，完成第二天商家设置的任务内容。 ',
//                        },
                        {
                            name: '测图',
                            value: 206,
                            description: '让广大网友选出自认为最让自己心动的图片，测图适用于各种图片，低成本高效率精准测图。<br/><i class="ml15"></i>我们采用随机展示算法和优劣奖惩机制来确保每张图片都是由接单侠认真筛选的结果。',
                        },
                        {
                            name: '直通车',
                            value: 207,
                            description: '关于直通车减少过滤问题: <br/><i class="ml15"></i>1.出价低，排名太靠后，建议在16-20位之前。<br/><i class="ml15"></i>2.展现太低，50-60%的点击率一般都会过滤，建议控制在行业标准的3倍左右。<br/><i class="ml15"></i>3.展示位置在自然搜索后面也会容易被过滤，建议把直通车位置调整到自然搜索前面。<br/><i class="ml15"></i>4.排名点击费用问题，可以适当的卡条件，尽量只卡1-2个条件 <br/><i class="ml15"></i>5.卡条件可以灵活运用，不要一直是卡同个条件，多样化，人性化以上建议仅供参考，由于淘宝判定过滤系统已经升级最高，若有过滤情况，请咨询客服；',
                            is_vip: false,
                        },
//                        {
//                            name: '钻展',
//                            value: 208,
//                            description: '',
//                        },
//                        {
//                            name: '活动',
//                            value: 209,
//                            description: '',
//                        },

                        {
                            name: '京东常规',
                            value: 301,
                            description: '粉丝通过商家提供的关键词，在京东app搜索找到商品，完成浏览、关注、加购、领取优惠券、浏览宝贝评价页等操作。吸引新粉丝关注，增强粉丝黏性！',
                        },
                        {
                            name: '京东快车',
                            value: 302,
                            description: '粉丝通过商家提供的关键词，在京东app搜索找到商品，完成浏览、关注、加购、领取优惠券、浏览宝贝评价页等操作。吸引新粉丝关注，增强粉丝黏性！',
                        }
                    ]
                },
            }
        },
        created: function () {
            this.$set(this.form_data, 'base_type', this.base_type);
        },
        watch: {
            //更新到根组件
            base_type: {
                handler: function (val, old) {
                    this.$set(this.form_data, 'base_type', val);
                },
                deep: true
            },
            //根数据更新到我
            'form_data.base_type': {
                handler: function (val, old) {
                    this.$set(this.$data, 'base_type', val);
                },
                deep: true
            },
            //用户流量类型 最少得保留一个
            'base_type.flow_type': function (val, old) {
                if(val.length < 1) {
                    this.$set(this.$data.base_type, 'flow_type', old);
                    new PNotify({
                        title: '敬告',
                        text: '最少要保留一个选项',
                        type: 'warning',
                    });
                }
            },
            //选择平台时，重新初始化选择任务类型
            'base_type.platform': function (val, old) {
                let task_types = this.current_platform_task_types;
                if(task_types.length > 0) {
                    this.$set(this.$data.base_type, 'task_type', task_types[0]);
                }
            },
        },
        computed: {
            current_platform_task_types: function () {
                for(let n in this.init_data.platforms) {
                    if(this.init_data.platforms[n].value === this.base_type.platform) {
                        return this.init_data.platforms[n].task_types
                    }
                }
                return [];
            },
            current_task_type_info: function () {
                for(let n in this.init_data.task_types) {
                    if(typeof (this.init_data.task_types[n]) === 'object' && this.init_data.task_types[n].hasOwnProperty('value')) {
                        if(this.init_data.task_types[n].value === this.base_type.task_type) {
                            return this.init_data.task_types[n];
                        }
                    }
                }
                return false;
            },
            base_platform: {
                get: function () {
                    return this.base_type.platform;
                },
                set: function (val) {
                    if(parseInt(val) !== this.base_type.platform) {
                        if(window.localStorage.getItem('user_confirmation_change_platform') !== 'is_confirmation') {
                            let _self = this;
                            BootstrapDialog.confirm({
                                title: '敬告',
                                message: '切换平台会导致已填写的数据全部丢失，是否确定切换？ 确认后再次操作不再提示！',
                                type: BootstrapDialog.TYPE_WARNING,
                                closable: false,
                                draggable: true,
                                btnCancelLabel: '取消',
                                btnOKLabel: '确认',
                                btnOKClass: 'btn-warning',
                                callback: function(result) {
                                    if(result) {
                                        _self.base_type.platform = parseInt(val);
                                        window.localStorage.setItem('user_confirmation_change_platform', 'is_confirmation')
                                    }
                                }
                            });
                        } else {
                            this.base_type.platform = parseInt(val)
                        }
                    }
                }
            },
            base_task_type: {
                get: function () {
                    return this.base_type.task_type;
                },
                set: function (val) {
                    if(parseInt(val) !== this.base_type.task_type) {
                        if(window.localStorage.getItem('user_confirmation_change_task_type') !== 'is_confirmation') {
                            let _self = this;
                            BootstrapDialog.confirm({
                                title: '敬告',
                                message: '切换任务类型会导致已填写的数据全部丢失，是否确定切换任务类型？ 确认后再次操作不再提示！',
                                type: BootstrapDialog.TYPE_WARNING,
                                closable: false,
                                draggable: true,
                                btnCancelLabel: '取消',
                                btnOKLabel: '确认',
                                btnOKClass: 'btn-warning',
                                callback: function(result) {
                                    if(result) {
                                        _self.base_type.task_type = parseInt(val);
                                        window.localStorage.setItem('user_confirmation_change_task_type', 'is_confirmation')
                                    } else {

                                    }
                                }
                            });
                        } else {
                            this.base_type.task_type = parseInt(val)
                        }
                    }
                }
            },
        },
        methods: {
            taskTypeBelongCurrentPlatform: function (task_type_value) {
                return ($.inArray(task_type_value, this.current_platform_task_types) !== -1) ? true : false;
            },
            clearPlatformChecked: function (event) {
                let self = this;
                setTimeout(function () {
                    if(parseInt(event.target.value) !== parseInt(self.base_type.platform)) {
                        event.target.checked = false;
                    }
                }, 50)
            },
            clearChecked: function (event) {
                let self = this;
                setTimeout(function () {
                    if(parseInt(event.target.value) !== parseInt(self.base_type.task_type)) {
                        event.target.checked = false;
                    }
                }, 50)
            },
        }
    }
</script>

<style>

</style>
