<template>
    <div style="
               padding-top:70px;
               display:none;
               position:fixed;
               top:0;
               left:0;
               right:0;
               bottom:0;
               min-height:100%;
               background:#fff;
               z-index:999;
               overflow-y:auto;
             ">
        <section class="panel">
            <div class="panel-body">
                <div class="text-center text-warning mb50">
                    <h3>确认推广订单信息</h3>
                    <hr>
                </div>

                <section class="task-pay-section">
                    <div class="form-horizontal">

                        <div class="col-lg-11 col-lg-offset-1">
                            <div class="form-group">
                                <label class="text-primary">
                                    <strong class="h4">基础信息</strong>
                                </label>
                            </div>
                        </div>

                        <div class="row">
                            <!--左边 开始-->
                            <div class="col-lg-5 col-lg-offset-1">

                                <div class="form-group">
                                    <label class="col-lg-4">
                                        推广平台：
                                    </label>
                                    <div class="col-lg-8">
                                        <img src="img/channel_log/redio_taobao.jpg" alt="">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-lg-4">
                                        推广店铺：
                                    </label>
                                    <div class="col-lg-8">
                                        哈哈哈瓦哈哈旗舰店
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-lg-4">
                                        任务类型：
                                    </label>
                                    <div class="col-lg-8">
                                        常规任务(101)
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-lg-4">
                                        任务开始时间：
                                    </label>
                                    <div class="col-lg-8">
                                        2017-11-11 08:08:08
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-lg-4">
                                        任务结束时间：
                                    </label>
                                    <div class="col-lg-8">
                                        2017-21-11 08:08:08
                                    </div>
                                </div>
                            </div>
                            <!--左边 结束-->
                            <!--右边 开始-->
                            <div class="col-lg-5">
                                <div class="form-group">
                                    <label class="col-lg-4">
                                        商品名称：
                                    </label>
                                    <div class="col-lg-8">
                                        <a href="#">骆驼男装 夏季短袖t恤男纯色V领半袖打底衫男士青年T恤薄款短袖 热卖6万件 佟大为同款</a>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-lg-4">
                                        关键词：
                                    </label>
                                    <div class="col-lg-8">
                                        魂牵梦萦、魂牵梦萦 、魂牵梦萦 、魂牵梦萦
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-lg-4">
                                        商品图片：
                                    </label>
                                    <div class="col-lg-8">
                                        <div class="image-container">
                                            <img src="img/avatar.png" alt="" class="img-thumbnail">
                                            <img src="img/avatar.png" alt="" class="img-thumbnail">
                                            <img src="img/avatar.png" alt="" class="img-thumbnail">
                                            <img src="img/avatar.png" alt="" class="img-thumbnail">
                                            <img src="img/avatar.png" alt="" class="img-thumbnail">
                                            <img src="img/avatar.png" alt="" class="img-thumbnail">
                                            <img src="img/avatar.png" alt="" class="img-thumbnail">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--右边 结束-->
                        </div>
                        <div class="row">
                            <div class="col-lg-10 col-lg-offset-1">
                                <hr>
                            </div>
                        </div>
                    </div>
                </section>

                <!--任务项及费用清单 开始-->
                <section class="task-pay-section">
                    <div class="col-lg-10 col-lg-offset-1">
                        <div class="form-horizontal">
                            <div class="form-group">
                                <label class="control-label text-primary">
                                    <strong class="h4">任务项及费用清单</strong>
                                </label>
                            </div>
                            <div class="form-group">
                                <table class="table table-striped table-hover">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>任务项</th>
                                        <th>总操作量</th>
                                        <th>费用</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>浏览商品</td>
                                        <td>1200</td>
                                        <td class="text-danger">0.5 x 1200 = 600.00</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>加购物车</td>
                                        <td>1200</td>
                                        <td class="text-danger">0.5 x 1200 = 600.00</td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>关注店铺</td>
                                        <td>1200</td>
                                        <td class="text-danger">0.5 x 1200 = 600.00</td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>进入评价页面</td>
                                        <td>1200</td>
                                        <td class="text-danger">0.5 x 1200 = 600.00</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <hr class="row">
                    </div>
                </section>
                <!--任务项及费用清单 结束-->

                <!--提交确认 开始-->
                <section class="task-pay-section">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-lg-10 col-lg-offset-1">
                                <div class="col-lg-4 col-lg-offset-8 col-md-6 col-md-offset-6 pay-inventory">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <label class="control-label">总合计费用 :</label>
                                        </div>
                                        <div class="col-xs-6 text-right">
                                            <span>232518</span>.00云币
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-xs-6">
                                            <label class="control-label">优惠折扣码 :</label>
                                        </div>
                                        <div class="col-xs-6 text-right">
                                            <input type="text" class="form-control">
                                            <small>
                                                -100.00云币
                                            </small>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-xs-6">
                                            <label class="control-label">优惠卷 :</label>
                                        </div>
                                        <div class="col-xs-6 text-right">
                                            <select class="form-control">
                                                <option value="#">暂无优惠卷</option>
                                            </select>
                                            <small>
                                                -100.00云币
                                            </small>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-xs-6">
                                            <label class="control-label">账户余额 :</label>
                                        </div>
                                        <div class="col-xs-6 text-right">
                                            100.00云币
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-xs-6">
                                            <label class="control-label">实际支付 :</label>
                                        </div>
                                        <div class="col-xs-6 text-right">
                                            <span class="text-warning s32">232418</span>.00云币
                                        </div>
                                    </div>


                                    <div class="mt50 text-right">
                                        <a href="task_pay.html" class="btn btn-danger btn-lg">
                                            <i class="icon icon-check"></i>
                                            支付订单，立即推广您的产品
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span class="clearfix"></span>
                    </div>
                </section>
                <!--提交确认 结束-->
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        components: {

        },
        data: function () {
            return {

            }
        }
    }
</script>