<template>
  <!--选择增值服务 开始-->
  <div class="task-plan-section">
    <h4 @click="section_open===true ? section_open = false : section_open = true">
      选择增值服务
      <i class="icon"
         :class="{'icon-angle-double-up text-danger': section_open===false,'icon-angle-double-down': section_open===true}"></i>
    </h4>
    <blockquote v-show="section_open">
      <div class="form-horizontal tasi-form" role="form">
        <!--聊天 开始-->
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>真实聊天</strong>
          </label>
          <div class="col-lg-10">
            <div class="checkboxs">
              <label>
                <input type="checkbox" :value="true" v-model="value_added_services.ask.issued"> 是否启用聊天服务
              </label>
            </div>
            <div class="mt20 animated fadeIn" v-if="value_added_services.ask.issued === true">
              <div class="form-group no-border">
                <label class="col-lg-2 control-label">
                  <strong>占比总操作人数</strong>
                </label>
                <div class="col-lg-8">
                  <select class="form-control" v-model="value_added_services.ask.proportion">
                    <option value="100">100%</option>
                    <option value="90">90%</option>
                    <option value="80">80%</option>
                    <option value="70">70%</option>
                    <option value="50">50%</option>
                    <option value="40">40%</option>
                    <option value="30">30%</option>
                    <option value="20">20%</option>
                    <option value="10">10%</option>
                  </select>

                  <div class="help-block text-info">
                    <i class="icon icon-info-circle"></i>
                    该占例解释为：通过关键词搜索访问产品的人中，有多少人会跟店家聊天？
                  </div>
                </div>
              </div>
              <div class="form-group no-border">
                <label class="col-lg-2 control-label">
                  <strong>聊天内容</strong>
                </label>
                <div class="col-lg-8" :class="{'has-error': validation.hasError('value_added_services.ask.text'), 'has-success': validation.isPassed('value_added_services.ask.text')}">
                  <textarea id="value_add_services_ask" placeholder="请输入需要接单侠提的问题，如：1、这款商品采用的材质是什么? 2、拍下什么时候发货？...一行一个问题" rows="5" class="form-control" v-model="value_added_services.ask.text"></textarea>
                  <div class="help-block text-danger" v-if="validation.hasError('value_added_services.ask.text')">
                    <i class="icon icon-times-circle color-red"></i>
                    {{ validation.firstError('value_added_services.ask.text') }}
                  </div>
                </div>
                <div class="col-lg-10 col-lg-offset-2 clearfix">
                  <div class="help-block text-info">
                    <i class="icon icon-info-circle"></i>
                    输入需要接单侠提的问题，如：1、这款商品采用的材质是什么?  2、拍下什么时候发货？...一行一个问题，一个回车键表示一行。
                  </div>
                </div>
              </div>
              <div class="help-block mt50 text-right text-danger">
                该项增值服务费用： {{visitors}} x {{value_added_services.ask.proportion}}% x {{value_added_services.ask.price}} = {{Number(ask_cost).toFixed(2)}} 云币
              </div>
            </div>
          </div>
        </div>
        <!--聊天 结束-->
        <!--访客入店时间分布优化 开始-->
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>访客入店时间分布优化</strong>
          </label>
          <div class="col-lg-10">
            <div class="radios-inline">
              <label class="label_radio">
                <input value="1" name="timeArrival" v-model.number="value_added_services.time_distribution.type" type="radio"> 服务器按网民习惯分布
              </label>
              <label class="label_radio text-warning">
                <input value="2" name="timeArrival" v-model.number="value_added_services.time_distribution.type" type="radio"> 自定义分布
              </label>
            </div>
            <div class="animated fadeIn" v-if="value_added_services.time_distribution.type === 1">
              <div class="help-block text-info">
                <i class="icon icon-info-circle"></i>
                访客进店时间按网民购物习惯全天分布
              </div>
              <div class="mt20">
                <img :src="root.imgs.shopping_chart" alt="网民购物习惯" style="max-width: 100%">
              </div>
            </div>
            <div class="animated fadeIn" v-if="value_added_services.time_distribution.type === 2">
              <div class="help-block text-info">
                <i class="icon icon-info-circle"></i>
                流量将按照您指定的方式分布，若当前时间段任务未完全完成，则任务会放到下一个时间段继续完成，直到任务完全完成
              </div>
              <div class="buttons mt20">
                <template v-for="(one_day, n) in value_added_services.time_distribution.data">
                  <label class="btn btn-primary mr5 mb10" :class="{'btn-shadow': (n === value_added_services.time_distribution.choose_day)}" @click="chooseDay(n)">第{{ n + 1}}天</label>
                </template>
              </div>
              <div class="mt30">
                <table class="table table-bordered days-info">
                  <thead>
                  <tr>
                    <th colspan="8">
                    <span class="pull-left">
                     第
                      {{value_added_services.time_distribution.choose_day + 1}}
                      天 到店访客数为：
                      {{value_added_services.time_distribution.data[value_added_services.time_distribution.choose_day].today_num}}
                      ； 还有
                      {{computeOneDayNotAssignedNumber(value_added_services.time_distribution.choose_day)}}
                      个任务可以分配
                    </span>
                      <div class="inline-block pull-right">
                        <label class="btn btn-xs btn-success" @click="setOneDayEveryTimeDistributionByRandom">随机分配当天</label>
                        <label class="btn btn-xs btn-success" @click="setEveryDayDistributionByRandom">随机分配全部</label>
                        <label class="btn btn-xs btn-info" @click="setOneDayEveryTimeDistributionByAverage">平均分配当天</label>
                        <label class="btn btn-xs btn-info" @click="setEveryDayDistributionByAverage">平均分配全部</label>
                        <label class="btn btn-xs btn-default" @click="cleanUpAllDistribution">全部重置为0</label>
                      </div>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="(v,n) in Math.ceil(value_added_services.time_distribution.data[value_added_services.time_distribution.choose_day].distribution.length / value_added_services.time_distribution.col_num)">
                    <tr>
                      <td v-for="(d,k) in value_added_services.time_distribution.col_num">
                        {{value_added_services.time_distribution.data[value_added_services.time_distribution.choose_day].distribution[n * value_added_services.time_distribution.col_num + k].time}}
                        点放
                        <input :disabled="isDisabled(value_added_services.time_distribution.data[value_added_services.time_distribution.choose_day].distribution[n * value_added_services.time_distribution.col_num + k].time)" type="text"
                               class="form-control inline-block"
                               :value="value_added_services.time_distribution.data[value_added_services.time_distribution.choose_day].distribution[n * value_added_services.time_distribution.col_num + k].num"
                               @change="setDistributionValue(n * value_added_services.time_distribution.col_num + k,$event)"
                        >
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
              <div class="help-block text-danger" v-if="validation.hasError('value_added_services.time_distribution.type')">
                <i class="icon icon-times-circle color-red"></i>
                {{ validation.firstError('value_added_services.time_distribution.type') }}
              </div>
              <div class="help-block mt50 text-right text-danger">
                该项增值服务费用：{{Number(value_added_services.prices.time_distribution.value).toFixed(2)}} 云币
              </div>
            </div>
          </div>
        </div>
        <!--访客入店时间分布优化 结束-->

        <!--任务投放地区 开始-->
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>任务投放地区</strong>
          </label>
          <div class="col-lg-10">
            <div class="checkboxs">
              <label class="checkbox-inline" v-for="(checkbox, n) in regions">
                <input :value="checkbox.id" v-model="value_added_services.regions" type="checkbox">
                {{checkbox.name}}
              </label>
            </div>
            <div class="help-block text-info">
              <i class="icon icon-info-circle"></i>
              不选则不限制地区，部分地区投放请勾选对应地区
            </div>
            <div class="help-block mt50 text-right text-danger">
              该项增值服务费用： {{value_added_services.prices.regions.value}} 云币
            </div>
          </div>
        </div>
        <!--任务投放地区 结束-->

        <!--用户画像 开始-->
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>接单侠质量过滤</strong>
          </label>
          <div class="col-lg-10">
            <div class="form-group no-border">
              <label class="col-lg-2 col-md-4 control-label">
                <strong>姓别</strong>
              </label>
              <div class="col-lg-6 col-md-8">
                <label>
                  <input type="checkbox" checked disabled>
                  男生
                </label>
                <label>
                  <input type="checkbox" checked disabled>
                  女生
                </label>
              </div>
            </div>
            <div class="form-group no-border">
              <label class="col-lg-2 col-md-4 control-label">
                <strong>年龄区间</strong>
              </label>
              <div class="col-lg-8 col-md-8">
                <div class="checkboxs">
                  <label>
                    <input type="checkbox" checked disabled>
                    不限
                  </label>
                  <label>
                    <input type="checkbox" disabled>
                    自定义
                  </label>

                  <input type="text" disabled class="form-control per10 minw30 inline-block">
                  到
                  <input type="text" disabled class="form-control per10 minw30 inline-block">
                  周岁
                </div>
              </div>
            </div>
            <div class="form-group no-border">
              <label class="col-lg-2 col-md-4 control-label">
                <strong>已实名认证</strong>
              </label>
              <div class="col-lg-6 col-md-8">
                <label>
                  <input type="checkbox" disabled>
                  已实名
                </label>
              </div>
            </div>
            <div class="form-group no-border">
              <label class="col-lg-2 col-md-4 control-label">
                <strong>综合评分</strong>
              </label>
              <div class="col-lg-6 col-md-8">
                <select class="form-control per60 inline-block" disabled>
                  <option value="5">5分</option>
                  <option value="4.9">4.9分</option>
                  <option value="4.8">4.8分</option>
                  <option value="4.5">4.5分</option>
                  <option value="0" selected="selected">0分</option>
                </select>
                <span class="ml10 mt5">以上</span>
              </div>
              <div class="help-block text-info col-lg-offset-2 col-lg-6">
                <i class="icon icon-info-circle"></i>
                根据接单侠的接单率、接单完成率、完成任务质量、放弃任务率、总完成任务单量、是否实名等等属性计算出来的综合评分，评分越高则标志着该接单侠质量越好！
              </div>
            </div>

            <div class="form-group no-border">
              <label class="col-lg-2 col-md-4 control-label">
                <strong>特征属性</strong>
              </label>
              <div class="col-lg-10 col-md-8">
                <div class="checkboxs">
                  <label><input value="0" type="checkbox" checked disabled>不限</label>
                  <label><input value="1" type="checkbox" disabled> 女装男装</label>
                  <label><input value="2" type="checkbox" disabled> 鞋类箱包</label>
                  <label><input value="3" type="checkbox" disabled> 母婴用品</label>
                  <label><input value="4" type="checkbox" disabled> 护肤彩妆</label>
                  <label><input value="5" type="checkbox" disabled> 汇吃美食</label>
                  <label><input value="6" type="checkbox" disabled> 珠宝配饰</label>
                  <label><input value="7" type="checkbox" disabled> 家装建材</label>
                  <label><input value="8" type="checkbox" disabled> 家居家纺</label>
                  <label><input value="9" type="checkbox" disabled> 百货市场</label>
                  <label><input value="10" type="checkbox" disabled> 汽车用品</label>
                  <label><input value="11" type="checkbox" disabled> 手机数码</label>
                  <label><input value="12" type="checkbox" disabled> 家电办公</label>
                  <label><input value="13" type="checkbox" disabled> 生活服务</label>
                  <label><input value="14" type="checkbox" disabled> 运动户外</label>
                  <label><input value="15" type="checkbox" disabled> 花鸟文娱</label>
                  <label><input value="16" type="checkbox" disabled> 农资采购</label>
                </div>
              </div>
            </div>
            <div class="help-block text-warning">
              <i class="icon icon-info-circle"></i>
              接单侠用户画像功能目前仅开放给超级VIP商户内测使用，即将开放给全体vip商户，敬请期待！
            </div>
            <!--<div class="help-block mt50 text-right text-danger">-->
              <!--该项增值服务费用： 0 云币-->
            <!--</div>-->
          </div>
        </div>
        <!--用户画像 结束-->

        <!--发票服务 开始-->
        <div class="form-group">
          <label class="col-lg-2 control-label">
            <strong>发票服务</strong>
          </label>
          <div class="col-lg-10">
            <div class="checkboxs">
              <label>
                <input type="checkbox" :value="true" v-model="value_added_services.invoice.issued"> 开具发票（{{value_added_services.invoice.rate}}%费率）
              </label>
            </div>
            <div class="mt20 animated fadeIn" v-if="value_added_services.invoice.issued === true">
              <div class="form-group no-border">
                <label class="col-lg-2 control-label">
                  <strong>发票抬头</strong>
                </label>
                <div class="col-lg-8" :class="{'has-error': validation.hasError('value_added_services.invoice.title'), 'has-success': validation.isPassed('value_added_services.invoice.title')}">
                  <input placeholder="请填写发票抬头,如：某某科技有限责任公司" id="value_add_services_invoice" class="form-control" type="text" v-model="value_added_services.invoice.title">
                  <div class="help-block text-danger" v-if="validation.hasError('value_added_services.invoice.title')">
                    <i class="icon icon-times-circle color-red"></i>
                    {{ validation.firstError('value_added_services.invoice.title') }}
                  </div>
                </div>
              </div>
              <div class="form-group no-border">
                <label class="col-lg-2 control-label">
                  <strong>发票收件人姓名</strong>
                </label>
                <div class="col-lg-8" :class="{'has-error': validation.hasError('value_added_services.invoice.consignee'), 'has-success': validation.isPassed('value_added_services.invoice.consignee')}">
                  <input placeholder="请填写收件的人的姓名" class="form-control" type="text" v-model="value_added_services.invoice.consignee">
                  <div class="help-block text-danger" v-if="validation.hasError('value_added_services.invoice.consignee')">
                    <i class="icon icon-times-circle color-red"></i>
                    {{ validation.firstError('value_added_services.invoice.consignee') }}
                  </div>
                </div>
              </div>
              <div class="form-group no-border">
                <label class="col-lg-2 control-label">
                  <strong>联系电话</strong>
                </label>
                <div class="col-lg-8" :class="{'has-error': validation.hasError('value_added_services.invoice.telphone'), 'has-success': validation.isPassed('value_added_services.invoice.telphone')}">
                  <input placeholder="电话号码" class="form-control" type="text" v-model="value_added_services.invoice.telphone">
                  <div class="help-block text-danger" v-if="validation.hasError('value_added_services.invoice.telphone')">
                    <i class="icon icon-times-circle color-red"></i>
                    {{ validation.firstError('value_added_services.invoice.telphone') }}
                  </div>
                </div>
              </div>
              <div class="form-group no-border">
                <label class="col-lg-2 control-label">
                  <strong>收件地址</strong>
                </label>
                <div class="col-lg-8" :class="{'has-error': validation.hasError('value_added_services.invoice.address'), 'has-success': validation.isPassed('value_added_services.invoice.address')}">
                  <textarea rows="3" class="form-control" v-model="value_added_services.invoice.address"></textarea>
                  <div class="help-block text-danger" v-if="validation.hasError('value_added_services.invoice.address')">
                    <i class="icon icon-times-circle color-red"></i>
                    {{ validation.firstError('value_added_services.invoice.address') }}
                  </div>
                </div>
              </div>
              <div class="help-block mt50 text-right text-danger">
                该项增值服务费用： {{Number(init_data.no_invoice_cost).toFixed(2)}} x {{value_added_services.invoice.rate}}% = {{invoice_cost.toFixed(2)}} 云币
              </div>
            </div>
          </div>
        </div>
        <!--发票服务 结束-->
      </div>
    </blockquote>
  </div>
  <!--选择增值服务 结束-->
</template>

<script>
    import {formatDate} from '../../common/date.js';
    import {scrollFocus} from '../../common/common'
    import {randomAssignTaskTime} from '../../common/common';
    import {computedStepData} from '../../common/computeStep';
    import {computeAllCost} from '../../common/common';

    export default {
        data () {
            return {
                section_open: true,
                task_data: this.$parent.$data.task_data,
                root: this.$root,
                value_added_services: {
                    prices: {
                        invoice: {//发票
                            valid: false,
                            value: 0
                        },
                        ask: {//聊天
                            valid: false,
                            value: 0
                        },
                        time_distribution: {//时间优化
                            valid: false,
                            value: 0
                        },
                        regions: {//投放地区
                            valid: false,
                            value: 0
                        },
                        user_portrait: {//用户画像
                            valid: false,
                            value: 0
                        },
                    },
                    //时间优化
                    time_distribution: {
                        price: 0,       //此服务费用
                        type: 1,        //访客入店时间分布优化类型，1服务器控制、2自定义
                        customize_day_num: 120,  //自定义时间分布优化支持天数
                        col_num: 6,     //渲染的表格每行多少列
                        choose_day: 0,  //渲染第几天的数据
                        data: [
//                            {
//                                today_num: 60,
//                                distribution: [
//                                    {
//                                        time: 0,
//                                        num: 20
//                                    },
//                                    {
//                                        time: 1,
//                                        num: 20
//                                    },
//                                ]
//                            },
                        ]
                    },
                    //发票
                    invoice: {
                        rate: 0,        //费率
                        issued: false,
                        title: '',      //发票抬头
                        consignee: '',
                        telphone: '',
                        address: ''
                    },
                    //投放地区限制
                    regions: [],
                    ask: {
                        price: 0,     //单价，需从服务器获取
                        proportion: 30, //默认比例
                        issued: false,
                        text: '',
                    },
                },
                init_data: {
                    no_invoice_cost: 0,
                }
            }
        },
        created: function () {
            this.$set(this.task_data, 'value_added_services', this.value_added_services);
            this.loadServerPrices();
        },
        watch: {
            //更新到根组件
            value_added_services: {
                handler: function (val, old) {
                    this.$set(this.task_data, 'value_added_services', val);
                },
                deep: true
            },
            //根数据更新到我
            'task_data.value_added_services': {
                handler: function (val, old) {
                    this.$set(this.$data, 'value_added_services', val);
                },
                deep: true
            },
            'value_added_services.time_distribution.type': function (val, old) {
                if(val === 2) {
                    if(this.task_data.task_plan_info.day_length > this.value_added_services.time_distribution.customize_day_num) {
                        let _self = this;
                        BootstrapDialog.confirm({
                            title: '敬告',
                            message: '<p class="s16">为了获得更好的用户体验，我们限定自定义分布的任务时长为'+_self.value_added_services.time_distribution.customize_day_num+'天，<br/>您当前的任务计划时长超过'+_self.value_added_services.time_distribution.customize_day_num+'天，点击确认按钮后，<br/>您的任务计划时长将被<span class="text-danger">自动调整</span>为'+_self.value_added_services.time_distribution.customize_day_num+'天。若需要自定义更长时间，请与我们联系</p>',
                            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                            closable: false, // <-- Default value is false
                            draggable: true, // <-- Default value is false
                            btnCancelLabel: '取消', // <-- Default value is 'Cancel',
                            btnOKLabel: '确认', // <-- Default value is 'OK',
                            btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
                            callback: function(result) {
                                // result will be true if button was click, while it will be false if users close the dialog directly.
                                if(result) {
                                    _self.$set(_self.task_data.task_plan_info, 'day_length', _self.value_added_services.time_distribution.customize_day_num);
                                    new PNotify({
                                        title: '敬告',
                                        text: '已将任务计划时长调整为'+_self.value_added_services.time_distribution.customize_day_num+'天',
                                        type: 'success',
                                    });
                                }else {
                                    _self.$set(_self.value_added_services.time_distribution, 'type', 1);
                                }
                            }
                        });
                    }
                }
                //满足条件，尝试生成表格数据
                if(this.value_added_services.time_distribution.type === 2 && this.task_data.task_plan_info.day_length <= this.value_added_services.time_distribution.customize_day_num) {
                    this.createTimeDistributionData();
                }
            },
            'time_distribution_not_done_day': function () {
                this.validate();
            },
            'task_data.task_plan_info.day_length': function (val, old) {
                if(this.value_added_services.time_distribution.type === 2 && this.task_data.task_plan_info.day_length > this.value_added_services.time_distribution.customize_day_num) {
                    let _self = this;
                    BootstrapDialog.confirm({
                        title: '敬告',
                        message: '<p class="s16">您在《增值服务->访客入店时间分布优化》中选择了[自定义分布]。我们限定自定义分布的任务时长为'+_self.value_added_services.time_distribution.customize_day_num+'天，<br/>点击确认按钮后，自动将您的[访客入店时间分布优化]设置为<span class="text-danger">服务器按网购时间分布</span>，<br/>点击取消按钮，则会自动调将您的任务执行天数调整为'+_self.value_added_services.time_distribution.customize_day_num+'天。</p>',
                        type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                        closable: false, // <-- Default value is false
                        draggable: true, // <-- Default value is false
                        btnCancelLabel: '取消', // <-- Default value is 'Cancel',
                        btnOKLabel: '确认', // <-- Default value is 'OK',
                        btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
                        callback: function(result) {
                            // result will be true if button was click, while it will be false if users close the dialog directly.
                            if(result) {
                                _self.$set(_self.value_added_services.time_distribution, 'type', 1);
                                new PNotify({
                                    title: '敬告',
                                    text: '已将访客入店时间分布优化设置为随机分配',
                                    type: 'success',
                                });
                            }else {
                                _self.$set(_self.task_data.task_plan_info, 'day_length', _self.value_added_services.time_distribution.customize_day_num);
                                new PNotify({
                                    title: '敬告',
                                    text: '已将任务计划时长调整为'+_self.value_added_services.time_distribution.customize_day_num+'天',
                                    type: 'success',
                                });
                            }
                        }
                    });
                }
                //满足条件，尝试生成表格数据
                if(this.value_added_services.time_distribution.type === 2 && this.task_data.task_plan_info.day_length <= this.value_added_services.time_distribution.customize_day_num) {
                    this.createTimeDistributionData();
                }
            },
            'root.server_data': {
                handler:  function (val ,old) {
                    this.loadServerPrices();
                },
                deep: true,
            },
            //增值服务费用计算设定
            'value_added_services.invoice.issued': function (val, old) {
                this.value_added_services.prices.invoice.valid = val;
                if(val === true) {
                    scrollFocus('value_add_services_invoice');
                }
            },
            'value_added_services.ask.issued': function (val, old) {
                this.value_added_services.prices.ask.valid = val;
                if(val === true) {
                    scrollFocus('value_add_services_ask');
                }
            },
        },
        validators: {
            'value_added_services.invoice.title': function (value) {
                if(this.value_added_services.invoice.issued === true) {
                    return this.Validator.value(value).required('请填写发票抬头！');
                }
            },
            'value_added_services.invoice.consignee': function (value) {
                if(this.value_added_services.invoice.issued === true) {
                    return this.Validator.value(value).required('收件人姓名不能为空！');
                }
            },
            'value_added_services.invoice.telphone': function (value) {
                if(this.value_added_services.invoice.issued === true) {
                    return this.Validator.value(value).required('收件人电话不能为空！');
                }
            },
            'value_added_services.invoice.address': function (value) {
                if(this.value_added_services.invoice.issued === true) {
                    return this.Validator.value(value).required('发票邮寄地址不能为空！');
                }
            },
            'value_added_services.ask.text': function (value) {
                if(this.value_added_services.ask.issued === true) {
                    return this.Validator.value(value).required('输入的接单侠问题不能为空！');
                }
            },
            'value_added_services.time_distribution.type': function (type) {
                let _self = this;
                return this.Validator.custom(function () {
                    if(type === 2) {
                        let i = _self.time_distribution_not_done_day;
                        if(i !== false) {
                            _self.value_added_services.time_distribution.choose_day = parseInt(i);
                            return '您使用了 增值服务-> 访客入店时间分布优化 -> 自定义分布。但您第'+(i+1)+'天的任务分配未完成设置，请先设置,已为您标记到当天。'
                        }
                    }
                });
            }
        },
        computed: {
            day_length: function () {
                return this.task_data.task_plan_info.day_length;
            },
            begin_date: function () {
                return new Date(formatDate((new Date(this.task_data.task_plan_info.begin_time)), 'yyyy-MM-dd'));
            },
            cur_date: function () {
                return new Date(formatDate((new Date()), 'yyyy-MM-dd'));
            },
            cur_datetime: function () {
                return new Date();
            },
            last_datetime: function () {
                if(! this.task_data.task_plan_info.end_time) {
                    this.task_data.task_plan_info.end_time = (moment(this.task_data.task_plan_info.begin_time, 'YYYY-MM-DD').add(this.day_length, 'days').add(-1, 'minutes')).format('YYYY-MM-DD HH:mm:ss');
                }
                return moment(this.task_data.task_plan_info.end_time, 'YYYY-MM-DD HH:mm:ss');
            },
            time_distribution_not_done_day: function () {
                for(let i=0;i<this.task_data.task_plan_info.day_length;++i) {
                    let not_assigned = this.computeOneDayNotAssignedNumber(i);
                    if(not_assigned !== 0) {
                        return i;
                    }
                }
                return false;
            },
            task_plan: function () {
                return this.task_data.task_plan_info;
            },
            visitors: function () {
                return this.computedStepData(this.task_plan.first_day, this.task_plan.increase_num, this.task_plan.day_length)
            },
            ask_cost: function () {
                let cost = parseFloat(this.value_added_services.ask.price) * parseFloat(this.visitors) * this.value_added_services.ask.proportion / 100;

                this.$set(this.value_added_services.prices.ask, 'value', cost);

                return cost;
            },
            invoice_cost: function () {
                this.value_added_services.prices.invoice.value = 0; //先将发票价格设置为 0
                let no_invoice_cost = computeAllCost(this.task_data);
                let cost = no_invoice_cost * parseFloat(this.value_added_services.invoice.rate) / 100;

                this.$set(this.init_data, 'no_invoice_cost', no_invoice_cost);
                this.$set(this.value_added_services.prices.invoice, 'value', cost);

                return  cost;
            },
            regions: function () {
                return this.root.server_data.regions;
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
            chooseDay: function (n) {
                this.value_added_services.time_distribution.choose_day = n
            },
            isDisabled: function (hour) {
                if(this.value_added_services.time_distribution.choose_day === 0 && this.begin_date.getTime() === this.cur_date.getTime()) {
                    if(hour < this.cur_datetime.getHours()) {
                        return true;
                    }
                }
                if(this.value_added_services.time_distribution.choose_day === (this.day_length - 1)) {
                    if(hour > (new Date(this.last_datetime)).getHours()) {
                        return true;
                    }
                }

                return false;
            },
            setDistributionValue: function (time_index, event) {
                let val = parseInt(event.target.value);
                if(!isNaN(val)) {
                    if((this.computeOneDayNotAssignedNumber(this.value_added_services.time_distribution.choose_day) - val) >= 0) {
                        this.value_added_services.time_distribution.data[this.value_added_services.time_distribution.choose_day].distribution[time_index].num = val;
                        this.$set(event.target, 'value',val)
                    } else {
                        this.value_added_services.time_distribution.data[this.value_added_services.time_distribution.choose_day].distribution[time_index].num = 0;
                        this.value_added_services.time_distribution.data[this.value_added_services.time_distribution.choose_day].distribution[time_index].num =
                            this.computeOneDayNotAssignedNumber(this.value_added_services.time_distribution.choose_day);
                        new PNotify({
                            title: '敬告',
                            text: '该天总操作数不能超过' + this.value_added_services.time_distribution.data[this.value_added_services.time_distribution.choose_day].today_num + '， 已为您自动调整',
                            type: 'info'
                        });
                    }
                } else {
                    this.$set(event.target, 'value',0)
                    new PNotify('只能输入数字类型')
                }

            },
            setOneDayEveryTimeDistributionByRandom: function (day_index) {
                if(!$.isNumeric(day_index)) {
                    day_index = this.value_added_services.time_distribution.choose_day;
                }
                //当天可分配总数
                let task_num = this.value_added_services.time_distribution.data[day_index].today_num;
                //当天可分配时间点
                let time_num_arr = this.getOneDayActiveTime(day_index);
                //生成随机分配数
                let res = randomAssignTaskTime(time_num_arr, task_num);
                //赋值
                for(let n=0; n<res.length;++n) {
                    this.value_added_services.time_distribution.data[day_index].distribution[res[n].time].num = res[n].num;
                }
            },
            setEveryDayDistributionByRandom: function () {
                for(let n=0;n<this.task_data.task_plan_info.day_length; ++n) {
                    this.setOneDayEveryTimeDistributionByRandom(n);
                }
            },
            setOneDayEveryTimeDistributionByAverage: function (day_index) {
                if(!$.isNumeric(day_index)) {
                    day_index = this.value_added_services.time_distribution.choose_day;
                }
                //当天可分配总数
                let task_num = this.value_added_services.time_distribution.data[day_index].today_num;
                //当天可分配时间点
                let time_num_arr = this.getOneDayActiveTime(day_index);
                let len = time_num_arr.length;
                let avg = Math.floor(task_num / len);
                //赋值
                for(let n=0; n<len;++n) {
                    this.value_added_services.time_distribution.data[day_index].distribution[time_num_arr[n]].num = avg;
                }

                if(avg * len < task_num) {
                    for(let k=0;k<(task_num - avg * len);++k) {
                        this.value_added_services.time_distribution.data[day_index].distribution[time_num_arr[k]].num += 1;
                    }
                }

            },
            cleanUpAllDistribution: function () {
                for(let n=0; n < this.task_data.task_plan_info.day_length; ++n) {
                    for(let k=0; k < this.value_added_services.time_distribution.data[n].distribution.length;++k) {
                        this.value_added_services.time_distribution.data[n].distribution[k].num = 0;
                    }
                }
            },
            setEveryDayDistributionByAverage: function () {
                for(let n=0;n<this.task_data.task_plan_info.day_length; ++n) {
                    this.setOneDayEveryTimeDistributionByAverage(n);
                }
            },
            getOneDayActiveTime: function (day_index) {
                let arr = [];
                if(day_index === 0 && this.begin_date.getTime() === this.cur_date.getTime()) {
                    for(let i=0; i< 24; ++i) {
                        if(i >= this.cur_datetime.getHours()) {
                            arr.push(i);
                        }
                    }
                    //第一天计算
                    return arr;
                }

                if(day_index === (this.day_length - 1)) {
                    for(let i=0; i< 24; ++i) {
                      if(i <= (new Date(this.last_datetime)).getHours()) {
                          arr.push(i)
                      }
                    }
                    return arr;
                }


                for(let i=0; i< 24; ++i) {
                    arr.push(i);
                }

                return arr;
            },
            computeOneDayNotAssignedNumber: function (one_day) {
                if(this.value_added_services.time_distribution.data && one_day < this.value_added_services.time_distribution.data.length) {
                     let assignedNumber = 0;
                     let distribution = this.value_added_services.time_distribution.data[one_day].distribution;
                     for(let n=0;n<distribution.length; ++n) {
                         assignedNumber += distribution[n].num;
                     }
                     return this.value_added_services.time_distribution.data[one_day].today_num - assignedNumber;
                }
                return 0;
            },
            createTimeDistributionData:function () {
                let day_length = this.task_data.task_plan_info.day_length;
                let step_num = this.task_data.task_plan_info.increase ? this.task_data.task_plan_info.increase_num : 0;
                let first_day_num = this.task_data.task_plan_info.first_day;
                //防止重复计算
//                if(day_length !== this.value_added_services.time_distribution.data.length) {
                let tmpData = [];
                for(let n=0; n < day_length; ++n) {
                    let today_data = [];
                    let today_num = first_day_num + n * step_num;

                    for(let i=0; i<24; ++i) {
                        today_data.push({
                            time: i,
                            num: 0
                        });
                    }

                    tmpData.push({
                        today_num: today_num,
                        distribution: today_data
                    })
                }

                this.$set(this.value_added_services.time_distribution, 'data', tmpData);
//                }
            },
            computedStepData: computedStepData,
            loadServerPrices: function () {
                if(this.root.server_data.prices.hasOwnProperty('ask_question')) {
                    this.$set(this.value_added_services.ask, 'price', this.root.server_data.prices.ask_question.business_price);
                }
                if(this.root.server_data.prices.hasOwnProperty('invoice')) {
                    this.$set(this.value_added_services.invoice, 'rate', this.root.server_data.prices.invoice.price_rate);
                }
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
