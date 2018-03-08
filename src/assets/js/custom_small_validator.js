import SimpleVueValidation from 'simple-vue-validator';
Vue.prototype.Validator = SimpleVueValidation.Validator;


//错误消息本地化
SimpleVueValidation.extendTemplates({
    in: '必须是 {0} 中的任意一个.',
    optionCombiner: function (options) {
        if (options.length > 2) {
            options = [options.slice(0, options.length - 1).join('，'), options[options.length - 1]];
        }
        return options.join(' 或 ');
    }
});

//导入Vue
Vue.use(SimpleVueValidation);