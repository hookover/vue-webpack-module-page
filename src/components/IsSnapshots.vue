<template>
    <div v-if="snapshots !== false">
        <div style="position: relative;width: 100%;">
            <div style=" position: absolute; width: 100%;top:  0; right:0;height: 100%;z-index: 99999;background: rgba(99,66,0,0.06);text-align: center;">
                <div style="position: fixed;width: 100%;top: 30%;left:0; text-align:center;color:#ddd;">
                    <div style="font-size: 200px;">快照</div>
                    <div style="font-size: 50px;">计划编号：{{snapshots.order_id}}</div>
                    <div style="font-size: 50px;">计划发布时间：{{snapshots.created_at}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        computed: {
            snapshots: function () {
                if(typeof (snapshots) !== 'undefined') {
                    return snapshots;
                }
                return false;
            }
        }
    }
</script>