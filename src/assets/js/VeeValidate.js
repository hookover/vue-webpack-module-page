import VeeValidate from 'vee-validate'
import { Validator } from 'vee-validate'

Validator.extend('nickname', {
    getMessage: field => '请输入正确的呢称(2-15字符，中英文、数字和下划线)',
    validate: value => /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/.test(value)
})



import zh_CN from '../../../node_modules/vee-validate/dist/locale/zh_CN';
Validator.localize(zh_CN);


const dictionary = {
    zh_CN: {
        messages: {
            email: () => '请输入正确的邮箱格式',
            required: ( field )=> "请输入" + field,
            min_value: ( field, v ) => field + " 不能小于 " + v
        },
    }
};
Validator.localize(dictionary);
const config = {
    errorBagName: 'errors', // change if property conflicts.
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'zh_CN',
    strict: true,
    enableAutoClasses: true,
    classNames: {
        touched: 'touched', // the control has been blurred
        untouched: 'untouched', // the control hasn't been blurred
        valid: 'ng-valid', // model is valid
        invalid: 'ng-invalid', // model is invalid
        pristine: 'pristine', // control has not been interacted with
        dirty: 'ng-dirty' // control has been interacted with
    },
    events: 'input|blur',
    inject: true
}
Vue.use(VeeValidate,config)