<!--深度优化选项组件 开始-->
<template>
    <table class="table table-bordered table-hover">
        <thead>
        <tr>
            <template v-for="n in table_header">
                <th :class="[n.css || '']">{{n.title}}</th>
            </template>
        </tr>
        </thead>
        <tbody>
        <template v-for="(row, n) in in_data.price_allocation.optimization_options">
            <tr>
                <td>{{row.name}}</td>
                <td class="hidden-phone hidden-xs hidden-sm">{{task_data.task_plan_info.day_length}}</td>
                <td>
                    <select class="form-control" v-model="row.proportion" :disable="row.proportion_changeable">
                        <option value="100">100%</option>
                        <option value="90">90%</option>
                        <option value="80">80%</option>
                        <option value="70">70%</option>
                        <option value="60">60%</option>
                        <option value="50">50%</option>
                        <option value="40">40%</option>
                        <option value="30">30%</option>
                        <option value="20">20%</option>
                        <option value="10">10%</option>
                        <option value="0">0%</option>
                    </select>
                </td>
                <td class="hidden-phone hidden-xs hidden-sm">{{task_data.task_plan_info.first_day}}</td>
                <td>
                    <select class="form-control" v-model="row.increase" :disable="row.increase_changeable">
                        <option :value="true">增长</option>
                        <option :value="false">不增长</option>
                    </select>
                </td>
                <td class="hidden-phone hidden-xs hidden-sm">{{row.increase ? task_data.task_plan_info.increase_num * (row.proportion / 100) : 0}}</td>
                <td>
                    {{computeVisitorNumber(row.proportion, row.increase)}}
                </td>
                <td>
                <span class="text-danger">
                    {{computeVisitorNumber(row.proportion, row.increase)}} x {{row.price}} = {{(computeVisitorNumber(row.proportion, row.increase) * row.price).toFixed(2)}} 云币
                </span>
                </td>
            </tr>
        </template>
        <tr>
            <td colspan="8">
                <span class="text-danger pull-right">合计费用： {{Number(compute_total_price).toFixed(2)}} 云币</span>
            </td>
        </tr>
        </tbody>
    </table>
</template>
<!--深度优化选项组件 结束-->

<script>
    import {computedStepData} from '../../common/computeStep';

    export default{
        data: function () {
            return {
                task_data: this.$parent.$data.task_data,
                root: this.$root,
            }
        },
        props: {
            in_data: {
                required:true,
                default: {
                    table_data: [],
                },
            },
            table_header: {
                default: [
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
            }
        },
        components: {
            TableComponent: IVTable,
        },
        computed: {
            compute_total_price: function () {
                let total = 0;
                for(let n in this.in_data.price_allocation.optimization_options) {
                    total = total + this.computeVisitorNumber(this.in_data.price_allocation.optimization_options[n].proportion, this.in_data.price_allocation.optimization_options[n].increase) * this.in_data.price_allocation.optimization_options[n].price
                }
                //将此处处理的费用总计传到上层
                this.$set(this.in_data.prices.optimization,'value', total);
                return total;
            },
        },
        methods: {
            computedStepData: computedStepData,
            computeVisitorNumber: function (proportion, increase) {
                proportion = proportion / 100;
                if(increase) {
                    return this.computedStepData(this.task_data.task_plan_info.first_day * proportion, this.task_data.task_plan_info.increase_num * proportion, this.task_data.task_plan_info.day_length);
                } else {
                    return this.task_data.task_plan_info.first_day * this.task_data.task_plan_info.day_length * proportion;
                }
            },
        }
    }
</script>