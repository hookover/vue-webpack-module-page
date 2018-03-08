/**
 * 实时动态强制更改用户录入
 * arg1 inputObject
 **/
global.CONSTANT = {
    IMAGE_DOMAIN: '//img.task.com',
    _token: $('meta[name="csrf-token"]').attr('content'),
    platforms: {
        tb: {
            name: '淘宝',
            key: 1,
        },
        tmall:{
            name: '天猫',
            key: 2,
        },
        jd: {
            name: '京东',
            key: 3,
        }
    },
};

export function convertPathToUrl(path) {
    return CONSTANT.IMAGE_DOMAIN + '/' + path
}
export function amount(string){
    let regStrs = [
        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
    ];
    for(i=0; i<regStrs.length; i++){
        var reg = new RegExp(regStrs[i][0]);
        string =  string.replace(reg, regStrs[i][1]);
    }
    return string;
}
// <input type="text" name="city" value="" onKeyUp="amount(this)" onBlur="overFormat(this)" />
/**
 * 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
 * arg1 inputObject
 * 这个函数写得很傻，是我很早以前写的了，没有进行优化，但功能十分齐全，你尝试着使用
 * 其实有一种可以更快速的JavaScript内置函数可以提取杂乱数据中的数字：
 * parseFloat('10');
 **/
export function overFormat(string){
    var v = string;
    if(v === ''){
        v = '0.00';
    }else if(v === '0'){
        v = '0.00';
    }else if(v === '0.'){
        v = '0.00';
    }else if(/^0+\d+\.?\d*.*$/.test(v)){
        v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
        v = inp.getRightPriceFormat(v).val;
    }else if(/^0\.\d$/.test(v)){
        v = v + '0';
    }else if(!/^\d+\.\d{2}$/.test(v)){
        if(/^\d+\.\d{2}.+/.test(v)){
            v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
        }else if(/^\d+$/.test(v)){
            v = v + '.00';
        }else if(/^\d+\.$/.test(v)){
            v = v + '00';
        }else if(/^\d+\.\d$/.test(v)){
            v = v + '0';
        }else if(/^[^\d]+\d+\.?\d*$/.test(v)){
            v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
        }else if(/\d+/.test(v)){
            v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
            ty = false;
        }else if(/^0+\d+\.?\d*$/.test(v)){
            v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
            ty = false;
        }else{
            v = '0.00';
        }
    }
    return v;
}
export function scrollFocus(id, timeout) {
    scroll(id, timeout);
    focus(id, timeout);
}
export  function focus(id, timeout) {
    if(!timeout) {
     timeout = 1;
    }
    setTimeout(function () {
        $('#' + id).focus();
    }, timeout)
}
export function scroll(id, timeout) {
    if(!timeout) {
        timeout = 1;
    }
    setTimeout(function () {
        if ($("html, body").find('#' + id).length > 0) {
            $("html, body").animate({
                scrollTop: ($('#' + id).offset().top - 200) + "px"
            }, {
                duration: 500,
                easing: "swing"
            });
        }
    }, timeout)
}
/**
 *
 * @param time_arr 时间点数组
 * @param task_num 任务总数量
 */
export function randomAssignTaskTime(time_arr, task_num) {
    let len = time_arr.length;
    let tmp_res = [];
    let res = [];
    let count = 0;

    while (task_num > 0) {
        let tmp_num = Math.ceil(Math.random() * (task_num / len * 2));
        if(task_num - tmp_num >= 0) {
            if(tmp_res.length < len) { //如果还没填满，就填
                tmp_res.push(tmp_num)
            } else { //如果填满了，就随机加
                let index = Math.floor(Math.random() * len)
                tmp_res[index] += tmp_num;
            }
            task_num -= tmp_num;
        }

        count++;
        if(count>100) {
            let index = Math.floor(Math.random() * len)
            tmp_res[index] += task_num;
            task_num = 0;
        }
    }

    for(let n=0; n<len; ++n) {
        res.push({
            time: time_arr[n],
            num: tmp_res[n]
        })
    }
    return res;
}
/**
 * 布尔类型转为数字
 * @param obj_or_arr
 */
export function deepConvertBooleanToNumber(obj_or_arr) {
    for(let n in obj_or_arr) {
        if(typeof obj_or_arr[n] === 'boolean') {
            if(obj_or_arr[n] === true) {
                obj_or_arr[n] = 1;
            }
            if(obj_or_arr[n] === false) {
                obj_or_arr[n] = 0;
            }
        }
        if(typeof obj_or_arr[n] === 'object') {
            deepConvertBooleanToNumber(obj_or_arr[n]);
        }
    }
}
/**
 * 字符串布尔转布尔
 * @param obj_or_arr
 */
export function deepConvertStringToBoolean(obj_or_arr) {
    for(let n in obj_or_arr) {
        if(obj_or_arr[n] === 'true') {
            obj_or_arr[n] = true;
        }
        if(obj_or_arr[n] === 'false') {
            obj_or_arr[n] = false;
        }

        if(typeof obj_or_arr[n] === 'object') {
            deepConvertStringToBoolean(obj_or_arr[n]);
        }
    }
}
/**
 * 字符串数字、字符串布尔转为数字和布尔
 * @param obj_or_arr
 */
export function deepConvertStringToBooleanAndNumber(obj_or_arr) {
    for(let n in obj_or_arr) {
        if(obj_or_arr[n] === 'true') {
            obj_or_arr[n] = true;
        }
        if(obj_or_arr[n] === 'false') {
            obj_or_arr[n] = false;
        }

        if(obj_or_arr[n] && !isNaN(Number(obj_or_arr[n])) && (typeof obj_or_arr[n] !== 'boolean')) {
            obj_or_arr[n] = Number(obj_or_arr[n])
        }

        if(typeof obj_or_arr[n] === 'object') {
            deepConvertStringToBooleanAndNumber(obj_or_arr[n]);
        }
    }
}

export function computeAllCost(data) {
    let cost = 0;
    for(let o in data) {
        if(data[o].hasOwnProperty('prices')) {
            for(let k in data[o].prices) {
                let obj = data[o].prices[k];
                if(obj.hasOwnProperty('value')) {
                    if(obj.valid === true) {
                        cost += parseFloat(obj.value);
                    }
                }
            }
        }
    }
    return cost;
}
export function lessIE9() {
    if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE6.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0")
    {
        return true;
    }
    return false;
}
