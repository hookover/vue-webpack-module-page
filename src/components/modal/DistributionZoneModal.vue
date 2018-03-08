<template>
  <!-- Modal -->
  <div class="modal fade" tabindex="-1" role="dialog" :id="id" :aria-labelledby="id" aria-hidden="true">
    <div class="modal-dialog choice-distribution-zone">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="modal-title">发货地选择</h4>
        </div>
        <div class="modal-body">
          <table class="table table-bordered">
            <tbody>
            <template v-for="(zone,n) in data.zones">
              <tr>
                <th :colspan="data.row_num">{{zone.text}}</th>
              </tr>
              <template v-for="(v,n) in Math.ceil(zone.options.length / data.row_num)">
                <tr>
                  <td v-for="(checkbox, k) in zone.options" v-if="Math.ceil((k+1) / data.row_num) === v">
                    <label class="radios-inline">
                      <template v-if="data.isRadio">
                        <input :value="checkbox.value" :name="data.name" v-model="res.distribution_zone" type="radio">{{checkbox.name}}
                      </template>
                      <template v-if="!data.isRadio">
                        <input :value="checkbox.value" type="checkbox">{{checkbox.name}}
                      </template>
                    </label>
                  </td>
                  <template v-if="(v === Math.ceil(zone.options.length / data.row_num)) && ((zone.options.length % data.row_num) > 0)">
                    <td :colspan="data.row_num - (zone.options.length % data.row_num)"></td>
                  </template>
                </tr>
              </template>
            </template>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <!--<button data-dismiss="modal" class="btn btn-danger" type="button">重置</button>-->
          <button class="btn btn-danger" type="button" @click="clear">重置</button>
          <button class="btn btn-warning" type="button" data-dismiss="modal">完成选定</button>
        </div>
      </div>
    </div>
  </div>
  <!-- modal -->
</template>

<script>
    export default {
        name: '_DistributionZoneModal',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        props: {
            id: {
                default: 'DistributionZoneModal' + Math.ceil(Math.random() * 10000000)
            },
            res: {
                /**
                 * 使用此组件时，传入props必须有一个名为res的对象，对象中必须一个distribution_zone属性，
                 * 当此组件选项更新时，会将值更新到res.distribution_zone
                 */
                required: true,
            },
            data: {
                default: {
                    selected: '',
                    name: 'DistributionZoneModal' + Math.ceil(Math.random() * 10000000),
                    isRadio: true,
                    row_num: 5,
                    zones: [
                        {
                            text: '按区域',
                            options: [
                                {
                                    name: '江浙沪',
                                    value: '江浙沪'
                                },
                                {
                                    name: '珠三角',
                                    value: '珠三角'
                                },
                                {
                                    name: '港澳台',
                                    value: '港澳台'
                                },
                                {
                                    name: '海外',
                                    value: '海外'
                                },
                            ]
                        },
                        {
                            text: '按城市',
                            options: [
                                {
                                    name: '北京',
                                    value: '北京'
                                },
                                {
                                    name: '上海',
                                    value: '上海'
                                },
                                {
                                    name: '广州',
                                    value: '广州'
                                },
                                {
                                    name: '深圳',
                                    value: '深圳'
                                },
                                {
                                    name: '杭州',
                                    value: '杭州'
                                },
                                {
                                    name: '温州',
                                    value: '温州'
                                },
                                {
                                    name: '宁波',
                                    value: '宁波'
                                },
                                {
                                    name: '南京',
                                    value: '南京'
                                },
                                {
                                    name: '苏州',
                                    value: '苏州'
                                },
                                {
                                    name: '济南',
                                    value: '济南'
                                },
                                {
                                    name: '青岛',
                                    value: '青岛'
                                },
                                {
                                    name: '大连',
                                    value: '大连'
                                },
                                {
                                    name: '无锡',
                                    value: '无锡'
                                },
                                {
                                    name: '合肥',
                                    value: '合肥'
                                },
                                {
                                    name: '天津',
                                    value: '天津'
                                },
                                {
                                    name: '长沙',
                                    value: '长沙'
                                },
                                {
                                    name: '武汉',
                                    value: '武汉'
                                },
                                {
                                    name: '郑州',
                                    value: '郑州'
                                },
                                {
                                    name: '石家庄',
                                    value: '石家庄'
                                },
                                {
                                    name: '成都',
                                    value: '成都'
                                },
                                {
                                    name: '重庆',
                                    value: '重庆'
                                },
                                {
                                    name: '西安',
                                    value: '西安'
                                },
                                {
                                    name: '昆明',
                                    value: '昆明'
                                },
                                {
                                    name: '南宁',
                                    value: '南宁'
                                },
                                {
                                    name: '福州',
                                    value: '福州'
                                },
                                {
                                    name: '厦门',
                                    value: '厦门'
                                },
                                {
                                    name: '南昌',
                                    value: '南昌'
                                },
                                {
                                    name: '东莞',
                                    value: '东莞'
                                },
                                {
                                    name: '沈阳',
                                    value: '沈阳'
                                },
                                {
                                    name: '长春',
                                    value: '长春'
                                },
                                {
                                    name: '哈尔滨',
                                    value: '哈尔滨'
                                },
                            ]
                        },
                        {
                            text: '省份',
                            options: [
                                {
                                    name: '安徽',
                                    value: '安徽'
                                },
                                {
                                    name: '福建',
                                    value: '福建'
                                },
                                {
                                    name: '甘肃',
                                    value: '甘肃'
                                },
                                {
                                    name: '广东',
                                    value: '广东'
                                },
                                {
                                    name: '广西',
                                    value: '广西'
                                },
                                {
                                    name: '贵州',
                                    value: '贵州'
                                },
                                {
                                    name: '海南',
                                    value: '海南'
                                },
                                {
                                    name: '河北',
                                    value: '河北'
                                },
                                {
                                    name: '河南',
                                    value: '河南'
                                },
                                {
                                    name: '湖北',
                                    value: '湖北'
                                },
                                {
                                    name: '湖南',
                                    value: '湖南'
                                },
                                {
                                    name: '江苏',
                                    value: '江苏'
                                },
                                {
                                    name: '黑龙江',
                                    value: '黑龙江'
                                },
                                {
                                    name: '江西',
                                    value: '江西'
                                },
                                {
                                    name: '吉林',
                                    value: '吉林'
                                },
                                {
                                    name: '辽宁',
                                    value: '辽宁'
                                },
                                {
                                    name: '内蒙古',
                                    value: '内蒙古'
                                },
                                {
                                    name: '宁夏',
                                    value: '宁夏'
                                },
                                {
                                    name: '青海',
                                    value: '青海'
                                },
                                {
                                    name: '山东',
                                    value: '山东'
                                },
                                {
                                    name: '山西',
                                    value: '山西'
                                },
                                {
                                    name: '陕西',
                                    value: '陕西'
                                },
                                {
                                    name: '四川',
                                    value: '四川'
                                },
                                {
                                    name: '西藏',
                                    value: '西藏'
                                },
                                {
                                    name: '新疆',
                                    value: '新疆'
                                },
                                {
                                    name: '云南',
                                    value: '云南'
                                },
                                {
                                    name: '浙江',
                                    value: '浙江'
                                },
                                {
                                    name: '香港',
                                    value: '香港'
                                },
                                {
                                    name: '澳门',
                                    value: '澳门'
                                },
                                {
                                    name: '台湾',
                                    value: '台湾'
                                },
                            ]
                        },
                    ]
                }
            }
        },
        methods: {
            clear: function () {
                this.res.distribution_zone = ''
            }
        }
    }
</script>