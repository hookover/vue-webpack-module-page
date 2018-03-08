import VeeValidate, { Validator } from 'vee-validate';
//修改语言包
import zh_CN from 'vee-validate/dist/locale/zh_CN';
//VeeValidate语言包切换
Validator.addLocale(zh_CN);


//自定义提示
const dictionary = {
    zh_CN: {
        messages: {
            required: (field) => field + '不能为空'
        }
    }
};
Validator.localize(dictionary);


Validator.extend('mobile', {
    messages: {
        zh_CN:field => '手机号码输入不正确',
    },
    validate: value => {
        return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
});

//载入
Vue.use(VeeValidate, {
    locale: 'zh_CN',
});